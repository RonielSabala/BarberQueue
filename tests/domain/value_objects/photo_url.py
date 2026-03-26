import random
import string
from dataclasses import dataclass
from typing import ClassVar
from urllib.parse import urlparse

from typing_extensions import Annotated, TypeAlias

from domain.utils import random_string_len
from domain.value_objects.base import ListOf, StringField

_URL_PREFIXES = ("http", "https")
_IMAGE_EXTENSIONS = ("jpg", "jpeg", "png", "webp")
_TLDS = ("com", "net", "org", "io")
_URL_CHARS = string.ascii_lowercase + string.digits

_MIN_HOST_LENGTH = 8
_MAX_HOST_LENGTH = 14

_MIN_FILENAME_LENGTH = 8
_MAX_FILENAME_LENGTH = 16


@dataclass(slots=True, frozen=True)
class PhotoUrl(StringField):
    _min_len: ClassVar[int] = 12

    def __post_init__(self) -> None:
        StringField.__post_init__(self)

        parsed = urlparse(self.value)
        if parsed.scheme not in _URL_PREFIXES or not parsed.netloc:
            raise self._validation_error("must be a valid http or https url")

    @classmethod
    def random_value(cls) -> str:
        scheme = random.choice(_URL_PREFIXES)
        host = random_string_len(_URL_CHARS, _MIN_HOST_LENGTH, _MAX_HOST_LENGTH)
        tld = random.choice(_TLDS)
        filename = random_string_len(
            _URL_CHARS, _MIN_FILENAME_LENGTH, _MAX_FILENAME_LENGTH
        )
        ext = random.choice(_IMAGE_EXTENSIONS)

        return f"{scheme}://{host}.{tld}/{filename}.{ext}"


PhotoUrls: TypeAlias = Annotated[
    list[PhotoUrl], ListOf(base_type=PhotoUrl, min_items=1, max_items=5)
]
