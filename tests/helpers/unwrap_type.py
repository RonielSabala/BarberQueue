import types
from typing import Annotated, Union, get_args, get_origin

from domain.value_objects.base.list_of import ListOf

NONE_TYPE = type(None)


def is_union(hint: object) -> bool:
    return get_origin(hint) is Union or isinstance(hint, types.UnionType)


def is_annotated(obj: Annotated) -> bool:
    return get_origin(obj) is Annotated


def unwrap_list_of(obj: object) -> ListOf | None:
    if not is_annotated(obj):
        return

    return next((item for item in get_args(obj) if isinstance(item, ListOf)), None)


def unwrap_type(hint: object) -> type:
    """
    Unwrap **X | None** to X.
    """

    if not is_union(hint):
        return hint if isinstance(hint, type) else NONE_TYPE

    types = [arg for arg in get_args(hint) if arg is not NONE_TYPE]
    return types[0] if len(types) == 1 else NONE_TYPE
