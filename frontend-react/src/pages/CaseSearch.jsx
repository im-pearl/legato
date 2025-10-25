import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Chip,
  Switch,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import AppSidebar from '../components/common/AppSidebar';
import ProgressBar from '../components/common/ProgressBar';
import LoadingModal from '../components/common/LoadingModal';

function CaseSearch() {
  const navigate = useNavigate();
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [searchCourt, setSearchCourt] = useState('all');

  const progressSteps = [
    { id: 'step1', label: '신청지 검토' },
    { id: 'step2', label: '쟁점 추출' },
    { id: 'step3', label: '판례 검색' },
    { id: 'step4', label: '최종 검토' },
  ];

  const [issues, setIssues] = useState([
    {
      content: '계약상 대금이 00,000,000 원으로 정해졌다고 볼 수 있는지 여부',
      precedents: [
        {
          caseNumber: '서울중앙지방법원 2023. 7. 12. 선고 2022가단5192624 판결',
          summary:
            '원고와 피고 사이에 원고가 구하는 건축 설계용역대금 77,736,651원에 관한 합의가 있었다거나 원고가 제공한 설계용역에 관한 보수가 위 금액 상당에 이르는지에 관하여 보건대, 갑 제3호증의 기재만으로는 이를 인정하기 부족하고, 달리 이를 인정할 만한 증거가 없다...',
          selected: true,
        },
        {
          caseNumber: '대구지방법원 2024. 4. 4. 선고 2022가합206258 판결',
          summary:
            '설계용역 수행의 대가 지급 여부나 그 산정 기준은 원고와 피고 사이의 설계용역계약 성립을 위한 본질적인 사항에 속하는데도...',
          selected: true,
        },
      ],
    },
    {
      content: '상대방에게 부당이득반환책임이 성립하는지 여부',
      precedents: [
        {
          caseNumber: '대구지방법원 2024. 4. 4. 선고 2022가합206258 판결',
          summary:
            '설계용역대금에 관한 명시적인 약정이 없어 설계용역 성립은 부정하였으나, 감정인의 감정 결과를 기초로 한 부당이득금에 대한 부당이득반환의무를 인정한 사례',
          selected: true,
        },
      ],
    },
  ]);

  const handleMenuChange = (menuId) => {
    console.log('메뉴 변경:', menuId);
  };

  const togglePrecedentSelection = (issueIndex, precedentIndex) => {
    const newIssues = [...issues];
    newIssues[issueIndex].precedents[precedentIndex].selected =
      !newIssues[issueIndex].precedents[precedentIndex].selected;
    setIssues(newIssues);
  };

  const getSelectedPrecedentsCount = () => {
    let count = 0;
    issues.forEach((issue) => {
      issue.precedents.forEach((precedent) => {
        if (precedent.selected) count++;
      });
    });
    return count;
  };

  const viewFullPrecedent = (precedent) => {
    alert(`${precedent.caseNumber} 판례 전문 보기를 요청했습니다.`);
  };

  const searchPrecedents = () => {
    if (!searchKeyword.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }
    alert(`"${searchKeyword}" 키워드로 판례 검색을 요청했습니다.`);
  };

  const goBack = () => {
    navigate('/case-issues');
  };

  const saveTemp = () => {
    alert('임시저장 되었습니다.');
  };

  const finalReview = () => {
    if (getSelectedPrecedentsCount() === 0) {
      alert('최소 하나 이상의 판례를 선택해주세요.');
      return;
    }
    setShowLoadingModal(true);
    setTimeout(() => {
      setShowLoadingModal(false);
      navigate('/case-finalreview');
    }, 1500);
  };

  const factsContent = `1. 의뢰인은 상대방으로부터 **시 **구 **번지 오피스텔 신축설계(면적 00,000,000 m2 규모)의 건축설계(건축심의, 경관심의, 건축인허가, 구조 심의) 용역(이하 '이 사건 용역')을 의뢰받아 완료하였음. (계약서 없음)
- 건축심의, 건축허가, 건축구조심의 완료 및 건축물 착공연기신청 완료(착공연기 기간 내)

2. 상대방은 의뢰인에게 총 0,000,000원을 입금하였음(지급내역))
- 1차 지급: 0,000,000원 입금(입금자 **주식회사)
- 2차 지급: 0,000,000원 입금(입금자 **주식회사)
- 3차 지급: 0,000,000원 입금(입금자 **주식회사)

3. 의뢰인은 이 사건 용역에 대하여 평당 0만 원, 총 00,000,000 원으로 견적서를 작성하였음. (의뢰인 단독 날인)

4. 의뢰인은 이 사건 용역의 설계비가 평당 00,000원이라고 주장하며, 이에 용역대금은 약 0원이라고 주장함. (건축 설계비 산정근거: 평 × 00,000원, 건물규모: 00,000,000 m2 (0,000평))

5. 이에 의뢰인은 대금 잔금 약 1억 원을 상대방에게 청구하고자 함.`;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppSidebar activeMenu="case-review" onMenuChange={handleMenuChange} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: '240px',
          p: 3,
          maxWidth: 1200,
        }}
      >
        <ProgressBar steps={progressSteps} completedSteps={['step1', 'step2']} activeStep="step3" />

        {/* 사실관계 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              사실관계
            </Typography>
            <Typography variant="body2" color="grey.800" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
              {factsContent}
            </Typography>
          </CardContent>
        </Card>

        {/* 판례 검색 결과 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={3}>
              판례 검색 결과
            </Typography>

            {issues.map((issue, issueIndex) => (
              <Box
                key={issueIndex}
                sx={{
                  mb: 3,
                  pb: 3,
                  borderBottom: issueIndex < issues.length - 1 ? '1px dashed' : 'none',
                  borderColor: 'grey.300',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Chip
                    label={issueIndex + 1}
                    size="small"
                    sx={{
                      bgcolor: 'grey.500',
                      color: 'white',
                      fontWeight: 500,
                      mr: 2,
                    }}
                  />
                  <Typography variant="body1" color="grey.800" fontWeight={400}>
                    {issue.content}
                  </Typography>
                </Box>

                <Box sx={{ ml: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {issue.precedents.map((precedent, precedentIndex) => (
                    <Paper
                      key={precedentIndex}
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: precedent.selected ? 'primary.main' : 'grey.300',
                        bgcolor: precedent.selected ? 'primary.50' : 'white',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Typography variant="body2" fontWeight={600} color="primary.main">
                          {precedent.caseNumber}
                        </Typography>
                        <Switch
                          size="small"
                          checked={precedent.selected}
                          onChange={() => togglePrecedentSelection(issueIndex, precedentIndex)}
                        />
                      </Box>
                      <Typography variant="body2" color="grey.800" sx={{ mb: 1.5, lineHeight: 1.5 }}>
                        {precedent.summary}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => viewFullPrecedent(precedent)}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        전문보기
                      </Button>
                    </Paper>
                  ))}
                </Box>
              </Box>
            ))}

            {/* 선택된 판례 수 */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Typography variant="body2" color="grey.700">
                선택된 판례 수 :{' '}
                <Box component="span" color="primary.main" fontWeight={500}>
                  {getSelectedPrecedentsCount()}
                </Box>
              </Typography>
            </Box>

            {/* 추가 검색 */}
            <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle1" fontWeight={600} color="grey.800" mb={2}>
                추가 판례 검색
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  placeholder="자연어로 검색하세요"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') searchPrecedents();
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={searchPrecedents} edge="end">
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl fullWidth size="small">
                    <Select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                      <MenuItem value="all">전체</MenuItem>
                      <MenuItem value="title">제목</MenuItem>
                      <MenuItem value="content">내용</MenuItem>
                      <MenuItem value="caseNumber">사건번호</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <Select value={searchCourt} onChange={(e) => setSearchCourt(e.target.value)}>
                      <MenuItem value="all">모든 법원</MenuItem>
                      <MenuItem value="supreme">대법원</MenuItem>
                      <MenuItem value="high">고등법원</MenuItem>
                      <MenuItem value="district">지방법원</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Paper>
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
            <Button variant="contained" onClick={finalReview}>
              최종 검토
            </Button>
          </Box>
        </Box>

        <LoadingModal
          isVisible={showLoadingModal}
          message="AI가 승소가능성 및 집행가능성을 검토하고 있습니다."
        />
      </Box>
    </Box>
  );
}

export default CaseSearch;

