from uuid import UUID
from fastapi import APIRouter, Depends
from sqlmodel import Session

from ...core.dependencies import get_current_user
from ...core.exceptions import not_found
from ...db.session import get_session
from ...models.user import User
from ...schemas.investment import InvestmentCreate, InvestmentUpdate, InvestmentResponse
from ... import crud

router = APIRouter(prefix="/investments", tags=["investments"])


@router.get("", response_model=list[InvestmentResponse])
def list_investments(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    return crud.investment.get_all(session, current_user.id)


@router.get("/{inv_id}", response_model=InvestmentResponse)
def get_investment(inv_id: UUID, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    inv = crud.investment.get_one(session, inv_id, current_user.id)
    if not inv:
        not_found("Investimento não encontrado.")
    return inv


@router.post("", response_model=InvestmentResponse, status_code=201)
def create_investment(data: InvestmentCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    return crud.investment.create(session, data, current_user.id)


@router.patch("/{inv_id}", response_model=InvestmentResponse)
def update_investment(inv_id: UUID, data: InvestmentUpdate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    inv = crud.investment.get_one(session, inv_id, current_user.id)
    if not inv:
        not_found("Investimento não encontrado.")
    return crud.investment.update(session, inv, data)


@router.delete("/{inv_id}", status_code=204)
def delete_investment(inv_id: UUID, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    inv = crud.investment.get_one(session, inv_id, current_user.id)
    if not inv:
        not_found("Investimento não encontrado.")
    crud.investment.delete(session, inv)
