from datetime import datetime, timezone
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field


class RevokedToken(SQLModel, table=True):
    __tablename__ = "revoked_token"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    token_hash: str = Field(unique=True)
    revoked_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime
