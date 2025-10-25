from fastapi import APIRouter, HTTPException
from app.schemas.requests import IssuesRequest
from app.schemas.responses import IssuesResponse
from app.services.issues_service import issues_service

router = APIRouter()


@router.post("/issues", response_model=IssuesResponse)
async def analyze_issues(request: IssuesRequest):
    """
    2단계: 쟁점 분석
    
    사실관계를 바탕으로 법적 쟁점을 도출하고 분석합니다.
    """
    try:
        result = await issues_service.analyze_issues(request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

