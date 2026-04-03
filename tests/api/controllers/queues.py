import requests

from api.base_controller import BaseController
from api.decorators import GET, route_prefix


@route_prefix("/api/queues")
class QueueController(BaseController):
    @GET("/barbershop/{barbershop_id}")
    def get_barbershop_queues(self, barbershop_id: int) -> requests.Response: ...

    @GET("/barber/{barber_id}")
    def get_barber_queue(self, barber_id: int) -> requests.Response: ...
