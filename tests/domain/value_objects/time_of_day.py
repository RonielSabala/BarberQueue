import datetime
import random
import re
from dataclasses import dataclass

from domain.value_objects.base.string_field import StringField

_FIXED_TIME_LENGTH = 8
_TIME_PATTERN = re.compile(r"^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$")


@dataclass(slots=True, frozen=True)
class TimeOfDay(StringField):
    _min_len = _FIXED_TIME_LENGTH
    _max_len = _FIXED_TIME_LENGTH
    _pattern = _TIME_PATTERN
    _pattern_error_msg = "must be a valid time in format HH:MM:SS"

    @classmethod
    def random_value(cls) -> str:
        return datetime.time(
            hour=random.randrange(24),
            minute=random.randrange(60),
            second=random.randrange(60),
        ).strftime("%H:%M:%S")
