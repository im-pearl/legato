import { Box, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minH="100vh"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={8}
      >
        <Text fontSize="3xl" fontWeight={600} color="gray.800">
          심사 AI 맛보기
        </Text>
        <Button
          size="lg"
          colorPalette="gray"
          onClick={() => navigate('/fact-review')}
        >
          맛보기 페이지 가기
        </Button>
      </Box>
    </Box>
  );
}

export default Home;

