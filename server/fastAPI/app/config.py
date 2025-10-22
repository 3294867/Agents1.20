# app/config.py
from pydantic_settings import BaseSettings
from pathlib import Path
from dotenv import load_dotenv

# Load .env manually
dotenv_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path)

class Settings(BaseSettings):
    openai_api_key: str

settings = Settings()
