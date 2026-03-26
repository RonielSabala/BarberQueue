from dataclasses import dataclass

from domain.value_objects.base import IntegerField

_FIXED_CODE_DIGITS = 6


@dataclass(slots=True, frozen=True)
class ResetCode(IntegerField):
    _min_value = 10 ** (_FIXED_CODE_DIGITS - 1)
    _max_value = 10**_FIXED_CODE_DIGITS - 1
