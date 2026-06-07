import React, { useState } from 'react';
import { login, register } from '../api/apiClient';
import { t, input, btnPrimary, focusBorder, blurBorder } from '../styles/tokens';

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
    }}>
      {/* Left branding panel - hidden on mobile */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #5b5fef 0%, #7c3aed 50%, #a855f7 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: t.sp8,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-10%',
          width: '400px', height: '400px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', left: '-5%',
          width: '300px', height: '300px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '64px', marginBottom: t.sp6 }}>🌱</div>
          <h1 style={{
            fontSize: '32px', fontWeight: '700', margin: `0 0 ${t.sp4} 0`,
            letterSpacing: '-0.03em', lineHeight: 1.2,
          }}>
            AI 成长平台
          </h1>
          <p style={{
            fontSize: t.lg, opacity: 0.85, margin: 0,
            lineHeight: 1.6, maxWidth: '320px',
          }}>
            陪你养成好习惯<br />让每一天的进步都看得见
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
            <div style={{ fontSize: '40px', marginBottom: t.sp3 }}>🌱</div>
            <h1 style={{
              fontSize: t['2xl'], fontWeight: '700',
              color: t.text, margin: 0,
              letterSpacing: '-0.02em',
            }}>
              AI 成长平台
            </h1>
          </div>

          <h2 style={{
            fontSize: t.xl, fontWeight: '600', color: t.text,
            margin: `0 0 ${t.sp2} 0`,
          }}>
            {isRegister ? '创建账号' : '欢迎回来'}
          </h2>
          <p style={{
            fontSize: t.base, color: t.textSecondary,
            margin: `0 0 ${t.sp6} 0`,
          }}>
            {isRegister ? '注册后开始记录你的成长' : '登录继续你的成长之旅'}
          </p>

          {error && (
            <div style={{
              backgroundColor: t.errorLight,
              color: t.error,
              padding: `${t.sp3} ${t.sp4}`,
              borderRadius: t.rMd,
              marginBottom: t.sp4,
              fontSize: t.base,
              border: `1px solid rgba(239,68,68,0.2)`,
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
                placeholder="请输入用户名"
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
                placeholder="请输入密码"
                onFocus={focusBorder}
                onBlur={blurBorder}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...btnPrimary,
                width: '100%',
                backgroundColor: loading ? t.border : t.primary,
                color: loading ? t.textMuted : 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? '处理中...' : (isRegister ? '注册' : '登录')}
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            marginTop: t.sp5,
            color: t.textSecondary,
            fontSize: t.base,
          }}>
            {isRegister ? '已有账号？' : '没有账号？'}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{
                background: 'none', border: 'none',
                color: t.primary, cursor: 'pointer',
                fontWeight: '600', fontSize: t.base,
                fontFamily: 'inherit',
              }}
            >
              {isRegister ? '立即登录' : '立即注册'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
