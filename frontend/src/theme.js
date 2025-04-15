import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#41B6E6', // Light Blue
      light: '#64b5f6',
      dark: '#2E6484', // Deep Blue-Grey
    },
    secondary: {
      main: '#2E6484', // Deep Blue-Grey
      light: '#3a7a9e',
      dark: '#1e4a5f',
    },
    accent: {
      main: '#E989A7', // Soft Pink
      light: '#f0a5bb',
      dark: '#d66d8f',
    },
    background: {
      default: mode === 'dark' ? '#1A1F25' : '#FFFFFF',
      paper: mode === 'dark' ? '#212832' : '#FFFFFF',
    },
    text: {
      primary: mode === 'dark' ? '#E0E0E0' : '#2E6484',
      secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(46, 100, 132, 0.7)',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#41B6E6', // Light Blue
      light: '#64b5f6',
      dark: '#2E6484', // Deep Blue-Grey
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      color: mode === 'dark' ? '#E0E0E0' : '#2E6484',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: mode === 'dark' ? '#E0E0E0' : '#2E6484',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: mode === 'dark' ? '#E0E0E0' : '#2E6484',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: mode === 'dark' ? '#E0E0E0' : '#2E6484',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: mode === 'dark' ? '#E0E0E0' : '#2E6484',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: mode === 'dark' ? '#E0E0E0' : '#2E6484',
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.08)',
    '0px 16px 24px rgba(0,0,0,0.12)',
    '0px 24px 32px rgba(0,0,0,0.12)',
    ...Array(19).fill('none'),
  ],
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: mode === 'dark' 
            ? 'linear-gradient(135deg, #212832 0%, #1A1F25 100%)'
            : '#41B6E6',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          '& .MuiButton-root': {
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(46, 100, 132, 0.15)',
            },
          },
          '& .MuiTypography-root': {
            color: '#FFFFFF',
          },
          '& .MuiIconButton-root': {
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'dark' ? '#212832' : '#FFFFFF',
          borderRight: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(46, 100, 132, 0.12)'}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#212832' : '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          },
        },
        containedPrimary: {
          backgroundColor: '#41B6E6',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#2E6484',
          },
        },
        containedSecondary: {
          backgroundColor: '#2E6484',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#1e4a5f',
          },
        },
        outlined: {
          borderColor: mode === 'dark' ? '#E989A7' : '#41B6E6',
          color: mode === 'dark' ? '#E989A7' : '#41B6E6',
          '&:hover': {
            borderColor: mode === 'dark' ? '#f0a5bb' : '#2E6484',
            backgroundColor: mode === 'dark' ? 'rgba(233, 137, 167, 0.08)' : 'rgba(65, 182, 230, 0.08)',
          },
        },
        text: {
          color: mode === 'dark' ? '#E0E0E0' : '#2E6484',
          '&:hover': {
            backgroundColor: mode === 'dark' ? 'rgba(224, 224, 224, 0.08)' : 'rgba(46, 100, 132, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        colorPrimary: {
          backgroundColor: '#E989A7',
          color: '#FFFFFF',
        },
        colorSecondary: {
          backgroundColor: '#41B6E6',
          color: '#FFFFFF',
        },
        outlined: {
          borderColor: mode === 'dark' ? '#E989A7' : '#41B6E6',
          color: mode === 'dark' ? '#E989A7' : '#41B6E6',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardInfo: {
          backgroundColor: mode === 'dark' ? 'rgba(65, 182, 230, 0.16)' : 'rgba(65, 182, 230, 0.12)',
          color: mode === 'dark' ? '#E0E0E0' : '#2E6484',
        },
        standardSuccess: {
          backgroundColor: mode === 'dark' ? 'rgba(46, 125, 50, 0.16)' : 'rgba(46, 125, 50, 0.12)',
          color: mode === 'dark' ? '#E0E0E0' : '#2e7d32',
        },
        standardWarning: {
          backgroundColor: mode === 'dark' ? 'rgba(237, 108, 2, 0.16)' : 'rgba(237, 108, 2, 0.12)',
          color: mode === 'dark' ? '#E0E0E0' : '#ed6c02',
        },
        standardError: {
          backgroundColor: mode === 'dark' ? 'rgba(211, 47, 47, 0.16)' : 'rgba(211, 47, 47, 0.12)',
          color: mode === 'dark' ? '#E0E0E0' : '#d32f2f',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
        },
        switchBase: {
          padding: 0,
          margin: 2,
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#FFFFFF',
            '& + .MuiSwitch-track': {
              backgroundColor: '#E989A7',
              opacity: 1,
              border: 'none',
            },
          },
        },
        thumb: {
          width: 22,
          height: 22,
        },
        track: {
          borderRadius: 13,
          border: '1px solid #E989A7',
          backgroundColor: '#E989A7',
          opacity: 1,
        },
      },
    },
  },
});

export default getTheme; 