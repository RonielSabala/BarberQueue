from dataclasses import dataclass

from domain.dtos import BaseResponse


@dataclass(slots=True, kw_only=True, frozen=True)
class UserResponse(BaseResponse):
    _id: int
    username: str
    email: str
    role: str


@dataclass(slots=True, kw_only=True, frozen=True)
class LoginResponse(BaseResponse):
    token: str
    user: UserResponse
