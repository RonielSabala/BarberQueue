import random


def random_bool() -> bool:
    return random.choice((True, False))


def random_string(chars: str, length: int) -> str:
    return "".join(random.choices(chars, k=length))


def random_string_len(chars: str, min_len: int, max_len: int) -> str:
    return random_string(chars, random.randint(min_len, max_len))


def random_subset[T](items: list[T]) -> list[T]:
    k = random.randint(1, len(items))
    return random.sample(items, k)


def to_camel_case(name: str) -> str:
    parts = name.lstrip("_").split("_")
    return parts[0].lower() + "".join(part.capitalize() for part in parts[1:])
