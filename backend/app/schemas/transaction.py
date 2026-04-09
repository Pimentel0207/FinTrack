from decimal import Decimal
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, field_validator


VALID_TYPES = {"income", "expense", "patrimony"}
VALID_METHODS = {"pix", "debit", "credit", None}


class TransactionCreate(BaseModel):
    type: str
    amount: Decimal
    description: str
    category: str
    method: Optional[str] = None
    card_id: Optional[UUID] = None
    is_fixed: bool = False
    reference_month: str  # "YYYY-MM"

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        if v not in VALID_TYPES:
            raise ValueError(f"Tipo inválido. Use: {', '.join(VALID_TYPES)}")
        return v

    @field_validator("method")
    @classmethod
    def validate_method(cls, v: Optional[str]) -> Optional[str]:
        if v not in VALID_METHODS:
            raise ValueError("Método inválido. Use: pix, debit, credit")
        return v

    @field_validator("reference_month")
    @classmethod
    def validate_month(cls, v: str) -> str:
        import re
        if not re.match(r"^\d{4}-(0[1-9]|1[0-2])$", v):
            raise ValueError("reference_month deve estar no formato YYYY-MM")
        return v

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Valor deve ser maior que zero.")
        return v


class TransactionUpdate(BaseModel):
    description: Optional[str] = None
    category: Optional[str] = None
    method: Optional[str] = None
    card_id: Optional[UUID] = None
    amount: Optional[Decimal] = None
    is_fixed: Optional[bool] = None
    reference_month: Optional[str] = None


class TransactionResponse(BaseModel):
    id: UUID
    type: str
    amount: Decimal
    description: str
    category: str
    method: Optional[str]
    card_id: Optional[UUID]
    is_fixed: bool
    reference_month: str
    created_at: datetime

    model_config = {"from_attributes": True}
