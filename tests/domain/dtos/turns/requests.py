from dataclasses import dataclass
from typing import Annotated

from domain.dtos import BaseRequest
from domain.value_objects import Id, Username
from domain.value_objects.base import ListOf


@dataclass(slots=True, kw_only=True, frozen=True)
class CreateTurnMemberRequest(BaseRequest):
    barber_id: Id | None
    member_name: Username


@dataclass(slots=True, kw_only=True, frozen=True)
class CreateTurnRequest(BaseRequest):
    client_id: Id
    barbershop_id: Id
    barber_id: Id | None
    group_members: (
        Annotated[
            list[CreateTurnMemberRequest],
            ListOf(base_type=CreateTurnMemberRequest, min_items=1, max_items=10),
        ]
        | None
    )
