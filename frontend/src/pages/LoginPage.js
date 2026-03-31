import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import toast from 'react-hot-toast';
import './LoginPage.css';
 
const BRANCH_NAMES = [
  'Barmer Main','VDR Barmer','Gudamalani','Balotra','Jaisalmer','Pokaran',
  'Jalore','Bhinmal','Ahore','Sayala','Sanchore Main','VU Sanchore',
  'Jodhpur Main','Jodhpur Marwar','Nandanvan','Saraswati Nagar','Ratanada','Paota',
  'Suryanagari','Mathaniya','Osian','Pipar Nagar','Bap','Phalodi',
  'Pali','Sojat','Sumerpur Sheoganj','Falna Bali','Sadri',
  'Devnagri Sirohi','Pindwara','Aburoad','Mount Abu',
];
 
export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [regData, setRegData] = useState({ username: '', password: '', role: 'branch_secretary', branchName: '', districtName: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
 
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) { toast.error('Enter username and password'); return; }
    setLoading(true);
    try {
      await login(username, password);
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };
 
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regData.username || !regData.password) { toast.error('Enter username and password'); return; }
    if (regData.role === 'branch_secretary' && !regData.branchName) { toast.error('Select your branch'); return; }
    setLoading(true);
    try {
      await register(regData);
      toast.success('Registration successful! Awaiting admin approval.');
      setMode('login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };
 
  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-pattern" />
      </div>
      <div className="login-card fade-in">
        <div className="login-header">
          <div className="login-emblem"><span>BVP</span></div>
          <h1>Bharat Vikas Parishad</h1>
          <p>Rajasthan Pashchim — Branch Report Portal</p>
        </div>
 
        <div className="login-tabs">
          <button className={`login-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Login</button>
          <button className={`login-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>New Registration</button>
        </div>
 
        {mode === 'login' ? (
          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-field">
              <label>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. secretary_jodhpur_main" autoComplete="username" />
            </div>
            <div className="login-field">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" autoComplete="current-password" />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="login-hint">
              Default password for all accounts: <strong>1234</strong>
              <br />Please change after first login.
            </div>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleRegister}>
            <div className="login-field">
              <label>Username</label>
              <input type="text" value={regData.username} onChange={e => setRegData({...regData, username: e.target.value})} placeholder="e.g. secretary_branch_name" />
            </div>
            <div className="login-field">
              <label>Password</label>
              <input type="password" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} placeholder="Create password" />
            </div>
            <div className="login-field">
              <label>Role</label>
              <select value={regData.role} onChange={e => setRegData({...regData, role: e.target.value})}>
                <option value="branch_secretary">Branch Secretary</option>
                <option value="prant_secretary">Prant Secretary</option>
              </select>
            </div>
            {regData.role === 'branch_secretary' && (
              <div className="login-field">
                <label>Branch</label>
                <select value={regData.branchName} onChange={e => setRegData({...regData, branchName: e.target.value})}>
                  <option value="">-- Select Branch --</option>
                  {BRANCH_NAMES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            )}
            <button type="submit" className="login-btn register-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
            <div className="login-hint">
              New registrations require admin approval before you can login.
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
 