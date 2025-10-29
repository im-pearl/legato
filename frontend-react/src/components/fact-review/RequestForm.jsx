import { Box, Card, Text, Grid, GridItem } from '@chakra-ui/react';

function RequestForm({ basicInfo, title, qaItems }) {
  return (
    <Card.Root variant="outline">
      <Card.Body>
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Text fontSize="lg" fontWeight={600}>
            의뢰서
          </Text>
        </Box>

        <Box mb={4} pb={4} borderBottomWidth="1px" borderColor="gray.200">
          <Text fontSize="sm" fontWeight={600} color="gray.700" mb={3}>
            의뢰서 정보
          </Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            {Object.entries(basicInfo).map(([label, value]) => (
              <GridItem key={label}>
                <Text fontSize="xs" color="gray.600" mb={1}>
                  {label}
                </Text>
                <Text fontSize="sm" fontWeight={500}>
                  {value}
                </Text>
              </GridItem>
            ))}
          </Grid>
        </Box>

        <Box mb={4} pb={4} borderBottomWidth="1px" borderColor="gray.200">
          <Text fontSize="sm" fontWeight={600} color="gray.700" mb={2}>
            의뢰서 제목
          </Text>
          <Text fontSize="sm" color="gray.800">
            {title}
          </Text>
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight={600} color="gray.700" mb={3}>
            질문 및 답변
          </Text>
          {qaItems.map((item, index) => (
            <Box key={index} mb={3}>
              <Text fontSize="sm" fontWeight={500} color="gray.800" mb={1}>
                {index + 1}. {item.question}
              </Text>
              <Text
                fontSize="sm"
                color="gray.700"
                p={2}
                borderRadius="md"
                bg="white"
                _hover={{ bg: 'gray.100' }}
                cursor="text"
                userSelect="text"
              >
                {item.answer}
              </Text>
            </Box>
          ))}
        </Box>
      </Card.Body>
    </Card.Root>
  );
}

export default RequestForm;

