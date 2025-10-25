import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Stepper,
  Step,
  StepLabel,
  StepButton,
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

function AppSidebar({ open, onToggle }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    { label: '사실관계 검토', path: '/case-analysis' },
    { label: '쟁점 분석', path: '/case-issues' },
    { label: '판례 리서치', path: '/case-search' },
    { label: '심사보고서 작성', path: '/case-final-review' },
  ];

  // 현재 URL 기반으로 active step 결정
  const getActiveStep = () => {
    const stepIndex = steps.findIndex((step) => location.pathname === step.path);
    return stepIndex !== -1 ? stepIndex : -1;
  };

  const activeStep = getActiveStep();

  const handleStepClick = (stepPath) => {
    navigate(stepPath);
  };

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

      {/* Vertical Stepper */}
      {open ? (
        <Box sx={{ px: 2, py: 3 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepButton onClick={() => handleStepClick(step.path)}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontSize: '0.9rem',
                        fontWeight: activeStep === index ? 600 : 400,
                      },
                    }}
                  >
                    {step.label}
                  </StepLabel>
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Box>
      ) : (
        <Box sx={{ px: 1, py: 2 }}>
          {steps.map((step, index) => (
            <IconButton
              key={step.label}
              onClick={() => handleStepClick(step.path)}
              sx={{
                width: '100%',
                mb: 1,
                color: activeStep === index ? 'primary.main' : 'grey.600',
                bgcolor: activeStep === index ? 'primary.50' : 'transparent',
                '&:hover': {
                  bgcolor: activeStep === index ? 'primary.100' : 'grey.100',
                },
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                {index + 1}
              </Typography>
            </IconButton>
          ))}
        </Box>
      )}

      <Box sx={{ flexGrow: 1 }} />
      <Divider />

      {/* 설정 메뉴 */}
      <List sx={{ px: open ? 1.5 : 0.5, py: 1 }}>
        <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              borderRadius: 1.5,
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
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary="설정"
              sx={{ opacity: open ? 1 : 0 }}
              primaryTypographyProps={{
                fontSize: '0.95rem',
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}

export { DrawerHeader };
export default AppSidebar;

