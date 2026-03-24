import random
import re
from dataclasses import dataclass

from domain.value_objects.base.base_field import BaseField

_MIN_HOUR = 0
_MAX_HOUR = 23

_MIN_MINUTE = 0
_MAX_MINUTE = 59

_MIN_SECOND = 0
_MAX_SECOND = 59

_TIME_PATTERN = re.compile(r"^\d{2}:\d{2}:\d{2}$")


@dataclass(slots=True, frozen=True)
class TimeOfDay(BaseField[str]):
    def __post_init__(self) -> None:
        if not self._is_valid_time(self.value):
            raise self._validation_error("must be a valid time in format HH:MM:SS")

    @classmethod
    def _is_valid_time(cls, value: str) -> bool:
        if not _TIME_PATTERN.fullmatch(value):
            return False

        time_data = value.split(":")
        if len(time_data) != 3:
            return False

        hour, minute, second = map(int, time_data)
        return (
            _MIN_HOUR <= hour <= _MAX_HOUR
            and _MIN_MINUTE <= minute <= _MAX_MINUTE
            and _MIN_SECOND <= second <= _MAX_SECOND
        )

    @classmethod
    def random_value(cls) -> str:
        hour = random.randint(_MIN_HOUR, _MAX_HOUR)
        minute = random.randint(_MIN_MINUTE, _MAX_MINUTE)
        second = random.randint(_MIN_SECOND, _MAX_SECOND)

        return f"{hour:02d}:{minute:02d}:{second:02d}"
