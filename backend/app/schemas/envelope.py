from decimal import Decimal
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, field_validator


class EnvelopeCreate(BaseModel):
    category: str
    limit_amount: Decimal

    @field_validator("limit_amount")
    @classmethod
    def validate_amount(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Limite deve ser maior que zero.")
        return v


class EnvelopeUpdate(BaseModel):
    category: str | None = None
    limit_amount: Decimal | None = None


class EnvelopeResponse(BaseModel):
    id: UUID
    category: str
    limit_amount: Decimal
    updated_at: datetime

    model_config = {"from_attributes": True}


class EnvelopeStatusResponse(EnvelopeResponse):
    """Response com status de uso do envelope"""
    spent_current_month: Decimal
    percentage_used: float
    status: str  # "ok", "warning" (50%), "alert" (80%), "exceeded" (100%+)
