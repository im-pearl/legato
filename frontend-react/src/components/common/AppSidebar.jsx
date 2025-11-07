import { useNavigate } from 'react-router-dom';
import { Box, Text, IconButton } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/react';
import {
  LuChevronLeft,
  LuMenu,
} from 'react-icons/lu';

const drawerWidth = '200px';

function AppSidebar({ open, onToggle }) {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'AI 심사', path: '/fact-review', active: true },
    { label: '프롬프트 수정', path: null, active: false },
  ];

  const handleMenuClick = (item) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <Box
      as="nav"
      position="fixed"
      left={0}
      top={0}
      h="100vh"
      w={drawerWidth}
      bg="gray.50"
      borderRightWidth="1px"
      borderColor="gray.200"
      transition="transform 0.3s"
      transform={open ? 'translateX(0)' : 'translateX(-100%)'}
      zIndex={1000}
      display="flex"
      flexDirection="column"
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
      </Box>

      {/* 네비게이션 메뉴 */}
      <Box px={3} py={4}>
        {menuItems.map((item) => (
          <Box
            key={item.label}
            display="flex"
            alignItems="center"
            cursor="pointer"
            onClick={() => handleMenuClick(item)}
            _hover={{ bg: 'gray.100' }}
            borderRadius="md"
            px={3}
            py={2.5}
            mb={1}
            bg={item.active ? 'gray.100' : 'transparent'}
            color={item.active ? 'gray.900' : 'gray.600'}
            transition="all 0.2s"
          >
            <Text fontSize="0.875rem" fontWeight={item.active ? 600 : 500}>
              {item.label}
            </Text>
          </Box>
        ))}
      </Box>

      <Box flex={1} />

      {/* 사용자 프로필 */}
      <Box
        px={3}
        py={3}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={3}
          cursor="pointer"
          _hover={{ bg: 'gray.50' }}
          p={2}
          borderRadius="lg"
          transition="all 0.2s"
        >
          <Avatar.Root size="sm" bg="gray.900" color="white">
            <Avatar.Fallback name="정범환" />
          </Avatar.Root>
          <Box>
            <Text fontSize="0.875rem" fontWeight={600} color="gray.900">
              정범환 변호사
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export const DrawerHeader = Box;
export default AppSidebar;