import requests

from api.base_controller import BaseController
from api.decorators import DELETE, GET, PATCH, route_prefix
from domain.dtos.employees import UpdateEmployeeAssignmentRequest


@route_prefix("/api/employees")
class EmployeeController(BaseController):
    @GET("/{id}")
    def get(self, id: int) -> requests.Response: ...

    @PATCH("/{id}/barbershop/{barbershop_id}")
    def update_assignment(
        self, id: int, barbershop_id: int, request: UpdateEmployeeAssignmentRequest
    ) -> requests.Response: ...

    @DELETE("/{id}")
    def delete(self, id: int) -> requests.Response: ...
