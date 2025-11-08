import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Button,
  Text,
  Input,
  IconButton,
  Stack,
  Badge,
  CheckboxCard,
  NativeSelectRoot,
  NativeSelectField,
} from '@chakra-ui/react';
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverPositioner,
  PopoverContent,
  PopoverBody,
} from '@chakra-ui/react';
import { LuSearch, LuFilter } from 'react-icons/lu';
import AppHeader from '../components/common/AppHeader';
import StepsBar, { stepsWidth } from '../components/common/StepsBar';
import LoadingModal from '../components/common/LoadingModal';
import PrecedentModal from '../components/case-research/PrecedentModal';

function CaseResearch() {
  const navigate = useNavigate();
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showPrecedentModal, setShowPrecedentModal] = useState(false);
  const [selectedPrecedent, setSelectedPrecedent] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [searchCourt, setSearchCourt] = useState('all');

  const [issues, setIssues] = useState([
    {
      content: '계약상 대금이 00,000,000 원으로 정해졌다고 볼 수 있는지 여부',
      precedents: [
        {
          caseNumber: '서울중앙지방법원 2023. 7. 12. 선고 2022가단5192624 판결',
          summary:
            '원고와 피고 사이에 원고가 구하는 건축 설계용역대금 77,736,651원에 관한 합의가 있었다거나 원고가 제공한 설계용역에 관한 보수가 위 금액 상당에 이르는지에 관하여 보건대, 갑 제3호증의 기재만으로는 이를 인정하기 부족하고, 달리 이를 인정할 만한 증거가 없다...',
          selected: true,
        },
        {
          caseNumber: '대구지방법원 2024. 4. 4. 선고 2022가합206258 판결',
          summary:
            '설계용역 수행의 대가 지급 여부나 그 산정 기준은 원고와 피고 사이의 설계용역계약 성립을 위한 본질적인 사항에 속하는데도...',
          selected: true,
        },
      ],
    },
    {
      content: '상대방에게 부당이득반환책임이 성립하는지 여부',
      precedents: [
        {
          caseNumber: '대구지방법원 2024. 4. 4. 선고 2022가합206258 판결',
          summary:
            '설계용역대금에 관한 명시적인 약정이 없어 설계용역 성립은 부정하였으나, 감정인의 감정 결과를 기초로 한 부당이득금에 대한 부당이득반환의무를 인정한 사례',
          selected: true,
        },
      ],
    },
  ]);

  const togglePrecedentSelection = (issueIndex, precedentIndex) => {
    const newIssues = [...issues];
    newIssues[issueIndex].precedents[precedentIndex].selected =
      !newIssues[issueIndex].precedents[precedentIndex].selected;
    setIssues(newIssues);
  };

  const getSelectedPrecedentsCount = () => {
    let count = 0;
    issues.forEach((issue) => {
      issue.precedents.forEach((precedent) => {
        if (precedent.selected) count++;
      });
    });
    return count;
  };

  const viewFullPrecedent = (precedent) => {
    setSelectedPrecedent(precedent);
    setShowPrecedentModal(true);
  };

  const searchPrecedents = () => {
    if (!searchKeyword.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }
    alert(`"${searchKeyword}" 키워드로 판례 검색을 요청했습니다.`);
  };

  const goBack = () => {
    navigate('/issue-identification');
  };

  const saveTemp = () => {
    alert('임시저장 되었습니다.');
  };

  const finalReview = () => {
    if (getSelectedPrecedentsCount() === 0) {
      alert('최소 하나 이상의 판례를 선택해주세요.');
      return;
    }
    setShowLoadingModal(true);
    setTimeout(() => {
      setShowLoadingModal(false);
      navigate('/final-review');
    }, 1500);
  };

  const factsContent = `1. 의뢰인은 상대방으로부터 **시 **구 **번지 오피스텔 신축설계(면적 00,000,000 m2 규모)의 건축설계(건축심의, 경관심의, 건축인허가, 구조 심의) 용역(이하 '이 사건 용역')을 의뢰받아 완료하였음. (계약서 없음)
- 건축심의, 건축허가, 건축구조심의 완료 및 건축물 착공연기신청 완료(착공연기 기간 내)

2. 상대방은 의뢰인에게 총 0,000,000원을 입금하였음(지급내역))
- 1차 지급: 0,000,000원 입금(입금자 **주식회사)
- 2차 지급: 0,000,000원 입금(입금자 **주식회사)
- 3차 지급: 0,000,000원 입금(입금자 **주식회사)

3. 의뢰인은 이 사건 용역에 대하여 평당 0만 원, 총 00,000,000 원으로 견적서를 작성하였음. (의뢰인 단독 날인)

4. 의뢰인은 이 사건 용역의 설계비가 평당 00,000원이라고 주장하며, 이에 용역대금은 약 0원이라고 주장함. (건축 설계비 산정근거: 평 × 00,000원, 건물규모: 00,000,000 m2 (0,000평))

5. 이에 의뢰인은 대금 잔금 약 1억 원을 상대방에게 청구하고자 함.`;

  return (
    <Box minH="100vh">
      <AppHeader />
      <StepsBar />

      <Box
        as="main"
        ml={stepsWidth}
        p={6}
      >
        {/* 사실관계 */}
        <Card.Root variant="outline" mb={6}>
          <Card.Body>
            <Text fontSize="lg" fontWeight={600} mb={4}>
              사실관계
            </Text>
            <Text fontSize="sm" color="gray.800" whiteSpace="pre-line" lineHeight={1.6}>
              {factsContent}
            </Text>
          </Card.Body>
        </Card.Root>

        {/* 판례 검색 결과 */}
        <Card.Root variant="outline" mb={6}>
          <Card.Body>
            <Text fontSize="lg" fontWeight={600} mb={6}>
              판례 검색 결과
            </Text>

            {issues.map((issue, issueIndex) => (
              <Box
                key={issueIndex}
                mb={issueIndex < issues.length - 1 ? 8 : 0}
              >
                <Box display="flex" alignItems="flex-start" gap={3} mb={4}>
                  <Box
                    w="24px"
                    h="24px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="gray.900"
                    color="white"
                    borderRadius="full"
                    fontWeight={600}
                    flexShrink={0}
                    fontSize="0.75rem"
                  >
                    {issueIndex + 1}
                  </Box>
                  <Text fontSize="md" color="gray.800" fontWeight={600} flex={1}>
                    {issue.content}
                  </Text>
                </Box>

                <Box ml={8} display="flex" flexDirection="column" gap={4}>
                  {issue.precedents.map((precedent, precedentIndex) => (
                    <CheckboxCard.Root
                      key={precedentIndex}
                      checked={precedent.selected}
                      onCheckedChange={() => togglePrecedentSelection(issueIndex, precedentIndex)}
                      size="lg"
                      colorPalette="gray"
                    >
                      <CheckboxCard.HiddenInput />
                      <CheckboxCard.Control>
                        <CheckboxCard.Content>
                          <CheckboxCard.Label fontWeight={500} color="gray.900" mb={2}>
                            {precedent.caseNumber}
                          </CheckboxCard.Label>
                          <CheckboxCard.Description fontSize="sm" color="gray.900" lineHeight={1.6} mb={3}>
                            {precedent.summary}
                          </CheckboxCard.Description>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewFullPrecedent(precedent);
                            }}
                          >
                            전문보기
                          </Button>
                        </CheckboxCard.Content>
                        <CheckboxCard.Indicator />
                      </CheckboxCard.Control>
                    </CheckboxCard.Root>
                  ))}
                </Box>
              </Box>
            ))}

            {/* 선택된 판례 수 */}
            <Box display="flex" justifyContent="flex-end" mt={2} mb={6}>
              <Text fontSize="sm" color="gray.700">
                선택된 판례 수 :{' '}
                <Text as="span" color="gray.900" fontWeight={500}>
                  {getSelectedPrecedentsCount()}
                </Text>
              </Text>
            </Box>

            {/* 추가 검색 */}
            <Box p={6} borderRadius="lg" bg="gray.50">
              <Text fontSize="md" fontWeight={600} color="gray.800" mb={4}>
                추가 판례 검색
              </Text>
              <Box display="flex" gap={2}>
                <Input
                  bg="white"
                  flex={1}
                  placeholder="검색어를 입력하세요"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') searchPrecedents();
                  }}
                />
                <IconButton
                  onClick={searchPrecedents}
                  colorPalette="gray"
                  aria-label="검색"
                >
                  <LuSearch />
                </IconButton>
                <PopoverRoot portalled positioning={{ placement: 'bottom-end' }}>
                  <PopoverTrigger asChild>
                    <IconButton
                      variant="outline"
                      aria-label="필터"
                    >
                      <LuFilter />
                    </IconButton>
                  </PopoverTrigger>
                  <PopoverPositioner>
                    <PopoverContent>
                      <PopoverBody p={6} minW="300px">
                      <Text fontSize="sm" fontWeight={600} mb={4}>
                        검색 필터
                      </Text>
                      <Stack gap={4}>
                        <Box>
                          <Text fontSize="xs" color="gray.700" mb={1}>
                            검색 타입
                          </Text>
                          <NativeSelectRoot size="sm">
                            <NativeSelectField
                              value={searchType}
                              onChange={(e) => setSearchType(e.target.value)}
                            >
                              <option value="all">전체</option>
                              <option value="title">제목</option>
                              <option value="content">내용</option>
                              <option value="caseNumber">사건번호</option>
                            </NativeSelectField>
                          </NativeSelectRoot>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.700" mb={1}>
                            법원
                          </Text>
                          <NativeSelectRoot size="sm">
                            <NativeSelectField
                              value={searchCourt}
                              onChange={(e) => setSearchCourt(e.target.value)}
                            >
                              <option value="all">모든 법원</option>
                              <option value="supreme">대법원</option>
                              <option value="high">고등법원</option>
                              <option value="district">지방법원</option>
                            </NativeSelectField>
                          </NativeSelectRoot>
                        </Box>
                      </Stack>
                    </PopoverBody>
                    </PopoverContent>
                  </PopoverPositioner>
                </PopoverRoot>
              </Box>
            </Box>
          </Card.Body>
        </Card.Root>

        {/* 액션 버튼 */}
        <Box display="flex" justifyContent="space-between" gap={4}>
          <Button size="lg" variant="outline" onClick={goBack} bg="white">
            이전으로
          </Button>
          <Box display="flex" gap={3}>
            <Button size="lg" variant="outline" onClick={saveTemp} bg="white">
              임시저장
            </Button>
            <Button size="lg" colorPalette="gray" onClick={finalReview}>
              확인
            </Button>
          </Box>
        </Box>

        <LoadingModal
          isVisible={showLoadingModal}
          message="AI가 승소가능성 및 집행가능성을 검토하고 있습니다."
        />

        <PrecedentModal
          isOpen={showPrecedentModal}
          onClose={() => setShowPrecedentModal(false)}
          precedent={selectedPrecedent}
        />
      </Box>
    </Box>
  );
}

export default CaseResearch;

