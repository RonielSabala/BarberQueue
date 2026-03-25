import datetime
import random
import re
from dataclasses import dataclass

from domain.value_objects.base.base_field import BaseField

_MIN_DAYS_OFFSET = 0
_MAX_DAYS_OFFSET = 30

_DATETIME_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$")


@dataclass(slots=True, frozen=True)
class DateTimeString(BaseField[str]):
    def __post_init__(self) -> None:
        if not _DATETIME_PATTERN.fullmatch(self.value):
            raise self._validation_error(
                "must be a valid datetime in format YYYY-MM-DD HH:MM:SS"
            )

    @classmethod
    def random_value(cls) -> str:
        days_offset = random.randint(_MIN_DAYS_OFFSET, _MAX_DAYS_OFFSET)
        date_time = datetime.datetime.now() - datetime.timedelta(days=days_offset)
        return date_time.strftime("%Y-%m-%d %H:%M:%S")
