import { Portal, Box, Text, Spinner } from '@chakra-ui/react';

function LoadingModal({ isVisible = false, message = '잠시만 기다려주세요...' }) {
  if (!isVisible) return null;

  return (
    <Portal>
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
        backdropFilter="blur(4px)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={2000}
      >
        <Box
          bg="white"
          p={10}
          borderRadius="xl"
          boxShadow="xl"
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={6}
          maxW="400px"
          w="90%"
          animation="fadeIn 0.3s ease"
          css={{
            '@keyframes fadeIn': {
              from: {
                opacity: 0,
                transform: 'translateY(-10px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Spinner
            size="xl"
            color="gray.900"
            thickness="4px"
          />
          <Text
            fontSize="md"
            color="gray.900"
            textAlign="center"
            fontWeight={500}
            lineHeight={1.5}
          >
            {message}
          </Text>
        </Box>
      </Box>
    </Portal>
  );
}

export default LoadingModal;

