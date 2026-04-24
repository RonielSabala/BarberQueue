from dataclasses import dataclass

from domain.dtos import BaseResponse


@dataclass(slots=True, kw_only=True, frozen=True)
class GroupMemberTurnResponse(BaseResponse):
    _id: int
    barbershop_id: int
    member_id: int
    barber_id: int | None
    group_id: int
    member_name: str
    status: str
    position: int | None
    absolute_position: int | None
    estimated_time: float | None
    created_at: str
