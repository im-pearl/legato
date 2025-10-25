from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    """Application settings."""
    
    # API Keys
    CLAUDE_API_KEY: str
    
    # Claude Settings
    CLAUDE_MODEL: str = "claude-sonnet-4-20250514"
    CLAUDE_MAX_TOKENS: int = 8000
    CLAUDE_TEMPERATURE: float = 0.0
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080"
    ]
    
    # Project paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    PROMPTS_DIR: Path = BASE_DIR / "app" / "prompts"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

