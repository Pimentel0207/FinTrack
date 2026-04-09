from decimal import Decimal
from datetime import datetime, timezone
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field


class Investment(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    name: str
    type: str                                          # "CDB", "Ações", "Tesouro", "FII", "Outros"
    amount_invested: Decimal = Field(max_digits=12, decimal_places=2)
    current_value: Decimal = Field(max_digits=12, decimal_places=2)
    return_rate: Decimal = Field(max_digits=8, decimal_places=4)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
