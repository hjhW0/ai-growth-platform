import React, { useState } from 'react';
import { login, register, trackEvent } from '../api/apiClient';
import { t, input, focusBorder, blurBorder } from '../styles/tokens';
import { Sprout } from 'lucide-react';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let data = isRegister ? await register(username, password) : await login(username, password);
      trackEvent(isRegister ? 'register' : 'login');
      onLogin(data.user);
    } catch (err) {
      setError(err.error || '操作失败');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: t.bg,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 背景装饰 */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: '500px', height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(78, 238, 148, 0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', left: '-10%',
        width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167, 139, 250, 0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Left branding panel */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, rgba(78, 238, 148, 0.08) 0%, rgba(167, 139, 250, 0.08) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: t.sp8,
        position: 'relative',
        overflow: 'hidden',
        borderRight: '1px solid rgba(78, 238, 148, 0.1)',
      }}>
        {/* 装饰光晕 */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-10%',
          width: '300px', height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(78, 238, 148, 0.1) 0%, transparent 60%)',
          animation: 'breathe 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', left: '-5%',
          width: '250px', height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.08) 0%, transparent 60%)',
          animation: 'breathe 8s ease-in-out 1s infinite',
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="ai-orb" style={{ width: 80, height: 80, margin: `0 auto ${t.sp6}` }}>
            <Sprout size={32} style={{ color: t.primary }} />
          </div>
          <h1 style={{
            fontSize: '32px', fontWeight: '700', margin: `0 0 ${t.sp4} 0`,
            letterSpacing: '-0.03em', lineHeight: 1.2,
            color: t.text,
          }}>
            赛博温室
          </h1>
          <p style={{
            fontSize: t.lg, margin: 0,
            lineHeight: 1.7, maxWidth: '320px',
            color: t.textSecondary,
          }}>
            一个陪伴你成长的<br />
            <span style={{ color: t.primary, fontWeight: '600' }}>数字温室</span>
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: t.sp6,
        maxWidth: '480px',
      }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          {/* Mobile-only logo */}
          <div style={{
            textAlign: 'center', marginBottom: t.sp8,
          }}>
            <div className="ai-orb" style={{ width: 56, height: 56, margin: `0 auto ${t.sp3}` }}>
              <Sprout size={24} style={{ color: t.primary }} />
            </div>
            <h1 style={{
              fontSize: t['2xl'], fontWeight: '700',
              color: t.text, margin: 0,
              letterSpacing: '-0.02em',
            }}>
              赛博温室
            </h1>
          </div>

          <h2 style={{
            fontSize: t.xl, fontWeight: '600', color: t.text,
            margin: `0 0 ${t.sp2} 0`,
          }}>
            {isRegister ? '开始你的成长之旅' : '欢迎回来'}
          </h2>
          <p style={{
            fontSize: t.base, color: t.textSecondary,
            margin: `0 0 ${t.sp6} 0`,
          }}>
            {isRegister ? '种下第一颗种子，让温室开始陪伴你' : '温室一直在等你'}
          </p>

          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              color: t.error,
              padding: `${t.sp3} ${t.sp4}`,
              borderRadius: t.rMd,
              marginBottom: t.sp4,
              fontSize: t.base,
              border: '1px solid rgba(239,68,68,0.15)',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: t.sp4 }}>
              <label style={{
                fontSize: t.sm, color: t.textSecondary,
                fontWeight: '500', display: 'block',
                marginBottom: t.sp2,
              }}>用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={input}
                placeholder="输入用户名"
                onFocus={focusBorder}
                onBlur={blurBorder}
              />
            </div>

            <div style={{ marginBottom: t.sp5 }}>
              <label style={{
                fontSize: t.sm, color: t.textSecondary,
                fontWeight: '500', display: 'block',
                marginBottom: t.sp2,
              }}>密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={input}
                placeholder="输入密码"
                onFocus={focusBorder}
                onBlur={blurBorder}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: t.rMd,
                border: 'none',
                fontSize: t.base,
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                minHeight: '44px',
                background: loading
                  ? 'rgba(255, 255, 255, 0.06)'
                  : 'linear-gradient(135deg, #4EEE94, #3cc07a)',
                color: loading ? t.textMuted : 'white',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(78, 238, 148, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {loading ? '正在连接温室...' : (isRegister ? '种下种子' : '进入温室')}
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            marginTop: t.sp5,
            color: t.textSecondary,
            fontSize: t.base,
          }}>
            {isRegister ? '已经有温室了？' : '还没有温室？'}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{
                background: 'none', border: 'none',
                color: t.primary, cursor: 'pointer',
                fontWeight: '600', fontSize: t.base,
                fontFamily: 'inherit',
                marginLeft: '4px',
              }}
            >
              {isRegister ? '立即进入' : '种一颗种子'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
