import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getTheme from './theme';

// Components
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CaseViewer from './pages/CaseViewer';
import Upload from './pages/Upload';
import Reports from './pages/Reports';
import Team from './pages/Team';
import Settings from './pages/Settings';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'dark';
  });

  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const showToast = (message, severity = 'info') => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login showToast={showToast} />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout onThemeToggle={toggleTheme} themeMode={mode}>
                    <Dashboard showToast={showToast} />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/viewer/:caseId"
              element={
                <ProtectedRoute>
                  <Layout onThemeToggle={toggleTheme} themeMode={mode}>
                    <CaseViewer showToast={showToast} />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Layout onThemeToggle={toggleTheme} themeMode={mode}>
                    <Upload showToast={showToast} />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Layout onThemeToggle={toggleTheme} themeMode={mode}>
                    <Reports showToast={showToast} />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <Layout onThemeToggle={toggleTheme} themeMode={mode}>
                    <Team showToast={showToast} />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/*"
              element={
                <ProtectedRoute>
                  <Layout onThemeToggle={toggleTheme} themeMode={mode}>
                    <Settings showToast={showToast} />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
        <Toast
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          onClose={handleCloseToast}
        />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
