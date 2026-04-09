from enum import StrEnum


class ClientStatusEnum(StrEnum):
    DEFAULT = "default"
    AT_BARBERSHOP = "at_barbershop"
    ON_QUEUE = "on_queue"
    WAITING = "waiting"
    IN_SERVICE = "in_service"
    ATTENDED = "attended"
    PAID = "paid"
