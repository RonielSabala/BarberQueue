"""
Barbers DTOs package.
"""

from domain.dtos.barbers.requests import (
    CreateBarberReviewRequest,
    UpdateBarberStatusRequest,
)
from domain.dtos.barbers.responses import BarberDashboardResponse, BarberReviewResponse

__all__ = [
    "CreateBarberReviewRequest",
    "UpdateBarberStatusRequest",
    "BarberDashboardResponse",
    "BarberReviewResponse",
]
