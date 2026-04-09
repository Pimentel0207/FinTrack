from decimal import Decimal
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, field_validator


class GoalCreate(BaseModel):
    type: str           # "saving" | "sos"
    title: str
    emoji: Optional[str] = None
    target_amount: Decimal
    sos_category: Optional[str] = None

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        if v not in ("saving", "sos"):
            raise ValueError("Tipo deve ser 'saving' ou 'sos'.")
        return v

    @field_validator("target_amount")
    @classmethod
    def validate_amount(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Meta deve ser maior que zero.")
        return v


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    emoji: Optional[str] = None
    target_amount: Optional[Decimal] = None


class DepositWithdraw(BaseModel):
    amount: Decimal

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Valor deve ser maior que zero.")
        return v


class GoalResponse(BaseModel):
    id: UUID
    type: str
    title: str
    emoji: Optional[str]
    target_amount: Decimal
    current_amount: Decimal
    sos_category: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
