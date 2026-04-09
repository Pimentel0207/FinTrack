from sqlmodel import Session, select
from ..models.user import User
from ..schemas.user import UserCreate
from ..core.security import hash_password, verify_password


def get_by_email(session: Session, email: str) -> User | None:
    return session.exec(select(User).where(User.email == email)).first()


def get_by_username(session: Session, username: str) -> User | None:
    return session.exec(select(User).where(User.username == username)).first()


def get_by_login(session: Session, login: str) -> User | None:
    """Aceita email ou username."""
    user = get_by_email(session, login)
    if not user:
        user = get_by_username(session, login)
    return user


def create(session: Session, data: UserCreate) -> User:
    user = User(
        name=data.name,
        email=data.email,
        username=data.username,
        password_hash=hash_password(data.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def authenticate(session: Session, login: str, password: str) -> User | None:
    user = get_by_login(session, login)
    if not user or not verify_password(password, user.password_hash):
        return None
    return user
