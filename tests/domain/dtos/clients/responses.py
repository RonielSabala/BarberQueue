from dataclasses import dataclass
from typing import Annotated

from domain.dtos import BaseResponse
from domain.value_objects.base import ListOf


@dataclass(slots=True, kw_only=True, frozen=True)
class GroupMemberTurnResponse(BaseResponse):
    turn_id: int
    member_id: int
    member_name: str
    barber_id: int | None
    position: int
    status: str


@dataclass(slots=True, kw_only=True, frozen=True)
class GroupResponse(BaseResponse):
    group_id: int
    members: Annotated[
        list[GroupMemberTurnResponse], ListOf(base_type=GroupMemberTurnResponse)
    ]


@dataclass(slots=True, kw_only=True, frozen=True)
class ClientTurnResponse(BaseResponse):
    _id: int
    barbershop_id: int
    client_id: int
    barber_id: int | None
    username: str
    status: str
    position: int
    created_at: str
    group: GroupResponse | None
