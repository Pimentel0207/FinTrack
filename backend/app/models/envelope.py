from decimal import Decimal
from datetime import datetime, timezone
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field


class Envelope(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    category: str
    limit_amount: Decimal = Field(max_digits=12, decimal_places=2)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
