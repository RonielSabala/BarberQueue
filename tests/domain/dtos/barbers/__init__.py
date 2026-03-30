"""
Barbers DTOs package.
"""

from domain.dtos.barbers.requests import (
    CreateBarberReviewRequest,
    UpdateBarberStatusRequest,
)
from domain.dtos.barbers.responses import (
    BarberDashboardResponse,
    BarberResponse,
    BarberReviewResponse,
)

__all__ = [
    "CreateBarberReviewRequest",
    "UpdateBarberStatusRequest",
    "BarberDashboardResponse",
    "BarberResponse",
    "BarberReviewResponse",
]
