from dataclasses import dataclass

from domain.dtos.base import BaseDto


@dataclass(slots=True, kw_only=True, frozen=True)
class BaseResponse(BaseDto):
    """
    Base response DTO.
    """


@dataclass(slots=True, kw_only=True, frozen=True)
class MessageResponse(BaseResponse):
    message: str


@dataclass(slots=True, kw_only=True, frozen=True)
class ErrorResponse(BaseResponse):
    error: str
