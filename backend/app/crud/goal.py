from decimal import Decimal
from datetime import datetime, timezone
from uuid import UUID
from sqlmodel import Session, select
from ..models.goal import Goal
from ..schemas.goal import GoalCreate, GoalUpdate


def get_all(session: Session, user_id: UUID, type: str | None = None) -> list[Goal]:
    query = select(Goal).where(Goal.user_id == user_id)
    if type:
        query = query.where(Goal.type == type)
    return session.exec(query).all()


def get_one(session: Session, goal_id: UUID, user_id: UUID) -> Goal | None:
    return session.exec(
        select(Goal).where(Goal.id == goal_id, Goal.user_id == user_id)
    ).first()


def create(session: Session, data: GoalCreate, user_id: UUID) -> Goal:
    goal = Goal(
        user_id=user_id,
        type=data.type,
        title=data.title,
        emoji=data.emoji,
        target_amount=data.target_amount,
        sos_category=data.sos_category,
    )
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal


def update(session: Session, goal: Goal, data: GoalUpdate) -> Goal:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(goal, field, value)
    goal.updated_at = datetime.now(timezone.utc)
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal


def deposit(session: Session, goal: Goal, amount: Decimal) -> Goal:
    goal.current_amount += amount
    goal.updated_at = datetime.now(timezone.utc)
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal


def withdraw(session: Session, goal: Goal, amount: Decimal) -> Goal:
    goal.current_amount -= amount
    goal.updated_at = datetime.now(timezone.utc)
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal


def delete(session: Session, goal: Goal) -> None:
    session.delete(goal)
    session.commit()
