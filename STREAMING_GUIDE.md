# 🚀 Legato 스트리밍 구현 가이드

## 📋 개요

LLM 응답을 스트리밍으로 받아 실시간으로 UI에 타이핑 효과로 표시하는 시스템입니다.

## 🏗️ 아키텍처

### 백엔드 (FastAPI + Claude API)
```
ClaudeClient.generate_stream()
    ↓
Service.*_stream()
    ↓
API /*/stream endpoints
    ↓
StreamingResponse (SSE)
```

### 프론트엔드 (React)
```
fetch (ReadableStream)
    ↓
StreamingTagParser (태그 파싱)
    ↓
useStreaming 훅
    ↓
React 컴포넌트 (타이핑 효과)
```

## 🔧 구현 완료 사항

### ✅ 백엔드
1. **ClaudeClient** (`backend/app/core/claude_client.py`)
   - `generate_stream()` 메서드 추가
   - 에러 처리: `[@에러]..[@에러_끝]` 태그로 전송

2. **서비스 레이어**
   - `analysis_service.py`: `analyze_stream()`
   - `issues_service.py`: `analyze_issues_stream()`
   - `precedents_service.py`: `research_precedents_stream()`
   - `report_service.py`: `generate_report_stream()`

3. **API 엔드포인트**
   - `/api/v1/analysis/stream`
   - `/api/v1/issues/stream`
   - `/api/v1/precedents/stream`
   - `/api/v1/report/stream`

4. **Request 스키마** (`backend/app/schemas/requests.py`)
   - `analysis_result`, `issues_result`, `precedents_result`를 `str | dict`로 수정
   - 사용자가 수정한 텍스트(태그 포함)를 그대로 전달 가능

### ✅ 프론트엔드
1. **유틸리티**
   - `utils/streamingAPI.js`: 스트리밍 API 호출
   - `utils/tagParser.js`: 태그 파싱 및 추출

2. **커스텀 훅**
   - `hooks/useStreaming.js`: 스트리밍 상태 관리

3. **스트리밍 페이지**
   - `pages/IssueIdentificationStreaming.jsx`: 쟁점 분석
   - `pages/CaseResearchStreaming.jsx`: 판례 리서치
   - `pages/FinalReviewStreaming.jsx`: 최종 보고서

## 📝 태그 형식

### 1. 쟁점 분석 (issues)
```
@issue1
강제추행 성립 여부
@end

@issue2
위자료 액수
@end
```

### 2. 판례 리서치 (precedents)
```
@issue1:강제추행 성립 여부
@issue2:위자료 액수
@case1
@num:서울남부지방법원 2020. 10. 23. 선고 2020가단208977 판결
@summary:원고의 가슴을 움켜잡아 강제추행하여 벌금 1,000만원이 선고된 사안에서 위자료 1,000만원 인용됨.
@end
@end
```

### 3. 최종 보고서 (report)
```
@issue1. 강제추행 성립 여부
강제추행 성립이 인정될 것으로 보임
@end

@issue2. 위자료 액수
1,000만원~2,000만원이 예상됨
@end

@prob
- 80~90
- 승소가능성은 높으며, 위자료 액수만이 문제됨.
@end
```

## 🎯 사용 방법

### 1. 백엔드 실행
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. 프론트엔드 실행
```bash
cd frontend-react
npm run dev
```

### 3. 스트리밍 테스트
각 페이지의 "AI 재생성" 버튼을 클릭하여 스트리밍을 테스트할 수 있습니다.

## 📊 데이터 플로우

### Step 1: FactReview → IssueIdentification
```javascript
// FactReview에서 전달
navigate('/issue-identification', {
  state: {
    factsContent: '사실관계 텍스트',
    requestData: { /* API 요청 데이터 */ }
  }
});

// IssueIdentification에서 수신 후 스트리밍 시작
useEffect(() => {
  if (location.state?.requestData) {
    generateIssues(location.state.requestData);
  }
}, [location.state]);
```

### Step 2: IssueIdentification → CaseResearch
```javascript
// 사용자가 수정한 쟁점을 태그 형식으로 전달
const issuesText = issues.map((issue, idx) => 
  `@issue${idx + 1}\n${issue.content}\n@end`
).join('\n\n');

navigate('/case-research', {
  state: {
    factsContent,
    issuesText,
    issues,
  }
});
```

