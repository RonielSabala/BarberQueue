from dataclasses import dataclass
from typing import ClassVar

from domain.value_objects.base import NameField


@dataclass(slots=True, frozen=True)
class Username(NameField):
    _min_len: ClassVar[int] = 5
    _max_len: ClassVar[int] = 30
