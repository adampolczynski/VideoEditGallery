import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { useAuthStore } from './store';
import { authAPI } from './api';

// Router component wrapped with location tracking
function AppRoutes() {
  const { isAuthenticated, setToken } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Check if token is still valid on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          await authAPI.verify();
          setToken(token);
        } catch {
          setToken(null);
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
