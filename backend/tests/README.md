# 테스트 가이드

백엔드 API를 테스트하기 위한 스크립트와 샘플 데이터입니다.

## 빠른 시작

### 서버 실행 (다른 터미널에서)
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

### 테스트 실행
```bash
# 이 폴더(tests)로 이동
cd backend/tests

# 1단계만 테스트
python test_api.py analysis

# 전체 파이프라인 테스트
python test_api.py all
```

## 파일 구조

```
tests/
├── README.md              # 이 파일
├── TEST_GUIDE.md          # 자세한 테스트 가이드
├── test_api.py            # Python 테스트 스크립트 (권장)
├── test_curl.sh           # Bash curl 스크립트
└── test_data/
    ├── sample_request.json    # 강제추행 사건 샘플
    └── step*_result.json      # 테스트 결과 (자동 생성)
```

## 테스트 옵션

```bash
python test_api.py analysis      # 1단계: 사실관계 검토
python test_api.py issues        # 2단계: 쟁점 분석
python test_api.py precedents    # 3단계: 판례 리서치
python test_api.py report        # 4단계: 심사보고서
python test_api.py all           # 전체 실행
```

## 다른 테스트 방법

### Swagger UI (가장 쉬움)
http://localhost:8000/docs

### curl
```bash
./test_curl.sh
```

자세한 내용은 `TEST_GUIDE.md`를 참고하세요.

