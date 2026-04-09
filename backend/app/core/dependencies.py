from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from jose import JWTError
from .security import decode_token
from .exceptions import unauthorized
from ..db.session import get_session
from ..models.user import User
from ..models.revoked_token import RevokedToken
import hashlib

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> User:
    try:
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        revoked = session.exec(select(RevokedToken).where(RevokedToken.token_hash == token_hash)).first()
        if revoked:
            unauthorized("Token revogado.")

        payload = decode_token(token)
        user_id: str = payload.get("sub")
        if not user_id:
            unauthorized()
    except JWTError:
        unauthorized()

    user = session.get(User, user_id)
    if not user:
        unauthorized("Usuário não encontrado.")
    return user
