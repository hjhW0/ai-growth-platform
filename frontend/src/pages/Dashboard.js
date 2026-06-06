import React, { useState, useEffect } from 'react';
import { getTodayStats, getTasks, getStreak, getGoals, getGrowthLogs, submitFeedback } from '../api/apiClient';
import { getToday } from '../utils/dateFormatter';

const CARD = {
  backgroundColor: '#111111',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '12px',
  border: '1px solid #27272a'
};

const CARD_LABEL = {
  fontSize: '12px',
  color: '#71717a',
  marginBottom: '14px',
  fontWeight: '500'
};

function Skeleton({ height = 20, width = '100%', borderRadius = '4px', style = {} }) {
  return (
    <div style={{
      height,
      width,
      borderRadius,
      backgroundColor: '#1a1a1a',
      animation: 'pulse 1.5s ease-in-out infinite',
      ...style
    }} />
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [streak, setStreak] = useState(0);
  const [activeGoal, setActiveGoal] = useState(null);
  const [latestLog, setLatestLog] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const today = getToday();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, tasksData, streakData, goalsData, logsData] = await Promise.all([
        getTodayStats(),
        getTasks({ date: today }),
        getStreak(),
        getGoals({ status: 'active' }),
        getGrowthLogs({ limit: 1 })
      ]);
      setStats(statsData);
      setTodayTasks(tasksData.tasks || []);
      setStreak(streakData.streak || 0);
      const goals = goalsData.data || goalsData.goals || [];
      setActiveGoal(goals.length > 0 ? goals[0] : null);
      const logs = logsData.data || [];
      setLatestLog(logs.length > 0 ? logs[0] : null);
    } catch (error) {
      console.error('加载数据失败:', error);
    }
    setLoading(false);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackContent.trim()) return;
    try {
      await submitFeedback(feedbackContent, feedbackRating);
      setFeedbackSent(true);
      setTimeout(() => {
        setShowFeedback(false);
        setFeedbackContent('');
        setFeedbackRating(5);
        setFeedbackSent(false);
      }, 1500);
    } catch (e) {
      alert('提交失败，请重试');
    }
  };

  const completedCount = stats?.completed || 0;
  const totalCount = stats?.total || 0;
  const rate = stats?.rate || 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return { icon: '🌙', text: '夜深了，注意休息' };
    if (hour < 12) return { icon: '☀️', text: '早上好' };
    if (hour < 18) return { icon: '☀️', text: '下午好' };
    return { icon: '🌅', text: '晚上好' };
  };

  const greeting = getGreeting();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user.username || '用户';

  if (loading) {
    return (
      <div>
        <div style={{
          ...CARD,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.05) 100%)',
          borderColor: 'rgba(99,102,241,0.2)'
        }}>
          <Skeleton height={16} width="60%" borderRadius="8px" style={{ marginBottom: 8, backgroundColor: 'rgba(99,102,241,0.1)' }} />
          <Skeleton height={12} width="40%" borderRadius="6px" style={{ marginBottom: 20, backgroundColor: 'rgba(99,102,241,0.08)' }} />
          <Skeleton height={50} borderRadius="10px" style={{ backgroundColor: 'rgba(99,102,241,0.08)' }} />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} style={CARD}>
            <Skeleton height={12} width="30%" style={{ marginBottom: 12 }} />
            <Skeleton height={16} width="70%" style={{ marginBottom: 8 }} />
            <Skeleton height={12} width="50%" />
          </div>
        ))}
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* 问候 + 核心数据 */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.05) 100%)',
        borderRadius: '12px',
        padding: '24px',
        color: '#fafafa',
        marginBottom: '12px',
        border: '1px solid rgba(99,102,241,0.2)'
      }}>
        <div style={{ fontSize: '15px', color: '#a1a1aa', marginBottom: '4px' }}>
          {greeting.icon} {greeting.text}，{username}
        </div>
        <div style={{ fontSize: '13px', color: '#71717a', marginBottom: '20px' }}>
          🔥 已连续打卡 {streak} 天
        </div>

        <div style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '10px',
          padding: '14px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: '#a1a1aa' }}>今日任务</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#fafafa' }}>
              {completedCount}/{totalCount} 完成
            </span>
          </div>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '3px',
            height: '4px'
          }}>
            <div style={{
              backgroundColor: '#6366f1',
              borderRadius: '3px',
              height: '4px',
              width: `${rate}%`,
              transition: 'width 0.5s ease'
            }} />
          </div>
          <div style={{ textAlign: 'right', marginTop: '6px', fontSize: '11px', color: '#71717a' }}>
            完成率 {rate}%
          </div>
        </div>
      </div>

      {/* 当前核心目标 */}
      <div style={CARD}>
        <div style={CARD_LABEL}>🎯 当前核心目标</div>
        {activeGoal ? (
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#fafafa', marginBottom: '6px' }}>
              {activeGoal.title}
            </div>
            {activeGoal.description && (
              <div style={{ fontSize: '13px', color: '#71717a', marginBottom: '10px' }}>
                {activeGoal.description}
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#a1a1aa', flexWrap: 'wrap' }}>
              <span>{activeGoal.goal_type || '未分类'}</span>
              <span>{activeGoal.priority === 'high' ? '🔴 高优先级' : activeGoal.priority === 'medium' ? '🟡 中优先级' : '🟢 低优先级'}</span>
              {activeGoal.deadline && <span>截止 {activeGoal.deadline}</span>}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎯</div>
            <div style={{ color: '#71717a', fontSize: '14px' }}>暂无活跃目标</div>
            <div style={{ color: '#52525b', fontSize: '13px', marginTop: '4px' }}>去"目标"页面创建一个吧</div>
          </div>
        )}
      </div>

      {/* 最近 AI 建议 */}
      <div style={CARD}>
        <div style={CARD_LABEL}>🤖 最近 AI 建议</div>
        {latestLog ? (
          <div>
            <div style={{
              fontSize: '13px',
              color: '#a1a1aa',
              lineHeight: '1.7',
              whiteSpace: 'pre-wrap'
            }}>
              {latestLog.ai_summary || latestLog.content}
            </div>
            <div style={{ fontSize: '11px', color: '#52525b', marginTop: '10px' }}>
              {latestLog.log_date}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>💡</div>
            <div style={{ color: '#71717a', fontSize: '14px' }}>暂无 AI 建议</div>
            <div style={{ color: '#52525b', fontSize: '13px', marginTop: '4px' }}>完成今日任务后可生成复盘</div>
          </div>
        )}
      </div>

      {/* 今日任务列表 */}
      <div style={CARD}>
        <div style={CARD_LABEL}>📋 今日任务</div>
        {todayTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>✨</div>
            <div style={{ color: '#71717a', fontSize: '14px' }}>今天还没有任务</div>
            <div style={{ color: '#52525b', fontSize: '13px', marginTop: '4px' }}>去"任务"页面添加吧</div>
          </div>
        ) : (
          <div>
            {todayTasks.slice(0, 5).map(task => (
              <div key={task.id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px solid #1a1a1a'
              }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: `2px solid ${task.status === 'completed' ? '#22c55e' : '#3f3f46'}`,
                  backgroundColor: task.status === 'completed' ? '#22c55e' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px',
                  flexShrink: 0
                }}>
                  {task.status === 'completed' && (
                    <span style={{ color: 'white', fontSize: '10px' }}>✓</span>
                  )}
                </div>
                <span style={{
                  flex: 1,
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  color: task.status === 'completed' ? '#52525b' : '#fafafa',
                  fontSize: '14px'
                }}>
                  {task.title}
                </span>
                {task.priority === 'high' && (
                  <span style={{ fontSize: '11px', color: '#ef4444', marginLeft: '8px' }}>高</span>
                )}
              </div>
            ))}
            {todayTasks.length > 5 && (
              <a href="/tasks" style={{
                display: 'block',
                textAlign: 'center',
                padding: '12px',
                color: '#6366f1',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                还有 {todayTasks.length - 5} 项任务 →
              </a>
            )}
          </div>
        )}
      </div>

      {/* 浮动反馈按钮 */}
      <div
        onClick={() => setShowFeedback(true)}
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: '#6366f1',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          cursor: 'pointer',
          zIndex: 40,
          transition: 'transform 0.2s ease',
          boxShadow: '0 0 20px rgba(99,102,241,0.3)'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        💬
      </div>

      {/* 反馈弹窗 */}
      {showFeedback && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }} onClick={() => setShowFeedback(false)}>
          <div style={{
            backgroundColor: '#111111',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '400px',
            border: '1px solid #27272a'
          }} onClick={e => e.stopPropagation()}>
            {feedbackSent ? (
              <div style={{ textAlign: 'center', padding: '30px' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎉</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#fafafa' }}>感谢你的反馈！</div>
                <div style={{ fontSize: '13px', color: '#71717a', marginTop: '8px' }}>我们会认真改进</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#fafafa', marginBottom: '20px' }}>
                  💬 意见反馈
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', color: '#a1a1aa', marginBottom: '8px' }}>整体体验</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1,2,3,4,5].map(i => (
                      <span
                        key={i}
                        onClick={() => setFeedbackRating(i)}
                        style={{
                          fontSize: '22px',
                          cursor: 'pointer',
                          transition: 'transform 0.15s ease',
                          transform: i <= feedbackRating ? 'scale(1.1)' : 'scale(1)'
                        }}
                      >
                        {i <= feedbackRating ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>

                <textarea
                  value={feedbackContent}
                  onChange={e => setFeedbackContent(e.target.value)}
                  placeholder="说说你的使用感受..."
                  style={{
                    width: '100%',
                    minHeight: '90px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #27272a',
                    fontSize: '14px',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    backgroundColor: '#0a0a0a',
                    color: '#fafafa',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#27272a'}
                />

                <button
                  onClick={handleSubmitFeedback}
                  disabled={!feedbackContent.trim()}
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: feedbackContent.trim() ? '#6366f1' : '#1a1a1a',
                    color: feedbackContent.trim() ? 'white' : '#52525b',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: feedbackContent.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s'
                  }}
                >
                  提交反馈
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
