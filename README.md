# 🚀 Legato - AI 법률 검토 자동화 시스템

Claude AI를 활용한 법률 사건 검토 및 보고서 자동 생성 시스템입니다.

## ✨ 주요 기능

### 1. 실시간 스트리밍 분석
- **사실관계 검토**: AI가 의뢰서와 상담결과지를 분석하여 사실관계를 자동으로 정리
- **쟁점 추출**: 사건의 핵심 쟁점을 자동으로 도출
- **판례 리서치**: 각 쟁점에 대한 관련 판례를 자동으로 검색 및 분석
- **최종 보고서**: 승소 가능성을 평가하고 종합 보고서 생성

### 2. 타이핑 효과
- LLM 응답을 실시간으로 스트리밍하여 자연스러운 타이핑 효과
- 생성 과정을 시각적으로 확인 가능

### 3. 사용자 수정
- AI가 생성한 내용을 사용자가 직접 수정 가능
- 수정된 내용이 다음 단계의 분석에 반영

## 🏗️ 기술 스택

### 백엔드
- **FastAPI**: 고성능 Python 웹 프레임워크
- **Claude API**: Anthropic의 Claude AI 모델
- **Pydantic**: 데이터 검증 및 설정 관리
- **Server-Sent Events (SSE)**: 실시간 스트리밍

### 프론트엔드
- **React 18**: 최신 React 기능 활용
- **Vite**: 빠른 개발 환경
- **Chakra UI**: 모던 UI 컴포넌트 라이브러리
- **React Router**: 페이지 라우팅 및 상태 전달

## 📦 설치 및 실행

### 1. 사전 요구사항
- Python 3.11+
- Node.js 18+
- Claude API Key (Anthropic)

### 2. 백엔드 설정

```bash
cd backend

# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경변수 설정
cp .env.example .env
# .env 파일을 열어서 CLAUDE_API_KEY를 입력하세요

# 서버 실행
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

백엔드 서버가 `http://localhost:8000`에서 실행됩니다.

### 3. 프론트엔드 설정

```bash
cd frontend-react

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드가 `http://localhost:5173`에서 실행됩니다.

## 🎯 사용 방법

### 1. 의뢰서 입력 (FactReview)
1. 의뢰인 정보와 사건 내용을 입력
2. "쟁점분석" 버튼 클릭

### 2. 쟁점 확인 (IssueIdentification)
1. AI가 자동으로 사실관계와 쟁점을 분석 (스트리밍)
2. 생성된 내용을 확인하고 필요시 수정
3. "확인" 버튼으로 다음 단계 진행

### 3. 판례 검토 (CaseResearch)
1. AI가 각 쟁점에 대한 관련 판례를 검색 (스트리밍)
2. 판례를 선택/해제하여 최종 검토할 판례 선정
3. "최종 검토" 버튼 클릭

### 4. 최종 보고서 (FinalReview)
1. AI가 판단 및 승소가능성을 분석 (스트리밍)
2. 내용을 검토하고 수정
3. "저장" 버튼으로 보고서 확정

## 📁 프로젝트 구조

```
legato/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # API 엔드포인트
│   │   ├── core/            # 핵심 설정 및 Claude 클라이언트
│   │   ├── prompts/         # AI 프롬프트
│   │   ├── schemas/         # Request/Response 스키마
│   │   └── services/        # 비즈니스 로직
│   └── main.py              # FastAPI 앱
├── frontend-react/
│   ├── src/
│   │   ├── components/      # 재사용 가능한 컴포넌트
│   │   ├── hooks/           # 커스텀 훅 (useStreaming 등)
│   │   ├── pages/           # 페이지 컴포넌트
│   │   ├── router/          # 라우터 설정
│   │   └── utils/           # 유틸리티 (스트리밍 API, 태그 파서)
│   └── vite.config.js
└── STREAMING_GUIDE.md       # 상세 구현 가이드
```

## 🔧 API 엔드포인트

### 스트리밍 API
- `POST /api/v1/analysis/stream` - 사실관계 검토
- `POST /api/v1/issues/stream` - 쟁점 분석
- `POST /api/v1/precedents/stream` - 판례 리서치
- `POST /api/v1/report/stream` - 최종 보고서

### 일반 API (호환성)
- `POST /api/v1/analysis` - 사실관계 검토 (JSON)
- `POST /api/v1/issues` - 쟁점 분석 (JSON)
- `POST /api/v1/precedents` - 판례 리서치 (JSON)
- `POST /api/v1/report` - 최종 보고서 (JSON)

## 🎨 주요 기능 설명

### 태그 기반 파싱
LLM 응답을 `@태그명` 형식으로 구조화하여 UI를 동적으로 렌더링:

```
@issue1
강제추행 성립 여부
@end

@issue2
위자료 액수
@end
```

### 실시간 타이핑 효과
- Claude API에서 텍스트가 도착하는 즉시 화면에 표시
- 글자 단위로 업데이트되어 자연스러운 타이핑 효과

### 데이터 흐름
```
FactReview (입력)
  ↓
IssueIdentification (사실관계 + 쟁점 스트리밍)
  ↓
CaseResearch (판례 스트리밍)
  ↓
FinalReview (판단 + 승소가능성 스트리밍)
  ↓
보고서 저장
```

## 🐛 트러블슈팅

### 스트리밍이 작동하지 않을 때
1. 백엔드 서버가 실행 중인지 확인
2. CORS 설정 확인
3. Claude API Key가 올바른지 확인
4. 브라우저 콘솔에서 에러 확인

### API 연결 오류
- `utils/streamingAPI.js`에서 `API_BASE_URL` 확인
- 기본값: `http://localhost:8000/api/v1`

## 📚 상세 문서

- [스트리밍 구현 가이드](STREAMING_GUIDE.md) - 상세한 구현 방법과 API 문서
- [백엔드 README](backend/README.md) - 백엔드 상세 문서
- [프론트엔드 README](frontend-react/README.md) - 프론트엔드 상세 문서

## 🔐 환경변수

### 백엔드 (.env)
```env
CLAUDE_API_KEY=your_claude_api_key_here
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_MAX_TOKENS=8000
CLAUDE_TEMPERATURE=0.0
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여

이슈와 풀 리퀘스트를 환영합니다!

## 📧 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

Made with ❤️ using Claude AI

