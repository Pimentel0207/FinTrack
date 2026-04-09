from uuid import UUID
from fastapi import APIRouter, Depends
from sqlmodel import Session

from ...core.dependencies import get_current_user
from ...core.exceptions import not_found
from ...db.session import get_session
from ...models.user import User
from ...schemas.card import CardCreate, CardUpdate, CardResponse
from ... import crud

router = APIRouter(prefix="/cards", tags=["cards"])


@router.get("", response_model=list[CardResponse])
def list_cards(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    return crud.card.get_all(session, current_user.id)


@router.get("/{card_id}", response_model=CardResponse)
def get_card(card_id: UUID, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    card = crud.card.get_one(session, card_id, current_user.id)
    if not card:
        not_found("Cartão não encontrado.")
    return card


@router.post("", response_model=CardResponse, status_code=201)
def create_card(data: CardCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    return crud.card.create(session, data, current_user.id)


@router.put("/{card_id}", response_model=CardResponse)
def update_card(card_id: UUID, data: CardUpdate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    card = crud.card.get_one(session, card_id, current_user.id)
    if not card:
        not_found("Cartão não encontrado.")
    return crud.card.update(session, card, data)


@router.delete("/{card_id}", status_code=204)
def delete_card(card_id: UUID, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    card = crud.card.get_one(session, card_id, current_user.id)
    if not card:
        not_found("Cartão não encontrado.")
    crud.card.delete(session, card)
