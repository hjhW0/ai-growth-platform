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
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '480px',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 0',
      paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      borderTop: '1px solid #27272a',
      zIndex: 50
    }}>
      {NAV_ITEMS.map(item => {
        const active = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path} style={{
            textDecoration: 'none',
            color: active ? '#6366f1' : '#71717a',
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: active ? '600' : '400',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: '6px 8px',
            minWidth: '44px',
            minHeight: '44px',
            justifyContent: 'center',
            borderRadius: '8px',
            backgroundColor: active ? 'rgba(99,102,241,0.1)' : 'transparent',
            transition: 'all 0.2s ease'
          }}>
            <span style={{ fontSize: '18px', lineHeight: 1 }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
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
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a'
      }}>
        <div style={{ textAlign: 'center', color: '#71717a' }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>✨</div>
          <div style={{ fontSize: '14px' }}>加载中...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* 顶部导航栏 */}
        <nav style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#0a0a0a',
          color: '#fafafa',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: '1px solid #27272a'
        }}>
          <h1 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: '#fafafa' }}>✨ AI 成长平台</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: '#a1a1aa' }}>{user.username}</span>
            <button
              onClick={handleLogout}
              style={{
                background: '#111111',
                border: '1px solid #27272a',
                color: '#a1a1aa',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                minHeight: '32px',
                transition: 'all 0.2s ease'
              }}
            >
              退出
            </button>
          </div>
        </nav>

        {/* 页面内容 */}
        <main style={{
          width: '100%',
          maxWidth: '480px',
          padding: '16px',
          flex: 1,
          paddingBottom: '80px'
        }}>
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
