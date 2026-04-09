"""
Barbershop DTOs package.
"""

from domain.dtos.barbershops.requests import (
    CreateBarbershopEmployeeRequest,
    CreateBarbershopPhotosRequest,
    CreateBarbershopRequest,
    CreateBarbershopReviewRequest,
    UpdateBarbershopPhotoRequest,
    UpdateBarbershopRequest,
    UpdateBarbershopStatusRequest,
)
from domain.dtos.barbershops.responses import (
    BarbershopClientResponse,
    BarbershopDashboardResponse,
    BarbershopDetailResponse,
    BarbershopEmployeeResponse,
    BarbershopPhotoResponse,
    BarbershopResponse,
    BarbershopReviewResponse,
    CreateBarbershopEmployeeResponse,
    CreateBarbershopPhotosResponse,
    CreateBarbershopResponse,
    GetBarbershopPhotosResponse,
)

__all__ = [
    "CreateBarbershopEmployeeRequest",
    "CreateBarbershopPhotosRequest",
    "CreateBarbershopRequest",
    "CreateBarbershopReviewRequest",
    "UpdateBarbershopPhotoRequest",
    "UpdateBarbershopRequest",
    "UpdateBarbershopStatusRequest",
    "BarbershopClientResponse",
    "BarbershopDashboardResponse",
    "BarbershopDetailResponse",
    "BarbershopEmployeeResponse",
    "BarbershopPhotoResponse",
    "BarbershopResponse",
    "BarbershopReviewResponse",
    "CreateBarbershopEmployeeResponse",
    "CreateBarbershopPhotosResponse",
    "CreateBarbershopResponse",
    "GetBarbershopPhotosResponse",
]
