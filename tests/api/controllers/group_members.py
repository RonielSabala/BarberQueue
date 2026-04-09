import requests

from api.base_controller import BaseController
from api.decorators import GET, route_prefix


@route_prefix("/api/group-members")
class GroupMemberController(BaseController):
    @GET("/{id}/turn")
    def get_turn(self, id: int) -> requests.Response: ...
