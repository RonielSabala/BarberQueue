from dataclasses import dataclass


@dataclass(slots=True, kw_only=True, frozen=True)
class ListOf[T]:
    base_type: type[T]
    min_items: int = 0
    max_items: int | None = None

    def __post_init__(self):
        if self.min_items < 0:
            raise ValueError("min_items must be >= 0")

        if self.max_items is not None and self.max_items < self.min_items:
            raise ValueError("max_items must be >= min_items")
