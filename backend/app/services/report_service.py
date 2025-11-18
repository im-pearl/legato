import json
from typing import Iterator
from app.core.claude_client import claude_client
from app.prompts.prompt_loader import prompt_loader
from app.schemas.requests import ReportRequest
from app.schemas.responses import ReportResponse


class ReportService:
    """심사보고서 작성 서비스"""
    
    def __init__(self):
        self.prompt_name = "report"
    
    async def generate_report(self, request: ReportRequest) -> ReportResponse:
        """
        4단계: 심사보고서 작성 수행
        
        Args:
            request: 보고서 작성 요청
        
        Returns:
            심사보고서
        """
        # 시스템 프롬프트 로드
        system_prompt = prompt_loader.load(self.prompt_name)
        
        # 사용자 메시지 구성
        user_message = prompt_loader.format_user_message(
            case_request=request.case_request,
            consultation_result=request.consultation_result,
            reviewer_notes=request.reviewer_notes,
            analysis_result=json.dumps(request.analysis_result, ensure_ascii=False, indent=2),
            issues_result=json.dumps(request.issues_result, ensure_ascii=False, indent=2),
            precedents_result=json.dumps(request.precedents_result, ensure_ascii=False, indent=2)
        )
        
        # Claude API 호출
        response_text = claude_client.generate(
            system_prompt=system_prompt,
            user_message=user_message,
            max_tokens=12000  # 보고서는 길 수 있으므로 토큰 증가
        )
        
        # JSON 파싱
        try:
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0]
            
            result_dict = json.loads(response_text.strip())
            return ReportResponse(**result_dict)
        
        except (json.JSONDecodeError, ValueError) as e:
            raise ValueError(f"Failed to parse Claude response: {e}\nResponse: {response_text}")
    
    def generate_report_stream(self, request: ReportRequest) -> Iterator[str]:
        """
        4단계: 심사보고서 작성 스트리밍
        
        Args:
            request: 보고서 작성 요청
        
        Yields:
            텍스트 청크
        """
        # 시스템 프롬프트 로드
        system_prompt = prompt_loader.load(self.prompt_name)
        
        # 문자열이면 그대로, dict면 JSON 변환
        analysis_result_str = request.analysis_result if isinstance(request.analysis_result, str) else json.dumps(request.analysis_result, ensure_ascii=False, indent=2)
        issues_result_str = request.issues_result if isinstance(request.issues_result, str) else json.dumps(request.issues_result, ensure_ascii=False, indent=2)
        precedents_result_str = request.precedents_result if isinstance(request.precedents_result, str) else json.dumps(request.precedents_result, ensure_ascii=False, indent=2)
        
        # 사용자 메시지 구성
        user_message = prompt_loader.format_user_message(
            case_request=request.case_request,
            consultation_result=request.consultation_result,
            reviewer_notes=request.reviewer_notes,
            analysis_result=analysis_result_str,
            issues_result=issues_result_str,
            precedents_result=precedents_result_str
        )
        
        # Claude API 스트리밍 호출
        for chunk in claude_client.generate_stream(
            system_prompt=system_prompt,
            user_message=user_message,
            max_tokens=12000
        ):
            yield chunk


report_service = ReportService()

