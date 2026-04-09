from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime, timezone
from sqlmodel import Session, select

from .core.config import settings
from .db.session import engine
from .models.user import User
from .models.card import Card
from .models.transaction import Transaction
from .models.investment import Investment
from .models.goal import Goal
from .models.subscription import Subscription
from .models.envelope import Envelope
from .models.refresh_token import RefreshToken
from .models.revoked_token import RevokedToken

limiter = Limiter(key_func=get_remote_address)
scheduler = AsyncIOScheduler()


def cleanup_expired_tokens():
    """Remove tokens expirados das tabelas de segurança."""
    now = datetime.now(timezone.utc)
    with Session(engine) as session:
        expired_refresh = session.exec(select(RefreshToken).where(RefreshToken.expires_at < now)).all()
        for token in expired_refresh:
            session.delete(token)

        expired_revoked = session.exec(select(RevokedToken).where(RevokedToken.expires_at < now)).all()
        for token in expired_revoked:
            session.delete(token)

        session.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.add_job(cleanup_expired_tokens, "interval", hours=6)
    scheduler.start()
    yield
    scheduler.shutdown()


app = FastAPI(
    title="FinTrack Premium API",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": {"code": "ERR_INTERNAL", "message": "Erro inesperado.", "details": str(exc) if settings.DEBUG else None}},
    )


@app.get("/health")
def health():
    return {"status": "ok"}
