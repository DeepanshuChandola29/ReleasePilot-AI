
from fastapi import APIRouter, HTTPException, Query

from app.services.github_service import compare_github_commits

router = APIRouter()


@router.get("/compare")
def compare_commits(
    owner: str = Query(..., min_length=1),
    repo: str = Query(..., min_length=1),
    base: str = Query(..., min_length=1),
    head: str = Query(..., min_length=1)
):
    try:
        result = compare_github_commits(
            owner=owner,
            repo_name=repo,
            base=base,
            head=head
        )

        return {
            "status": "success",
            "message": "GitHub commits compared successfully",
            "data": result
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )
