from pydantic import BaseModel, Field


class CaseRequest(BaseModel):
    """의뢰서 정보"""
    title: str = Field(..., description="의뢰서 제목")
    questions: list[dict[str, str]] = Field(
        ..., 
        description="질문과 답변 리스트. 각 항목은 {'question': '질문', 'answer': '답변'} 형태"
    )
    created_date: str | None = Field(None, description="의뢰서 작성일 (선택)")
    case_type: str | None = Field(None, description="사건 분류 (선택)")


class ConsultationResult(BaseModel):
    """상담 결과지 정보"""
    # 상담내용 섹션
    case_name: str = Field(..., description="사건명")
    facts: str = Field(..., description="사실관계")
    
    # 상담결과 섹션
    legal_principle: str = Field(..., description="관련 법리")
    evidence: str = Field(..., description="증거 판단")
    unfavorable_factors: str = Field(..., description="불리요소")
    expected_amount: str = Field(..., description="승소 예상 금액")
    execution_plan: str = Field(..., description="집행 방안")
    initial_fee: str = Field(..., description="착수금")
    success_fee: str = Field(..., description="성공보수")
    
    # 선택 필드
    client_name: str | None = Field(None, description="의뢰인 닉네임 (선택)")
    lawyer_name: str | None = Field(None, description="변호사 이름 (선택)")


class AnalysisRequest(BaseModel):
    """1단계: 사실관계 검토 요청"""
    case_request: CaseRequest
    consultation_result: ConsultationResult
    reviewer_notes: str | None = Field(None, description="심사역 작성 메모")


class IssuesRequest(BaseModel):
    """2단계: 쟁점 분석 요청"""
    case_request: CaseRequest
    consultation_result: ConsultationResult
    reviewer_notes: str | None = None
    analysis_result: str | dict = Field(..., description="1단계 사실관계 검토 결과 (텍스트 또는 dict)")


class PrecedentsRequest(BaseModel):
    """3단계: 판례 리서치 요청"""
    case_request: CaseRequest
    consultation_result: ConsultationResult
    reviewer_notes: str | None = None
    analysis_result: str | dict
    issues_result: str | dict = Field(..., description="2단계 쟁점 분석 결과 (텍스트 또는 dict)")


class ReportRequest(BaseModel):
    """4단계: 심사보고서 작성 요청"""
    case_request: CaseRequest
    consultation_result: ConsultationResult
    reviewer_notes: str | None = None
    analysis_result: str | dict
    issues_result: str | dict
    precedents_result: str | dict = Field(..., description="3단계 판례 리서치 결과 (텍스트 또는 dict)")

