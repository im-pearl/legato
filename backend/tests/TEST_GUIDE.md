# API 테스트 가이드

## 빠른 시작

### 1. 서버 실행
```bash
# backend 폴더에서
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

서버가 실행되면 http://localhost:8000 에서 접근 가능

### 2. 테스트 폴더로 이동
```bash
# 다른 터미널에서
cd backend/tests
```

### 3. API 문서 확인
브라우저에서 http://localhost:8000/docs 접속
- Swagger UI에서 모든 엔드포인트 확인 가능
- "Try it out" 버튼으로 직접 테스트 가능

## 테스트 방법

### 방법 1: Python 테스트 스크립트 (추천)

```bash
# requests 패키지 설치 (한 번만)
pip install requests

# 1단계만 테스트
python test_api.py analysis

# 2단계만 테스트 (1단계 먼저 실행 필요)
python test_api.py issues

# 전체 파이프라인 테스트
python test_api.py all
```

**장점:**
- 단계별 실행 가능
- 결과를 자동으로 저장 (`test_data/step*_result.json`)
- 다음 단계에 이전 결과 자동 전달
- 색상으로 보기 좋은 출력

### 방법 2: Swagger UI (가장 쉬움)

1. http://localhost:8000/docs 접속
2. `/api/v1/analysis` 엔드포인트 클릭
3. "Try it out" 버튼 클릭
4. Request body에 샘플 데이터 입력 (아래 참고)
5. "Execute" 버튼 클릭

**샘플 데이터:** `test_data/sample_request.json` 파일 내용을 복사해서 붙여넣기

### 방법 3: curl 명령어

```bash
# 헬스 체크
curl http://localhost:8000/health

# 1단계: 사실관계 검토
curl -X POST http://localhost:8000/api/v1/analysis \
  -H "Content-Type: application/json" \
  -d @test_data/sample_request.json

# 또는 쉘 스크립트 실행
./test_curl.sh
```

### 방법 4: Python 직접 호출

```python
import json
import requests

# 샘플 데이터 로드
with open('test_data/sample_request.json', 'r') as f:
    data = json.load(f)

# API 호출
response = requests.post(
    'http://localhost:8000/api/v1/analysis',
    json=data
)

# 결과 확인
result = response.json()
print(json.dumps(result, ensure_ascii=False, indent=2))
```

## 테스트 데이터

### 샘플 데이터 위치
- `test_data/sample_request.json` - 강제추행 사건 샘플

### 결과 파일
테스트 실행 시 자동으로 생성:
- `test_data/step1_result.json` - 사실관계 검토 결과
- `test_data/step2_result.json` - 쟁점 분석 결과
- `test_data/step3_result.json` - 판례 리서치 결과
- `test_data/step4_result.json` - 심사보고서 결과

## API 엔드포인트

### 1단계: 사실관계 검토
```
POST /api/v1/analysis
```

**입력:**
- `case_request`: 의뢰서 정보
- `consultation_result`: 상담결과지 정보
- `reviewer_notes`: 심사역 메모 (선택)

**출력:**
- `facts_summary`: 정리된 사실관계
- `key_points`: 핵심 포인트 리스트
- `timeline`: 시간순 정리
- `parties`: 당사자 정보

### 2단계: 쟁점 분석
```
POST /api/v1/issues
```

**입력:** 1단계 입력 + `analysis_result`

**출력:**
- `issues`: 쟁점 리스트 (제목, 설명, 중요도)
- `main_issue`: 핵심 쟁점 요약

### 3단계: 판례 리서치
```
POST /api/v1/precedents
```

**입력:** 2단계 입력 + `issues_result`

**출력:**
- `issue_precedents`: 쟁점별 관련 판례
- `additional_notes`: 추가 검토사항

### 4단계: 심사보고서 작성
```
POST /api/v1/report
```

**입력:** 3단계 입력 + `precedents_result`

**출력:**
- `executive_summary`: 요약
- `facts`: 사실관계
- `issues_analysis`: 쟁점별 분석
- `legal_opinion`: 법적 의견
- `win_probability`: 승소 가능성 (%)
- `execution_probability`: 집행 가능성 (%)
- `conclusion`: 결론
- `recommendations`: 제안사항

## 문제 해결

### 서버에 연결할 수 없습니다
```bash
# 서버가 실행 중인지 확인
ps aux | grep uvicorn

# 서버 재시작
uvicorn main:app --reload
```

### CLAUDE_API_KEY 오류
```bash
# .env 파일 확인
cat .env

# API 키가 없다면 추가
echo "CLAUDE_API_KEY=your_api_key_here" > .env
```

### requests 모듈 없음
```bash
pip install requests
```

## 다음 단계

1. **프롬프트 수정**: `app/prompts/criminal/` 폴더의 프롬프트 파일 수정
2. **새 분야 추가**: `app/prompts/` 아래 새 폴더 생성
3. **프론트엔드 연동**: React 앱에서 API 호출 구현

