import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Text, IconButton, Button } from '@chakra-ui/react';
import {
  LuSettings,
  LuChevronLeft,
  LuMenu,
} from 'react-icons/lu';

const drawerWidth = '200px';

function AppSidebar({ open, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    { label: '사실관계 검토', path: '/case-analysis' },
    { label: '쟁점 분석', path: '/case-issues' },
    { label: '판례 리서치', path: '/case-search' },
    { label: '심사보고서 작성', path: '/case-final-review' },
  ];

  const getActiveStep = () => {
    const stepIndex = steps.findIndex((step) => location.pathname === step.path);
    return stepIndex !== -1 ? stepIndex : -1;
  };

  const activeStep = getActiveStep();

  const handleStepClick = (stepPath) => {
    navigate(stepPath);
  };

  return (
    <Box
      as="nav"
      position="fixed"
      left={0}
      top={0}
      h="100vh"
      w={open ? drawerWidth : '65px'}
      bg="gray.50"
      borderRightWidth="1px"
      borderColor="gray.200"
      transition="width 0.3s"
      zIndex={10}
    >
      {/* 헤더 - 토글 버튼 */}
      <Box
        h="56px"
        display="flex"
        alignItems="center"
        px={2}
        borderBottomWidth="1px"
        borderColor="gray.200"
      >
        {open ? (
          <>
            <Text flex={1} fontSize="lg" fontWeight={700} color="gray.900" pl={2}>
              심사 AI 데모
            </Text>
            <IconButton
              onClick={onToggle}
              size="sm"
              variant="ghost"
              aria-label="사이드바 닫기"
            >
              <LuChevronLeft />
            </IconButton>
          </>
        ) : (
          <IconButton
            onClick={onToggle}
            size="sm"
            variant="ghost"
            mx="auto"
            aria-label="사이드바 열기"
          >
            <LuMenu />
          </IconButton>
        )}
      </Box>

      {/* Vertical Stepper - 수동 구현 */}
      {open && (
        <Box px={4} py={6}>
          {steps.map((step, index) => (
            <Box key={step.label} mb={4}>
              <Box
                display="flex"
                alignItems="center"
                gap={3}
                cursor="pointer"
                onClick={() => handleStepClick(step.path)}
                _hover={{ bg: 'gray.100' }}
                borderRadius="md"
                px={2}
                py={2}
              >
                <Box
                  w="32px"
                  h="32px"
                  borderRadius="full"
                  bg={activeStep === index ? 'teal.500' : activeStep > index ? 'teal.500' : 'gray.300'}
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight={600}
                  fontSize="sm"
                  flexShrink={0}
                >
                  {index + 1}
                </Box>
                <Text
                  fontSize="0.9rem"
                  fontWeight={activeStep === index ? 600 : 400}
                  color={activeStep === index ? 'gray.900' : 'gray.600'}
                >
                  {step.label}
                </Text>
              </Box>
              {index < steps.length - 1 && (
                <Box
                  w="2px"
                  h="20px"
                  bg={activeStep > index ? 'teal.500' : 'gray.300'}
                  ml="15px"
                  my={1}
                />
              )}
            </Box>
          ))}
        </Box>
      )}

      <Box flex={1} />

      {/* 설정 메뉴 */}
      <Box px={open ? 3 : 1} py={2}>
        <Button
          variant="ghost"
          size="sm"
          w="full"
          justifyContent={open ? 'flex-start' : 'center'}
          px={open ? 3 : 0}
        >
          <LuSettings />
          {open && <Text ml={2}>설정</Text>}
        </Button>
      </Box>
    </Box>
  );
}

export const DrawerHeader = Box;
export default AppSidebar;
