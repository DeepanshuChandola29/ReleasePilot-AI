
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import health, github, risk, release

app = FastAPI(
    title="ReleasePilot AI",
    description="AI-Powered Intelligent CI/CD Release Management Platform",
    version="1.0.0"
)

# Allow communication with the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes exactly once
app.include_router(
    health.router,
    prefix="/api",
    tags=["Health"]
)

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


@app.get("/")
def home():
    return {
        "message": "Welcome to ReleasePilot AI API",
        "status": "running"
    }
