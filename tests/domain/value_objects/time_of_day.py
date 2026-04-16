import datetime
import random
import re
from dataclasses import dataclass
from typing import Self

from domain.value_objects.base.string_field import StringField

_MAX_HOUR = 24
_MAX_MINUTE = 60
_MAX_SECOND = 60
_SECONDS_PER_HOUR = _MAX_MINUTE * _MAX_SECOND
_SECONDS_PER_DAY = _MAX_HOUR * _SECONDS_PER_HOUR
_TIME_FORMAT = "%H:%M:%S"

_FIXED_TIME_LENGTH = 8
_TIME_PATTERN = re.compile(r"^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$")


@dataclass(slots=True, frozen=True)
class TimeOfDay(StringField):
    _min_len = _FIXED_TIME_LENGTH
    _max_len = _FIXED_TIME_LENGTH
    _pattern = _TIME_PATTERN
    _pattern_error_msg = "must be a valid time in format HH:MM:SS"

    @classmethod
    def random_datetime(cls) -> datetime.time:
        return datetime.time(
            hour=random.randrange(_MAX_HOUR),
            minute=random.randrange(_MAX_MINUTE),
            second=random.randrange(_MAX_SECOND),
        )

    @classmethod
    def random_value(cls) -> str:
        return cls.random_datetime().strftime(_TIME_FORMAT)

    @classmethod
    def _time_from_seconds(cls, total_seconds: int) -> datetime.time:
        hour, reminder = divmod(total_seconds, _SECONDS_PER_HOUR)
        minute, second = divmod(reminder, _MAX_MINUTE)
        return datetime.time(hour=hour, minute=minute, second=second)

    @classmethod
    def random_pair(cls) -> tuple[Self, Self]:
        first, second = sorted(random.sample(range(_SECONDS_PER_DAY), 2))
        return (
            cls(cls._time_from_seconds(first).strftime(_TIME_FORMAT)),
            cls(cls._time_from_seconds(second).strftime(_TIME_FORMAT)),
        )
