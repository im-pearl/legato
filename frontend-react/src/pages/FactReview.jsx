import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { prepareDataForLLM } from '../utils/highlightUtils';
import {
  Box,
  Card,
  Grid,
  GridItem,
  Stack,
  Textarea,
  ScrollArea,
  Button,
  Text,
} from '@chakra-ui/react';
import AppHeader from '../components/common/AppHeader';
import StepsBar, { stepsWidth } from '../components/common/StepsBar';
import LoadingModal from '../components/common/LoadingModal';
import RequestForm from '../components/fact-review/RequestForm';
import ConsultationResult from '../components/fact-review/ConsultationResult';
import EvidenceList from '../components/fact-review/EvidenceList';

function FactReview() {
  const navigate = useNavigate();

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [files, setFiles] = useState([
    { name: '과거_설계_계약서.pdf', description: '' },
    { name: '지급내역.png', description: '' },
  ]);

  const [qaItems, setQaItems] = useState([
    {
      question: '의뢰인은 성범죄 가해자인가요, 피해자인가요?',
      answer: '피해자',
      highlights: [],
    },
    {
      question: '다음 중 어떤 범죄를 당하였나요?',
      answer: '강제추행(성추행)',
      highlights: [],
    },
    {
      question: '의뢰인이 겪은 상황은 다음 중 어디에 해당하나요?',
      answer: '가해자가 폭행, 협박, 약물을 이용하여 의뢰인을 반항할 수 없게 하여 추행함',
      highlights: [],
    },
    {
      question: '가해자는 구체적으로 어떤 행위를 하였나요?',
      answer: '강제로 성기, 가슴, 엉덩이 등 신체부위를 만지는 행위, 강제로 포옹, 백허그 등 껴안는 행위, 강제로 입 맞추는 행위',
      highlights: [],
    },
    {
      question: '강제추행 행위가 일어난 장소는 어디인가요?',
      answer: '모텔, 사우나, 목욕탕 등 숙박업소',
      highlights: [],
    },
    {
      question: '의뢰인의 나이가 어떻게 되나요?',
      answer: '만 19세 이상 (성인)',
      highlights: [],
    },
    {
      question: '의뢰인은 강제추행으로 인해 상해를 입었나요?',
      answer: '아니오',
      highlights: [],
    },
    {
      question: '의뢰인과 가해자의 관계는 어떻게 되나요?',
      answer: '친구, 선후배, 동료 등 지인관계',
      highlights: [],
    },
    {
      question: '의뢰인이 확보한 증거자료는 무엇이 있나요?',
      answer: '가해자가 범행을 인정하는 취지의 대화 내용 (녹음파일, 메시지)',
      highlights: [],
    },
    {
      question: '의뢰인은 가해자를 고소하였나요?',
      answer: '고소 후 구약식 판결을 받은 상태',
      highlights: [],
    },
    {
      question: '가해자는 어떤 입장인가요?',
      answer: '사실을 모두 인정하고 있음',
      highlights: [],
    },
    {
      question: '의뢰인은 어떤 입장인가요?',
      answer: '금전적으로 손해배상까지 받고 싶어요',
      highlights: [],
    },
    {
      question: '가해자에게 전과가 있나요?',
      answer: '다른 종류의 전과 있음',
      highlights: [],
    },
    {
      question: '의뢰인 연령대가 어떻게 되나요?',
      answer: '20대',
      highlights: [],
    },
    {
      question: '변호사님에게 어떤 도움을 받고 싶으신가요?',
      answer: '소송 진행',
      highlights: [],
    },
    {
      question: '의뢰인 거주 지역',
      answer: '서울 관악구',
      highlights: [],
    },
    {
      question: '사건내용',
      answer: '민사 소송을 통해 제가 정신적으로 받은 모든 피해를 조금이나마 보상받고 싶습니다.',
      highlights: [],
    },
  ]);

  const requestBasicInfo = {
    '의뢰서 작성일': '2025년 3월 14일',
    '사건 분류': '성범죄',
  };

  const [consultationGroups, setConsultationGroups] = useState({
    '기초 정보': [
      { label: '의뢰인 이름(닉네임)', value: '수민' },
      { label: '의뢰인 연락처', value: '010-6407-4522' },
      { label: '변호사', value: '박변호' },
      { label: '변호사 연락처', value: '010-****-****' },
    ],
    '상담 내용': [
      { label: '사건명', value: '성폭력(강제추행) 피해에 따른 불법행위 손해배상 청구', highlights: [] },
      {
        label: '사실관계',
        value:
          '2023. 7. 8. 토요일 경 가해자와 송별회 술자리를 가졌는데, 가해자가 피해자의 소장품을 핑계로 숙박업소로 유인한 후, 강제적으로 바지 안에 손을 넣는 등의 중한 추행을 한 사건입니다.',
        highlights: [],
      },
      { label: '상담 결과', value: '불법행위 손해배상 청구 소송 진행', highlights: [] },
      {
        label: '관련 법리',
        value:
          '불법행위 손해배상 청구(일반 민사법리)에 따른 소송입니다.',
        highlights: [],
      },
      { 
        label: '증거 판단', 
        value: '이미 상대가 약식명령(1,000만원)을 받은 사안으로, 약식명령장을 문서송부촉탁 받아 증거로 제출할 예정입니다. - 1301 형사포탈 문자 메시지 존재 - 사건번호 : 서울서부지검 2023형제27420 호', 
        highlights: [] 
      },
      { 
        label: '불리 요소', 
        value: '확정된 형사 사건이 있어, 상대가 부인하거나 부정할 수는 없습니다. 다만, 행위 자체의 수준을 보고 위자료 액수를 줄이겠다는 입장을 밝힐 수는 있습니다.', 
        highlights: [] 
      },
      { label: '승소 예상 금액', value: '2,000만원 전후', highlights: [] },
      { 
        label: '집행 방안', 
        value: '현재 정확히 상대의 재산 내역을 알고 있지는 않으나, 상대가 한참 취업을 하여 일을 할 나이(1993년생)이므로, 급여 압류 등을 진행하여 추심을 지속적으로 해날 수 있을 것으로 보입니다.', 
        highlights: [] 
      },
    ],
    '비용 정보': [
      { label: '착수금', value: '부가세 포함하여 3,300,000원' },
      { label: '성공보수', value: '상대로 부터 지급받은 금액의 5%' },
    ],
  });

  const handleFileChange = (details) => {
    const newFiles = details.acceptedFiles.map((file) => ({
      name: file.name,
      description: '',
      file,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFileDescription = (index, description) => {
    setFiles((prev) =>
      prev.map((file, i) => (i === index ? { ...file, description } : file))
    );
  };

  const saveTemp = () => {
    alert('임시저장 되었습니다.');
  };

  const analyzeIssues = () => {
    // LLM 전송용 데이터 준비
    const llmData = prepareDataForLLM(qaItems, consultationGroups);
    console.log('LLM 전송 데이터:', llmData);
    
    // 쟁점 분석 페이지로 이동하며 데이터 전달
    navigate('/issue-identification', {
      state: {
        requestData: {
          case_request: {
            title: '강제추행 피해자입니다. 변호사비 지원 받고 싶습니다.',
            questions: qaItems.map(item => ({
              question: item.question,
              answer: item.answer
            })),
            created_date: requestBasicInfo['의뢰서 작성일'],
            case_type: requestBasicInfo['사건 분류'],
          },
          consultation_result: {
            case_name: consultationGroups['상담 내용'][0].value,
            facts: consultationGroups['상담 내용'][1].value,
            legal_principle: consultationGroups['상담 내용'][3].value,
            evidence: consultationGroups['상담 내용'][4].value,
            unfavorable_factors: consultationGroups['상담 내용'][5].value,
            expected_amount: consultationGroups['상담 내용'][6].value,
            execution_plan: consultationGroups['상담 내용'][7].value,
            initial_fee: consultationGroups['비용 정보'][0].value,
            success_fee: consultationGroups['비용 정보'][1].value,
            client_name: consultationGroups['기초 정보'][0].value,
            lawyer_name: consultationGroups['기초 정보'][2].value,
          }
        }
      }
    });
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
    <Box minH="100vh">
      <AppHeader />
      <StepsBar />

      <Box
        as="main"
        ml={stepsWidth}
        p={6}
      >
        {/* 메인 2열 레이아웃 */}
        <Grid 
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} 
          gap={2} 
          mb={4}
        >
          {/* 왼쪽 열: 의뢰서 & 상담 결과지 */}
          <GridItem>
            <ScrollArea.Root maxHeight="calc(100vh - 180px)">
              <ScrollArea.Viewport>
                <ScrollArea.Content paddingEnd="3">
                  <Stack gap={4}>
                    <RequestForm
                      basicInfo={requestBasicInfo}
                      title="강제추행 피해자입니다. 변호사비 지원 받고 싶습니다."
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
                  <Stack gap={4}>
              {/* 자료 업로드 */}
              <EvidenceList
                files={files}
                onFileChange={handleFileChange}
                onRemoveFile={removeFile}
                onUpdateDescription={updateFileDescription}
              />

              {/* 심사역 작성 */}
              <Card.Root variant="outline">
                <Card.Body>
                  <Text fontSize="lg" fontWeight={600} mb={4}>
                    심사역 의견
                  </Text>
                  <Textarea
                    placeholder="심사역의 1차 의견을 작성해주세요"
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
          <Box display="flex"></Box>
          <Box display="flex" gap={3}>
          <Button size="lg" variant="outline" onClick={saveTemp} bg="white">
            임시저장
          </Button>
          <Button size="lg" onClick={analyzeIssues}>
            확인
          </Button>
          </Box>
        </Box>

        <LoadingModal
          isVisible={showLoadingModal}
          message="AI가 사실관계를 정리하고 쟁점을 추출하고 있습니다."
        />
      </Box>
    </Box>
  );
}

export default FactReview;

