from __future__ import annotations

import requests

from api.base_controller import BaseController
from api.decorators import POST, route_prefix
from domain.dtos.auth.requests import (
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
)


@route_prefix("/api/auth")
class AuthController(BaseController):
    @POST("/login")
    def login(self, request: LoginRequest) -> requests.Response: ...

    @POST("/register")
    def register(self, request: RegisterRequest) -> requests.Response: ...

    @POST("/forgot-password")
    def forgot_password(self, request: ForgotPasswordRequest) -> requests.Response: ...

    @POST("/reset-password")
    def reset_password(self, request: ResetPasswordRequest) -> requests.Response: ...
