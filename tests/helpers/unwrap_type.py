import types
import typing

TYPE_NONE = type(None)


def _is_union(hint: object) -> bool:
    return typing.get_origin(hint) is typing.Union or isinstance(hint, types.UnionType)


def unwrap_type(hint: object) -> type | None:
    """
    Unwrap **X | None** to X.
    """

    if not _is_union(hint):
        return hint if isinstance(hint, type) else None

    args = [arg for arg in typing.get_args(hint) if arg is not TYPE_NONE]
    return args[0] if len(args) == 1 else None


def is_optional(hint: object) -> tuple[bool, type | None]:
    """
    Return (True, X) for **X | None**, or (False, X) for plain X.
    """

    return _is_union(hint), unwrap_type(hint)
