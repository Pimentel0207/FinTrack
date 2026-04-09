from datetime import datetime, timezone
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field


class Card(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    nickname: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
