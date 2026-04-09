from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from ...core.dependencies import get_current_user
from ...core.exceptions import not_found, unprocessable
from ...db.session import get_session
from ...models.user import User
from ...schemas.goal import GoalCreate, GoalUpdate, GoalResponse, DepositWithdraw
from ... import crud

router = APIRouter(prefix="/goals", tags=["goals"])


@router.get("", response_model=list[GoalResponse])
def list_goals(
    type: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return crud.goal.get_all(session, current_user.id, type)


@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal(goal_id: UUID, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    goal = crud.goal.get_one(session, goal_id, current_user.id)
    if not goal:
        not_found("Meta não encontrada.")
    return goal


@router.post("", response_model=GoalResponse, status_code=201)
def create_goal(data: GoalCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    return crud.goal.create(session, data, current_user.id)


@router.patch("/{goal_id}", response_model=GoalResponse)
def update_goal(goal_id: UUID, data: GoalUpdate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    goal = crud.goal.get_one(session, goal_id, current_user.id)
    if not goal:
        not_found("Meta não encontrada.")
    return crud.goal.update(session, goal, data)


@router.post("/{goal_id}/deposit", response_model=GoalResponse)
def deposit(goal_id: UUID, data: DepositWithdraw, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    goal = crud.goal.get_one(session, goal_id, current_user.id)
    if not goal:
        not_found("Meta não encontrada.")
    return crud.goal.deposit(session, goal, data.amount)


@router.post("/{goal_id}/withdraw", response_model=GoalResponse)
def withdraw(goal_id: UUID, data: DepositWithdraw, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    goal = crud.goal.get_one(session, goal_id, current_user.id)
    if not goal:
        not_found("Meta não encontrada.")
    if data.amount > goal.current_amount:
        unprocessable(f"Saldo insuficiente. Disponível: R$ {goal.current_amount:.2f}")
    return crud.goal.withdraw(session, goal, data.amount)


@router.delete("/{goal_id}", status_code=204)
def delete_goal(goal_id: UUID, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    goal = crud.goal.get_one(session, goal_id, current_user.id)
    if not goal:
        not_found("Meta não encontrada.")
    crud.goal.delete(session, goal)
