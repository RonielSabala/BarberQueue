import requests

from api.base_controller import BaseController
from api.decorators import GET, PATCH, route_prefix
from domain.dtos.users import UpdateUserPasswordRequest, UpdateUserRequest


@route_prefix("/api/users")
class UserController(BaseController):
    @GET("")
    def get_all(
        self,
        *,
        username: str | None = None,
        email: str | None = None,
        role: str | None = None,
    ) -> requests.Response: ...

    @GET("/{id}")
    def get_user(self, id: int) -> requests.Response: ...

    @PATCH("/{id}")
    def update_user(self, id: int, request: UpdateUserRequest) -> requests.Response: ...

    @PATCH("/{id}/password")
    def update_user_password(
        self, id: int, request: UpdateUserPasswordRequest
    ) -> requests.Response: ...
