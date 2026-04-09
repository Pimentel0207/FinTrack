from datetime import datetime, timezone
from uuid import UUID
from sqlmodel import Session, select
from ..models.investment import Investment
from ..schemas.investment import InvestmentCreate, InvestmentUpdate


def get_all(session: Session, user_id: UUID) -> list[Investment]:
    return session.exec(select(Investment).where(Investment.user_id == user_id)).all()


def get_one(session: Session, inv_id: UUID, user_id: UUID) -> Investment | None:
    return session.exec(
        select(Investment).where(Investment.id == inv_id, Investment.user_id == user_id)
    ).first()


def create(session: Session, data: InvestmentCreate, user_id: UUID) -> Investment:
    inv = Investment(
        user_id=user_id,
        name=data.name,
        type=data.type,
        amount_invested=data.amount_invested,
        current_value=data.current_value,
        return_rate=data.return_rate,
    )
    session.add(inv)
    session.commit()
    session.refresh(inv)
    return inv


def update(session: Session, inv: Investment, data: InvestmentUpdate) -> Investment:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(inv, field, value)
    inv.updated_at = datetime.now(timezone.utc)
    session.add(inv)
    session.commit()
    session.refresh(inv)
    return inv


def delete(session: Session, inv: Investment) -> None:
    session.delete(inv)
    session.commit()
