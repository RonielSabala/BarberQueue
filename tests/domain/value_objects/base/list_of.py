from dataclasses import dataclass


@dataclass(slots=True, kw_only=True, frozen=True)
class ListOf[T]:
    base_type: type[T]
    min_items: int | None = None
    max_items: int | None = None

    def __post_init__(self):
        min_items = self.min_items
        if min_items is None:
            return

        cls_name = self.__class__.__name__
        if min_items < 0:
            raise ValueError(f"{cls_name}.min_items must be >= 0")

        max_items = self.max_items
        if max_items is not None and max_items < min_items:
            raise ValueError(f"{cls_name}.max_items must be >= {cls_name}.min_items")
