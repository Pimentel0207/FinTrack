from decimal import Decimal
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field


class Transaction(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    type: str                                          # "income", "expense", "patrimony"
    amount: Decimal = Field(max_digits=12, decimal_places=2)
    description: str = Field(max_length=255)
    category: str
    method: Optional[str] = None                       # "pix", "debit", "credit"
    card_id: Optional[UUID] = Field(default=None, foreign_key="card.id")
    is_fixed: bool = False
    reference_month: str                               # "YYYY-MM"
    deleted_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
