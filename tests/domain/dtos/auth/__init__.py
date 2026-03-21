"""
Auth DTOs package.
"""

from domain.dtos.auth.requests import (
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
)
from domain.dtos.auth.responses import (
    ForgotPasswordResponse,
    LoginResponse,
    UserResponse,
)

__all__ = [
    "ForgotPasswordRequest",
    "LoginRequest",
    "RegisterRequest",
    "ResetPasswordRequest",
    "ForgotPasswordResponse",
    "LoginResponse",
    "UserResponse",
]
