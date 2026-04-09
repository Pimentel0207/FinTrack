from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from ...core.dependencies import get_current_user
from ...core.exceptions import not_found, unprocessable
from ...db.session import get_session
from ...models.user import User
from ...schemas.transaction import TransactionCreate, TransactionUpdate, TransactionResponse
from ... import crud

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=list[TransactionResponse])
def list_transactions(
    type: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    reference_month: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return crud.transaction.get_all(session, current_user.id, type, category, reference_month)


@router.get("/{tx_id}", response_model=TransactionResponse)
def get_transaction(tx_id: UUID, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    tx = crud.transaction.get_one(session, tx_id, current_user.id)
    if not tx:
        not_found("Transação não encontrada.")
    return tx


@router.post("", response_model=TransactionResponse, status_code=201)
def create_transaction(
    data: TransactionCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    # Regra: crédito/débito exige card_id
    if data.method in ("credit", "debit") and not data.card_id:
        unprocessable("Cartão obrigatório para pagamentos com crédito ou débito.")

    # Valida que o cartão pertence ao usuário
    if data.card_id:
        card = crud.card.get_one(session, data.card_id, current_user.id)
        if not card:
            not_found("Cartão não encontrado.")

    return crud.transaction.create(session, data, current_user.id)


@router.patch("/{tx_id}", response_model=TransactionResponse)
def update_transaction(
    tx_id: UUID,
    data: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    tx = crud.transaction.get_one(session, tx_id, current_user.id)
    if not tx:
        not_found("Transação não encontrada.")

    if data.card_id:
        card = crud.card.get_one(session, data.card_id, current_user.id)
        if not card:
            not_found("Cartão não encontrado.")

    return crud.transaction.update(session, tx, data)


@router.delete("/{tx_id}", status_code=204)
def delete_transaction(tx_id: UUID, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    tx = crud.transaction.get_one(session, tx_id, current_user.id)
    if not tx:
        not_found("Transação não encontrada.")
    crud.transaction.soft_delete(session, tx)
