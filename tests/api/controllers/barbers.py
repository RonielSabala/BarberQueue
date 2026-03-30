import requests

from api.base_controller import BaseController
from api.decorators import DELETE, GET, PATCH, POST, route_prefix
from domain.dtos.barbers import CreateBarberReviewRequest, UpdateBarberStatusRequest


@route_prefix("/api/barbers")
class BarberController(BaseController):
    @GET("/{id}")
    def get(self, id: int) -> requests.Response: ...

    @GET("/{id}/dashboard")
    def get_dashboard(self, id: int) -> requests.Response: ...

    @PATCH("/{id}/status")
    def update_status(
        self, id: int, request: UpdateBarberStatusRequest
    ) -> requests.Response: ...

    @GET("/{id}/reviews")
    def get_reviews(self, id: int) -> requests.Response: ...

    @POST("/{id}/reviews")
    def create_review(
        self, id: int, request: CreateBarberReviewRequest
    ) -> requests.Response: ...

    @DELETE("/{id}/reviews/{review_id}")
    def delete_review(self, id: int, review_id: int) -> requests.Response: ...
