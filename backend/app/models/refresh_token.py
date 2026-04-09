from datetime import datetime, timezone
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field


class RefreshToken(SQLModel, table=True):
    __tablename__ = "refresh_token"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    token_hash: str = Field(unique=True)
    expires_at: datetime
    revoked: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
