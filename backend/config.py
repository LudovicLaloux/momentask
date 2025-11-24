from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
ENV = os.getenv("ENV", "development")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

def is_development() -> bool:
    return ENV == "development"
