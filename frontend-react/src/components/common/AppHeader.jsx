import { Box, Text, IconButton } from '@chakra-ui/react';
import { LuMenu } from 'react-icons/lu';

function AppHeader({ caseNumber, caseTitle, onToggleSidebar, sidebarOpen }) {
  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      h="56px"
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
      display="flex"
      alignItems="center"
      px={3}
      gap={1.5}
      flexShrink={0}
      zIndex={100}
    >
      {!sidebarOpen && (
        <IconButton
          onClick={onToggleSidebar}
          size="sm"
          variant="ghost"
          aria-label="사이드바 열기"
        >
          <LuMenu />
        </IconButton>
      )}
      <Box
        px={2}
        py={1}
        bg="gray.100"
        color="gray.900"
        fontWeight={600}
        fontSize="0.875rem"
        borderRadius="md"
        h="28px"
        display="flex"
        alignItems="center"
      >
        {caseNumber}번 신청
      </Box>
      <Text
        fontSize="md"
        fontWeight={500}
        color="gray.800"
      >
        {caseTitle}
      </Text>
    </Box>
  );
}

export default AppHeader;

