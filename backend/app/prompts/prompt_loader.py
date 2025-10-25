from pathlib import Path
from app.core.config import settings


class PromptLoader:
    """프롬프트 템플릿 로더"""
    
    def __init__(self, category: str = "criminal"):
        self.category = category
        self.prompts_dir = settings.PROMPTS_DIR / category
    
    def load(self, prompt_name: str) -> str:
        """
        프롬프트 파일 로드
        
        Args:
            prompt_name: 프롬프트 파일명 (확장자 제외)
        
        Returns:
            프롬프트 템플릿 문자열
        """
        prompt_path = self.prompts_dir / f"{prompt_name}.txt"
        
        if not prompt_path.exists():
            raise FileNotFoundError(f"Prompt file not found: {prompt_path}")
        
        with open(prompt_path, "r", encoding="utf-8") as f:
            return f.read()
    
    def format_user_message(self, **kwargs) -> str:
        """
        사용자 메시지 포맷팅
        
        Args:
            **kwargs: 템플릿에 들어갈 변수들
        
        Returns:
            포맷팅된 사용자 메시지
        """
        parts = []
        
        if "case_request" in kwargs:
            parts.append(f"## 의뢰서 정보\n{self._format_case_request(kwargs['case_request'])}")
        
        if "consultation_result" in kwargs:
            parts.append(f"## 상담 결과지\n{self._format_consultation_result(kwargs['consultation_result'])}")
        
        if "reviewer_notes" in kwargs and kwargs["reviewer_notes"]:
            parts.append(f"## 심사역 메모\n{kwargs['reviewer_notes']}")
        
        if "analysis_result" in kwargs:
            parts.append(f"## 1단계 사실관계 검토 결과\n```json\n{kwargs['analysis_result']}\n```")
        
        if "issues_result" in kwargs:
            parts.append(f"## 2단계 쟁점 분석 결과\n```json\n{kwargs['issues_result']}\n```")
        
        if "precedents_result" in kwargs:
            parts.append(f"## 3단계 판례 리서치 결과\n```json\n{kwargs['precedents_result']}\n```")
        
        return "\n\n".join(parts)
    
    def _format_case_request(self, case_request) -> str:
        """의뢰서 포맷팅"""
        lines = [
            f"### 의뢰서 제목\n{case_request.title}",
            ""
        ]
        
        if case_request.created_date:
            lines.append(f"작성일: {case_request.created_date}")
        if case_request.case_type:
            lines.append(f"사건 분류: {case_request.case_type}")
        
        lines.append("\n### 질문 및 답변\n")
        
        for qa in case_request.questions:
            question = qa.get('question', '')
            answer = qa.get('answer', '')
            lines.append(f"**Q: {question}**")
            lines.append(f"A: {answer}\n")
        
        return "\n".join(lines)
    
    def _format_consultation_result(self, consultation) -> str:
        """상담 결과지 포맷팅"""
        lines = []
        
        if consultation.client_name:
            lines.append(f"의뢰인: {consultation.client_name}")
        if consultation.lawyer_name:
            lines.append(f"변호사: {consultation.lawyer_name}")
        
        if lines:
            lines.append("")
        
        # 상담내용 섹션
        lines.append("# 상담내용")
        lines.append(f"\n## 사건명\n{consultation.case_name}")
        lines.append(f"\n## 사실관계\n{consultation.facts}")
        
        # 상담결과 섹션
        lines.append("\n# 상담결과")
        lines.append(f"\n## 관련 법리\n{consultation.legal_principle}")
        lines.append(f"\n## 증거 판단\n{consultation.evidence}")
        lines.append(f"\n## 불리요소\n{consultation.unfavorable_factors}")
        lines.append(f"\n## 승소 예상 금액\n{consultation.expected_amount}")
        lines.append(f"\n## 집행 방안\n{consultation.execution_plan}")
        lines.append(f"\n## 착수금\n{consultation.initial_fee}")
        lines.append(f"\n## 성공보수\n{consultation.success_fee}")
        
        return "\n".join(lines)


# Singleton instance
prompt_loader = PromptLoader()

