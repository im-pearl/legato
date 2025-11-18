import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  Button,
  Text,
  Textarea,
  IconButton,
  Stack,
  Spinner,
} from '@chakra-ui/react';
import { LuPlus, LuX, LuSparkles } from 'react-icons/lu';
import AppHeader from '../components/common/AppHeader';
import StepsBar, { stepsWidth } from '../components/common/StepsBar';
import { useStreaming } from '../hooks/useStreaming';

function IssueIdentification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [issues, setIssues] = useState([]);
  const [factsContent, setFactsContent] = useState('');
  const { startStreaming, isStreaming } = useStreaming();
  
  // 스트리밍 중인 쟁점 임시 저장
  const [streamingIssues, setStreamingIssues] = useState([]);

  // 페이지 진입 시 자동으로 분석 시작
  useEffect(() => {
    if (location.state?.requestData) {
      // FactReview에서 넘어온 데이터로 자동 분석
      analyzeFactsAndIssues(location.state.requestData);
    }
  }, []);

  /**
   * 사실관계 + 쟁점 분석 (순차 스트리밍)
   */
  const analyzeFactsAndIssues = async (requestData) => {
    setFactsContent('');
    setIssues([]);
    setStreamingIssues([]);
    
    // 1단계: 사실관계 스트리밍
    let analysisText = '';
    await startStreaming(
      '/analysis/stream',
      requestData,
      (element) => {
        if (element.type === 'text' || element.type === 'tag_content') {
          analysisText += element.content;
          setFactsContent(analysisText);
        }
      },
      async () => {
        // 사실관계 완료 후 2단계: 쟁점 분석
        await analyzeIssues({ ...requestData, analysis_result: analysisText });
      }
    );
  };

  /**
   * 쟁점 분석 (스트리밍)
   */
  const analyzeIssues = async (requestData) => {
    let currentIssueIndex = -1;
    let currentIssueContent = '';

    await startStreaming(
      '/issues/stream',
      requestData,
      (element) => {
        if (element.type === 'tag_start' && element.tag.startsWith('issue')) {
          // 새로운 쟁점 시작
          currentIssueIndex++;
          currentIssueContent = '';
          
          setStreamingIssues(prev => [
            ...prev,
            { content: '', isStreaming: true }
          ]);
        }
        else if (element.type === 'tag_content' && element.tag.startsWith('issue')) {
          // 쟁점 내용 업데이트
          currentIssueContent += element.content;
          
          setStreamingIssues(prev => {
            const newIssues = [...prev];
            if (newIssues[currentIssueIndex]) {
              newIssues[currentIssueIndex].content = currentIssueContent;
            }
            return newIssues;
          });
        }
        else if (element.type === 'tag_end' && element.tag.startsWith('issue')) {
          // 쟁점 완료
          setStreamingIssues(prev => {
            const newIssues = [...prev];
            if (newIssues[currentIssueIndex]) {
              newIssues[currentIssueIndex].isStreaming = false;
              newIssues[currentIssueIndex].content = element.content;
            }
            return newIssues;
          });
        }
      },
      () => {
        // 스트리밍 완료
        setIssues(streamingIssues.map(issue => ({ content: issue.content })));
      }
    );
  };

  const addNewIssue = () => {
    setIssues([...issues, { content: '' }]);
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
    // 다음 페이지로 이동하며 데이터 전달
    const issuesText = issues.map((issue, idx) => 
      `@issue${idx + 1}\n${issue.content}\n@end`
    ).join('\n\n');
    
    navigate('/case-research', {
      state: {
        factsContent,
        issuesText,
        issues,
        requestData: location.state?.requestData,
      }
    });
  };

  // 스트리밍 중이거나 완료된 쟁점을 표시
  const displayIssues = isStreaming ? streamingIssues : issues;

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
        <Card.Root variant="outline" mb={4}>
          <Card.Body>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Text fontSize="lg" fontWeight={600}>
                사실관계
              </Text>
              {!isStreaming && factsContent && (
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => analyzeFactsAndIssues(location.state?.requestData)}
                  colorPalette="blue"
                >
                  <LuSparkles />
                  AI 재생성
                </Button>
              )}
            </Box>
            
            {isStreaming && !factsContent && (
              <Box display="flex" justifyContent="center" py={20}>
                <Spinner size="xl" colorPalette="gray" />
              </Box>
            )}
            
            {(!isStreaming || factsContent) && (
              <Textarea
                value={factsContent}
                onChange={(e) => !isStreaming && setFactsContent(e.target.value)}
                rows={10}
                fontFamily="inherit"
                lineHeight={1.5}
                isDisabled={isStreaming}
                placeholder="사실관계를 입력하세요"
              />
            )}
          </Card.Body>
        </Card.Root>

        {/* 쟁점 섹션 */}
        <Card.Root variant="outline" mb={4}>
          <Card.Body>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Text fontSize="lg" fontWeight={600}>
                쟁점
              </Text>
              <Button
                size="xs"
                variant="subtle"
                onClick={addNewIssue}
                isDisabled={isStreaming}
              >
                <LuPlus />
                추가
              </Button>
            </Box>

            {displayIssues.length === 0 && !isStreaming && (
              <Text color="gray.500" textAlign="center" py={8}>
                쟁점이 자동으로 생성됩니다...
              </Text>
            )}

            {displayIssues.length === 0 && isStreaming && (
              <Box display="flex" justifyContent="center" py={8}>
                <Spinner size="lg" colorPalette="gray" />
              </Box>
            )}

            <Stack gap={4}>
              {displayIssues.map((issue, index) => (
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
                    mt="8px"
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
                    fontSize="md"
                    lineHeight={1.5}
                    flex={1}
                    placeholder="쟁점을 입력해주세요"
                    isDisabled={issue.isStreaming || isStreaming}
                  />

                  {!issue.isStreaming && !isStreaming && (
                    <IconButton
                      size="sm"
                      variant="ghost"
                      colorPalette="gray"
                      onClick={() => deleteIssue(index)}
                      flexShrink={0}
                      aria-label="삭제"
                    >
                      <LuX />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Stack>
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
              onClick={searchCases}
              isDisabled={isStreaming || displayIssues.length === 0}
            >
              확인
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default IssueIdentification;

