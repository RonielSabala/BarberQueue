from dataclasses import dataclass
from typing import Annotated, Any, Self

from domain.dtos import BaseRequest
from domain.utils import DEFAULT_OPTIONAL_CHANCE
from domain.value_objects import (
    Address,
    BarbershopName,
    Capacity,
    Description,
    Email,
    EmployeeRole,
    Id,
    Password,
    Phone,
    PhotoUrl,
    Rating,
    ReviewContent,
    TimeOfDay,
    Username,
    WorkingDays,
)
from domain.value_objects.base import ListOf


@dataclass(slots=True, kw_only=True, frozen=True)
class AssignBarbershopEmployeeRequest(BaseRequest):
    start_time: TimeOfDay
    end_time: TimeOfDay
    working_days: WorkingDays


@dataclass(slots=True, kw_only=True, frozen=True)
class CreateBarbershopEmployeeRequest(BaseRequest):
    username: Username
    email: Email
    phone: Phone
    password: Password
    role: EmployeeRole
    start_time: TimeOfDay
    end_time: TimeOfDay
    working_days: WorkingDays

    @classmethod
    def random(
        cls, optional_chance: float = DEFAULT_OPTIONAL_CHANCE, **fields: Any | tuple
    ) -> Self:
        if "start_time" not in fields and "end_time" not in fields:
            start_time, end_time = TimeOfDay.random_sorted_times(n=2)
            fields = {"start_time": start_time, "end_time": end_time, **fields}

        return super(CreateBarbershopEmployeeRequest, cls).random(
            optional_chance, **fields
        )


@dataclass(slots=True, kw_only=True, frozen=True)
class CreateBarbershopPhotoRequest(BaseRequest):
    photo_url: PhotoUrl
    photo_description: Description


@dataclass(slots=True, kw_only=True, frozen=True)
class CreateBarbershopPhotosRequest(BaseRequest):
    photos: Annotated[
        list[CreateBarbershopPhotoRequest],
        ListOf(base_type=CreateBarbershopPhotoRequest, min_items=1),
    ]


@dataclass(slots=True, kw_only=True, frozen=True)
class CreateBarbershopRequest(BaseRequest):
    admin_id: Id
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
    client_id: Id
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
