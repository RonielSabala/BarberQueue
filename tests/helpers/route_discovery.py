import inspect
from collections.abc import Iterator

from api.base_controller import BaseController
from helpers.body_route import BodyRoute


def _all_subclasses[T: type](cls: T) -> Iterator[T]:
    for sub in cls.__subclasses__():
        yield sub
        yield from _all_subclasses(sub)


def discover_body_routes() -> Iterator[BodyRoute]:
    for controller in _all_subclasses(BaseController):
        route_prefix = controller.prefix

        for _, method in inspect.getmembers(controller, predicate=inspect.isfunction):
            route: BodyRoute | None = getattr(method, "__body_route__", None)
            if route is None:
                continue

            route.set_full_path(route_prefix)
            yield route
