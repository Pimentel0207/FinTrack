from uuid import UUID
from datetime import datetime, timezone
from sqlmodel import Session, select
from ..models.subscription import Subscription
from ..schemas.subscription import SubscriptionCreate, SubscriptionUpdate


def get_all(session: Session, user_id: UUID) -> list[Subscription]:
    query = select(Subscription).where(Subscription.user_id == user_id)
    return session.exec(query.order_by(Subscription.created_at.desc())).all()


def get_one(session: Session, sub_id: UUID, user_id: UUID) -> Subscription | None:
    return session.exec(
        select(Subscription).where(
            Subscription.id == sub_id,
            Subscription.user_id == user_id
        )
    ).first()


def create(session: Session, data: SubscriptionCreate, user_id: UUID) -> Subscription:
    sub = Subscription(
        user_id=user_id,
        name=data.name,
        amount=data.amount,
        billing_day=data.billing_day,
        category=data.category,
    )
    session.add(sub)
    session.commit()
    session.refresh(sub)
    return sub


def update(session: Session, sub: Subscription, data: SubscriptionUpdate) -> Subscription:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(sub, field, value)
    session.add(sub)
    session.commit()
    session.refresh(sub)
    return sub


def delete(session: Session, sub: Subscription) -> None:
    session.delete(sub)
    session.commit()
