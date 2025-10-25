from pydantic import BaseModel, Field


class AnalysisResponse(BaseModel):
    """1단계: 사실관계 검토 응답"""
    facts_summary: str = Field(..., description="정리된 사실관계")
    key_points: list[str] = Field(..., description="핵심 포인트")
    timeline: list[dict] = Field(default_factory=list, description="시간순 정리")
    parties: dict = Field(..., description="당사자 정보")


class Issue(BaseModel):
    """쟁점 항목"""
    issue_id: str
    title: str = Field(..., description="쟁점 제목")
    description: str = Field(..., description="쟁점 상세 설명")
    importance: str = Field(..., description="중요도: high/medium/low")


class IssuesResponse(BaseModel):
    """2단계: 쟁점 분석 응답"""
    issues: list[Issue] = Field(..., description="추출된 쟁점 목록")
    main_issue: str = Field(..., description="핵심 쟁점 요약")


class Precedent(BaseModel):
    """판례 항목"""
    case_number: str = Field(..., description="판례 번호")
    court: str = Field(..., description="법원")
    date: str = Field(..., description="선고일")
    summary: str = Field(..., description="판례 요지")
    relevance: str = Field(..., description="본 사건과의 관련성")
    outcome: str = Field(..., description="판결 결과")


class IssuePrecedents(BaseModel):
    """쟁점별 판례 목록"""
    issue_id: str
    issue_title: str
    precedents: list[Precedent]


class PrecedentsResponse(BaseModel):
    """3단계: 판례 리서치 응답"""
    issue_precedents: list[IssuePrecedents] = Field(..., description="쟁점별 관련 판례")
    additional_notes: str | None = Field(None, description="추가 검토사항")


class ReportResponse(BaseModel):
    """4단계: 심사보고서 응답"""
    executive_summary: str = Field(..., description="요약")
    facts: str = Field(..., description="사실관계")
    issues_analysis: list[dict] = Field(..., description="쟁점별 분석")
    legal_opinion: str = Field(..., description="법적 의견")
    win_probability: int = Field(..., ge=0, le=100, description="승소 가능성 (%)")
    win_probability_reason: str = Field(..., description="승소 가능성 판단 근거")
    execution_probability: int = Field(..., ge=0, le=100, description="집행 가능성 (%)")
    execution_probability_reason: str = Field(..., description="집행 가능성 판단 근거")
    conclusion: str = Field(..., description="결론")
    recommendations: list[str] = Field(..., description="제안사항")

