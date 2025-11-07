import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { Steps } from '@chakra-ui/react';

function StepsBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const steps = [
    { title: '사실관계 검토', path: '/fact-review' },
    { title: '쟁점 분석', path: '/issue-identification' },
    { title: '판례 리서치', path: '/case-research' },
    { title: '심사보고서 작성', path: '/final-review' },
  ];

  const getCurrentStep = () => {
    const stepIndex = steps.findIndex((step) => location.pathname === step.path);
    return stepIndex !== -1 ? stepIndex : 0;
  };

  const currentStep = getCurrentStep();

  const handleStepChange = (details) => {
    navigate(steps[details.step].path);
  };

  return (
    <Box
      bg="white"
      py={4}
      px={6}
    >
      <Steps.Root
        step={currentStep}
        count={steps.length}
        onStepChange={handleStepChange}
        variant="subtle"
        colorPalette="gray"
        size="sm"
      >
        <Steps.List>
          {steps.map((step, index) => (
            <Steps.Item key={index} index={index}>
              <Steps.Trigger>
                <Steps.Indicator />
                <Steps.Title>{step.title}</Steps.Title>
              </Steps.Trigger>
              <Steps.Separator />
            </Steps.Item>
          ))}
        </Steps.List>
      </Steps.Root>
    </Box>
  );
}

export default StepsBar;

