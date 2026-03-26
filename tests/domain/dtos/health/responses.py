from dataclasses import dataclass

from domain.dtos.base_response import MessageResponse


@dataclass(slots=True, kw_only=True, frozen=True)
class HealthResponse(MessageResponse): ...
