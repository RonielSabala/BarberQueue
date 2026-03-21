def to_camel_case(name: str) -> str:
    parts = name.lstrip("_").split("_")
    return parts[0].lower() + "".join(part.capitalize() for part in parts[1:])
