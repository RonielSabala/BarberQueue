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
