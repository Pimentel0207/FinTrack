from uuid import UUID
from datetime import datetime, timezone
from decimal import Decimal
from sqlmodel import Session, select
from ..models.envelope import Envelope
from ..models.transaction import Transaction
from ..schemas.envelope import EnvelopeCreate, EnvelopeUpdate, EnvelopeStatusResponse


def get_all(session: Session, user_id: UUID) -> list[Envelope]:
    query = select(Envelope).where(Envelope.user_id == user_id)
    return session.exec(query.order_by(Envelope.updated_at.desc())).all()


def get_one(session: Session, env_id: UUID, user_id: UUID) -> Envelope | None:
    return session.exec(
        select(Envelope).where(
            Envelope.id == env_id,
            Envelope.user_id == user_id
        )
    ).first()


def create(session: Session, data: EnvelopeCreate, user_id: UUID) -> Envelope:
    env = Envelope(
        user_id=user_id,
        category=data.category,
        limit_amount=data.limit_amount,
    )
    session.add(env)
    session.commit()
    session.refresh(env)
    return env


def update(session: Session, env: Envelope, data: EnvelopeUpdate) -> Envelope:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(env, field, value)
    env.updated_at = datetime.now(timezone.utc)
    session.add(env)
    session.commit()
    session.refresh(env)
    return env


def delete(session: Session, env: Envelope) -> None:
    session.delete(env)
    session.commit()


def get_status(session: Session, env: Envelope, reference_month: str) -> EnvelopeStatusResponse:
    """Calcula o status do envelope para o mês de referência"""
    spent = session.exec(
        select(Transaction).where(
            Transaction.user_id == env.user_id,
            Transaction.category == env.category,
            Transaction.type == "expense",
            Transaction.reference_month == reference_month,
            Transaction.deleted_at == None,
        )
    ).all()

    spent_total = sum(tx.amount for tx in spent)
    percentage = float((spent_total / env.limit_amount * 100)) if env.limit_amount > 0 else 0.0

    if percentage >= 100:
        status = "exceeded"
    elif percentage >= 80:
        status = "alert"
    elif percentage >= 50:
        status = "warning"
    else:
        status = "ok"

    return EnvelopeStatusResponse(
        id=env.id,
        category=env.category,
        limit_amount=env.limit_amount,
        updated_at=env.updated_at,
        spent_current_month=spent_total,
        percentage_used=percentage,
        status=status,
    )
