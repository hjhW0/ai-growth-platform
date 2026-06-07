import React, { useState, useEffect } from 'react';
import { Flame, Target, Lightbulb, Sparkles, MessageCircle, CheckCircle2, Star, TrendingUp, Sprout } from 'lucide-react';
import { getTodayStats, getTasks, getStreak, getGoals, getGrowthLogs, submitFeedback, trackEvent } from '../api/apiClient';
import { getToday } from '../utils/dateFormatter';
import { t, card, focusBorder, blurBorder } from '../styles/tokens';

function Skeleton({ height = 20, width = '100%', borderRadius = t.rSm, style = {} }) {
  return (
    <div style={{
      height, width, borderRadius,
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style,
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
  const [error, setError] = useState(null);
  const today = getToday();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [statsData, tasksData, streakData, goalsData, logsData] = await Promise.all([
        getTodayStats(), getTasks({ date: today }), getStreak(),
        getGoals({ status: 'active' }), getGrowthLogs({ limit: 1 })
      ]);
      setStats(statsData);
      setTodayTasks(tasksData.tasks || []);
      setStreak(streakData.streak || 0);
      const goals = goalsData.data || goalsData.goals || [];
      setActiveGoal(goals.length > 0 ? goals[0] : null);
      const logs = logsData.data || [];
      setLatestLog(logs.length > 0 ? logs[0] : null);
      setError(null);
    } catch (error) {
      console.error('加载数据失败:', error);
      setError('加载数据失败，请稍后重试');
    }
    setLoading(false);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackContent.trim()) return;
    try {
      await submitFeedback(feedbackContent, feedbackRating);
      trackEvent('submit_feedback', JSON.stringify({ rating: feedbackRating }));
      setFeedbackSent(true);
      setTimeout(() => {
        setShowFeedback(false);
        setFeedbackContent(''); setFeedbackRating(5); setFeedbackSent(false);
      }, 1500);
    } catch (e) { alert('提交失败，请重试'); }
  };

  const completedCount = stats?.completed || 0;
  const totalCount = stats?.total || 0;
  const rate = stats?.rate || 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return { text: '夜深了', sub: '早点休息，明天继续加油' };
    if (hour < 12) return { text: '早上好', sub: '新的一天，从第一个任务开始' };
    if (hour < 18) return { text: '下午好', sub: '保持专注，你做得很棒' };
    return { text: '晚上好', sub: '回顾一下今天的收获吧' };
  };

  const greeting = getGreeting();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user.username || '用户';

  if (loading) {
    return (
      <div>
        <div style={{ ...card, marginBottom: t.sp4 }}>
          <Skeleton height={18} width="50%" style={{ marginBottom: t.sp3 }} />
          <Skeleton height={12} width="35%" style={{ marginBottom: t.sp5 }} />
          <Skeleton height={64} borderRadius={t.rMd} />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ ...card, marginBottom: t.sp3 }}>
            <Skeleton height={12} width="30%" style={{ marginBottom: t.sp3 }} />
            <Skeleton height={14} width="70%" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...card, textAlign: 'center', padding: `${t.sp8} ${t.sp5}`, backgroundColor: t.errorLight, border: `1px solid rgba(239,68,68,0.15)` }}>
        <Sparkles size={32} style={{ color: t.error, marginBottom: t.sp3 }} />
        <div style={{ color: t.error, fontSize: t.md, fontWeight: '500', marginBottom: t.sp2 }}>{error}</div>
        <button onClick={() => { setLoading(true); setError(null); loadData(); }} style={{
          padding: `${t.sp3} ${t.sp5}`, borderRadius: t.rMd, border: 'none',
          backgroundColor: t.primary, color: 'white', cursor: 'pointer',
          fontSize: t.sm, fontWeight: '600', fontFamily: 'inherit',
        }}>重试</button>
      </div>
    );
  }

  return (
    <div>
      {/* Greeting + Today Progress */}
      <div className="animate-in" style={{
        ...card,
        marginBottom: t.sp4,
        background: `linear-gradient(135deg, ${t.primaryLight} 0%, #f0f0ff 100%)`,
        border: `1px solid rgba(91,95,239,0.15)`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: t.sp4 }}>
          <div>
            <div style={{ fontSize: t['2xl'], fontWeight: '700', color: t.text, letterSpacing: '-0.02em' }}>
              {greeting.text}，{username}
            </div>
            <div style={{ fontSize: t.sm, color: t.textSecondary, marginTop: t.sp1 }}>
              {greeting.sub}
            </div>
          </div>
          {streak > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              backgroundColor: 'rgba(245,158,11,0.1)',
              padding: '4px 10px', borderRadius: t.rFull,
              border: '1px solid rgba(245,158,11,0.2)',
            }}>
              <Flame size={14} style={{ color: t.warning }} />
              <span style={{ fontSize: t.sm, fontWeight: '700', color: t.warning }}>{streak}</span>
            </div>
          )}
        </div>

        <div style={{
          backgroundColor: t.surface,
          borderRadius: t.rMd,
          padding: t.sp4,
          border: `1px solid ${t.border}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: t.sp3 }}>
            <span style={{ fontSize: t.sm, fontWeight: '600', color: t.text }}>今日进度</span>
            <span style={{ fontSize: t.sm, color: t.textSecondary }}>
              {completedCount}/{totalCount}
            </span>
          </div>
          <div style={{
            backgroundColor: t.surfaceAlt,
            borderRadius: t.rFull,
            height: '8px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              borderRadius: t.rFull,
              width: `${rate}%`,
              transition: 'width 0.6s ease',
              background: rate >= 80
                ? `linear-gradient(90deg, ${t.success}, #34d399)`
                : rate >= 50
                  ? `linear-gradient(90deg, ${t.warning}, #fbbf24)`
                  : `linear-gradient(90deg, ${t.primary}, #818cf8)`,
            }} />
          </div>
          <div style={{ textAlign: 'right', marginTop: t.sp2, fontSize: t.xs, color: t.textMuted }}>
            {rate >= 80 ? '太棒了！继续保持' : rate >= 50 ? '过半了，加油' : '刚刚开始，慢慢来'}
          </div>
        </div>
      </div>

      {/* Today Tasks */}
      <div className="animate-in animate-in-delay-1" style={{ ...card, marginBottom: t.sp3 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: t.sp3 }}>
          <span style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', letterSpacing: '0.02em' }}>
            今日任务
          </span>
          {todayTasks.length > 0 && (
            <span style={{ fontSize: t.xs, color: t.textMuted }}>{todayTasks.length} 项</span>
          )}
        </div>
        {todayTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: `${t.sp6} 0` }}>
            <Sprout size={32} style={{ color: t.textMuted, marginBottom: t.sp2 }} />
            <div style={{ color: t.textSecondary, fontSize: t.base, marginBottom: t.sp1 }}>今天还没有任务</div>
            <div style={{ color: t.textMuted, fontSize: t.sm }}>去"任务"页面添加吧</div>
          </div>
        ) : (
          <div>
            {todayTasks.slice(0, 5).map((task, idx) => (
              <div key={task.id} style={{
                display: 'flex', alignItems: 'center', gap: t.sp3,
                padding: `${t.sp3} 0`,
                borderBottom: idx < Math.min(todayTasks.length, 5) - 1 ? `1px solid ${t.borderLight}` : 'none',
              }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${task.status === 'completed' ? t.success : t.border}`,
                  backgroundColor: task.status === 'completed' ? t.success : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {task.status === 'completed' && <CheckCircle2 size={14} style={{ color: 'white' }} />}
                </div>
                <span style={{
                  flex: 1, fontSize: t.base,
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  color: task.status === 'completed' ? t.textMuted : t.text,
                }}>
                  {task.title}
                </span>
                {task.priority === 'high' && (
                  <span style={{ fontSize: t.xs, color: t.error, flexShrink: 0 }}>高</span>
                )}
              </div>
            ))}
            {todayTasks.length > 5 && (
              <a href="/tasks" style={{
                display: 'block', textAlign: 'center', padding: t.sp3,
                color: t.primary, textDecoration: 'none',
                fontSize: t.sm, fontWeight: '500',
              }}>
                还有 {todayTasks.length - 5} 项 →
              </a>
            )}
          </div>
        )}
      </div>

      {/* Active Goal */}
      <div className="animate-in animate-in-delay-2" style={{ ...card, marginBottom: t.sp3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: t.sp2, marginBottom: t.sp3 }}>
          <Target size={14} style={{ color: t.textMuted }} />
          <span style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', letterSpacing: '0.02em' }}>当前目标</span>
        </div>
        {activeGoal ? (
          <div>
            <div style={{ fontSize: t.md, fontWeight: '600', color: t.text, marginBottom: t.sp1 }}>
              {activeGoal.title}
            </div>
            {activeGoal.description && (
              <div style={{ fontSize: t.sm, color: t.textSecondary, marginBottom: t.sp3, lineHeight: 1.5 }}>
                {activeGoal.description}
              </div>
            )}
            <div style={{ display: 'flex', gap: t.sp2, flexWrap: 'wrap' }}>
              <span style={{
                padding: '2px 8px', borderRadius: t.rSm,
                fontSize: t.xs, fontWeight: '500',
                backgroundColor: activeGoal.priority === 'high' ? t.errorLight : activeGoal.priority === 'medium' ? t.warningLight : t.successLight,
                color: activeGoal.priority === 'high' ? t.error : activeGoal.priority === 'medium' ? t.warning : t.success,
              }}>
                {activeGoal.priority === 'high' ? '高优先' : activeGoal.priority === 'medium' ? '中优先' : '低优先'}
              </span>
              {activeGoal.deadline && (
                <span style={{
                  padding: '2px 8px', borderRadius: t.rSm,
                  fontSize: t.xs, backgroundColor: t.surfaceAlt, color: t.textMuted,
                }}>
                  截止 {activeGoal.deadline}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: `${t.sp5} 0` }}>
            <Target size={28} style={{ color: t.textMuted, marginBottom: t.sp2 }} />
            <div style={{ color: t.textSecondary, fontSize: t.sm }}>暂无活跃目标</div>
          </div>
        )}
      </div>

      {/* AI Insight */}
      <div className="animate-in animate-in-delay-3" style={{ ...card, marginBottom: t.sp3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: t.sp2, marginBottom: t.sp3 }}>
          <Lightbulb size={14} style={{ color: t.textMuted }} />
          <span style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', letterSpacing: '0.02em' }}>AI 洞察</span>
        </div>
        {latestLog ? (
          <div>
            <div style={{
              fontSize: t.sm, color: t.textSecondary, lineHeight: 1.7,
              whiteSpace: 'pre-wrap', padding: t.sp3,
              backgroundColor: t.primaryLight, borderRadius: t.rMd,
              border: `1px solid rgba(91,95,239,0.1)`,
            }}>
              {latestLog.ai_summary || latestLog.content}
            </div>
            <div style={{ fontSize: t.xs, color: t.textMuted, marginTop: t.sp2 }}>
              {latestLog.log_date}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: `${t.sp5} 0` }}>
            <Lightbulb size={28} style={{ color: t.textMuted, marginBottom: t.sp2 }} />
            <div style={{ color: t.textSecondary, fontSize: t.sm }}>完成今日任务后可生成复盘</div>
          </div>
        )}
      </div>

      {/* Feedback FAB */}
      <div
        onClick={() => setShowFeedback(true)}
        style={{
          position: 'fixed', bottom: '80px', right: '20px',
          width: '48px', height: '48px', borderRadius: '50%',
          backgroundColor: t.primary, color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 40,
          boxShadow: '0 4px 14px rgba(91,95,239,0.35)',
          transition: 'transform 0.15s',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageCircle size={20} />
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: t.sp4,
        }} onClick={() => setShowFeedback(false)}>
          <div style={{
            backgroundColor: t.surface, borderRadius: t.rXl,
            padding: t.sp6, width: '100%', maxWidth: '400px',
            border: `1px solid ${t.border}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            animation: 'scaleIn 0.2s ease-out',
          }} onClick={e => e.stopPropagation()}>
            {feedbackSent ? (
              <div style={{ textAlign: 'center', padding: `${t.sp8} 0` }}>
                <CheckCircle2 size={40} style={{ color: t.success, marginBottom: t.sp3 }} />
                <div style={{ fontSize: t.lg, fontWeight: '600', color: t.text }}>感谢你的反馈！</div>
                <div style={{ fontSize: t.sm, color: t.textSecondary, marginTop: t.sp2 }}>我们会认真改进</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: t.lg, fontWeight: '600', color: t.text, marginBottom: t.sp5 }}>
                  意见反馈
                </div>
                <div style={{ marginBottom: t.sp4 }}>
                  <div style={{ fontSize: t.sm, color: t.textSecondary, marginBottom: t.sp2 }}>整体体验</div>
                  <div style={{ display: 'flex', gap: t.sp2 }}>
                    {[1,2,3,4,5].map(i => (
                      <Star
                        key={i}
                        size={24}
                        onClick={() => setFeedbackRating(i)}
                        style={{
                          cursor: 'pointer', transition: 'transform 0.1s',
                          transform: i <= feedbackRating ? 'scale(1.15)' : 'scale(1)',
                          color: i <= feedbackRating ? t.warning : t.border,
                          fill: i <= feedbackRating ? t.warning : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                </div>
                <textarea
                  value={feedbackContent}
                  onChange={e => setFeedbackContent(e.target.value)}
                  placeholder="说说你的使用感受..."
                  style={{
                    width: '100%', minHeight: '90px',
                    padding: t.sp3, borderRadius: t.rMd,
                    border: `1.5px solid ${t.border}`,
                    fontSize: t.base, resize: 'vertical', outline: 'none',
                    boxSizing: 'border-box', fontFamily: 'inherit',
                    backgroundColor: t.bg, color: t.text,
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
                <button
                  onClick={handleSubmitFeedback}
                  disabled={!feedbackContent.trim()}
                  style={{
                    width: '100%', marginTop: t.sp4,
                    padding: t.sp3, borderRadius: t.rMd, border: 'none',
                    background: feedbackContent.trim() ? t.primary : t.border,
                    color: feedbackContent.trim() ? 'white' : t.textMuted,
                    fontSize: t.base, fontWeight: '600',
                    cursor: feedbackContent.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: 'inherit', minHeight: '44px',
                    transition: 'all 0.15s',
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
