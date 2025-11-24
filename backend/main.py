from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import is_development, CORS_ORIGINS
from database import Base, engine
from routes.habits import router as habits_router
from routes.completions import router as completions_router

if is_development():
    # Create tables
    Base.metadata.create_all(bind=engine)

app = FastAPI(title="Momentask Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(habits_router)
app.include_router(completions_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}