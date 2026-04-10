from fastapi import APIRouter, Depends
from sqlmodel import Session

from ...core.dependencies import get_current_user
from ...core.exceptions import unauthorized
from ...db.session import get_session
from ...models.user import User
from ...schemas.user import UserResponse, UserUpdate, PasswordChangeRequest
from ...core.security import verify_password
from ... import crud

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", response_model=UserResponse)
def get_profile(
    current_user: User = Depends(get_current_user),
):
    """Retorna o perfil do usuário autenticado"""
    return UserResponse.model_validate(current_user)


@router.patch("", response_model=UserResponse)
def update_profile(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Atualiza perfil do usuário (nome, salário, currency, avatar)"""
    updated_user = crud.user.update(session, current_user, data)
    return UserResponse.model_validate(updated_user)


@router.post("/change-password", status_code=204)
def change_password(
    data: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Altera a senha do usuário"""
    if not verify_password(data.current_password, current_user.password_hash):
        unauthorized("Senha atual incorreta.")

    crud.user.change_password(session, current_user, data.new_password)
