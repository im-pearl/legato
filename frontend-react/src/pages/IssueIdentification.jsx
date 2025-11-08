import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Button,
  Text,
  Textarea,
  IconButton,
  Stack,
} from '@chakra-ui/react';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import AppHeader from '../components/common/AppHeader';
import StepsBar, { stepsWidth } from '../components/common/StepsBar';
import LoadingModal from '../components/common/LoadingModal';

function IssueIdentification() {
  const navigate = useNavigate();
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [issues, setIssues] = useState([
    { content: '계약상 대금이 00,000,000 원으로 정해졌다고 볼 수 있는지 여부' },
    { content: '상대방에게 부당이득반환책임이 성립하는지 여부' },
  ]);

  const factsContent = `1. 의뢰인은 상대방으로부터 **시 **구 **번지 오피스텔 신축설계(면적 00,000,000 m2 규모)의 건축설계(건축심의, 경관심의, 건축인허가, 구조 심의) 용역(이하 '이 사건 용역')을 의뢰받아 완료하였음. (계약서 없음)

- 건축심의, 건축허가, 건축구조심의 완료 및 건축물 착공연기신청 완료(착공연기 기간 내)

2. 상대방은 의뢰인에게 총 0,000,000원을 입금하였음(지급내역))
- 1차 지급: 0,000,000원 입금(입금자 **주식회사)
- 2차 지급: 0,000,000원 입금(입금자 **주식회사)
- 3차 지급: 0,000,000원 입금(입금자 **주식회사)

3. 의뢰인은 이 사건 용역에 대하여 평당 0만 원, 총 00,000,000 원으로 견적서를 작성하였음. (의뢰인 단독 날인)

4. 의뢰인은 이 사건 용역의 설계비가 평당 00,000원이라고 주장하며, 이에 용역대금은 약 0원이라고 주장함. (건축 설계비 산정근거: 평 × 00,000원, 건물규모: 00,000,000 m2 (0,000평))

5. 이에 의뢰인은 대금 잔금 약 1억 원을 상대방에게 청구하고자 함.`;

  const addNewIssue = () => {
    setIssues([...issues, { content: '쟁점 내용을 입력하세요.' }]);
  };

  const deleteIssue = (index) => {
    if (window.confirm('정말로 이 쟁점을 삭제하시겠습니까?')) {
      setIssues(issues.filter((_, i) => i !== index));
    }
  };

  const updateIssue = (index, content) => {
    const newIssues = [...issues];
    newIssues[index].content = content;
    setIssues(newIssues);
  };

  const goBack = () => {
    navigate('/fact-review');
  };

  const saveTemp = () => {
    alert('임시저장 되었습니다.');
  };

  const searchCases = () => {
    setShowLoadingModal(true);
    setTimeout(() => {
      setShowLoadingModal(false);
      navigate('/case-research');
    }, 1500);
  };

  return (
    <Box minH="100vh">
      <AppHeader />
      <StepsBar />

      <Box
        as="main"
        ml={stepsWidth}
        p={6}
      >
        {/* 사실관계 섹션 */}
        <Card.Root variant="outline" mb={6}>
          <Card.Body>
            <Text fontSize="lg" fontWeight={600} mb={4}>
              사실관계
            </Text>
            <Textarea
              defaultValue={factsContent}
              rows={10}
              fontFamily="inherit"
              lineHeight={1.5}
            />
          </Card.Body>
        </Card.Root>

        {/* 쟁점 섹션 */}
        <Card.Root variant="outline" mb={6}>
          <Card.Body>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Text fontSize="lg" fontWeight={600}>
                쟁점
              </Text>
              <Button
                size="xs"
                variant="subtle"
                onClick={addNewIssue}
              >
                <LuPlus />
                추가
              </Button>
            </Box>

            <Stack gap={4}>
              {issues.map((issue, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="flex-start"
                  gap={4}
                  p={4}
                  borderWidth="1px"
                  borderColor="gray.300"
                  borderRadius="lg"
                  bg="white"
                  transition="all 0.2s"
                  _focusWithin={{
                    borderColor: 'gray.400',
                    boxShadow: 'sm',
                  }}
                >
                  <Box
                    w="24px"
                    h="24px"
                    mt="6px"
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
                    {index + 1}
                  </Box>

                  <Textarea
                    value={issue.content}
                    onChange={(e) => updateIssue(index, e.target.value)}
                    variant="plain"
                    rows={1}
                    fontSize="0.95rem"
                    lineHeight={1.5}
                    flex={1}
                  />

                  <IconButton
                    size="sm"
                    variant="ghost"
                    colorPalette="red"
                    onClick={() => deleteIssue(index)}
                    flexShrink={0}
                    aria-label="삭제"
                  >
                    <LuTrash2 />
                  </IconButton>
                </Box>
              ))}
            </Stack>
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
            <Button size="lg" colorPalette="gray" onClick={searchCases}>
              확인
            </Button>
          </Box>
        </Box>

        <LoadingModal
          isVisible={showLoadingModal}
          message="AI가 사실관계와 쟁점을 기반으로 판례를 검색하고 있습니다."
        />
      </Box>
    </Box>
  );
}

export default IssueIdentification;

