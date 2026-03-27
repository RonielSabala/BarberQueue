import requests

from api.base_controller import BaseController
from api.decorators import DELETE, GET, PATCH, POST, route_prefix
from domain.dtos.barbershops import (
    CreateBarbershopEmployeeRequest,
    CreateBarbershopPhotosRequest,
    CreateBarbershopRequest,
    CreateBarbershopReviewRequest,
    UpdateBarbershopPhotoRequest,
    UpdateBarbershopRequest,
    UpdateBarbershopStatusRequest,
)


@route_prefix("/api/barbershops")
class BarbershopController(BaseController):
    @GET("")
    def get_all(
        self, *, search: str | None = None, is_open: bool | None = None
    ) -> requests.Response: ...

    @POST("")
    def create(self, request: CreateBarbershopRequest) -> requests.Response: ...

    @GET("/{id}")
    def get(self, id: int) -> requests.Response: ...

    @PATCH("/{id}")
    def update(
        self, id: int, request: UpdateBarbershopRequest
    ) -> requests.Response: ...

    @PATCH("/{id}/status")
    def update_status(
        self, id: int, request: UpdateBarbershopStatusRequest
    ) -> requests.Response: ...

    @PATCH("/{id}/photo")
    def update_photo(
        self, id: int, request: UpdateBarbershopPhotoRequest
    ) -> requests.Response: ...

    @GET("/{id}/photos")
    def get_photos(self, id: int) -> requests.Response: ...

    @POST("/{id}/photos")
    def add_photos(
        self, id: int, request: CreateBarbershopPhotosRequest
    ) -> requests.Response: ...

    @DELETE("/{id}/photos/{photo_id}")
    def delete_photo(self, id: int, photo_id: int) -> requests.Response: ...

    @GET("/{id}/reviews")
    def get_reviews(self, id: int) -> requests.Response: ...

    @POST("/{id}/reviews")
    def add_review(
        self, id: int, request: CreateBarbershopReviewRequest
    ) -> requests.Response: ...

    @DELETE("/{id}/reviews/{review_id}")
    def delete_review(self, id: int, review_id: int) -> requests.Response: ...

    @GET("/{id}/employees")
    def get_employees(self, id: int) -> requests.Response: ...

    @POST("/{id}/employees")
    def create_employee(
        self, id: int, request: CreateBarbershopEmployeeRequest
    ) -> requests.Response: ...

    @DELETE("/{id}/employees/{employee_id}")
    def delete_employee(self, id: int, employee_id: int) -> requests.Response: ...
