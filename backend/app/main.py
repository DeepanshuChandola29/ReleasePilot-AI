
from fastapi import APIRouter
from datetime import datetime, timezone
from app.routes import github
from app.routes import health, github, risk
from app.routes import health, github, risk, release

router = APIRouter()


@router.get("/health")
def health_check():
    return {
        "status": "success",
        "message": "ReleasePilot AI backend is running!",
        "application": "ReleasePilot AI",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import health

app = FastAPI(
    title="ReleasePilot AI",
    description="AI-Powered Intelligent CI/CD Release Management Platform",
    version="1.0.0"
)

# Allow communication between React frontend and FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(health.router, prefix="/api", tags=["Health"])


@app.get("/")
def home():
    return {
        "message": "Welcome to ReleasePilot AI API",
        "status": "running"
    }

app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(github.router, prefix="/api/github", tags=["GitHub"])
app.include_router(
    github.router,
    prefix="/api/github",
    tags=["GitHub"]
)

app.include_router(
    risk.router,
    prefix="/api/risk",
    tags=["Risk Prediction"]
)

app.include_router(
    release.router,
    prefix="/api/release",
    tags=["Release Analysis"]
)