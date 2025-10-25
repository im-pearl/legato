import { Stepper, Step, StepLabel, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

// 커스텀 Connector
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 14,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 1,
  },
}));

// 커스텀 Step Icon
const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.grey[300],
  zIndex: 1,
  color: theme.palette.grey[600],
  width: 28,
  height: 28,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '0.75rem',
  fontWeight: 500,
  ...(ownerState.active && {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    fontWeight: 600,
  }),
  ...(ownerState.completed && {
    backgroundColor: theme.palette.primary[100],
    border: `2px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
  }),
}));

function CustomStepIcon(props) {
  const { active, completed, className, icon } = props;

  return (
    <CustomStepIconRoot ownerState={{ active, completed }} className={className}>
      {icon}
    </CustomStepIconRoot>
  );
}

function ProgressBar({ steps = [], completedSteps = [], activeStep = '' }) {
  // 각 스텝의 상태를 확인하는 함수
  const getStepIndex = (stepId) => {
    return steps.findIndex((step) => step.id === stepId);
  };

  const activeStepIndex = getStepIndex(activeStep);

  return (
    <Box sx={{ mb: 3 }}>
      <Stepper
        alternativeLabel
        activeStep={activeStepIndex}
        connector={<CustomConnector />}
      >
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive = step.id === activeStep;

          return (
            <Step key={step.id} completed={isCompleted} active={isActive}>
              <StepLabel
                StepIconComponent={CustomStepIcon}
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: '0.75rem',
                    color: isActive ? 'primary.main' : 'grey.600',
                    fontWeight: isActive ? 500 : 400,
                    mt: 1,
                  },
                  '& .MuiStepLabel-label.Mui-active': {
                    color: 'primary.main',
                    fontWeight: 500,
                  },
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}

export default ProgressBar;

