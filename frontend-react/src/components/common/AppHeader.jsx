import { Box, Text } from '@chakra-ui/react';

function AppHeader({ caseNumber, caseTitle }) {
  return (
    <Box
      as="header"
      h="56px"
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
      display="flex"
      alignItems="center"
      px={3}
      gap={1.5}
      flexShrink={0}
    >
      <Box
        px={2}
        py={1}
        bg="teal.50"
        color="teal.700"
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

