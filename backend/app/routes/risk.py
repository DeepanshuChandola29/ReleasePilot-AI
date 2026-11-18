
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.risk_service import predict_release_risk

router = APIRouter()


class ReleaseComparison(BaseModel):
    total_files_changed: int = Field(ge=0)
    total_additions: int = Field(ge=0)
    total_deletions: int = Field(ge=0)
    files: list[dict] = Field(default_factory=list)


@router.post("/predict")
def predict_risk(comparison: ReleaseComparison):

    try:
        result = predict_release_risk(
            comparison.model_dump()
        )

        return {
            "status": "success",
            "message": "ML release risk prediction completed",
            "data": result
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
