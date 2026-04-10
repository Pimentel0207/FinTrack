from uuid import UUID
from fastapi import APIRouter, Depends
from sqlmodel import Session

from ...core.dependencies import get_current_user
from ...core.exceptions import not_found
from ...db.session import get_session
from ...models.user import User
from ...schemas.subscription import SubscriptionCreate, SubscriptionUpdate, SubscriptionResponse
from ... import crud

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.get("", response_model=list[SubscriptionResponse])
def list_subscriptions(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Lista todas as assinaturas do usuário"""
    return crud.subscription.get_all(session, current_user.id)


@router.get("/{sub_id}", response_model=SubscriptionResponse)
def get_subscription(
    sub_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Obtém uma assinatura específica"""
    sub = crud.subscription.get_one(session, sub_id, current_user.id)
    if not sub:
        not_found("Assinatura não encontrada.")
    return sub


@router.post("", response_model=SubscriptionResponse, status_code=201)
def create_subscription(
    data: SubscriptionCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Cria uma nova assinatura"""
    return crud.subscription.create(session, data, current_user.id)


@router.patch("/{sub_id}", response_model=SubscriptionResponse)
def update_subscription(
    sub_id: UUID,
    data: SubscriptionUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Atualiza uma assinatura"""
    sub = crud.subscription.get_one(session, sub_id, current_user.id)
    if not sub:
        not_found("Assinatura não encontrada.")
    return crud.subscription.update(session, sub, data)


@router.delete("/{sub_id}", status_code=204)
def delete_subscription(
    sub_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Deleta uma assinatura"""
    sub = crud.subscription.get_one(session, sub_id, current_user.id)
    if not sub:
        not_found("Assinatura não encontrada.")
    crud.subscription.delete(session, sub)
