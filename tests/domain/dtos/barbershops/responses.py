from dataclasses import dataclass

from domain.dtos import BaseResponse
from domain.value_objects import IntWorkingDays


@dataclass(slots=True, kw_only=True, frozen=True)
class BarbershopClientResponse(BaseResponse):
    client_id: int
    current_status: str
    username: str


@dataclass(slots=True, kw_only=True, frozen=True)
class BarbershopDashboardResponse(BaseResponse):
    clients_today: int
    clients_this_week: int
    clients_this_month: int
    average_service_minutes: float | None
    average_rating: float | None
    total_reviews: int
    active_barbers: int
    queue_count: int


@dataclass(slots=True, kw_only=True, frozen=True)
class BarbershopDetailResponse(BaseResponse):
    _id: int
    barbershop_name: str
    email: str
    phone: str
    barbershop_address: str
    photo_url: str
    opens_at: str
    closes_at: str
    capacity: int
    is_active: bool
    is_open: bool
    average_rating: float | None


@dataclass(slots=True, kw_only=True, frozen=True)
class BarbershopEmployeeResponse(BaseResponse):
    _id: int
    username: str
    email: str
    phone: str
    role: str
    start_time: str
    end_time: str
    working_days: IntWorkingDays


@dataclass(slots=True, kw_only=True, frozen=True)
class BarbershopPhotoResponse(BaseResponse):
    _id: int
    photo_url: str
    photo_description: str


@dataclass(slots=True, kw_only=True, frozen=True)
class BarbershopResponse(BaseResponse):
    _id: int
    barbershop_name: str
    barbershop_address: str
    photo_url: str
    average_rating: float | None
    is_open: bool


@dataclass(slots=True, kw_only=True, frozen=True)
class BarbershopReviewResponse(BaseResponse):
    _id: int
    client_id: int
    username: str
    rating: int
    content: str
    created_at: str


@dataclass(slots=True, kw_only=True, frozen=True)
class CreateBarbershopEmployeeResponse(BaseResponse):
    _id: int
    username: str
    email: str
    role: str


@dataclass(slots=True, kw_only=True, frozen=True)
class CreateBarbershopResponse(BaseResponse):
    _id: int
    barbershop_name: str
    email: str
    phone: str
    barbershop_address: str
    photo_url: str
    opens_at: str
    closes_at: str
    capacity: int
    is_active: bool
