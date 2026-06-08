import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Rocket, ClipboardCheck, Zap, TrendingUp, Brain, Sprout, LogOut, Download } from 'lucide-react';
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
  { path: '/', label: '首页', Icon: LayoutDashboard },
  { path: '/goals', label: '目标', Icon: Rocket },
  { path: '/tasks', label: '任务', Icon: ClipboardCheck },
  { path: '/checkin', label: '打卡', Icon: Zap },
  { path: '/stats', label: '统计', Icon: TrendingUp },
  { path: '/ai', label: 'AI', Icon: Brain },
];

// PWA 安装提示组件
function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showTip, setShowTip] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const android = /Android/.test(navigator.userAgent);
    setIsIOS(iOS);
    setIsAndroid(android);

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowTip(!showTip);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      right: '16px',
      zIndex: 100,
    }}>
      <button
        onClick={handleInstall}
        style={{
          background: 'linear-gradient(135deg, #4EEE94, #3cc07a)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(78, 238, 148, 0.3)',
          animation: 'breathe 3s ease-in-out infinite',
        }}
        title="安装到桌面"
      >
        <Download size={20} />
      </button>
      {showTip && (
        <div style={{
          position: 'absolute',
          bottom: '56px',
          right: '0',
          background: 'rgba(26, 28, 41, 0.95)',
          backdropFilter: 'blur(16px)',
          color: t.text,
          padding: '12px 16px',
          borderRadius: '12px',
          fontSize: '13px',
          whiteSpace: 'nowrap',
          border: '1px solid rgba(78, 238, 148, 0.2)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}>
          {isIOS ? '点击分享 → 添加到主屏幕' :
           isAndroid ? 'Chrome 菜单 ⋮ → 安装应用' :
           '浏览器菜单 → 安装到桌面'}
        </div>
      )}
    </div>
  );
}

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
      backgroundColor: 'rgba(18, 19, 26, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '6px 0',
      paddingBottom: 'max(6px, env(safe-area-inset-bottom))',
      borderTop: '1px solid rgba(78, 238, 148, 0.1)',
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
            backgroundColor: active ? 'rgba(78, 238, 148, 0.1)' : 'transparent',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: active ? 'drop-shadow(0 0 8px rgba(78, 238, 148, 0.4))' : 'none',
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
          backgroundColor: 'rgba(18, 19, 26, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: `${t.sp3} ${t.sp4}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: '1px solid rgba(78, 238, 148, 0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: t.sp2 }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, rgba(78, 238, 148, 0.3), rgba(78, 238, 148, 0.1) 60%, transparent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(78, 238, 148, 0.25)',
              boxShadow: '0 0 12px rgba(78, 238, 148, 0.15)',
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
              background: 'radial-gradient(circle at 35% 35%, rgba(78, 238, 148, 0.25), rgba(167, 139, 250, 0.15))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '600', color: t.primary,
              border: '1px solid rgba(78, 238, 148, 0.25)',
              boxShadow: '0 0 10px rgba(78, 238, 148, 0.15)',
            }}>
              {user.username?.[0]?.toUpperCase() || '?'}
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
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
        <InstallPrompt />
      </div>
    </Router>
  );
}

export default App;
