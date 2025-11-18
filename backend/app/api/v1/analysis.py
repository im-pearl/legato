from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
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


@router.post("/analysis/stream")
async def analyze_case_stream(request: AnalysisRequest):
    """
    1단계: 사실관계 검토 (스트리밍)
    
    의뢰서와 상담결과지를 기반으로 사실관계를 스트리밍으로 정리합니다.
    """
    try:
        return StreamingResponse(
            analysis_service.analyze_stream(request),
            media_type="text/event-stream"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

