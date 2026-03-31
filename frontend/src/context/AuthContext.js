import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
 
const AuthContext = createContext(null);
 
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const token = localStorage.getItem('bvp_token');
    const savedUser = localStorage.getItem('bvp_user');
    if (token && savedUser) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);
 
  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const { token, user: userData } = res.data.data;
    localStorage.setItem('bvp_token', token);
    localStorage.setItem('bvp_user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    return userData;
  };
 
  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  };
 
  const changePassword = async (currentPassword, newPassword) => {
    const res = await api.put('/auth/change-password', { currentPassword, newPassword });
    return res.data;
  };
 
  const logout = () => {
    localStorage.removeItem('bvp_token');
    localStorage.removeItem('bvp_user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };
 
  const isPrant = user?.role === 'prant_secretary' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';
  const isBranch = user?.role === 'branch_secretary';
 
  return (
    <AuthContext.Provider value={{ user, loading, login, register, changePassword, logout, isPrant, isAdmin, isBranch }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
 