
from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter()


@router.get("/health")
def health_check():
    return {
        "status": "success",
        "message": "ReleasePilot AI backend is running!",
        "application": "ReleasePilot AI",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
