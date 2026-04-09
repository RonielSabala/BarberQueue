from dataclasses import dataclass

from domain.dtos import BaseResponse


@dataclass(slots=True, kw_only=True, frozen=True)
class TurnDetailResponse(BaseResponse):
    _id: int
    owner_id: int
    barbershop_id: int
    group_id: int | None
    barber_id: int | None
    owner_name: str
    owner_type: str
    owner_status: str
    position: int | None
    absolute_position: int | None
    estimated_time: float | None
    group_size: int | None
    created_at: str
    attended_at: str | None
    finished_at: str | None
