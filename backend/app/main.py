from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
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


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Formata erros de validação de forma consistente."""
    errors = exc.errors()
    # Extrai a primeira mensagem de erro ou combina múltiplas
    if errors:
        error_msg = errors[0].get("msg", "Validação inválida.")
    else:
        error_msg = "Validação inválida."

    return JSONResponse(
        status_code=422,
        content={"detail": {"code": "ERR_VALIDATION", "message": error_msg}},
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": {"code": "ERR_INTERNAL", "message": "Erro inesperado.", "details": str(exc) if settings.DEBUG else None}},
    )


from .api.v1 import auth as auth_router
from .api.v1 import cards as cards_router
from .api.v1 import transactions as transactions_router
from .api.v1 import investments as investments_router
from .api.v1 import goals as goals_router
from .api.v1 import subscriptions as subscriptions_router
from .api.v1 import envelopes as envelopes_router
from .api.v1 import profile as profile_router
from .api.v1 import dashboard as dashboard_router

app.include_router(auth_router.router, prefix="/api/v1")
app.include_router(cards_router.router, prefix="/api/v1")
app.include_router(transactions_router.router, prefix="/api/v1")
app.include_router(investments_router.router, prefix="/api/v1")
app.include_router(goals_router.router, prefix="/api/v1")
app.include_router(subscriptions_router.router, prefix="/api/v1")
app.include_router(envelopes_router.router, prefix="/api/v1")
app.include_router(profile_router.router, prefix="/api/v1")
app.include_router(dashboard_router.router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok"}
