from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt, JWTError
from .config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({"sub": user_id, "exp": expire}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(user_id: str, remember_me: bool = False) -> tuple[str, datetime]:
    days = settings.REFRESH_TOKEN_REMEMBER_ME_DAYS if remember_me else 0
    hours = 0 if remember_me else settings.REFRESH_TOKEN_EXPIRE_HOURS
    expires_at = datetime.now(timezone.utc) + timedelta(days=days, hours=hours)
    token = jwt.encode({"sub": user_id, "exp": expires_at, "type": "refresh"}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return token, expires_at


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
