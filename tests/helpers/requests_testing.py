import dataclasses
import random
from collections.abc import Iterator
from dataclasses import dataclass
from typing import ClassVar, Self

from domain.dtos import BaseRequest
from domain.utils import to_camel_case
from domain.value_objects.base import NameField
from helpers.unwrap_type import unwrap_list_of

# Internal helpers


def _join_with_dot(path: str | None, key: str) -> str:
    if path == "" or path is None:
        return key

    return path + "." + key


def _case_id(attribute: str, field: str) -> str:
    return f"{attribute}_{field}"


def _nested_case_id(parent: str, child: str) -> str:
    return f"{parent}__{child}"


# Internal types


@dataclass(slots=True, kw_only=True, frozen=True)
class _FieldMetadata:
    name: str
    field_type: type
    full_path: str
    json_key: str

    @classmethod
    def from_data(cls, name: str, field_type: type, path: str | None) -> Self:
        json_key = to_camel_case(name)
        return cls(
            name=name,
            field_type=field_type,
            full_path=_join_with_dot(path, json_key),
            json_key=json_key,
        )

    @property
    def is_nested(self) -> bool:
        field_type = self.field_type
        return isinstance(field_type, type) and issubclass(field_type, BaseRequest)


@dataclass(slots=True, frozen=True)
class BadFieldCase:
    case_id: str
    payload: dict
    expected_error_msg: str

    def build_inner_case(self, field: _FieldMetadata, payload: dict) -> Self:
        inner_payload = {**payload, field.json_key: self.payload}
        cls = type(self)
        return cls(
            _nested_case_id(field.name, self.case_id),
            inner_payload,
            self.expected_error_msg,
        )


@dataclass(slots=True, frozen=True)
class _UnexpectedKey(NameField):
    _min_len: ClassVar[int] = 1
    _max_len: ClassVar[int] = 25


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


# Field cases


def _get_unexpected_field_case(path: str | None, payload: dict) -> BadFieldCase:
    unexpected_key = _UnexpectedKey.random_value()
    key_path = _join_with_dot(path, unexpected_key)
    case_payload = {**payload, unexpected_key: None}
    return BadFieldCase(
        _case_id("unexpected_key", unexpected_key),
        case_payload,
        f"Unexpected field(s): '{key_path}'",
    )


def _get_required_field_case(field: _FieldMetadata, payload: dict) -> BadFieldCase:
    json_key = field.json_key
    case_payload = {k: v for k, v in payload.items() if k != json_key}
    return BadFieldCase(
        _case_id("required", field.name),
        case_payload,
        f"Field '{field.full_path}' is required",
    )


def _get_cannot_be_null_field_case(
    field: _FieldMetadata, payload: dict
) -> BadFieldCase:
    json_key = field.json_key
    case_payload = {k: (None if k == json_key else v) for k, v in payload.items()}
    return BadFieldCase(
        _case_id("cannot_be_null", field.name),
        case_payload,
        f"Field '{field.full_path}' cannot be null",
    )


def _get_required_object_field_case(
    field: _FieldMetadata, payload: dict
) -> BadFieldCase:
    case_payload = {**payload, field.json_key: "not_an_object"}
    return BadFieldCase(
        _case_id("required_object", field.name),
        case_payload,
        f"Field '{field.full_path}' must be an object",
    )


def _get_required_array_field_case(
    field: _FieldMetadata, payload: dict
) -> BadFieldCase:
    case_payload = {**payload, field.json_key: "not_an_array"}
    return BadFieldCase(
        _case_id("required_array", field.name),
        case_payload,
        f"Field '{field.full_path}' must be an array",
    )


def _get_very_few_items_field_case(
    field: _FieldMetadata, payload: dict, min_items: int
) -> BadFieldCase:
    case_payload = {**payload, field.json_key: [None] * (min_items - 1)}
    return BadFieldCase(
        _case_id("very_few", field.name),
        case_payload,
        f"Field '{field.full_path}[]' must have at least {min_items} item(s)",
    )


def _get_too_many_items_field_case(
    field: _FieldMetadata, payload: dict, max_items: int
) -> BadFieldCase:
    case_payload = {**payload, field.json_key: [None] * (max_items + 1)}
    return BadFieldCase(
        _case_id("too_many", field.name),
        case_payload,
        f"Field '{field.full_path}[]' must have at most {max_items} item(s)",
    )


# Orchestrate cases


def missing_field_cases(
    request_class: type[BaseRequest],
    _path: str | None = None,
    _mark: _OnceMark | None = None,
) -> Iterator[BadFieldCase]:
    """
    Introspects `request_class` fields to produce exhaustive missing-field
    and wrong-type scenarios automatically.
    """

    if _mark is None:
        _mark = _OnceMark()

    payload = request_class.random().to_json()
    nested_fields: list[_FieldMetadata] = []

    for field_info in request_class.class_fields():
        # Skip optional fields
        if field_info.is_optional:
            continue

        field_type = field_info.field_type
        field = _FieldMetadata.from_data(field_info.field_name, field_type, _path)

        # Add list cases
        list_metadata = unwrap_list_of(field_type)
        if list_metadata:
            min_items = list_metadata.min_items
            if min_items is not None:
                yield _get_very_few_items_field_case(field, payload, min_items)

            max_items = list_metadata.max_items
            if max_items is not None:
                yield _get_too_many_items_field_case(field, payload, max_items)

            yield _get_required_array_field_case(field, payload)
            continue

        if not isinstance(field_type, type):
            continue

        yield _get_required_field_case(field, payload)
        yield _get_cannot_be_null_field_case(field, payload)

        if field.is_nested:
            nested_fields.append(field)

    if _mark.available and (not nested_fields or random.random() > 0.5):
        _mark.consume()
        yield _get_unexpected_field_case(_path, payload)

    # Handle nested fields
    for field in nested_fields:
        yield _get_required_object_field_case(field, payload)
        yield from (
            case.build_inner_case(field, payload)
            for case in missing_field_cases(
                field.field_type, _path=field.full_path, _mark=_mark
            )
        )

    if _mark.available:
        _mark.consume()
        yield _get_unexpected_field_case(_path, payload)
