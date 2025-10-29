import { Box, Card, Text, Stack } from '@chakra-ui/react';

function ConsultationResult({ groups }) {
  return (
    <Card.Root variant="outline">
      <Card.Body>
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Text fontSize="lg" fontWeight={600}>
            상담 결과지
          </Text>
        </Box>

        {Object.entries(groups).map(([groupName, items]) => (
          <Box key={groupName} mb={4} pb={4} borderBottomWidth="1px" borderColor="gray.200">
            <Text fontSize="sm" fontWeight={600} color="gray.700" mb={3}>
              {groupName}
            </Text>
            <Stack gap={4}>
              {items.map((item, index) => (
                <Box key={index}>
                  <Text fontSize="xs" color="gray.600" mb={1}>
                    {item.label}
                  </Text>
                  <Text
                    fontSize="sm"
                    color="gray.800"
                    p={2}
                    borderRadius="md"
                    _hover={{ bg: 'gray.100' }}
                    cursor="text"
                    userSelect="text"
                    whiteSpace="pre-wrap"
                    wordBreak="break-word"
                  >
                    {item.value}
                  </Text>
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </Card.Body>
    </Card.Root>
  );
}

export default ConsultationResult;

