import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DataEntryPage from './pages/DataEntryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import './index.css';
 
function ProtectedRoute({ children, requirePrant = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (requirePrant && user.role === 'branch_secretary') return <Navigate to="/" />;
  return children;
}
 
function AppRoutes() {
  const { user } = useAuth();
 
  return (
    <>
      {user && <Navbar />}
      <main>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute><DataEntryPage /></ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute><AnalyticsPage /></ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute><ReportsPage /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}
 
function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, sans-serif',
              borderRadius: '12px',
              background: '#1B2A3B',
              color: '#FFF8F0',
              border: '1px solid rgba(212,175,55,0.3)',
            },
            success: { iconTheme: { primary: '#FF6B00', secondary: '#fff' } },
          }}
        />
        <AppRoutes />
        <Analytics />
      </AuthProvider>
    </Router>
  );
}
 
export default App;
 