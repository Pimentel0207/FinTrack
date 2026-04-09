from decimal import Decimal
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field


class Goal(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    type: str                                          # "saving" ou "sos"
    title: str
    emoji: Optional[str] = None
    target_amount: Decimal = Field(max_digits=12, decimal_places=2)
    current_amount: Decimal = Field(default=Decimal("0.00"), max_digits=12, decimal_places=2)
    sos_category: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
