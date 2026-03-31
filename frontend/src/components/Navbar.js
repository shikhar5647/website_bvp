import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import toast from 'react-hot-toast';
import './Navbar.css';
 
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', newPw: '' });
  const { user, logout, changePassword, isPrant } = useAuth();
  const navigate = useNavigate();
 
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out');
  };
 
  const handleChangePw = async (e) => {
    e.preventDefault();
    if (!pwForm.current || !pwForm.newPw) { toast.error('Fill both fields'); return; }
    try {
      await changePassword(pwForm.current, pwForm.newPw);
      toast.success('Password changed!');
      setShowPwModal(false);
      setPwForm({ current: '', newPw: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };
 
  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <div className="brand-emblem"><span>BVP</span></div>
            <div className="brand-text">
              <span className="brand-title">Bharat Vikas Parishad</span>
              <span className="brand-sub">Branch Report Portal</span>
            </div>
          </div>
 
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
 
          <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end onClick={() => setMenuOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Submit Report
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              Reports
            </NavLink>
            {isPrant && (
              <NavLink to="/analytics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                Analytics
              </NavLink>
            )}
 
            <div className="nav-user-section">
              <div className="nav-user-info">
                <span className="nav-user-name">{user?.username}</span>
                <span className="nav-user-role">{user?.role === 'branch_secretary' ? user?.branchName : user?.role?.replace('_', ' ')}</span>
              </div>
              <button className="nav-btn-sm" onClick={() => setShowPwModal(true)} title="Change Password">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </button>
              <button className="nav-btn-sm logout-btn" onClick={handleLogout} title="Logout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
 
      {showPwModal && (
        <div className="modal-overlay" onClick={() => setShowPwModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3>Change Password</h3>
            <form onSubmit={handleChangePw}>
              <div className="login-field">
                <label>Current Password</label>
                <input type="password" value={pwForm.current} onChange={e => setPwForm({...pwForm, current: e.target.value})} />
              </div>
              <div className="login-field">
                <label>New Password</label>
                <input type="password" value={pwForm.newPw} onChange={e => setPwForm({...pwForm, newPw: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="nav-prev-btn" onClick={() => setShowPwModal(false)}>Cancel</button>
                <button type="submit" className="login-btn" style={{width:'auto',padding:'10px 24px'}}>Change</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
 