from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "PrepWise API"
    environment: str = "development"
    api_v1_prefix: str = "/api/v1"
    database_url: str = str
    secret_key: str = "dev-only-change-this"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    cors_origins: list[str] = [
        "http://localhost:3000",
        "https://prepwise-seven-sand.vercel.app",
        "https://prepwise-git-main-subhishachintadas-projects.vercel.app",
    ]
    ai_api_key: str = ""
    ai_base_url: str = "https://api.openai.com/v1"
    ai_model: str = "gpt-4o-mini"
    max_upload_mb: int = 5

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

