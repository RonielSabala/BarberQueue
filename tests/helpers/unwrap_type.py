import types
import typing

NONE_TYPE = type(None)


def is_union(hint: object) -> bool:
    return typing.get_origin(hint) is typing.Union or isinstance(hint, types.UnionType)


def unwrap_type(hint: object) -> type:
    """
    Unwrap **X | None** to X.
    """

    if not is_union(hint):
        return hint if isinstance(hint, type) else NONE_TYPE

    types = [arg for arg in typing.get_args(hint) if arg is not NONE_TYPE]
    return types[0] if len(types) == 1 else NONE_TYPE
