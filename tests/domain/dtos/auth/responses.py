from dataclasses import dataclass

from domain.dtos.app.responses import MessageResponse
from domain.dtos.base_response import BaseResponse


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


@dataclass(slots=True, kw_only=True, frozen=True)
class ForgotPasswordResponse(MessageResponse): ...
