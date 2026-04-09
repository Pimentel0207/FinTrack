from decimal import Decimal
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, field_validator

VALID_TYPES = {"CDB", "Ações", "Tesouro", "FII", "Crypto", "Outros"}


class InvestmentCreate(BaseModel):
    name: str
    type: str
    amount_invested: Decimal
    current_value: Decimal
    return_rate: Decimal

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        if v not in VALID_TYPES:
            raise ValueError(f"Tipo inválido. Use: {', '.join(VALID_TYPES)}")
        return v

    @field_validator("amount_invested", "current_value")
    @classmethod
    def validate_positive(cls, v: Decimal) -> Decimal:
        if v < 0:
            raise ValueError("Valor não pode ser negativo.")
        return v


class InvestmentUpdate(BaseModel):
    name: str | None = None
    type: str | None = None
    amount_invested: Decimal | None = None
    current_value: Decimal | None = None
    return_rate: Decimal | None = None


class InvestmentResponse(BaseModel):
    id: UUID
    name: str
    type: str
    amount_invested: Decimal
    current_value: Decimal
    return_rate: Decimal
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
