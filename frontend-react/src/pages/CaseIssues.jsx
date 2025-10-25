import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  TextField,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AppSidebar, { DrawerHeader } from '../components/common/AppSidebar';
import LoadingModal from '../components/common/LoadingModal';

function CaseIssues() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [issues, setIssues] = useState([
    { content: '계약상 대금이 00,000,000 원으로 정해졌다고 볼 수 있는지 여부' },
    { content: '상대방에게 부당이득반환책임이 성립하는지 여부' },
  ]);

  const factsContent = `1. 의뢰인은 상대방으로부터 **시 **구 **번지 오피스텔 신축설계(면적 00,000,000 m2 규모)의 건축설계(건축심의, 경관심의, 건축인허가, 구조 심의) 용역(이하 '이 사건 용역')을 의뢰받아 완료하였음. (계약서 없음)

- 건축심의, 건축허가, 건축구조심의 완료 및 건축물 착공연기신청 완료(착공연기 기간 내)

2. 상대방은 의뢰인에게 총 0,000,000원을 입금하였음(지급내역))
- 1차 지급: 0,000,000원 입금(입금자 **주식회사)
- 2차 지급: 0,000,000원 입금(입금자 **주식회사)
- 3차 지급: 0,000,000원 입금(입금자 **주식회사)

3. 의뢰인은 이 사건 용역에 대하여 평당 0만 원, 총 00,000,000 원으로 견적서를 작성하였음. (의뢰인 단독 날인)

4. 의뢰인은 이 사건 용역의 설계비가 평당 00,000원이라고 주장하며, 이에 용역대금은 약 0원이라고 주장함. (건축 설계비 산정근거: 평 × 00,000원, 건물규모: 00,000,000 m2 (0,000평))

5. 이에 의뢰인은 대금 잔금 약 1억 원을 상대방에게 청구하고자 함.`;

  const handleMenuChange = (menuId) => {
    console.log('메뉴 변경:', menuId);
  };

  const addNewIssue = () => {
    setIssues([...issues, { content: '쟁점 내용을 입력하세요.' }]);
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
    navigate('/case-analysis');
  };

  const saveTemp = () => {
    alert('임시저장 되었습니다.');
  };

  const searchCases = () => {
    setShowLoadingModal(true);
    setTimeout(() => {
      setShowLoadingModal(false);
      navigate('/case-search');
    }, 1500);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppSidebar open={drawerOpen} onToggle={() => setDrawerOpen(!drawerOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: 'grey.50',
          minHeight: '100vh',
        }}
      >
        {/* 사실관계 섹션 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              사실관계
            </Typography>
            <TextField
              multiline
              fullWidth
              minRows={10}
              defaultValue={factsContent}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'inherit',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                },
              }}
            />
          </CardContent>
        </Card>

        {/* 쟁점 섹션 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                쟁점
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={addNewIssue}
                sx={{ minWidth: 'auto' }}
              >
                추가
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {issues.map((issue, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 2,
                    border: 1,
                    borderColor: 'grey.300',
                    borderRadius: 1.5,
                    bgcolor: 'white',
                    transition: 'all 0.2s',
                    '&:focus-within': {
                      borderColor: 'primary.main',
                      boxShadow: 1,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.500',
                      color: 'white',
                      borderRadius: 1,
                      fontWeight: 500,
                      flexShrink: 0,
                      fontSize: '0.9rem',
                    }}
                  >
                    {index + 1}
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    value={issue.content}
                    onChange={(e) => updateIssue(index, e.target.value)}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        fontSize: '0.95rem',
                        lineHeight: 1.5,
                      },
                    }}
                  />

                  <IconButton
                    size="small"
                    onClick={() => deleteIssue(index)}
                    sx={{
                      color: 'error.main',
                      flexShrink: 0,
                      '&:hover': {
                        bgcolor: 'error.lighter',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* 액션 버튼 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button variant="outlined" onClick={goBack}>
            이전으로
          </Button>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button variant="outlined" onClick={saveTemp}>
              임시저장
            </Button>
            <Button variant="contained" onClick={searchCases}>
              판례검색
            </Button>
          </Box>
        </Box>

        <LoadingModal
          isVisible={showLoadingModal}
          message="AI가 사실관계와 쟁점을 기반으로 판례를 검색하고 있습니다."
        />
      </Box>
    </Box>
  );
}

export default CaseIssues;

