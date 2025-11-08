import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { Steps } from '@chakra-ui/react';

const stepsWidth = '160px';

function StepsBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const steps = [
    { title: '사실관계 검토', path: '/fact-review' },
    { title: '쟁점 분석', path: '/issue-identification' },
    { title: '판례 리서치', path: '/case-research' },
    { title: '사안 포섭', path: '/final-review' },
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
      position="fixed"
      left={0}
      top="calc(56px + 48px)"
      w={stepsWidth}
      pt={8}
      px={4}
      zIndex={50}
    >
      <Steps.Root
        step={currentStep}
        count={steps.length}
        onStepChange={handleStepChange}
        orientation="vertical"
        height="260px"
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

export { stepsWidth };
export default StepsBar;

