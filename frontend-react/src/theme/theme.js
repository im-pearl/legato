import { createTheme } from '@mui/material/styles';

// Vue 프로젝트의 색상 팔레트를 그대로 사용
const theme = createTheme({
  palette: {
    primary: {
      main: '#008F7F',
      light: '#1AC6AC',
      dark: '#006C63',
      50: '#F4FBFB',
      100: '#EBFAF8',
      200: '#9CF0E2',
      300: '#33D8BE',
      400: '#1AC6AC',
      500: '#09AD97',
      600: '#008F7F',
      700: '#006C63',
      800: '#005A54',
      900: '#004744',
    },
    grey: {
      50: '#F8F9FA',
      100: '#F1F3F5',
      200: '#E9ECEF',
      300: '#DEE2E6',
      400: '#CCD2D8',
      500: '#AEB5BA',
      600: '#888E94',
      650: '#646A70',
      700: '#484F54',
      750: '#3A3E43',
      800: '#32363A',
      850: '#26282B',
      900: '#1F2022',
      950: '#17181A',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: [
      'Pretendard',
      '-apple-system',
      'BlinkMacSystemFont',
      'system-ui',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '10px 20px',
          minWidth: 100,
        },
        contained: {
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          borderRadius: 12,
          border: '1px solid #E9ECEF',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
          borderRight: '1px solid #E5E7EB',
        },
      },
    },
  },
});

export default theme;

