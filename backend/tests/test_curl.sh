#!/bin/bash
# API 테스트 스크립트 (curl 버전)

BASE_URL="http://localhost:8000/api/v1"
DATA_FILE="test_data/sample_request.json"

# 색상 설정
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Legal Review AI - API 테스트${NC}"
echo -e "${BLUE}======================================${NC}\n"

# 헬스 체크
echo -e "${BLUE}[1/5] 헬스 체크...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health)
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓ 서버 정상 작동${NC}\n"
else
    echo -e "${RED}✗ 서버에 연결할 수 없습니다${NC}"
    echo -e "${RED}  서버를 먼저 실행하세요: uvicorn main:app --reload${NC}"
    exit 1
fi

# 1단계: 사실관계 검토
echo -e "${BLUE}[2/5] 1단계: 사실관계 검토${NC}"
curl -s -X POST "${BASE_URL}/analysis" \
    -H "Content-Type: application/json" \
    -d @${DATA_FILE} \
    | python3 -m json.tool > test_data/step1_result.json

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 완료 (결과: test_data/step1_result.json)${NC}\n"
else
    echo -e "${RED}✗ 실패${NC}\n"
    exit 1
fi

echo -e "${BLUE}전체 테스트를 계속하려면 Python 스크립트를 사용하세요:${NC}"
echo -e "  python test_api.py all\n"

