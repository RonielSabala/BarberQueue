from dataclasses import dataclass

from domain.dtos.base import BaseDto


@dataclass(slots=True, kw_only=True, frozen=True)
class MessageResponse(BaseDto):
    message: str


@dataclass(slots=True, kw_only=True, frozen=True)
class ErrorResponse(BaseDto):
    error: str


@dataclass(slots=True, kw_only=True, frozen=True)
class HealthResponse(MessageResponse): ...
