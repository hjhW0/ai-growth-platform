import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Tasks from './pages/Tasks';
import CheckIn from './pages/CheckIn';
import Stats from './pages/Stats';
import AICenter from './pages/AICenter';
import GrowthLogs from './pages/GrowthLogs';

const NAV_ITEMS = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/goals', label: '目标', icon: '🎯' },
  { path: '/tasks', label: '任务', icon: '📋' },
  { path: '/checkin', label: '打卡', icon: '🔥' },
  { path: '/stats', label: '统计', icon: '📊' },
  { path: '/ai', label: 'AI', icon: '🤖' }
];

function BottomNav() {
  const location = useLocation();
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      backgroundColor: 'white', display: 'flex',
      justifyContent: 'space-around', padding: '12px 0',
      boxShadow: '0 -2px 8px rgba(0,0,0,0.1)'
    }}>
      {NAV_ITEMS.map(item => (
        <Link key={item.path} to={item.path} style={{
          textDecoration: 'none',
          color: location.pathname === item.path ? '#6366f1' : '#666',
          textAlign: 'center', fontSize: '12px'
        }}>
          <div style={{ fontSize: '20px' }}>{item.icon}</div>
          <div>{item.label}</div>
        </Link>
      ))}
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}>加载中...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        {/* 导航栏 */}
        <nav style={{
          backgroundColor: '#6366f1',
          color: 'white',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>AI 成长平台</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>{user.username}</span>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              退出
            </button>
          </div>
        </nav>

        {/* 页面内容 */}
        <main style={{ padding: '24px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/ai" element={<AICenter />} />
            <Route path="/growth-logs" element={<GrowthLogs />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
