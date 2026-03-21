import dataclasses
from dataclasses import dataclass
from typing import Iterator, get_type_hints

from domain.dtos import BaseRequest
from domain.utils import to_camel_case


@dataclass(slots=True, frozen=True)
class BadFieldCase:
    test_id: str
    payload: dict
    expected_error_msg: str


def _case_notation(attribute: str, field: str):
    return f"{attribute}_{field}"


def nested_notation(parent: str, child: str):
    return f"{parent}__{child}"


def missing_field_cases(
    request_class: type[BaseRequest], _path: str = ""
) -> Iterator[BadFieldCase]:
    """
    Introspects `request_class` fields to produce exhaustive
    missing-field and wrong-type scenarios automatically.
    """

    hints = get_type_hints(request_class)
    payload = request_class.random().to_json()

    for field in dataclasses.fields(request_class):
        # Skip optional fields
        if (
            field.default is not dataclasses.MISSING
            or field.default_factory is not dataclasses.MISSING
        ):
            continue

        field_name = field.name
        field_type = hints[field_name]
        field_json_key = to_camel_case(field_name)
        field_path = f"{_path}.{field_json_key}" if _path else field_json_key

        is_nested = isinstance(field_type, type) and issubclass(field_type, BaseRequest)

        # Missing field
        missing_payload = {k: v for k, v in payload.items() if k != field_json_key}
        yield BadFieldCase(
            _case_notation("missing", field_name),
            missing_payload,
            f"Field '{field_path}' is required",
        )

        if not is_nested:
            continue

        # Wrong type
        wrong_type_payload = {**payload, field_json_key: "not_an_object"}
        yield BadFieldCase(
            _case_notation("wrong_type", field_name),
            wrong_type_payload,
            f"Field '{field_path}' must be an object",
        )

        # Recurse into nested request
        yield from (
            BadFieldCase(
                nested_notation(field_name, case.test_id),
                {**payload, field_json_key: case.payload},
                case.expected_error_msg,
            )
            for case in missing_field_cases(field_type, _path=field_path)
        )
