import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Button,
  Text,
  Textarea,
  Stack,
  For,
} from '@chakra-ui/react';
import { Slider } from '@chakra-ui/react';
import AppSidebar from '../components/common/AppSidebar';
import AppHeader from '../components/common/AppHeader';
import PreviewReportModal from '../components/final-review/PreviewReportModal';

function FinalReview() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [winProbability, setWinProbability] = useState([75]);
  const [executionProbability, setExecutionProbability] = useState([80]);

  const [winProbabilityDescription, setWinProbabilityDescription] = useState(
    '계약서가 없고 상대방의 확인 서명이 없는 견적서만으로는 계약상 대금청구가 인정되기 어려우나, 부당이득반환청구는 실제 제공된 용역의 가치에 기초하여 인정될 가능성이 높습니다...'
  );

  const [executionProbabilityDescription, setExecutionProbabilityDescription] = useState(
    '상대방은 건설회사(법인)로, 토지 가액 약 9억 원의 재산을 보유하고 있어 집행 대상 재산이 충분합니다. 법인의 경우 개인보다 재산 은닉이 어렵고...'
  );

  const [conclusion, setConclusion] = useState(
    '의뢰인의 계약상 설계용역대금청구는 계약서가 없고 의뢰인이 일방적으로 작성한 견적서만으로는 계약 내용이 확정되었다고 보기 어려워 기각될 가능성이 높습니다...'
  );

  const clientName = '김건축';
  const requestNumber = 'CS-20250314-0042';
  const lawyerName = '박변호 변호사';
  const receiptDate = '2025년 03월 14일';

  const issues = [
    {
      content: '계약상 대금이 00,000,000 원으로 정해졌다고 볼 수 있는지 여부',
      precedents: [
        {
          caseNumber: '서울중앙지방법원 2023. 7. 12. 선고 2022가단5192624 판결',
          summary: '원고와 피고 사이에 원고가 구하는 건축 설계용역대금 77,736,651원에 관한 합의가 있었다거나...',
        },
        {
          caseNumber: '대구지방법원 2024. 4. 4. 선고 2022가합206258 판결',
          summary: '설계용역 수행의 대가 지급 여부나 그 산정 기준은 원고와 피고 사이의 설계용역계약 성립...',
        },
      ],
      subsumption:
        '본 사안에서는 의뢰인과 상대방 사이에 서면 계약서가 작성되지 않았고, 의뢰인이 단독으로 작성한 견적서만 존재합니다. 견적서는 의뢰인이 일방적으로 작성하고 날인한 것으로...',
    },
    {
      content: '상대방에게 부당이득반환책임이 성립하는지 여부',
      precedents: [
        {
          caseNumber: '대구지방법원 2024. 4. 4. 선고 2022가합206258 판결',
          summary: '설계용역대금에 관한 명시적인 약정이 없어 설계용역 성립은 부정하였으나...',
        },
      ],
      subsumption:
        '의뢰인은 건축설계용역을 완전히 이행하여 건축심의, 건축허가, 건축구조심의 등을 모두 완료하였습니다. 이로써 상대방은 의뢰인의 용역 제공을 통해...',
    },
  ];

  const factsContent = `1. 의뢰인은 상대방으로부터 **시 **구 **번지 오피스텔 신축설계(면적 00,000,000 m2 규모)의 건축설계(건축심의, 경관심의, 건축인허가, 구조 심의) 용역(이하 '이 사건 용역')을 의뢰받아 완료하였음. (계약서 없음)

- 건축심의, 건축허가, 건축구조심의 완료 및 건축물 착공연기신청 완료(착공연기 기간 내)

2. 상대방은 의뢰인에게 총 0,000,000원을 입금하였음(지급내역))
- 1차 지급: 0,000,000원 입금(입금자 **주식회사)
- 2차 지급: 0,000,000원 입금(입금자 **주식회사)
- 3차 지급: 0,000,000원 입금(입금자 **주식회사)

3. 의뢰인은 이 사건 용역에 대하여 평당 0만 원, 총 00,000,000 원으로 견적서를 작성하였음. (의뢰인 단독 날인)

4. 의뢰인은 이 사건 용역의 설계비가 평당 00,000원이라고 주장하며, 이에 용역대금은 약 0원이라고 주장함. (건축 설계비 산정근거: 평 × 00,000원, 건물규모: 00,000,000 m2 (0,000평))

5. 이에 의뢰인은 대금 잔금 약 1억 원을 상대방에게 청구하고자 함.`;

  const goBack = () => {
    navigate('/case-research');
  };

  const saveTemp = () => {
    alert('임시저장 되었습니다.');
  };

  const openPreviewModal = () => {
    setShowPreviewModal(true);
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
  };

  const confirmSave = () => {
    alert('법률 검토 보고서가 저장되었습니다.');
    closePreviewModal();
  };

  return (
    <>
      <Box display="flex">
        <AppSidebar open={drawerOpen} onToggle={() => setDrawerOpen(!drawerOpen)} />

        <Box
          flexGrow={1}
          display="flex"
          flexDirection="column"
          minH="100vh"
          ml={drawerOpen ? '200px' : '65px'}
          transition="margin-left 0.3s"
        >
          <AppHeader caseNumber="12345" caseTitle="강제추행 피해자입니다" />

          <Box
            as="main"
            flexGrow={1}
            p={6}
            bg="white"
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

        {/* 쟁점 및 포섭 */}
        <For each={issues}>
          {(issue, issueIndex) => (
            <Card.Root key={issueIndex} variant="outline" mb={6}>
              <Card.Body>
                <Text fontSize="lg" fontWeight={600} mb={4}>
                  쟁점 {issueIndex + 1}
                </Text>

                <Box p={4} mb={6} borderWidth="1px" borderRadius="md" bg="gray.50">
                  <Text fontSize="sm" color="gray.800" lineHeight={1.5}>
                    {issue.content}
                  </Text>
                </Box>

                <Text fontSize="md" fontWeight={600} color="gray.800" mb={4}>
                  관련 판례
                </Text>
                <Stack gap={4} mb={6}>
                  <For each={issue.precedents}>
                    {(precedent, index) => (
                      <Box key={index} p={4} borderWidth="1px" borderRadius="md">
                        <Text fontSize="sm" fontWeight={600} color="gray.900" mb={2}>
                          {precedent.caseNumber}
                        </Text>
                        <Text fontSize="sm" color="gray.800" lineHeight={1.5}>
                          {precedent.summary}
                        </Text>
                      </Box>
                    )}
                  </For>
                </Stack>

                <Text fontSize="md" fontWeight={600} color="gray.800" mb={4}>
                  판단
                </Text>
                <Textarea
                  defaultValue={issue.subsumption}
                  rows={4}
                  fontFamily="inherit"
                  fontSize="0.95rem"
                  lineHeight={1.5}
                />
              </Card.Body>
            </Card.Root>
          )}
        </For>

        {/* 결론 */}
        <Card.Root variant="outline" mb={6}>
          <Card.Body>
            <Text fontSize="lg" fontWeight={600} mb={4}>
              결론
            </Text>
            <Textarea
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              rows={5}
              fontFamily="inherit"
              fontSize="0.95rem"
              lineHeight={1.5}
            />
          </Card.Body>
        </Card.Root>

        {/* 승소가능성 */}
        <Card.Root variant="outline" mb={6}>
          <Card.Body>
            <Text fontSize="lg" fontWeight={600} mb={6}>
              승소가능성
            </Text>
            <Box mb={6}>
              <Slider.Root
                value={winProbability}
                onValueChange={(e) => setWinProbability(e.value)}
                min={0}
                max={100}
                step={5}
              >
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Slider.Label fontSize="sm" fontWeight={500}>승소 확률</Slider.Label>
                  <Slider.ValueText fontSize="sm" fontWeight={600} color="gray.900" />
                </Box>
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Range />
                  </Slider.Track>
                  <Slider.Thumbs />
                </Slider.Control>
              </Slider.Root>
            </Box>
            <Textarea
              value={winProbabilityDescription}
              onChange={(e) => setWinProbabilityDescription(e.target.value)}
              rows={4}
              fontFamily="inherit"
              fontSize="0.95rem"
              lineHeight={1.5}
            />
          </Card.Body>
        </Card.Root>

        {/* 집행가능성 */}
        <Card.Root variant="outline" mb={6}>
          <Card.Body>
            <Text fontSize="lg" fontWeight={600} mb={6}>
              집행가능성
            </Text>
            <Box mb={6}>
              <Slider.Root
                value={executionProbability}
                onValueChange={(e) => setExecutionProbability(e.value)}
                min={0}
                max={100}
                step={5}
              >
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Slider.Label fontSize="sm" fontWeight={500}>집행 확률</Slider.Label>
                  <Slider.ValueText fontSize="sm" fontWeight={600} color="gray.900" />
                </Box>
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Range />
                  </Slider.Track>
                  <Slider.Thumbs />
                </Slider.Control>
              </Slider.Root>
            </Box>
            <Textarea
              value={executionProbabilityDescription}
              onChange={(e) => setExecutionProbabilityDescription(e.target.value)}
              rows={4}
              fontFamily="inherit"
              fontSize="0.95rem"
              lineHeight={1.5}
            />
          </Card.Body>
        </Card.Root>

        {/* 액션 버튼 */}
        <Box display="flex" justifyContent="space-between" gap={4}>
          <Button size="lg" variant="outline" onClick={goBack}>
            이전으로
          </Button>
          <Box display="flex" gap={3}>
            <Button size="lg" variant="outline" onClick={saveTemp}>
              임시저장
            </Button>
            <Button size="lg" colorPalette="gray" onClick={openPreviewModal}>
              저장
            </Button>
          </Box>
        </Box>
        </Box>
      </Box>
      </Box>

      {/* 보고서 미리보기 모달 */}
      <PreviewReportModal
        isOpen={showPreviewModal}
        onClose={closePreviewModal}
        onConfirm={confirmSave}
        clientName={clientName}
        requestNumber={requestNumber}
        lawyerName={lawyerName}
        receiptDate={receiptDate}
        factsContent={factsContent}
        issues={issues}
        conclusion={conclusion}
        winProbability={winProbability}
        executionProbability={executionProbability}
        winProbabilityDescription={winProbabilityDescription}
        executionProbabilityDescription={executionProbabilityDescription}
      />
    </>
  );
}

export default FinalReview;

