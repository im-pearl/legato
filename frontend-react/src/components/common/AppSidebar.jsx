import { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  AccountBalance as AccountBalanceIcon,
  ContentPaste as ContentPasteIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

function AppSidebar({ activeMenu = 'case-review', onMenuChange, open, onToggle }) {
  const theme = useTheme();

  const categories = [
    {
      title: '카테고리',
      items: [
        {
          id: 'case-review',
          label: '사건 검토',
          icon: <DescriptionIcon />,
        },
        {
          id: 'investment-review',
          label: '투자 심사',
          icon: <AccountBalanceIcon />,
        },
      ],
    },
    {
      title: '설정',
      items: [
        {
          id: 'templates',
          label: '프롬프트 수정',
          icon: <ContentPasteIcon />,
        },
        {
          id: 'account-settings',
          label: '계정 설정',
          icon: <SettingsIcon />,
        },
      ],
    },
  ];

  return (
    <Drawer variant="permanent" open={open}>
      {/* 헤더 - 토글 버튼 */}
      <DrawerHeader>
        {open ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, pl: 2 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary" noWrap>
              심사 AI demo
            </Typography>
          </Box>
        ) : (
          <IconButton onClick={onToggle} sx={{ mx: 'auto' }}>
            <MenuIcon />
          </IconButton>
        )}
        {open && (
          <IconButton onClick={onToggle}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
      </DrawerHeader>
      <Divider />

      {/* 네비게이션 */}
      {categories.map((category, categoryIndex) => (
        <Box key={categoryIndex}>
          {open && (
            <Typography
              variant="caption"
              sx={{
                px: 3,
                mt: 2,
                mb: 1,
                display: 'block',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'grey.600',
                fontWeight: 600,
              }}
            >
              {category.title}
            </Typography>
          )}
          <List sx={{ px: open ? 1.5 : 0.5 }}>
            {category.items.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ display: 'block', mb: 0.5 }}>
                <ListItemButton
                  selected={activeMenu === item.id}
                  onClick={() => onMenuChange && onMenuChange(item.id)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    borderRadius: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.100',
                      color: 'primary.600',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'primary.100',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'grey.100',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: activeMenu === item.id ? 'primary.600' : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{ opacity: open ? 1 : 0 }}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: activeMenu === item.id ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {categoryIndex < categories.length - 1 && <Divider sx={{ my: 1 }} />}
        </Box>
      ))}
    </Drawer>
  );
}

export { DrawerHeader };
export default AppSidebar;

