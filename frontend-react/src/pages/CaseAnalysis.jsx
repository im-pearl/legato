import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  Link,
  IconButton,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  InsertDriveFile as FileIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import AppSidebar, { DrawerHeader } from '../components/common/AppSidebar';
import ProgressBar from '../components/common/ProgressBar';
import LoadingModal from '../components/common/LoadingModal';

function CaseAnalysis() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState('yellow');
  const [files, setFiles] = useState([
    { name: '과거_설계_계약서.pdf', highlight: false },
    { name: '지급내역.png', highlight: false },
  ]);

  const [qaItems, setQaItems] = useState([
    {
      question: '의뢰인이 청구하고자 하는 금액은 얼마인가요?',
      answer: '1억 원',
      highlights: [],
    },
    {
      question: '문제가 발생한 연도는 언제인가요?',
      answer: '2025',
      highlights: [],
    },
    {
      question: '의뢰인이 겪고 있는 상황은 무엇인가요?',
      answer: '건축사사무소를 운영하며, 설계계약서 없이 진행된 건축허가 후 잔금 미지급 문제가 발생했습니다.',
      highlights: [],
    },
    {
      question: '상대방의 입장은 무엇인가요?',
      answer: '잔금 지급 의사 없음',
      highlights: [],
    },
    {
      question: '변호사님에게 어떤 도움을 받고 싶으신가요?',
      answer: '소송 진행 및 분쟁/합의 지원',
      highlights: [],
    },
    {
      question: '사건내용',
      answer: '설계용역 대금 회수와 관련하여 잔금이 미지급된 문제로 인해 법적 대응이 필요한 상황입니다.',
      highlights: [],
    },
  ]);

  const progressSteps = [
    { id: 'review', label: '사건 검토' },
    { id: 'analysis', label: '쟁점 분석' },
    { id: 'proposal', label: '제안서 작성' },
    { id: 'final', label: '최종 검토' },
  ];

  const requestBasicInfo = {
    '의뢰서 작성일': '2025년 3월 14일',
    '사건 분류': '일반 민사',
  };

  const consultationGroups = {
    '기초 정보': [
      { label: '의뢰인 닉네임', value: '김건축', highlights: [] },
      { label: '의뢰인 연락처', value: '010-****-****', highlights: [] },
      { label: '변호사', value: '박변호', highlights: [] },
      { label: '변호사 연락처', value: '010-****-****', highlights: [] },
    ],
    '상담 내용': [
      { label: '사건명', value: '건축설계용역 미수금 회수', highlights: [] },
      {
        label: '사실관계',
        value:
          '소송의뢰인은 건축설계용역을 수행했으나, 상대방은 잔금 일부만 지급하고 나머지는 지급 거부하고 있습니다.',
        highlights: [],
      },
      { label: '상담 결과', value: '소송 진행 및 분쟁, 합의 지원 필요', highlights: [] },
      {
        label: '관련 법리',
        value:
          '상법 제61조는 상인이 그 영업범위 내에서 타인을 위하여 행위를 한 때에는 이에 대하여 상당한 보수를 청구할 수 있다라고 규정하고 있다...',
        highlights: [],
      },
      { label: '증거 판단', value: '업무 수행 증거 및 일부 지급 증거 존재', highlights: [] },
      { label: '불리 요소', value: '계약서 미작성으로 지급 기준 불명확', highlights: [] },
      { label: '승소 예상 금액', value: '3억7천만원', highlights: [] },
      { label: '집행 방안', value: '상대방 보유 부동산 등을 통한 집행 가능', highlights: [] },
    ],
    '비용 정보': [
      { label: '착수금', value: '000,000원', highlights: [] },
      { label: '성공보수', value: '회수 금액의 0%', highlights: [] },
    ],
  };

  const handleMenuChange = (menuId) => {
    console.log('메뉴 변경:', menuId);
  };

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    selectedFiles.forEach((file) => {
      setFiles((prev) => [...prev, { name: file.name, highlight: false, file }]);
    });
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    droppedFiles.forEach((file) => {
      setFiles((prev) => [...prev, { name: file.name, highlight: false, file }]);
    });
  };

  const toggleFileHighlight = (index) => {
    setFiles((prev) =>
      prev.map((file, i) => (i === index ? { ...file, highlight: !file.highlight } : file))
    );
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const saveTemp = () => {
    alert('임시저장 되었습니다.');
  };

  const analyzeIssues = () => {
    setShowLoadingModal(true);
    setTimeout(() => {
      setShowLoadingModal(false);
      navigate('/case-issues');
    }, 1500);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppSidebar activeMenu="case-review" open={drawerOpen} onToggle={() => setDrawerOpen(!drawerOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: 'grey.50',
          minHeight: '100vh',
        }}
      >
        <ProgressBar steps={progressSteps} completedSteps={[]} activeStep="review" />

        {/* 하이라이터 툴바 */}
        <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" fontWeight={500} color="grey.700">
            하이라이터
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 217, 102, 0.5)',
                border: activeHighlight === 'yellow' ? '2px solid rgba(255, 167, 38, 0.8)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
              onClick={() => setActiveHighlight('yellow')}
            />
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: 'rgba(150, 230, 150, 0.5)',
                border: activeHighlight === 'green' ? '2px solid rgba(76, 175, 80, 0.8)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
              onClick={() => setActiveHighlight('green')}
            />
          </Box>
        </Paper>

        {/* 메인 2열 레이아웃 */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* 왼쪽 열: 의뢰서 & 상담 결과지 */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 의뢰서 */}
            <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      의뢰서
                    </Typography>
                    <Link href="#" underline="hover" fontSize="0.875rem" fontWeight={500}>
                      자세히 보기
                    </Link>
                  </Box>

                  <Box sx={{ mb: 2, pb: 2, borderBottom: 1, borderColor: 'grey.200' }}>
                    <Typography variant="subtitle2" fontWeight={600} color="grey.700" mb={1.5}>
                      의뢰서 정보
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(requestBasicInfo).map(([label, value]) => (
                        <Grid item xs={6} key={label}>
                          <Typography variant="caption" color="grey.600" display="block">
                            {label}
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {value}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <Box sx={{ mb: 2, pb: 2, borderBottom: 1, borderColor: 'grey.200' }}>
                    <Typography variant="subtitle2" fontWeight={600} color="grey.700" mb={1}>
                      의뢰서 제목
                    </Typography>
                    <Typography variant="body2" color="grey.800">
                      계약서 작성 없이 설계용역을 했는데 터무니없이 낮은 금액을 받았어요
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} color="grey.700" mb={1.5}>
                      질문 및 답변
                    </Typography>
                    {qaItems.map((item, index) => (
                      <Box key={index} sx={{ mb: 1.5 }}>
                        <Typography variant="body2" fontWeight={500} color="grey.800" mb={0.5}>
                          {index + 1}. {item.question}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="grey.700"
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            bgcolor: 'white',
                            '&:hover': { bgcolor: 'grey.100' },
                            cursor: 'text',
                            userSelect: 'text',
                          }}
                        >
                          {item.answer}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* 상담 결과지 */}
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      상담 결과지
                    </Typography>
                    <Link href="#" underline="hover" fontSize="0.875rem" fontWeight={500}>
                      자세히 보기
                    </Link>
                  </Box>

                  {Object.entries(consultationGroups).map(([groupName, items]) => (
                    <Box key={groupName} sx={{ mb: 2, pb: 2, borderBottom: 1, borderColor: 'grey.200' }}>
                      <Typography variant="subtitle2" fontWeight={600} color="grey.700" mb={1.5}>
                        {groupName}
                      </Typography>
                      <Grid container spacing={2}>
                        {items.map((item, index) => (
                          <Grid item xs={groupName === '상담 내용' ? 12 : 6} key={index}>
                            <Typography variant="caption" color="grey.600" display="block">
                              {item.label}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="grey.800"
                              sx={{
                                p: 0.75,
                                borderRadius: 1,
                                '&:hover': { bgcolor: 'grey.100' },
                                cursor: 'text',
                                userSelect: 'text',
                              }}
                            >
                              {item.value}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ))}
                </CardContent>
              </Card>
          </Box>

          {/* 오른쪽 열: 자료 업로드 & 심사역 작성 */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 자료 업로드 */}
            <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    자료 업로드
                  </Typography>

                  <Box
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    sx={{
                      p: 4,
                      border: '2px dashed',
                      borderColor: 'grey.300',
                      borderRadius: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      bgcolor: 'grey.50',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.50',
                      },
                    }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body1" fontWeight={500} color="grey.700">
                      클릭하거나 파일을 여기에 끌어다 놓으세요
                    </Typography>
                    <Typography variant="caption" color="grey.600">
                      PDF, DOCX, JPG, PNG 파일 (최대 20MB)
                    </Typography>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleFileSelect}
                    />
                  </Box>

                  {files.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {files.map((file, index) => (
                        <Paper
                          key={index}
                          sx={{
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            bgcolor: file.highlight ? 'primary.50' : 'white',
                            border: 1,
                            borderColor: file.highlight ? 'primary.200' : 'grey.200',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <FileIcon sx={{ color: 'grey.600' }} />
                            <Typography variant="body2" fontWeight={500}>
                              {file.name}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => toggleFileHighlight(index)}
                              sx={{
                                color: file.highlight ? 'primary.main' : 'grey.500',
                                bgcolor: file.highlight ? 'primary.100' : 'transparent',
                                '&:hover': {
                                  bgcolor: file.highlight ? 'primary.100' : 'grey.100',
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => removeFile(index)}
                              sx={{
                                color: 'error.main',
                                '&:hover': {
                                  bgcolor: 'error.lighter',
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* 심사역 작성 */}
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    심사역 작성
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    placeholder="사건에 대한 심사 내용을 작성해주세요..."
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'grey.50',
                      },
                    }}
                  />
                </CardContent>
              </Card>
          </Box>
        </Box>

        {/* 액션 버튼 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button variant="outlined" onClick={saveTemp}>
            임시저장
          </Button>
          <Button variant="contained" onClick={analyzeIssues}>
            쟁점분석
          </Button>
        </Box>

        <LoadingModal
          isVisible={showLoadingModal}
          message="AI가 사실관계를 정리하고 쟁점을 추출하고 있습니다."
        />
      </Box>
    </Box>
  );
}

export default CaseAnalysis;

