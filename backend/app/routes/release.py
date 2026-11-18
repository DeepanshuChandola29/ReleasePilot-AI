from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.github_service import compare_github_commits
from app.services.risk_service import predict_release_risk

router = APIRouter()


class ReleaseAnalysisRequest(BaseModel):
    owner: str = Field(min_length=1)
    repo: str = Field(min_length=1)
    base: str = Field(min_length=1)
    head: str = Field(min_length=1)


@router.post("/analyze")
def analyze_release(request: ReleaseAnalysisRequest):

    try:
        # Step 1: Fetch GitHub commit changes
        comparison = compare_github_commits(
            owner=request.owner,
            repo_name=request.repo,
            base=request.base,
            head=request.head
        )

        # Step 2: Predict release risk using ML
        risk_result = predict_release_risk(comparison)

        # Step 3: Return combined analysis
        return {
            "status": "success",
            "message": "GitHub comparison and AI risk analysis completed",
            "data": {
                "repository": comparison["repository"],
                "base_commit": comparison["base_commit"],
                "head_commit": comparison["head_commit"],
                "total_commits": comparison["total_commits"],
                "total_files_changed": comparison["total_files_changed"],
                "total_additions": comparison["total_additions"],
                "total_deletions": comparison["total_deletions"],
                "risk_analysis": risk_result,
                "changed_files": comparison["files"]
            }
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Release analysis failed: {str(error)}"
        )