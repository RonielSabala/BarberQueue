"""
Auth DTOs package.
"""

from domain.dtos.auth.requests import (
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
)
from domain.dtos.auth.responses import LoginResponse, UserResponse

__all__ = [
    "ForgotPasswordRequest",
    "LoginRequest",
    "RegisterRequest",
    "ResetPasswordRequest",
    "LoginResponse",
    "UserResponse",
]
