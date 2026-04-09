from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


class CardCreate(BaseModel):
    nickname: str


class CardUpdate(BaseModel):
    nickname: str


class CardResponse(BaseModel):
    id: UUID
    nickname: str
    created_at: datetime

    model_config = {"from_attributes": True}
