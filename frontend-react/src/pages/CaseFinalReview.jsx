import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  TextField,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  LinearProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import AppSidebar, { DrawerHeader } from '../components/common/AppSidebar';

function CaseFinalReview() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [winProbability, setWinProbability] = useState(75);
  const [executionProbability, setExecutionProbability] = useState(80);

  const [winProbabilityDescription, setWinProbabilityDescription] = useState(
    '계약서가 없고 상대방의 확인 서명이 없는 견적서만으로는 계약상 대금청구가 인정되기 어려우나, 부당이득반환청구는 실제 제공된 용역의 가치에 기초하여 인정될 가능성이 높습니다...'
  );

  const [executionProbabilityDescription, setExecutionProbabilityDescription] = useState(
    '상대방은 건설회사(법인)로, 토지 가액 약 9억 원의 재산을 보유하고 있어 집행 대상 재산이 충분합니다. 법인의 경우 개인보다 재산 은닉이 어렵고...'
  );

  const [conclusion, setConclusion] = useState(
    '의뢰인의 계약상 설계용역대금청구는 계약서가 없고 의뢰인이 일방적으로 작성한 견적서만으로는 계약 내용이 확정되었다고 보기 어려워 기각될 가능성이 높습니다...'
  );

  const clientName = '김건축';
  const requestNumber = 'CS-20250314-0042';
  const lawyerName = '박변호 변호사';
  const receiptDate = '2025년 03월 14일';

  const issues = [
    {
      content: '계약상 대금이 00,000,000 원으로 정해졌다고 볼 수 있는지 여부',
      precedents: [
        {
          caseNumber: '서울중앙지방법원 2023. 7. 12. 선고 2022가단5192624 판결',
          summary: '원고와 피고 사이에 원고가 구하는 건축 설계용역대금 77,736,651원에 관한 합의가 있었다거나...',
        },
        {
          caseNumber: '대구지방법원 2024. 4. 4. 선고 2022가합206258 판결',
          summary: '설계용역 수행의 대가 지급 여부나 그 산정 기준은 원고와 피고 사이의 설계용역계약 성립...',
        },
      ],
      subsumption:
        '본 사안에서는 의뢰인과 상대방 사이에 서면 계약서가 작성되지 않았고, 의뢰인이 단독으로 작성한 견적서만 존재합니다. 견적서는 의뢰인이 일방적으로 작성하고 날인한 것으로...',
    },
    {
      content: '상대방에게 부당이득반환책임이 성립하는지 여부',
      precedents: [
        {
          caseNumber: '대구지방법원 2024. 4. 4. 선고 2022가합206258 판결',
          summary: '설계용역대금에 관한 명시적인 약정이 없어 설계용역 성립은 부정하였으나...',
        },
      ],
      subsumption:
        '의뢰인은 건축설계용역을 완전히 이행하여 건축심의, 건축허가, 건축구조심의 등을 모두 완료하였습니다. 이로써 상대방은 의뢰인의 용역 제공을 통해...',
    },
  ];

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

  const goBack = () => {
    navigate('/case-search');
  };

  const saveTemp = () => {
    alert('임시저장 되었습니다.');
  };

  const openPreviewModal = () => {
    setShowPreviewModal(true);
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
  };

  const confirmSave = () => {
    alert('법률 검토 보고서가 저장되었습니다.');
    closePreviewModal();
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

        {/* 쟁점 및 포섭 */}
        {issues.map((issue, issueIndex) => (
          <Card key={issueIndex} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                쟁점 {issueIndex + 1}
              </Typography>

              <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }}>
                <Typography variant="body2" color="grey.800" lineHeight={1.5}>
                  {issue.content}
                </Typography>
              </Paper>

              <Typography variant="subtitle1" fontWeight={600} color="grey.800" mb={2}>
                관련 판례
              </Typography>
              <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {issue.precedents.map((precedent, precedentIndex) => (
                  <Paper key={precedentIndex} sx={{ p: 2, border: 1, borderColor: 'grey.300' }}>
                    <Typography variant="body2" fontWeight={600} color="primary.main" mb={1}>
                      {precedent.caseNumber}
                    </Typography>
                    <Typography variant="body2" color="grey.800" lineHeight={1.5}>
                      {precedent.summary}
                    </Typography>
                  </Paper>
                ))}
              </Box>

              <Typography variant="subtitle1" fontWeight={600} color="grey.800" mb={2}>
                판단
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={4}
                defaultValue={issue.subsumption}
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
        ))}

        {/* 결론 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              결론
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={5}
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
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

        {/* 승소가능성 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={3}>
              승소가능성
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Slider
                value={winProbability}
                onChange={(_, value) => setWinProbability(value)}
                min={0}
                max={100}
                step={5}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                sx={{ flex: 1 }}
              />
              <Typography variant="h5" fontWeight={600} color="primary.main" sx={{ minWidth: 70, textAlign: 'center' }}>
                {winProbability}%
              </Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              minRows={4}
              value={winProbabilityDescription}
              onChange={(e) => setWinProbabilityDescription(e.target.value)}
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

        {/* 집행가능성 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={3}>
              집행가능성
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Slider
                value={executionProbability}
                onChange={(_, value) => setExecutionProbability(value)}
                min={0}
                max={100}
                step={5}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                sx={{ flex: 1 }}
              />
              <Typography variant="h5" fontWeight={600} color="primary.main" sx={{ minWidth: 70, textAlign: 'center' }}>
                {executionProbability}%
              </Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              minRows={4}
              value={executionProbabilityDescription}
              onChange={(e) => setExecutionProbabilityDescription(e.target.value)}
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

        {/* 액션 버튼 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button variant="outlined" onClick={goBack}>
            이전으로
          </Button>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button variant="outlined" onClick={saveTemp}>
              임시저장
            </Button>
            <Button variant="contained" onClick={openPreviewModal}>
              저장
            </Button>
          </Box>
        </Box>

        {/* 보고서 미리보기 모달 */}
        <Dialog
          open={showPreviewModal}
          onClose={closePreviewModal}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              maxHeight: '90vh',
            },
          }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              사건 심사 보고서
            </Typography>
            <IconButton onClick={closePreviewModal} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            {/* 보고서 헤더 */}
            <Table size="small" sx={{ mb: 3 }}>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100', width: '15%' }}>의뢰인</TableCell>
                  <TableCell sx={{ width: '35%' }}>{clientName}</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100', width: '15%' }}>신청지 번호</TableCell>
                  <TableCell sx={{ width: '35%' }}>{requestNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>상담 변호사</TableCell>
                  <TableCell>{lawyerName}</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>접수일</TableCell>
                  <TableCell>{receiptDate}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* 사건 요약 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} color="primary.main" mb={1.5} pb={0.5} borderBottom={1} borderColor="grey.200">
                사건 요약
              </Typography>
              <Typography variant="body2" lineHeight={1.6}>
                본 사건은 설계용역 대금 청구에 관한 사건으로, 의뢰인이 상대방으로부터 오피스텔 신축설계 용역을 의뢰받아 완료하였으나, 계약서 없이 진행되어 설계용역대금에 대한 다툼이 발생한 사안입니다...
              </Typography>
            </Box>

            {/* 사실관계 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} color="primary.main" mb={1.5} pb={0.5} borderBottom={1} borderColor="grey.200">
                사실관계
              </Typography>
              <Typography variant="body2" lineHeight={1.6} sx={{ whiteSpace: 'pre-line' }}>
                {factsContent}
              </Typography>
            </Box>

            {/* 법리 검토 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} color="primary.main" mb={1.5} pb={0.5} borderBottom={1} borderColor="grey.200">
                법리 검토
              </Typography>
              {issues.map((issue, index) => (
                <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < issues.length - 1 ? '1px dashed' : 'none', borderColor: 'grey.200' }}>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    {index + 1}. {issue.content}
                  </Typography>
                  <Typography variant="body2" lineHeight={1.6} mb={2}>
                    {issue.subsumption}
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={600} mb={1}>
                    관련 판례
                  </Typography>
                  <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                    {issue.precedents.map((precedent, pIndex) => (
                      <li key={pIndex}>
                        <Typography variant="body2" color="grey.700">
                          {precedent.caseNumber}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              ))}
            </Box>

            {/* 결론 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} color="primary.main" mb={1.5} pb={0.5} borderBottom={1} borderColor="grey.200">
                결론
              </Typography>
              <Typography variant="body2" lineHeight={1.6}>
                {conclusion}
              </Typography>
            </Box>

            {/* 승소가능성 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} color="primary.main" mb={1.5} pb={0.5} borderBottom={1} borderColor="grey.200">
                승소가능성 평가
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ height: 32, bgcolor: 'grey.200', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                  <LinearProgress
                    variant="determinate"
                    value={winProbability}
                    sx={{
                      height: '100%',
                      bgcolor: 'transparent',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'primary.main',
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="white"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {winProbability}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" lineHeight={1.6}>
                {winProbabilityDescription}
              </Typography>
            </Box>

            {/* 집행가능성 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} color="primary.main" mb={1.5} pb={0.5} borderBottom={1} borderColor="grey.200">
                집행가능성 평가
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ height: 32, bgcolor: 'grey.200', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                  <LinearProgress
                    variant="determinate"
                    value={executionProbability}
                    sx={{
                      height: '100%',
                      bgcolor: 'transparent',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'primary.main',
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="white"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {executionProbability}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" lineHeight={1.6}>
                {executionProbabilityDescription}
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button variant="contained" onClick={confirmSave}>
              제출
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default CaseFinalReview;
