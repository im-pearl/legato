# Legal Review AI - Backend

Claude AI 기반 법률 검토 자동화 백엔드 API

## 기술 스택

- **FastAPI**: 고성능 Python 웹 프레임워크
- **Claude API**: Anthropic의 Claude Sonnet 4 모델
- **Pydantic**: 데이터 검증 및 스키마 관리

## 프로젝트 구조

```
backend/
├── main.py                       # FastAPI 진입점
├── requirements.txt              # Python 의존성
├── .env                          # 환경변수 (gitignore)
│
└── app/
    ├── api/v1/                   # API 엔드포인트
    │   ├── analysis.py           # 1단계: 사실관계 검토
    │   ├── issues.py             # 2단계: 쟁점 분석
    │   ├── precedents.py         # 3단계: 판례 리서치
    │   └── report.py             # 4단계: 심사보고서
    │
    ├── core/                     # 핵심 설정
    │   ├── config.py             # 환경변수 설정
    │   └── claude_client.py      # Claude API 클라이언트
    │
    ├── services/                 # 비즈니스 로직
    │   ├── analysis_service.py
    │   ├── issues_service.py
    │   ├── precedents_service.py
    │   └── report_service.py
    │
    ├── prompts/                  # 프롬프트 관리
    │   ├── criminal/             # 강제추행 사건
    │   │   ├── analysis.txt
    │   │   ├── issues.txt
    │   │   ├── precedents.txt
    │   │   └── report.txt
    │   └── prompt_loader.py
    │
    └── schemas/                  # Pydantic 모델
        ├── requests.py
        └── responses.py
```

## 설치 및 실행

### 1. 가상환경 생성 및 활성화

```bash
cd backend
python -m venv venv

# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 2. 의존성 설치

```bash
pip install -r requirements.txt
```

### 3. 환경변수 설정

프로젝트 루트에 `.env` 파일 생성:

```env
CLAUDE_API_KEY=your_anthropic_api_key_here
```

### 4. 서버 실행

```bash
# 개발 모드 (자동 재시작)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 프로덕션 모드
uvicorn main:app --host 0.0.0.0 --port 8000
```

서버 실행 후:
- API 문서: http://localhost:8000/docs
- Health check: http://localhost:8000/health

## API 엔드포인트

### 1단계: 사실관계 검토
```
POST /api/v1/analysis
```

### 2단계: 쟁점 분석
```
POST /api/v1/issues
```

### 3단계: 판례 리서치
```
POST /api/v1/precedents
```

### 4단계: 심사보고서 작성
```
POST /api/v1/report
```

## 프롬프트 수정

각 분야별 프롬프트는 `app/prompts/{분야}/` 디렉토리에서 수정할 수 있습니다.

현재 지원 분야:
- `criminal`: 강제추행 사건

새로운 분야 추가 시:
1. `app/prompts/` 아래에 새 폴더 생성
2. 4개 프롬프트 파일 작성 (analysis.txt, issues.txt, precedents.txt, report.txt)
3. `PromptLoader` 사용 시 category 지정

## 개발 가이드

### 새로운 분야 추가

1. 프롬프트 폴더 생성: `app/prompts/new_category/`
2. 4개 프롬프트 파일 작성
3. 필요 시 스키마 확장

### 판례 DB 추가

`app/prompts/{분야}/precedents.txt` 파일의 "참고 판례 데이터베이스" 섹션에 판례 추가

### 응답 스키마 수정

`app/schemas/responses.py`에서 Pydantic 모델 수정

## 테스트

테스트 스크립트와 샘플 데이터는 `tests/` 폴더에 있습니다.

```bash
cd tests

# Python 테스트 스크립트 (권장)
python test_api.py analysis    # 1단계만
python test_api.py all          # 전체 파이프라인

# curl 스크립트
./test_curl.sh
```

자세한 테스트 방법은 `tests/TEST_GUIDE.md`를 참고하세요.

또는 브라우저에서 Swagger UI 사용:
- http://localhost:8000/docs


## 향후 개선사항

- [ ] 파일 업로드 기능 (PDF, DOCX 파싱)
- [ ] 데이터베이스 연동 (케이스 저장)
- [ ] 판례 벡터 DB (RAG)
- [ ] 스트리밍 응답
- [ ] Vision API (이미지 분석)
- [ ] 다양한 분야 확장

