import string
from dataclasses import dataclass

from domain.value_objects.base import StringField


@dataclass(slots=True, frozen=True)
class Password(StringField):
    _min_len = 8
    _max_len = 50
    _allowed_chars = string.ascii_letters + string.digits
