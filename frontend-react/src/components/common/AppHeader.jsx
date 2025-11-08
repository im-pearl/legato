import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Text, Tabs } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/react';

function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  // AI 심사 관련 페이지 체크
  const isAIReview = location.pathname.includes('/fact-review') || 
                     location.pathname.includes('/issue-identification') || 
                     location.pathname.includes('/case-research') || 
                     location.pathname.includes('/final-review');

  const currentTab = isAIReview ? 'ai-review' : 'prompt-edit';

  const handleTabChange = (details) => {
    if (details.value === 'ai-review') {
      navigate('/fact-review');
    }
    // 'prompt-edit'는 아무 동작 안 함
  };

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      bg="white"
      flexShrink={0}
      zIndex={100}
    >
      {/* 첫 번째 줄: 로고 + 유저 */}
      <Box
        h="56px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={6}
      >
        <Text fontSize="lg" fontWeight={700} color="gray.900">
          심사 AI
        </Text>

        <Box
          display="flex"
          alignItems="center"
          gap={3}
          cursor="pointer"
          px={2}
          py={1}
          borderRadius="lg"
          transition="all 0.2s"
          _hover={{ bg: 'gray.50' }}
        >
          <Avatar.Root size="xs" bg="gray.700" color="white">
            <Avatar.Fallback name="정범환" />
          </Avatar.Root>
          <Text fontSize="0.9rem" fontWeight={500} color="gray.700">
            정범환 변호사
          </Text>
        </Box>
      </Box>

      {/* 두 번째 줄: 탭 네비게이션 */}
      <Box px={6}>
        <Tabs.Root
          value={currentTab}
          onValueChange={handleTabChange}
          variant="line"
          size="md"
        >
          <Tabs.List>
            <Tabs.Trigger value="ai-review">
              AI 심사
            </Tabs.Trigger>
            <Tabs.Trigger value="prompt-edit">
              프롬프트 수정
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </Box>
    </Box>
  );
}

export default AppHeader;

