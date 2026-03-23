from dataclasses import dataclass

from domain.dtos import BaseRequest
from domain.value_objects import Email, Password, Phone, Username


@dataclass(slots=True, kw_only=True, frozen=True)
class UpdateUserRequest(BaseRequest):
    username: Username | None
    email: Email | None
    phone: Phone | None


@dataclass(slots=True, kw_only=True, frozen=True)
class UpdateUserPasswordRequest(BaseRequest):
    current_password: Password
    new_password: Password
