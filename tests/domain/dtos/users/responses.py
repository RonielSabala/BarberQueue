from dataclasses import dataclass

from domain.dtos import BaseResponse


@dataclass(slots=True, kw_only=True, frozen=True)
class GetUserResponse(BaseResponse):
    _id: int
    username: str
    email: str
    phone: str
    role: str
