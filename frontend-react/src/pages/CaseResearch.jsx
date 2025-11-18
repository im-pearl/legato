import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  Button,
  Text,
  Stack,
  Badge,
  CheckboxCard,
  Spinner,
} from '@chakra-ui/react';
import { LuSparkles } from 'react-icons/lu';
import AppHeader from '../components/common/AppHeader';
import StepsBar, { stepsWidth } from '../components/common/StepsBar';
import PrecedentModal from '../components/case-research/PrecedentModal';
import { useStreaming } from '../hooks/useStreaming';

function CaseResearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPrecedentModal, setShowPrecedentModal] = useState(false);
  const [selectedPrecedent, setSelectedPrecedent] = useState(null);
  const [issues, setIssues] = useState([]);
  const [factsContent, setFactsContent] = useState('');
  const { startStreaming, isStreaming } = useStreaming();
  
  // 스트리밍 중인 데이터
  const [streamingData, setStreamingData] = useState({});
  
  // 중복 실행 방지 (React Strict Mode 대응)
  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    if (location.state?.factsContent) {
      setFactsContent(location.state.factsContent);
    }
    if (location.state?.issues) {
      setIssues(location.state.issues.map(issue => ({
        ...issue,
        precedents: []
      })));
    }
    if (location.state?.requestData && !hasGeneratedRef.current) {
      hasGeneratedRef.current = true;
      // 자동으로 판례 생성
      generatePrecedents();
    }
  }, []);

  /**
   * 판례 생성 (스트리밍)
   */
  const generatePrecedents = async () => {
    setStreamingData({});
    
    let currentIssueTitle = '';
    let currentCaseIndex = -1;
    let currentCaseData = {};
    let tempStreamingData = {};

    await startStreaming(
      '/precedents/stream',
      {
        ...location.state.requestData,
        analysis_result: location.state.factsContent,
        issues_result: location.state.issuesText,
      },
      (element) => {
        console.log('CaseResearch 파싱:', element); // 디버깅
        
        // tag_end에서만 처리 (완성된 내용만 렌더링)
        if (element.type === 'tag_end') {
          if (element.tag.startsWith('issue')) {
            // 쟁점 제목 완성
            currentIssueTitle = element.content.trim();
            console.log('🔵 쟁점 설정:', currentIssueTitle);
          }
          else if (element.tag.startsWith('num')) {
            // 판례 번호 완성
            currentCaseData.caseNumber = element.content.trim();
            console.log('📌 판례번호:', currentCaseData.caseNumber);
            
            // num과 summary가 모두 있으면 즉시 저장
            if (currentCaseData.caseNumber && currentCaseData.summary) {
              console.log('✅ 판례 완료! (num 시점)');
              if (!tempStreamingData[currentIssueTitle]) {
                tempStreamingData[currentIssueTitle] = [];
              }
              tempStreamingData[currentIssueTitle].push({
                caseNumber: currentCaseData.caseNumber,
                summary: currentCaseData.summary,
                selected: true
              });
              console.log('💾 tempStreamingData:', JSON.stringify(tempStreamingData, null, 2));
              setStreamingData({...tempStreamingData});
              
              // 다음 판례를 위해 초기화
              currentCaseData = { caseNumber: '', summary: '' };
            }
          }
          else if (element.tag.startsWith('summary')) {
            // 판례 요지 완성
            currentCaseData.summary = element.content.trim();
            console.log('📝 요지:', currentCaseData.summary);
            
            // num과 summary가 모두 있으면 즉시 저장
            if (currentCaseData.caseNumber && currentCaseData.summary) {
              console.log('✅ 판례 완료! (summary 시점)');
              if (!tempStreamingData[currentIssueTitle]) {
                tempStreamingData[currentIssueTitle] = [];
              }
              tempStreamingData[currentIssueTitle].push({
                caseNumber: currentCaseData.caseNumber,
                summary: currentCaseData.summary,
                selected: true
              });
              console.log('💾 tempStreamingData:', JSON.stringify(tempStreamingData, null, 2));
              setStreamingData({...tempStreamingData});
              
              // 다음 판례를 위해 초기화
              currentCaseData = { caseNumber: '', summary: '' };
            }
          }
        }
      },
      () => {
        // 스트리밍 완료 - issues 배열에 판례 추가
        console.log('🎉 스트리밍 완료!');
        console.log('tempStreamingData:', tempStreamingData);
        console.log('issues 배열:', issues);
        
        setIssues(prev => prev.map(issue => {
          console.log(`🔍 매칭 시도: issue.content="${issue.content}"`);
          const precedents = tempStreamingData[issue.content] || [];
          console.log(`   매칭된 판례 수: ${precedents.length}`);
          
          return {
            ...issue,
            precedents: precedents.map(p => ({
              caseNumber: p.caseNumber,
              summary: p.summary,
              selected: true, // 기본값: 모두 선택
            }))
          };
        }));
      }
    );
  };

  const togglePrecedentSelection = (issueIndex, precedentIndex) => {
    const newIssues = [...issues];
    newIssues[issueIndex].precedents[precedentIndex].selected =
      !newIssues[issueIndex].precedents[precedentIndex].selected;
    setIssues(newIssues);
  };

  const getSelectedPrecedentsCount = () => {
    let count = 0;
    issues.forEach((issue) => {
      issue.precedents?.forEach((precedent) => {
        if (precedent.selected) count++;
      });
    });
    return count;
  };

  const viewFullPrecedent = (precedent) => {
    setSelectedPrecedent(precedent);
    setShowPrecedentModal(true);
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
    
    // 선택된 판례만 필터링하여 전달
    const filteredIssues = issues.map(issue => ({
      ...issue,
      precedents: issue.precedents?.filter(p => p.selected) || []
    }));
    
    // 판례 텍스트 생성
    const precedentsText = filteredIssues.map((issue, issueIdx) => {
      const casesText = issue.precedents.map((precedent, caseIdx) => 
        `@case${caseIdx + 1}\n@num:${precedent.caseNumber}\n@summary:${precedent.summary}\n@end`
      ).join('\n');
      
      return `@issue${issueIdx + 1}:${issue.content}\n${casesText}`;
    }).join('\n\n');
    
    navigate('/final-review', {
      state: {
        factsContent,
        issues: filteredIssues,
        precedentsText,
        requestData: location.state?.requestData,
      }
    });
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

        {/* 판례 검색 결과 */}
        <Card.Root variant="outline" mb={4}>
          <Card.Body>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
              <Text fontSize="lg" fontWeight={600}>
                판례 검색 결과
              </Text>
              {!isStreaming && issues.length > 0 && (
                <Button
                  size="xs"
                  variant="outline"
                  onClick={generatePrecedents}
                  colorPalette="blue"
                >
                  <LuSparkles />
                  AI 재생성
                </Button>
              )}
            </Box>

            {issues.length === 0 && isStreaming && (
              <Box display="flex" justifyContent="center" py={12}>
                <Spinner size="xl" colorPalette="gray" />
              </Box>
            )}

            {issues.map((issue, issueIndex) => (
              <Box
                key={issueIndex}
                mb={6}
                pb={6}
                borderBottomWidth={issueIndex < issues.length - 1 ? '1px' : '0'}
                borderBottomStyle="dashed"
                borderColor="gray.300"
              >
                <Box display="flex" alignItems="flex-start" mb={4}>
                  <Badge
                    size="sm"
                    colorPalette="gray"
                    mr={4}
                    fontWeight={500}
                  >
                    {issueIndex + 1}
                  </Badge>
                  <Text fontSize="md" color="gray.800" fontWeight={400}>
                    {issue.content}
                  </Text>
                </Box>

                <Box ml={10} display="flex" flexDirection="column" gap={4}>
                  {/* 스트리밍 중인 판례 표시 */}
                  {isStreaming && !streamingData[issue.content] && (
                    <Box display="flex" justifyContent="center" py={6}>
                      <Spinner size="md" colorPalette="gray" />
                    </Box>
                  )}
                  
                  {isStreaming && streamingData[issue.content]?.map((precedent, precedentIndex) => (
                    <Box
                      key={`streaming-${precedentIndex}`}
                      p={4}
                      borderWidth="1px"
                      borderColor="gray.300"
                      borderRadius="md"
                      bg="white"
                    >
                      <Text fontWeight={600} color="gray.900" mb={2}>
                        {precedent.caseNumber || '판례 번호 로딩 중...'}
                      </Text>
                      <Text fontSize="sm" color="gray.800" lineHeight={1.6}>
                        {precedent.summary || '요지 로딩 중...'}
                      </Text>
                    </Box>
                  ))}
                  
                  {/* 완료된 판례 (선택 가능) */}
                  {!isStreaming && issue.precedents?.map((precedent, precedentIndex) => (
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
                          <CheckboxCard.Label fontWeight={600} color="gray.900" mb={2}>
                            {precedent.caseNumber}
                          </CheckboxCard.Label>
                          <CheckboxCard.Description fontSize="sm" color="gray.800" lineHeight={1.6} mb={3}>
                            {precedent.summary}
                          </CheckboxCard.Description>
                        </CheckboxCard.Content>
                        <CheckboxCard.Indicator />
                      </CheckboxCard.Control>
                      <CheckboxCard.Addon justifyContent="flex-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewFullPrecedent(precedent)}
                        >
                          전문보기
                        </Button>
                      </CheckboxCard.Addon>
                    </CheckboxCard.Root>
                  ))}
                </Box>
              </Box>
            ))}

            {/* 선택된 판례 수 */}
            {!isStreaming && issues.length > 0 && (
              <Box display="flex" justifyContent="flex-end" mb={4}>
                <Text fontSize="sm" color="gray.700">
                  선택된 판례 수 :{' '}
                  <Text as="span" color="gray.900" fontWeight={500}>
                    {getSelectedPrecedentsCount()}
                  </Text>
                </Text>
              </Box>
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
            <Button 
              size="lg" 
              colorPalette="gray" 
              onClick={finalReview}
              isDisabled={isStreaming || getSelectedPrecedentsCount() === 0}
            >
              최종 검토
            </Button>
          </Box>
        </Box>
        </Box>
      </Box>

      {/* 판례 전문 모달 */}
      <PrecedentModal
        isOpen={showPrecedentModal}
        onClose={() => setShowPrecedentModal(false)}
        precedent={selectedPrecedent}
      />
    </>
  );
}

export default CaseResearch;
