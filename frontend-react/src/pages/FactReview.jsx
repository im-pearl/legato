import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { prepareDataForLLM } from '../utils/highlightUtils';
import {
  Box,
  Card,
  Button,
  Text,
  Grid,
  GridItem,
  IconButton,
  Stack,
  Input,
  Textarea,
  ScrollArea,
} from '@chakra-ui/react';
import {
  LuCloudUpload,
  LuTrash2,
  LuPencil,
  LuFile,
} from 'react-icons/lu';
import AppSidebar from '../components/common/AppSidebar';
import AppHeader from '../components/common/AppHeader';
import StepsBar from '../components/common/StepsBar';
import LoadingModal from '../components/common/LoadingModal';
import RequestForm from '../components/fact-review/RequestForm';
import ConsultationResult from '../components/fact-review/ConsultationResult';

function FactReview() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [files, setFiles] = useState([
    { name: '과거_설계_계약서.pdf', highlight: false },
    { name: '지급내역.png', highlight: false },
  ]);

  const [qaItems, setQaItems] = useState([
    {
      question: '의뢰인이 청구하고자 하는 금액은 얼마인가요?',
      answer: '1억 원',
      highlights: [],
    },
    {
      question: '문제가 발생한 연도는 언제인가요?',
      answer: '2025',
      highlights: [],
    },
    {
      question: '의뢰인이 겪고 있는 상황은 무엇인가요?',
      answer: '건축사사무소를 운영하며, 설계계약서 없이 진행된 건축허가 후 잔금 미지급 문제가 발생했습니다.',
      highlights: [],
    },
    {
      question: '상대방의 입장은 무엇인가요?',
      answer: '잔금 지급 의사 없음',
      highlights: [],
    },
    {
      question: '변호사님에게 어떤 도움을 받고 싶으신가요?',
      answer: '소송 진행 및 분쟁/합의 지원',
      highlights: [],
    },
    {
      question: '사건내용',
      answer: '설계용역 대금 회수와 관련하여 잔금이 미지급된 문제로 인해 법적 대응이 필요한 상황입니다.',
      highlights: [],
    },
  ]);

  const requestBasicInfo = {
    '의뢰서 작성일': '2025년 3월 14일',
    '사건 분류': '일반 민사',
  };

  const [consultationGroups, setConsultationGroups] = useState({
    '기초 정보': [
      { label: '의뢰인 닉네임', value: '김건축' },
      { label: '의뢰인 연락처', value: '010-****-****' },
      { label: '변호사', value: '박변호' },
      { label: '변호사 연락처', value: '010-****-****' },
    ],
    '상담 내용': [
      { label: '사건명', value: '건축설계용역 미수금 회수', highlights: [] },
      {
        label: '사실관계',
        value:
          '소송의뢰인은 건축설계용역을 수행했으나, 상대방은 잔금 일부만 지급하고 나머지는 지급 거부하고 있습니다.',
        highlights: [],
      },
      { label: '상담 결과', value: '소송 진행 및 분쟁, 합의 지원 필요', highlights: [] },
      {
        label: '관련 법리',
        value:
          '상법 제61조는 상인이 그 영업범위 내에서 타인을 위하여 행위를 한 때에는 이에 대하여 상당한 보수를 청구할 수 있다라고 규정하고 있다...',
        highlights: [],
      },
      { label: '증거 판단', value: '업무 수행 증거 및 일부 지급 증거 존재', highlights: [] },
      { label: '불리 요소', value: '계약서 미작성으로 지급 기준 불명확', highlights: [] },
      { label: '승소 예상 금액', value: '3억7천만원', highlights: [] },
      { label: '집행 방안', value: '상대방 보유 부동산 등을 통한 집행 가능', highlights: [] },
    ],
    '비용 정보': [
      { label: '착수금', value: '000,000원' },
      { label: '성공보수', value: '회수 금액의 0%' },
    ],
  });

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    selectedFiles.forEach((file) => {
      setFiles((prev) => [...prev, { name: file.name, highlight: false, file }]);
    });
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    droppedFiles.forEach((file) => {
      setFiles((prev) => [...prev, { name: file.name, highlight: false, file }]);
    });
  };

  const toggleFileHighlight = (index) => {
    setFiles((prev) =>
      prev.map((file, i) => (i === index ? { ...file, highlight: !file.highlight } : file))
    );
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const saveTemp = () => {
    alert('임시저장 되었습니다.');
  };

  const analyzeIssues = () => {
    // LLM 전송용 데이터 준비
    const llmData = prepareDataForLLM(qaItems, consultationGroups);
    console.log('LLM 전송 데이터:', llmData);
    
    // TODO: 실제 API 호출
    // await sendToLLM(llmData);
    
    setShowLoadingModal(true);
    setTimeout(() => {
      setShowLoadingModal(false);
      navigate('/issue-identification');
    }, 1500);
  };

  // 의뢰서 값 변경 핸들러
  const handleRequestChange = (itemIndex, newValue) => {
    setQaItems((prev) =>
      prev.map((item, idx) =>
        idx === itemIndex ? { ...item, answer: newValue } : item
      )
    );
  };

  // 의뢰서 하이라이트 핸들러
  const handleRequestHighlight = (itemIndex, selection) => {
    setQaItems((prev) =>
      prev.map((item, idx) =>
        idx === itemIndex
          ? {
              ...item,
              highlights: [...(item.highlights || []), selection],
            }
          : item
      )
    );
  };

  const handleRequestRemoveHighlight = (itemIndex, highlightIdx) => {
    setQaItems((prev) =>
      prev.map((item, idx) =>
        idx === itemIndex
          ? {
              ...item,
              highlights: item.highlights.filter((_, hIdx) => hIdx !== highlightIdx),
            }
          : item
      )
    );
  };

  // 상담결과지 값 변경 핸들러
  const handleConsultationChange = (groupName, itemIndex, newValue) => {
    setConsultationGroups((prev) => ({
      ...prev,
      [groupName]: prev[groupName].map((item, idx) =>
        idx === itemIndex ? { ...item, value: newValue } : item
      ),
    }));
  };

  // 상담결과지 하이라이트 핸들러
  const handleConsultationHighlight = (groupName, itemIndex, selection) => {
    setConsultationGroups((prev) => ({
      ...prev,
      [groupName]: prev[groupName].map((item, idx) =>
        idx === itemIndex
          ? {
              ...item,
              highlights: [...(item.highlights || []), selection],
            }
          : item
      ),
    }));
  };

  const handleConsultationRemoveHighlight = (groupName, itemIndex, highlightIdx) => {
    setConsultationGroups((prev) => ({
      ...prev,
      [groupName]: prev[groupName].map((item, idx) =>
        idx === itemIndex
          ? {
              ...item,
              highlights: (item.highlights || []).filter((_, hIdx) => hIdx !== highlightIdx),
            }
          : item
      ),
    }));
  };

  return (
    <Box display="flex">
      <AppSidebar open={drawerOpen} onToggle={() => setDrawerOpen(!drawerOpen)} />

      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        minH="100vh"
        ml={drawerOpen ? '200px' : '0'}
        transition="margin-left 0.3s"
      >
        <AppHeader 
          caseNumber="12345" 
          caseTitle="강제추행 피해자입니다"
          onToggleSidebar={() => setDrawerOpen(!drawerOpen)}
          sidebarOpen={drawerOpen}
        />
        <StepsBar />

        <Box
          as="main"
          flexGrow={1}
          pt={2}
          px={6}
          pb={6}
          bg="white"
        >
        {/* 메인 2열 레이아웃 */}
        <Grid 
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} 
          gap={6} 
          mb={6}
        >
          {/* 왼쪽 열: 의뢰서 & 상담 결과지 */}
          <GridItem>
            <ScrollArea.Root maxHeight="calc(100vh - 180px)">
              <ScrollArea.Viewport>
                <ScrollArea.Content paddingEnd="3">
                  <Stack gap={6}>
                    <RequestForm
                      basicInfo={requestBasicInfo}
                      title="계약서 작성 없이 설계용역을 했는데 터무니없이 낮은 금액을 받았어요"
                      qaItems={qaItems}
                      onChange={handleRequestChange}
                      onHighlight={handleRequestHighlight}
                      onRemoveHighlight={handleRequestRemoveHighlight}
                    />
                    <ConsultationResult
                      groups={consultationGroups}
                      onChange={handleConsultationChange}
                      onHighlight={handleConsultationHighlight}
                      onRemoveHighlight={handleConsultationRemoveHighlight}
                    />
                  </Stack>
                </ScrollArea.Content>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar>
                <ScrollArea.Thumb />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
          </GridItem>

          {/* 오른쪽 열: 자료 업로드 & 심사역 작성 */}
          <GridItem>
            <ScrollArea.Root maxHeight="calc(100vh - 180px)" variant="always">
              <ScrollArea.Viewport>
                <ScrollArea.Content paddingEnd="3">
                  <Stack gap={6}>
              {/* 자료 업로드 */}
              <Card.Root variant="outline">
                <Card.Body>
                  <Text fontSize="lg" fontWeight={600} mb={4}>
                    증거 리스트
                  </Text>

                  <Box
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    p={8}
                    borderWidth="2px"
                    borderStyle="dashed"
                    borderColor="gray.300"
                    borderRadius="lg"
                    textAlign="center"
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                      borderColor: 'gray.400',
                      bg: 'gray.50',
                    }}
                  >
                    <LuCloudUpload size={40} color="gray" style={{ margin: '0 auto 8px' }} />
                    <Text fontSize="md" fontWeight={500} color="gray.700">
                      클릭하거나 파일을 여기에 끌어다 놓으세요
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      PDF, DOCX, JPG, PNG 파일 (최대 20MB)
                    </Text>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      display="none"
                      onChange={handleFileSelect}
                    />
                  </Box>

                  {files.length > 0 && (
                    <Stack gap={3} mt={4}>
                      {files.map((file, index) => (
                        <Box
                          key={index}
                          p={3}
                          borderWidth="1px"
                          borderRadius="md"
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          bg={file.highlight ? 'gray.50' : 'white'}
                          borderColor={file.highlight ? 'gray.400' : 'gray.300'}
                        >
                          <Box display="flex" alignItems="center" gap={3}>
                            <LuFile size={20} color="gray" />
                            <Text fontSize="sm" fontWeight={500}>
                              {file.name}
                            </Text>
                          </Box>
                          <Box display="flex" gap={1}>
                            <IconButton
                              size="sm"
                              variant={file.highlight ? 'solid' : 'ghost'}
                              colorPalette={file.highlight ? 'gray' : 'gray'}
                              onClick={() => toggleFileHighlight(index)}
                              aria-label="하이라이트"
                            >
                              <LuPencil />
                            </IconButton>
                            <IconButton
                              size="sm"
                              variant="ghost"
                              colorPalette="red"
                              onClick={() => removeFile(index)}
                              aria-label="삭제"
                            >
                              <LuTrash2 />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Card.Body>
              </Card.Root>

              {/* 심사역 작성 */}
              <Card.Root variant="outline">
                <Card.Body>
                  <Text fontSize="lg" fontWeight={600} mb={4}>
                    심사역 작성
                  </Text>
                  <Textarea
                    placeholder="사건에 대한 심사 내용을 작성해주세요..."
                    rows={6}
                  />
                </Card.Body>
              </Card.Root>
                  </Stack>
                </ScrollArea.Content>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar>
                <ScrollArea.Thumb />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
          </GridItem>
        </Grid>

        {/* 액션 버튼 */}
        <Box display="flex" justifyContent="space-between" gap={4}>
          <Button size="lg" variant="outline" onClick={saveTemp}>
            임시저장
          </Button>
          <Button size="lg" onClick={analyzeIssues}>
            확인
          </Button>
        </Box>

        <LoadingModal
          isVisible={showLoadingModal}
          message="AI가 사실관계를 정리하고 쟁점을 추출하고 있습니다."
        />
        </Box>
      </Box>
    </Box>
  );
}

export default FactReview;

