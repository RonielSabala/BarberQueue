from dataclasses import dataclass

from domain.dtos import BaseRequest
from domain.value_objects import (
    Address,
    BarbershopName,
    Capacity,
    Email,
    Id,
    Password,
    Phone,
    PhotoUrl,
    PhotoUrls,
    Rating,
    ReviewContent,
    RoleName,
    TimeOfDay,
    Username,
    WorkingDays,
)


@dataclass(slots=True, kw_only=True, frozen=True)
class CreateBarbershopEmployeeRequest(BaseRequest):
    username: Username
    email: Email
    phone: Phone
    password: Password
    role: RoleName
    start_time: TimeOfDay
    end_time: TimeOfDay
    working_days: WorkingDays


@dataclass(slots=True, kw_only=True, frozen=True)
class CreateBarbershopPhotosRequest(BaseRequest):
    photo_urls: PhotoUrls


@dataclass(slots=True, kw_only=True, frozen=True)
class CreateBarbershopRequest(BaseRequest):
    barbershop_name: BarbershopName
    email: Email
    phone: Phone
    barbershop_address: Address
    photo_url: PhotoUrl
    opens_at: TimeOfDay
    closes_at: TimeOfDay
    capacity: Capacity | None


@dataclass(slots=True, kw_only=True, frozen=True)
class CreateBarbershopReviewRequest(BaseRequest):
    user_id: Id
    rating: Rating
    content: ReviewContent


@dataclass(slots=True, kw_only=True, frozen=True)
class UpdateBarbershopPhotoRequest(BaseRequest):
    photo_url: PhotoUrl


@dataclass(slots=True, kw_only=True, frozen=True)
class UpdateBarbershopRequest(BaseRequest):
    barbershop_name: BarbershopName | None
    email: Email | None
    phone: Phone | None
    barbershop_address: Address | None
    opens_at: TimeOfDay | None
    closes_at: TimeOfDay | None
    capacity: Capacity | None


@dataclass(slots=True, kw_only=True, frozen=True)
class UpdateBarbershopStatusRequest(BaseRequest):
    is_active: bool
