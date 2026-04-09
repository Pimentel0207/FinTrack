from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DEBUG: bool = True
    PORT: int = 8000
    CORS_ORIGIN: str = "http://localhost:5173"

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_HOURS: int = 24
    REFRESH_TOKEN_REMEMBER_ME_DAYS: int = 7

    DATABASE_URL: str

    class Config:
        env_file = ".env"


settings = Settings()
