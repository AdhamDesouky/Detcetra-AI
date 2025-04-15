import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  useTheme,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Tooltip,
  Container,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Visibility as ViewerIcon,
  Upload as UploadIcon,
  Description as ReportsIcon,
  Group as TeamIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Upload', icon: <UploadIcon />, path: '/upload' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  { text: 'Team', icon: <TeamIcon />, path: '/team' },
];

const Layout = ({ children, onThemeToggle, themeMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar 
            sx={{
              minHeight: { xs: 64, sm: 70 },
              py: 1,
            }}
          >
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 4,
                display: 'flex',
                fontWeight: 700,
                textDecoration: 'none',
                cursor: 'pointer',
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
              }}
              onClick={() => navigate('/dashboard')}
            >
              DETCETRA
            </Typography>

            <Box sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              gap: { xs: 1, sm: 2 },
              overflow: 'auto',
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: { xs: 1.5, sm: 2 },
                    minWidth: 'auto',
                    whiteSpace: 'nowrap',
                    ...(location.pathname === item.path && {
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.25)',
                      },
                    }),
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode`}>
                <IconButton onClick={onThemeToggle}>
                  {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
                  <Avatar sx={{ 
                    bgcolor: 'accent.main',
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                  }}>
                    <PersonIcon />
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ 
                  mt: '45px',
                  '& .MuiPaper-root': {
                    bgcolor: 'background.paper',
                  },
                }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem 
                  onClick={() => {
                    navigate('/settings/profile');
                    handleCloseUserMenu();
                  }}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <SettingsIcon sx={{ mr: 1 }} /> Profile Settings
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleLogout();
                    handleCloseUserMenu();
                  }}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <LogoutIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          bgcolor: 'background.default',
          mt: { xs: 8, sm: 9 },
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            height: '100%',
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 