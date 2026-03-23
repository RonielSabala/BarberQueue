from dataclasses import dataclass

from domain.dtos import BaseResponse, MessageResponse


@dataclass(slots=True, kw_only=True, frozen=True)
class GetUserResponse(BaseResponse):
    _id: int
    username: str
    email: str
    phone: str
    role: str


@dataclass(slots=True, kw_only=True, frozen=True)
class UpdateUserResponse(MessageResponse): ...


@dataclass(slots=True, kw_only=True, frozen=True)
class UpdateUserPasswordResponse(MessageResponse): ...
