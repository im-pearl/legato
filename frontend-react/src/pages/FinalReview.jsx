import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  Button,
  Text,
  Textarea,
  Stack,
  For,
  Spinner,
} from '@chakra-ui/react';
import { Slider } from '@chakra-ui/react';
import { LuSparkles } from 'react-icons/lu';
import AppHeader from '../components/common/AppHeader';
import StepsBar, { stepsWidth } from '../components/common/StepsBar';
import PreviewReportModal from '../components/final-review/PreviewReportModal';
import PrecedentModal from '../components/case-research/PrecedentModal';
import { useStreaming } from '../hooks/useStreaming';

function FinalReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPrecedentModal, setShowPrecedentModal] = useState(false);
  const [selectedPrecedent, setSelectedPrecedent] = useState(null);
  const [winProbability, setWinProbability] = useState([70, 80]);
  const [winProbabilityDescription, setWinProbabilityDescription] = useState('');
  const [issues, setIssues] = useState([]);
  const [factsContent, setFactsContent] = useState('');
  const { startStreaming, isStreaming } = useStreaming();
  
  // 스트리밍 중인 데이터
  const [streamingJudgments, setStreamingJudgments] = useState({});
  
  // 중복 실행 방지 (React Strict Mode 대응)
  const hasGeneratedRef = useRef(false);

  const clientName = '김건축';
  const requestNumber = 'CS-20250314-0042';
  const lawyerName = '박변호 변호사';
  const receiptDate = '2025년 03월 14일';

  useEffect(() => {
    if (location.state?.factsContent) {
      setFactsContent(location.state.factsContent);
    }
    if (location.state?.issues) {
      setIssues(location.state.issues.map(issue => ({
        ...issue,
        subsumption: ''
      })));
    }
    if (location.state?.requestData && !hasGeneratedRef.current) {
      hasGeneratedRef.current = true;
      // 자동으로 보고서 생성
      generateReport();
    }
  }, []);

  /**
   * 보고서 생성 (스트리밍)
   */
  const generateReport = async () => {
    setStreamingJudgments({});
    setWinProbabilityDescription('');
    
    let currentIssueTitle = '';
    let currentJudgment = '';
    let probData = { min: 0, max: 0, reason: '' };
    let tempJudgments = {};

    await startStreaming(
      '/report/stream',
      {
        ...location.state.requestData,
        analysis_result: location.state.factsContent,
        issues_result: location.state.issues.map((issue, idx) => 
          `@issue${idx + 1}\n${issue.content}\n@end`
        ).join('\n\n'),
        precedents_result: location.state.precedentsText,
      },
      (element) => {
        console.log('FinalReview 파싱:', element); // 디버깅
        
        // tag_end에서만 처리 (완성된 내용만 렌더링)
        if (element.type === 'tag_end') {
          if (element.tag.startsWith('issue')) {
            // 쟁점 판단 완료 - "쟁점제목: 판단" 형식에서 파싱
            const content = element.content.trim();
            const match = content.match(/^([^:\n]+):\s*(.+)/s);
            if (match) {
              const issueTitle = match[1].trim();
              const judgment = match[2].trim();
              tempJudgments[issueTitle] = judgment;
              setStreamingJudgments({...tempJudgments});
            }
          }
          else if (element.tag === 'prob') {
            // 승소가능성 파싱
            const content = element.content.trim();
            const match = content.match(/(\d+)~(\d+)/);
            if (match) {
              const min = parseInt(match[1]);
              const max = parseInt(match[2]);
              
              setWinProbability([min, max]);
              
              // 근거 추출 (범위 다음 줄)
              const lines = content.split('\n');
              const reasonLines = lines.slice(1).filter(line => line.trim() && !line.includes('~'));
              const reason = reasonLines.map(line => line.replace(/^-\s*/, '')).join(' ');
              
              setWinProbabilityDescription(reason);
            }
          }
        }
      },
      () => {
        // 스트리밍 완료 - issues 배열에 판단 추가
        setIssues(prev => prev.map(issue => ({
          ...issue,
          subsumption: tempJudgments[issue.content] || issue.subsumption
        })));
      }
    );
  };

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

  const viewFullPrecedent = (precedent) => {
    setSelectedPrecedent(precedent);
    setShowPrecedentModal(true);
  };

  return (
    <>
      <Box minH="100vh">
        <AppHeader />
        <StepsBar />

        <Box
          as="main"
          ml={stepsWidth}
          p={6}
        >
        {/* 사실관계 */}
        <Card.Root variant="outline" mb={4}>
          <Card.Body>
            <Text fontSize="lg" fontWeight={600} mb={4}>
              사실관계
            </Text>
            <Text fontSize="sm" color="gray.800" whiteSpace="pre-line" lineHeight={1.6}>
              {factsContent}
            </Text>
          </Card.Body>
        </Card.Root>

        {/* AI 재생성 버튼 */}
        {!isStreaming && issues.length > 0 && (
          <Box display="flex" justifyContent="flex-end" mb={4}>
            <Button
              size="sm"
              variant="outline"
              onClick={generateReport}
              colorPalette="blue"
            >
              <LuSparkles />
              AI 재생성
            </Button>
          </Box>
        )}

        {/* 로딩 중 */}
        {isStreaming && issues.length === 0 && (
          <Box display="flex" justifyContent="center" py={12}>
            <Spinner size="md" colorPalette="gray" />
          </Box>
        )}

        {/* 쟁점 및 포섭 */}
        <For each={issues}>
          {(issue, issueIndex) => (
            <Card.Root key={issueIndex} variant="outline" mb={4}>
              <Card.Body>
                <Text fontSize="lg" fontWeight={600} mb={2} color="gray.900">
                  쟁점 {issueIndex + 1}. {issue.content}
                </Text>

                <Text fontSize="md" fontWeight={600} color="gray.800" mb={4} mt={6}>
                  관련 판례
                </Text>
                <Stack gap={4} mb={4}>
                  <For each={issue.precedents || []}>
                    {(precedent, index) => (
                      <Box key={index} p={4} borderWidth="1px" borderRadius="md">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Text fontSize="md" fontWeight={500} color="gray.900" flex={1}>
                            {precedent.caseNumber}
                          </Text>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => viewFullPrecedent(precedent)}
                            flexShrink={0}
                          >
                            전문보기
                          </Button>
                        </Box>
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
                
                {isStreaming && !streamingJudgments[issue.content] && (
                  <Box display="flex" justifyContent="center" py={8}>
                    <Spinner size="md" colorPalette="gray" />
                  </Box>
                )}
                
                {(!isStreaming || streamingJudgments[issue.content]) && (
                  <Textarea
                    value={
                      isStreaming 
                        ? streamingJudgments[issue.content]
                        : (issue.subsumption || '')
                    }
                    onChange={(e) => {
                      if (!isStreaming) {
                        const newIssues = [...issues];
                        newIssues[issueIndex].subsumption = e.target.value;
                        setIssues(newIssues);
                      }
                    }}
                    rows={4}
                    fontFamily="inherit"
                    fontSize="0.95rem"
                    lineHeight={1.5}
                    isDisabled={isStreaming}
                  />
                )}
              </Card.Body>
            </Card.Root>
          )}
        </For>

        {/* 승소가능성 */}
        <Card.Root variant="outline" mb={4}>
          <Card.Body>
            <Text fontSize="lg" fontWeight={600} mb={4}>
              승소가능성
            </Text>
            <Box mb={4}>
              <Text fontSize="md" fontWeight={600} color="gray.900" mb={3}>
                {winProbability[0]}~{winProbability[1]}%
              </Text>
              <Slider.Root
                value={winProbability}
                onValueChange={(e) => {
                  if (!isStreaming) {
                    setWinProbability(e.value);
                  }
                }}
                min={0}
                max={100}
                step={5}
                disabled={isStreaming}
              >
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Range />
                  </Slider.Track>
                  <Slider.Thumbs />
                </Slider.Control>
              </Slider.Root>
            </Box>
            {isStreaming && !winProbabilityDescription && (
              <Box display="flex" justifyContent="center" py={8}>
                <Spinner size="md" colorPalette="gray" />
              </Box>
            )}
            
            {(!isStreaming || winProbabilityDescription) && (
              <Textarea
                value={winProbabilityDescription}
                onChange={(e) => {
                  if (!isStreaming) {
                    setWinProbabilityDescription(e.target.value);
                  }
                }}
                rows={4}
                fontFamily="inherit"
                fontSize="0.95rem"
                lineHeight={1.5}
                isDisabled={isStreaming}
                placeholder="승소가능성 근거를 입력하세요"
              />
            )}
          </Card.Body>
        </Card.Root>

        {/* 액션 버튼 */}
        <Box display="flex" justifyContent="space-between" gap={4}>
          <Button size="lg" variant="outline" onClick={goBack} bg="white" isDisabled={isStreaming}>
            이전으로
          </Button>
          <Box display="flex" gap={3}>
            <Button size="lg" variant="outline" onClick={saveTemp} bg="white" isDisabled={isStreaming}>
              임시저장
            </Button>
            <Button size="lg" colorPalette="gray" onClick={openPreviewModal} isDisabled={isStreaming}>
              저장
            </Button>
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
        winProbability={winProbability}
        winProbabilityDescription={winProbabilityDescription}
      />

      {/* 판례 전문 모달 */}
      <PrecedentModal
        isOpen={showPrecedentModal}
        onClose={() => setShowPrecedentModal(false)}
        precedent={selectedPrecedent}
      />
    </>
  );
}

export default FinalReview;
