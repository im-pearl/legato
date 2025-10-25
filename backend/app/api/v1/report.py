from fastapi import APIRouter, HTTPException
from app.schemas.requests import ReportRequest
from app.schemas.responses import ReportResponse
from app.services.report_service import report_service

router = APIRouter()


@router.post("/report", response_model=ReportResponse)
async def generate_report(request: ReportRequest):
    """
    4단계: 심사보고서 작성
    
    모든 분석 결과를 종합하여 최종 심사보고서를 생성합니다.
    """
    try:
        result = await report_service.generate_report(request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

