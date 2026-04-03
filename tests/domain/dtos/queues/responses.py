from dataclasses import dataclass
from typing import Annotated

from domain.dtos import BaseResponse
from domain.value_objects.base import ListOf


@dataclass(slots=True, kw_only=True, frozen=True)
class TurnResponse(BaseResponse):
    _id: int
    owner_id: int
    group_id: int | None
    barber_id: int | None
    owner_name: str
    owner_type: str
    owner_status: str
    position: int
    group_size: int | None


@dataclass(slots=True, kw_only=True, frozen=True)
class QueueResponse(BaseResponse):
    barber_id: int
    barber_name: str
    barber_status: str
    is_accepting: bool
    turns: Annotated[list[TurnResponse], ListOf(base_type=TurnResponse)]
