from dataclasses import dataclass
from typing import Annotated

from domain.dtos import BaseResponse
from domain.value_objects import IntWorkingDays
from domain.value_objects.base import ListOf


@dataclass(slots=True, kw_only=True, frozen=True)
class EmployeeAssignmentResponse(BaseResponse):
    barbershop_id: int
    start_time: str
    end_time: str
    working_days: IntWorkingDays


@dataclass(slots=True, kw_only=True, frozen=True)
class EmployeeResponse(BaseResponse):
    _id: int
    username: str
    email: str
    phone: str
    role: str
    assignments: Annotated[
        list[EmployeeAssignmentResponse], ListOf(base_type=EmployeeAssignmentResponse)
    ]
