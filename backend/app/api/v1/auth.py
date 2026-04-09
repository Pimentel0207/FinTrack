import hashlib
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request
from sqlmodel import Session, select

from ...core.security import create_access_token, create_refresh_token, decode_token
from ...core.dependencies import get_current_user, oauth2_scheme
from ...core.exceptions import unauthorized, conflict
from ...db.session import get_session
from ...models.user import User
from ...models.refresh_token import RefreshToken
from ...models.revoked_token import RevokedToken
from ...schemas.user import UserCreate, UserLogin, TokenResponse, UserResponse, RefreshRequest
from ... import crud

router = APIRouter(prefix="/auth", tags=["auth"])


def _build_token_response(user: User, remember_me: bool = False) -> dict:
    access_token = create_access_token(str(user.id))
    refresh_token_str, expires_at = create_refresh_token(str(user.id), remember_me)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token_str,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user),
        "_refresh_expires_at": expires_at,
    }


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(data: UserCreate, session: Session = Depends(get_session)):
    if crud.user.get_by_email(session, data.email):
        conflict("Email já cadastrado.")
    if crud.user.get_by_username(session, data.username):
        conflict("Username já em uso.")

    user = crud.user.create(session, data)

    tokens = _build_token_response(user)

    token_hash = hashlib.sha256(tokens["refresh_token"].encode()).hexdigest()
    session.add(RefreshToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=tokens["_refresh_expires_at"],
    ))
    session.commit()

    return TokenResponse(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_type="bearer",
        user=tokens["user"],
    )


@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, session: Session = Depends(get_session)):
    user = crud.user.authenticate(session, data.login, data.password)
    if not user:
        unauthorized("Credenciais inválidas.")

    tokens = _build_token_response(user, data.remember_me)

    token_hash = hashlib.sha256(tokens["refresh_token"].encode()).hexdigest()
    session.add(RefreshToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=tokens["_refresh_expires_at"],
        revoked=False,
    ))
    session.commit()

    return TokenResponse(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_type="bearer",
        user=tokens["user"],
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh(data: RefreshRequest, session: Session = Depends(get_session)):
    try:
        payload = decode_token(data.refresh_token)
        if payload.get("type") != "refresh":
            unauthorized("Token inválido.")
        user_id = payload.get("sub")
    except Exception:
        unauthorized("Token inválido ou expirado.")

    token_hash = hashlib.sha256(data.refresh_token.encode()).hexdigest()
    stored = session.exec(
        select(RefreshToken).where(RefreshToken.token_hash == token_hash)
    ).first()

    expires_at = stored.expires_at if stored.expires_at.tzinfo else stored.expires_at.replace(tzinfo=timezone.utc)
    if not stored or stored.revoked or expires_at < datetime.now(timezone.utc):
        unauthorized("Refresh token inválido ou expirado.")

    # Revoga o token atual e emite um novo (rotation)
    stored.revoked = True
    session.add(stored)

    user = session.get(User, user_id)
    if not user:
        unauthorized("Usuário não encontrado.")

    tokens = _build_token_response(user)

    new_hash = hashlib.sha256(tokens["refresh_token"].encode()).hexdigest()
    session.add(RefreshToken(
        user_id=user.id,
        token_hash=new_hash,
        expires_at=tokens["_refresh_expires_at"],
    ))
    session.commit()

    return TokenResponse(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.post("/logout", status_code=204)
def logout(
    token: str = Depends(oauth2_scheme),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    # Adiciona access token na blacklist
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    try:
        payload = decode_token(token)
        expires_at = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
    except Exception:
        unauthorized()

    session.add(RevokedToken(token_hash=token_hash, expires_at=expires_at))

    # Revoga todos os refresh tokens do usuário
    refresh_tokens = session.exec(
        select(RefreshToken).where(
            RefreshToken.user_id == current_user.id,
            RefreshToken.revoked == False,
        )
    ).all()
    for rt in refresh_tokens:
        rt.revoked = True
        session.add(rt)

    session.commit()
