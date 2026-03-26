from dataclasses import dataclass

from domain.dtos import BaseRequest
from domain.value_objects import Email, Password, Phone, ResetCode, Username


@dataclass(slots=True, kw_only=True, frozen=True)
class LoginRequest(BaseRequest):
    email: Email
    password: Password


@dataclass(slots=True, kw_only=True, frozen=True)
class RegisterRequest(BaseRequest):
    username: Username
    email: Email
    phone: Phone
    password: Password


@dataclass(slots=True, kw_only=True, frozen=True)
class ForgotPasswordRequest(BaseRequest):
    email: Email


@dataclass(slots=True, kw_only=True, frozen=True)
class ResetPasswordRequest(BaseRequest):
    reset_code: ResetCode
    new_password: Password
