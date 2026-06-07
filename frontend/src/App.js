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
import { t } from './styles/tokens';

const NAV_ITEMS = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/goals', label: '目标', icon: '🎯' },
  { path: '/tasks', label: '任务', icon: '✅' },
  { path: '/checkin', label: '打卡', icon: '🔥' },
  { path: '/stats', label: '统计', icon: '📊' },
  { path: '/ai', label: 'AI', icon: '🤖' },
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
      backgroundColor: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '6px 0',
      paddingBottom: 'max(6px, env(safe-area-inset-bottom))',
      borderTop: `1px solid ${t.border}`,
      zIndex: 50,
    }}>
      {NAV_ITEMS.map(item => {
        const active = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path} style={{
            textDecoration: 'none',
            color: active ? t.primary : t.textMuted,
            textAlign: 'center',
            fontSize: '10px',
            fontWeight: active ? '600' : '500',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: '6px 8px',
            minWidth: '44px',
            minHeight: '44px',
            justifyContent: 'center',
            borderRadius: t.rMd,
            backgroundColor: active ? t.primaryLight : 'transparent',
            transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: '20px', lineHeight: 1 }}>{item.icon}</span>
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
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: t.bg,
      }}>
        <div style={{ textAlign: 'center', color: t.textMuted }}>
          <div style={{ fontSize: '32px', marginBottom: t.sp3 }}>🌱</div>
          <div style={{ fontSize: t.base }}>加载中...</div>
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
        backgroundColor: t.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Top bar */}
        <header style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: `${t.sp3} ${t.sp4}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: `1px solid ${t.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: t.sp2 }}>
            <span style={{ fontSize: '18px' }}>🌱</span>
            <span style={{
              fontSize: t.lg, fontWeight: '700', color: t.text,
              letterSpacing: '-0.02em',
            }}>成长平台</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: t.sp3 }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              backgroundColor: t.primaryLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '600', color: t.primary,
            }}>
              {user.username?.[0]?.toUpperCase() || '?'}
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: `1px solid ${t.border}`,
                color: t.textSecondary,
                padding: '4px 12px',
                borderRadius: t.rSm,
                cursor: 'pointer',
                fontSize: t.sm,
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              退出
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{
          width: '100%',
          maxWidth: '480px',
          padding: t.sp4,
          flex: 1,
          paddingBottom: '80px',
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
