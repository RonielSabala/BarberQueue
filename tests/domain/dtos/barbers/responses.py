from dataclasses import dataclass

from domain.dtos import BaseResponse


@dataclass(slots=True, kw_only=True, frozen=True)
class BarberResponse(BaseResponse):
    _id: int
    username: str
    current_status: str
    is_accepting: bool


@dataclass(slots=True, kw_only=True, frozen=True)
class BarberDashboardResponse(BaseResponse):
    total_attended_clients: int
    average_time_with_clients: str | None
    average_rating: float | None
    join_date: str


@dataclass(slots=True, kw_only=True, frozen=True)
class BarberReviewResponse(BaseResponse):
    _id: int
    client_id: int
    username: str
    rating: int
    content: str
    created_at: str
