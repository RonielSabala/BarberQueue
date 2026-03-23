from __future__ import annotations

import dataclasses
import random
from dataclasses import dataclass
from typing import Any, Iterator, Self, get_type_hints

from domain.dtos import BaseRequest
from domain.utils import to_camel_case
from domain.value_objects.field_name import FieldName
from helpers.unwrap_type import is_optional


def _join_with_dot(a: str | None, b: str):
    if a == "" or a is None:
        return b

    return a + "." + b


@dataclass(slots=True, kw_only=True, frozen=True)
class _FieldMetadata:
    name: str
    field_type: type
    full_path: str
    json_key: str

    @classmethod
    def from_data(cls, name: str, field_type: Any, path: str | None) -> _FieldMetadata:
        json_key = to_camel_case(name)
        return cls(
            name=name,
            field_type=field_type,
            full_path=_join_with_dot(path, json_key),
            json_key=json_key,
        )

    def is_nested(self) -> bool:
        return isinstance(self.field_type, type) and issubclass(
            self.field_type, BaseRequest
        )


@dataclass(slots=True, frozen=True)
class BadFieldCase:
    case_id: str
    payload: dict
    expected_error_msg: str

    def build_inner_case(self, field: _FieldMetadata, payload: dict) -> Self:
        inner_payload = {**payload, field.json_key: self.payload}
        cls = type(self)
        return cls(
            nested_case_id(field.name, self.case_id),
            inner_payload,
            self.expected_error_msg,
        )


@dataclass(slots=True)
class _OnceMark:
    """
    A mutable flag ensuring something happens exactly once
    across a recursive tree traversal.
    """

    _done: bool = dataclasses.field(default=False, init=False)

    @property
    def available(self) -> bool:
        return not self._done

    def consume(self) -> None:
        self._done = True


def _case_id(attribute: str, field: str):
    return f"{attribute}_{field}"


def nested_case_id(parent: str, child: str):
    return f"{parent}__{child}"


def _get_missing_field_case(field: _FieldMetadata, payload: dict) -> BadFieldCase:
    json_key = field.json_key
    missing_payload = {k: v for k, v in payload.items() if k != json_key}
    return BadFieldCase(
        _case_id("missing", field.name),
        missing_payload,
        f"Field '{field.full_path}' is required",
    )


def _get_wrong_type_case(field: _FieldMetadata, payload: dict) -> BadFieldCase:
    wrong_type_payload = {**payload, field.json_key: "not_an_object"}
    return BadFieldCase(
        _case_id("wrong_type", field.name),
        wrong_type_payload,
        f"Field '{field.full_path}' must be an object",
    )


def _get_unexpected_field_case(path: str | None, payload: dict) -> BadFieldCase:
    unexpected_key = FieldName.random().value
    key_path = _join_with_dot(path, unexpected_key)
    return BadFieldCase(
        _case_id("unexpected_key", unexpected_key),
        {**payload, unexpected_key: None},
        f"Unexpected field(s): '{key_path}'",
    )


def missing_field_cases(
    request_class: type[BaseRequest],
    _path: str | None = None,
    _mark: _OnceMark | None = None,
) -> Iterator[BadFieldCase]:
    """
    Introspects `request_class` fields to produce exhaustive
    missing-field and wrong-type scenarios automatically.
    """

    if _mark is None:
        _mark = _OnceMark()

    payload = request_class.random().to_json()
    hints = get_type_hints(request_class)
    nested_fields: list[_FieldMetadata] = []

    for f in dataclasses.fields(request_class):
        field_name = f.name
        field_type = hints[field_name]
        optional, _ = is_optional(field_type)

        # Skip optional fields
        if (
            optional
            or f.default is not dataclasses.MISSING
            or f.default_factory is not dataclasses.MISSING
        ):
            continue

        field = _FieldMetadata.from_data(field_name, field_type, _path)
        yield _get_missing_field_case(field, payload)

        if field.is_nested():
            nested_fields.append(field)

    is_leaf = not nested_fields
    if _mark.available and (is_leaf or random.random() > 0.5):
        _mark.consume()
        yield _get_unexpected_field_case(_path, payload)

    # Handle nested fields
    for field in nested_fields:
        yield _get_wrong_type_case(field, payload)
        yield from (
            case.build_inner_case(field, payload)
            for case in missing_field_cases(
                field.field_type, _path=field.full_path, _mark=_mark
            )
        )

    if _mark.available:
        _mark.consume()
        yield _get_unexpected_field_case(_path, payload)