### Step 3: CaseResearch → FinalReview
```javascript
// 선택된 판례만 필터링하여 전달
const filteredIssues = issues.map(issue => ({
  ...issue,
  precedents: issue.precedents?.filter(p => p.selected) || []
}));

const precedentsText = /* 태그 형식으로 변환 */;

navigate('/final-review', {
  state: {
    factsContent,
    issues: filteredIssues,
    precedentsText,
  }
});
```

## 🔥 핵심 기능

### 1. 실시간 타이핑 효과
- Claude API에서 텍스트가 도착하는 즉시 화면에 표시
- 글자 단위로 업데이트되어 자연스러운 타이핑 효과

### 2. 태그 기반 파싱
- `@` 로 시작하는 태그를 감지하여 UI 렌더링
- 태그가 열리는 순간 UI 섹션 생성
- 태그가 닫히면 완료 처리

### 3. 사용자 수정
- 스트리밍 완료 후 사용자가 내용 수정 가능
- 수정된 내용(태그 포함)을 다음 단계로 전달

### 4. 판례 선택
- 기본값: 모든 판례 선택됨
- 사용자가 체크박스로 선택/해제
- 선택된 판례만 다음 단계로 전달

## ⚠️ 주의사항

### 1. CORS 설정
백엔드에서 CORS 허용 필요:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite 기본 포트
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. API URL 설정
프론트엔드 `utils/streamingAPI.js`에서 백엔드 URL 확인:
```javascript
const API_BASE_URL = 'http://localhost:8000/api/v1';
```

### 3. 프롬프트 형식
백엔드 프롬프트에서 태그 형식을 정확히 지켜야 함:
- `@issue1`, `@case1`, `@prob` 등
- `@end` 또는 `@끝`으로 종료

## 🧪 테스트 시나리오

### 1. 쟁점 분석 테스트
1. IssueIdentificationStreaming 페이지 접속
2. "AI 재생성" 버튼 클릭
3. 쟁점이 타이핑 효과로 나타나는지 확인
4. 쟁점 수정 후 "확인" 버튼

### 2. 판례 리서치 테스트
1. CaseResearchStreaming 페이지 접속
2. "AI 재생성" 버튼 클릭
3. 판례가 쟁점별로 나타나는지 확인
4. 판례 선택/해제 후 "최종 검토" 버튼

### 3. 최종 보고서 테스트
1. FinalReviewStreaming 페이지 접속
2. "AI 재생성" 버튼 클릭
3. 판단과 승소가능성이 타이핑 효과로 나타나는지 확인
4. 내용 수정 후 "저장" 버튼

## 🐛 트러블슈팅

### 1. 스트리밍이 안 될 때
- 백엔드 서버 실행 확인
- CORS 설정 확인
- 브라우저 콘솔에서 에러 메시지 확인

### 2. 태그 파싱 오류
- 프롬프트에서 태그 형식 확인
- `@end` 또는 `@끝` 태그 누락 확인
- 태그 이름 오타 확인

### 3. 데이터 전달 오류
- `location.state` 데이터 확인
- 태그 형식으로 변환된 텍스트 확인
- API 요청 페이로드 확인

## 📚 참고 자료

- FastAPI Streaming: https://fastapi.tiangolo.com/advanced/custom-response/#streamingresponse
- Anthropic Streaming: https://docs.anthropic.com/claude/reference/streaming
- React Router State: https://reactrouter.com/en/main/hooks/use-location

## 🎓 다음 단계

1. **실제 API 연동**: 각 페이지에서 실제 API 호출 테스트
2. **에러 처리 강화**: 네트워크 에러, 타임아웃 등 처리
3. **UX 개선**: 로딩 애니메이션, 스크롤 자동 이동 등
4. **성능 최적화**: 메모이제이션, 디바운싱 등
5. **E2E 테스트**: 전체 플로우 자동화 테스트

## 💡 팁

- 스트리밍 중에는 버튼을 비활성화하여 사용자 혼란 방지
- 태그 형식은 정규표현식으로 추가 검증 가능
- 스트리밍 중 끊김 시 재시도 로직 추가 고려
- 사용자 수정 내용을 localStorage에 자동 저장 고려

