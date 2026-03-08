import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import DataEntryPage from './pages/DataEntryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import './index.css';

function App() {
  return (
    <Router>
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
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<DataEntryPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;