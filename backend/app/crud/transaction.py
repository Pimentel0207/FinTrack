from uuid import UUID
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Session, select
from ..models.transaction import Transaction
from ..schemas.transaction import TransactionCreate, TransactionUpdate


def get_all(
    session: Session,
    user_id: UUID,
    type: Optional[str] = None,
    category: Optional[str] = None,
    reference_month: Optional[str] = None,
) -> list[Transaction]:
    query = select(Transaction).where(
        Transaction.user_id == user_id,
        Transaction.deleted_at == None,
    )
    if type:
        query = query.where(Transaction.type == type)
    if category:
        query = query.where(Transaction.category == category)
    if reference_month:
        query = query.where(Transaction.reference_month == reference_month)

    query = query.order_by(Transaction.created_at.desc())
    return session.exec(query).all()


def get_one(session: Session, tx_id: UUID, user_id: UUID) -> Transaction | None:
    return session.exec(
        select(Transaction).where(
            Transaction.id == tx_id,
            Transaction.user_id == user_id,
            Transaction.deleted_at == None,
        )
    ).first()


def create(session: Session, data: TransactionCreate, user_id: UUID) -> Transaction:
    tx = Transaction(
        user_id=user_id,
        type=data.type,
        amount=data.amount,
        description=data.description,
        category=data.category,
        method=data.method,
        card_id=data.card_id,
        is_fixed=data.is_fixed,
        reference_month=data.reference_month,
    )
    session.add(tx)
    session.commit()
    session.refresh(tx)
    return tx


def update(session: Session, tx: Transaction, data: TransactionUpdate) -> Transaction:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(tx, field, value)
    session.add(tx)
    session.commit()
    session.refresh(tx)
    return tx


def soft_delete(session: Session, tx: Transaction) -> None:
    tx.deleted_at = datetime.now(timezone.utc)
    session.add(tx)
    session.commit()
