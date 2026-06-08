import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Rocket, ClipboardCheck, Zap, TrendingUp, Brain, Sprout, LogOut } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Tasks from './pages/Tasks';
import CheckIn from './pages/CheckIn';
import Stats from './pages/Stats';
import AICenter from './pages/AICenter';
import GrowthLogs from './pages/GrowthLogs';
import GrowthPet from './components/GrowthPet';
import { t } from './styles/tokens';

const NAV_ITEMS = [
  { path: '/', label: '首页', Icon: LayoutDashboard },
  { path: '/goals', label: '目标', Icon: Rocket },
  { path: '/tasks', label: '任务', Icon: ClipboardCheck },
  { path: '/checkin', label: '打卡', Icon: Zap },
  { path: '/stats', label: '统计', Icon: TrendingUp },
  { path: '/ai', label: 'AI', Icon: Brain },
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
      backgroundColor: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '6px 0',
      paddingBottom: 'max(6px, env(safe-area-inset-bottom))',
      borderTop: `1px solid ${t.border}`,
      boxShadow: '0 -12px 28px rgba(31, 85, 52, 0.08)',
      zIndex: 50,
    }}>
      {NAV_ITEMS.map(item => {
        const active = location.pathname === item.path;
        const { Icon } = item;
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
            gap: '3px',
            padding: '6px 10px',
            minWidth: '48px',
            minHeight: '48px',
            justifyContent: 'center',
            borderRadius: t.rMd,
            backgroundColor: active ? t.primaryLight : 'transparent',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: 'none',
            transform: active ? 'scale(1.05)' : 'scale(1)',
          }}>
            <div className="nav-icon" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: active ? 'scale(1.15)' : 'scale(1)',
            }}>
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            </div>
            <span style={{ marginTop: '1px' }}>{item.label}</span>
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
        <div style={{ textAlign: 'center' }}>
          <div className="ai-orb" style={{ margin: '0 auto 16px', width: 56, height: 56 }}>
            <Sprout size={24} style={{ color: t.primary }} />
          </div>
          <div style={{ color: t.textMuted, fontSize: t.sm, animation: 'pulse 1.5s infinite' }}>
            正在唤醒温室...
          </div>
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
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: `${t.sp3} ${t.sp4}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: `1px solid ${t.border}`,
          boxShadow: '0 12px 28px rgba(31, 85, 52, 0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: t.sp2 }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(34, 197, 94, 0.22)',
              boxShadow: '0 8px 16px rgba(34, 197, 94, 0.14)',
              animation: 'breathe 4s ease-in-out infinite',
            }}>
              <Sprout size={16} style={{ color: t.primary }} />
            </div>
            <span style={{
              fontSize: t.lg, fontWeight: '700', color: t.text,
              letterSpacing: '-0.02em',
            }}>赛博温室</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: t.sp3 }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '600', color: t.primary,
              border: '1px solid rgba(34, 197, 94, 0.24)',
              boxShadow: '0 8px 18px rgba(31, 85, 52, 0.1)',
            }}>
              {user.username?.[0]?.toUpperCase() || '?'}
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: t.surfaceAlt,
                border: `1px solid ${t.border}`,
                color: t.textSecondary,
                padding: '6px 10px',
                borderRadius: t.rSm,
                cursor: 'pointer',
                fontSize: t.sm,
                fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: '4px',
                transition: 'all 0.2s',
              }}
            >
              <LogOut size={14} />
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
        <GrowthPet />
      </div>
    </Router>
  );
}

export default App;
