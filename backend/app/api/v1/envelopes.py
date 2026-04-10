from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from ...core.dependencies import get_current_user
from ...core.exceptions import not_found
from ...db.session import get_session
from ...models.user import User
from ...schemas.envelope import EnvelopeCreate, EnvelopeUpdate, EnvelopeResponse, EnvelopeStatusResponse
from ... import crud

router = APIRouter(prefix="/envelopes", tags=["envelopes"])


@router.get("", response_model=list[EnvelopeResponse])
def list_envelopes(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Lista todos os envelopes do usuário"""
    return crud.envelope.get_all(session, current_user.id)


@router.get("/{env_id}", response_model=EnvelopeResponse)
def get_envelope(
    env_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Obtém um envelope específico"""
    env = crud.envelope.get_one(session, env_id, current_user.id)
    if not env:
        not_found("Envelope não encontrado.")
    return env


@router.get("/{env_id}/status", response_model=EnvelopeStatusResponse)
def get_envelope_status(
    env_id: UUID,
    reference_month: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Obtém o status de uso do envelope no mês"""
    env = crud.envelope.get_one(session, env_id, current_user.id)
    if not env:
        not_found("Envelope não encontrado.")

    if not reference_month:
        from datetime import datetime
        reference_month = datetime.now().strftime("%Y-%m")

    return crud.envelope.get_status(session, env, reference_month)


@router.post("", response_model=EnvelopeResponse, status_code=201)
def create_envelope(
    data: EnvelopeCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Cria um novo envelope de categoria"""
    return crud.envelope.create(session, data, current_user.id)


@router.patch("/{env_id}", response_model=EnvelopeResponse)
def update_envelope(
    env_id: UUID,
    data: EnvelopeUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Atualiza um envelope"""
    env = crud.envelope.get_one(session, env_id, current_user.id)
    if not env:
        not_found("Envelope não encontrado.")
    return crud.envelope.update(session, env, data)


@router.delete("/{env_id}", status_code=204)
def delete_envelope(
    env_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Deleta um envelope"""
    env = crud.envelope.get_one(session, env_id, current_user.id)
    if not env:
        not_found("Envelope não encontrado.")
    crud.envelope.delete(session, env)
