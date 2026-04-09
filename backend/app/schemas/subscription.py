from decimal import Decimal
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, field_validator


class SubscriptionCreate(BaseModel):
    name: str
    amount: Decimal
    billing_day: int
    category: str

    @field_validator("billing_day")
    @classmethod
    def validate_day(cls, v: int) -> int:
        if not 1 <= v <= 28:
            raise ValueError("billing_day deve ser entre 1 e 28.")
        return v

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Valor deve ser maior que zero.")
        return v


class SubscriptionUpdate(BaseModel):
    name: str | None = None
    amount: Decimal | None = None
    billing_day: int | None = None
    category: str | None = None


class SubscriptionResponse(BaseModel):
    id: UUID
    name: str
    amount: Decimal
    billing_day: int
    category: str
    created_at: datetime

    model_config = {"from_attributes": True}
