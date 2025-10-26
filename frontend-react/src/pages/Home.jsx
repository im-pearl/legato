import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'white',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Typography variant="h4" fontWeight={600} color="grey.800">
          심사 AI 데모
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/case-analysis')}
        >
          데모 페이지 가기
        </Button>
      </Box>
    </Box>
  );
}

export default Home;

