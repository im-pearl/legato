from fastapi import APIRouter, HTTPException
from app.schemas.requests import AnalysisRequest
from app.schemas.responses import AnalysisResponse
from app.services.analysis_service import analysis_service

router = APIRouter()


@router.post("/analysis", response_model=AnalysisResponse)
async def analyze_case(request: AnalysisRequest):
    """
    1단계: 사실관계 검토
    
    의뢰서와 상담결과지를 기반으로 사실관계를 정리하고 분석합니다.
    """
    try:
        result = await analysis_service.analyze(request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

