from fastapi import APIRouter, HTTPException
from app.schemas.requests import PrecedentsRequest
from app.schemas.responses import PrecedentsResponse
from app.services.precedents_service import precedents_service

router = APIRouter()


@router.post("/precedents", response_model=PrecedentsResponse)
async def research_precedents(request: PrecedentsRequest):
    """
    3단계: 판례 리서치
    
    도출된 쟁점에 대해 관련 판례를 검색하고 분석합니다.
    """
    try:
        result = await precedents_service.research_precedents(request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

