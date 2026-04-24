import requests

from api.base_controller import BaseController
from api.decorators import DELETE, GET, PATCH, POST, route_prefix
from domain.dtos.turns import CreateTurnRequest


@route_prefix("/api/turns")
class TurnController(BaseController):
    @GET("/{id}")
    def get_turn(self, id: int) -> requests.Response: ...

    @POST("")
    def create_turn(self, request: CreateTurnRequest) -> requests.Response: ...

    @DELETE("/{id}")
    def delete_turn(self, id: int) -> requests.Response: ...

    @PATCH("/{id}/wait")
    def wait_turn(self, id: int) -> requests.Response: ...

    @PATCH("/{id}/unwait")
    def unwait_turn(self, id: int) -> requests.Response: ...

    @PATCH("/{id}/attend")
    def attend_turn(self, id: int) -> requests.Response: ...

    @PATCH("/{id}/pay")
    def pay_turn(self, id: int) -> requests.Response: ...
