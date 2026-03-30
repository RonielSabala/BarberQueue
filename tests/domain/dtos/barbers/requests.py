from dataclasses import dataclass

from domain.dtos import BaseRequest
from domain.value_objects import BarberCurrentStatus, Id, Rating, ReviewContent


@dataclass(slots=True, kw_only=True, frozen=True)
class CreateBarberReviewRequest(BaseRequest):
    client_id: Id
    rating: Rating
    content: ReviewContent


@dataclass(slots=True, kw_only=True, frozen=True)
class UpdateBarberStatusRequest(BaseRequest):
    current_status: BarberCurrentStatus | None
    is_accepting: bool | None
