import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  AccountBalance as AccountBalanceIcon,
  ContentPaste as ContentPasteIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

function AppSidebar({ activeMenu = 'case-review', onMenuChange }) {
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
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {/* 로고 */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          component="img"
          src="/logo.png"
          alt="로고"
          sx={{ width: 32, height: 32 }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <Typography variant="h6" fontWeight={700} color="text.primary">
          사건 심사 AI
        </Typography>
      </Box>

      {/* 네비게이션 */}
      {categories.map((category, categoryIndex) => (
        <Box key={categoryIndex} sx={{ mb: 3 }}>
          <Typography
            variant="caption"
            sx={{
              px: 3,
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
          <List sx={{ px: 1.5 }}>
            {category.items.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={activeMenu === item.id}
                  onClick={() => onMenuChange && onMenuChange(item.id)}
                  sx={{
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
                      color: activeMenu === item.id ? 'primary.600' : 'inherit',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: activeMenu === item.id ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Drawer>
  );
}

export default AppSidebar;

