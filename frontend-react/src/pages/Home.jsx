import { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AppSidebar, { DrawerHeader } from '../components/common/AppSidebar';
import AppHeader from '../components/common/AppHeader';

function Home() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppSidebar open={drawerOpen} onToggle={() => setDrawerOpen(!drawerOpen)} />
      
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <AppHeader caseNumber="12345" caseTitle="강제추행 피해자입니다" />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
            padding: 2,
          }}
        >
      <Container maxWidth="md">
        <Card
          sx={{
            padding: 4,
            borderRadius: 4,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {/* 로고 */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4L4 14V34L24 44L44 34V14L24 4Z" fill="#008F7F" />
                <path d="M24 24V44L44 34V14L24 4V24Z" fill="#006C63" />
                <path d="M24 4V24L4 14L24 4Z" fill="#1AC6AC" />
                <path d="M24 24V44L4 34V14L24 24Z" fill="#008F7F" />
                <path d="M24 4L44 14L24 24L4 14L24 4Z" fill="#33D8BE" />
              </svg>
              <Typography variant="h3" component="h1" fontWeight={700} color="text.primary">
                심사봇 목업
              </Typography>
            </Box>

            {/* 설명 */}
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ maxWidth: 600 }}>
              심사봇 목업입니다. 백엔드 아직 없고 뜨는 콘텐츠는 제가 임의로 넣은 데이터들입니다.
            </Typography>

            {/* 기능 카드들 */}
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                justifyContent: 'center',
                flexWrap: 'wrap',
                width: '100%',
                mt: 2,
              }}
            >
              {[
                {
                  title: '쟁점 추출',
                  description: '사건의 법적 쟁점을 추출',
                },
                {
                  title: '판례 검색',
                  description: '자연어를 기반으로 관련 판례를 검색',
                },
                {
                  title: '최종 검토',
                  description: '사건의 내용과 판례를 분석하여 포섭하고 승소가능성을 검토합니다',
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  sx={{
                    flex: 1,
                    minWidth: 200,
                    maxWidth: 250,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* 시작 버튼 */}
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/case-analysis')}
              sx={{
                mt: 2,
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              목업 페이지 가기
            </Button>
          </CardContent>
        </Card>
      </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default Home;

