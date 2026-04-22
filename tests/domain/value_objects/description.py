import string
from dataclasses import dataclass

from domain.value_objects.base import StringField


@dataclass(slots=True, frozen=True)
class Description(StringField):
    _min_len = 1
    _max_len = 100
    _allowed_chars = string.ascii_letters + string.digits + " "
