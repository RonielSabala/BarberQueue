import string
from dataclasses import dataclass

from domain.value_objects.base import StringField


@dataclass(slots=True, frozen=True)
class ReviewContent(StringField):
    _min_len = 1
    _max_len = 1000
    _allowed_chars = (
        string.ascii_letters + string.digits + r"\/|!@#$%&*(){}[]¿?'-=+;,._ "
    )
