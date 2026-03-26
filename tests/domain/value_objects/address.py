import string
from dataclasses import dataclass

from domain.value_objects.base import StringField


@dataclass(slots=True, frozen=True)
class Address(StringField):
    _min_len = 12
    _max_len = 255
    _allowed_chars = string.ascii_letters + string.digits + " ./"
