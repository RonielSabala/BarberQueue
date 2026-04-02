from dataclasses import dataclass

from domain.dtos import BaseRequest
from domain.value_objects import TimeOfDay, WorkingDays


@dataclass(slots=True, kw_only=True, frozen=True)
class UpdateEmployeeAssignmentRequest(BaseRequest):
    start_time: TimeOfDay | None
    end_time: TimeOfDay | None
    working_days: WorkingDays | None
