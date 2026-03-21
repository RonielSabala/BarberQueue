from dataclasses import dataclass

from domain.dtos.base import BaseDto


@dataclass(slots=True, kw_only=True, frozen=True)
class BaseResponse(BaseDto):
    """
    Base response DTO.
    """
