from dataclasses import dataclass

from domain.requests.base import BaseRequest
from domain.value_objects import Email, Password, Phone, ResetCode, Username


@dataclass(slots=True, frozen=True)
class LoginRequest(BaseRequest):
    email: Email
    password: Password


@dataclass(slots=True, frozen=True)
class RegisterRequest(BaseRequest):
    username: Username
    email: Email
    phone: Phone
    password: Password


@dataclass(slots=True, frozen=True)
class ForgotPasswordRequest(BaseRequest):
    email: Email


@dataclass(slots=True, frozen=True)
class ResetPasswordRequest(BaseRequest):
    reset_code: ResetCode
    password: Password
