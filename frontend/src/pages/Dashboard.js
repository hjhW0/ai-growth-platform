import React, { useState, useEffect } from 'react';
import { Flame, Target, Lightbulb, Sparkles, MessageCircle, CheckCircle2, Star, Sprout, Trophy, Droplets } from 'lucide-react';
import { getTodayStats, getTasks, getStreak, getGoals, getGrowthLogs, submitFeedback, trackEvent } from '../api/apiClient';
import { getToday } from '../utils/dateFormatter';
import { t, card, focusBorder, blurBorder } from '../styles/tokens';
import EmptyPot from '../components/EmptyPot';
import ErrorState from '../components/ErrorState';
import { SkeletonCard } from '../components/Skeleton';

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
      setError('温室的信号有点弱，数据没加载到');
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
    if (hour < 6) return { text: '夜深了', sub: '早点休息，明天的种子等你来浇灌' };
    if (hour < 9) return { text: '早安', sub: '新的一天，温室里的小苗在等你' };
    if (hour < 12) return { text: '上午好', sub: '阳光正好，适合专注做事' };
    if (hour < 14) return { text: '中午好', sub: '休息一下，下午继续发光' };
    if (hour < 18) return { text: '下午好', sub: '保持节奏，你今天做得很棒' };
    if (hour < 21) return { text: '晚上好', sub: '回顾一下今天的收获吧' };
    return { text: '夜晚好', sub: '今天辛苦了，给自己一个拥抱' };
  };

  const greeting = getGreeting();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user.username || '用户';

  if (loading) {
    return (
      <div>
        <SkeletonCard lines={2} height={140} />
        <SkeletonCard lines={1} height={80} />
        <SkeletonCard lines={1} height={80} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => { setLoading(true); setError(null); loadData(); }} />;
  }

  const allDone = totalCount > 0 && completedCount === totalCount;

  return (
    <div>
      {/* Greeting + Today Progress */}
      <div className="animate-in" style={{
        ...card,
        marginBottom: t.sp4,
        background: 'linear-gradient(135deg, rgba(78, 238, 148, 0.08) 0%, rgba(167, 139, 250, 0.06) 100%)',
        border: '1px solid rgba(78, 238, 148, 0.12)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 装饰光晕 */}
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 100, height: 100, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(78, 238, 148, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: t.sp4 }}>
          <div>
            <div style={{ fontSize: t['2xl'], fontWeight: '700', color: t.text, letterSpacing: '-0.02em' }}>
              {greeting.text}，{username}
              <Sparkles size={18} style={{ color: t.primary, marginLeft: 6, verticalAlign: '-2px' }} />
            </div>
            <div style={{ fontSize: t.sm, color: t.textSecondary, marginTop: t.sp1 }}>
              {greeting.sub}
            </div>
          </div>
          {streak > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              backgroundColor: 'rgba(245,158,11,0.12)',
              padding: '6px 12px', borderRadius: t.rFull,
              border: '1px solid rgba(245,158,11,0.2)',
              boxShadow: '0 0 12px rgba(245,158,11,0.15)',
              animation: 'breathe 3s ease-in-out infinite',
            }}>
              <Flame size={14} style={{ color: t.warning }} />
              <span style={{ fontSize: t.sm, fontWeight: '700', color: t.warning }}>{streak}</span>
            </div>
          )}
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderRadius: t.rMd,
          padding: t.sp4,
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: t.sp3 }}>
            <span style={{ fontSize: t.sm, fontWeight: '600', color: t.text }}>
              {allDone ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Trophy size={15} style={{ color: t.warning }} /> 今日全部完成！
                </span>
              ) : '今日进度'}
            </span>
            <span style={{ fontSize: t.sm, color: t.textSecondary }}>
              {completedCount}/{totalCount}
            </span>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderRadius: t.rFull,
            height: '10px',
            overflow: 'hidden',
            position: 'relative',
          }}>
            <div style={{
              height: '100%',
              borderRadius: t.rFull,
              width: `${rate}%`,
              transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              background: rate >= 80
                ? 'linear-gradient(90deg, #4EEE94, #34d399)'
                : rate >= 50
                  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  : 'linear-gradient(90deg, #4EEE94, #a78bfa)',
              boxShadow: rate >= 80
                ? '0 0 14px rgba(78, 238, 148, 0.5)'
                : rate >= 50
                  ? '0 0 14px rgba(245, 158, 11, 0.4)'
                  : '0 0 10px rgba(78, 238, 148, 0.3)',
            }} />
          </div>
          <div style={{ textAlign: 'right', marginTop: t.sp2, fontSize: t.xs, color: t.textMuted }}>
            {allDone ? '太厉害了，今天全部搞定了！' : rate >= 80 ? '快完成了，冲刺一下！' : rate >= 50 ? '过半了，节奏很好' : rate > 0 ? '刚刚起步，慢慢来' : '今天还没开始，等你出发'}
          </div>
        </div>
      </div>

      {/* Today Tasks */}
      <div className="animate-in animate-in-delay-1" style={{ ...card, marginBottom: t.sp3 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: t.sp3 }}>
          <span style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', letterSpacing: '0.02em' }}>
            今日待办
          </span>
          {todayTasks.length > 0 && (
            <span style={{ fontSize: t.xs, color: t.textMuted }}>{todayTasks.length} 项</span>
          )}
        </div>
        {todayTasks.length === 0 ? (
          <EmptyPot text="今天是一张白纸" sub="等你去填满它" />
        ) : (
          <div>
            {todayTasks.slice(0, 5).map((task, idx) => (
              <div key={task.id} className="card-hover" style={{
                display: 'flex', alignItems: 'center', gap: t.sp3,
                padding: `${t.sp3} ${t.sp4}`,
                marginBottom: t.sp2,
                backgroundColor: task.status === 'completed' ? 'rgba(78, 238, 148, 0.04)' : 'rgba(255, 255, 255, 0.03)',
                borderRadius: t.rMd,
                border: `1px solid ${task.status === 'completed' ? 'rgba(78, 238, 148, 0.1)' : 'rgba(255, 255, 255, 0.05)'}`,
                cursor: 'default',
              }}>
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${task.status === 'completed' ? t.success : 'rgba(78, 238, 148, 0.25)'}`,
                  backgroundColor: task.status === 'completed' ? t.success : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: task.status === 'completed' ? '0 0 10px rgba(78, 238, 148, 0.3)' : 'none',
                  transition: 'all 0.3s ease',
                }}>
                  {task.status === 'completed' && <CheckCircle2 size={14} style={{ color: 'white' }} />}
                </div>
                <span style={{
                  flex: 1, fontSize: t.base,
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  color: task.status === 'completed' ? t.textMuted : t.text,
                  transition: 'all 0.2s',
                }}>
                  {task.title}
                </span>
                {task.priority === 'high' && (
                  <span style={{
                    fontSize: t.xs, color: t.error, flexShrink: 0,
                    padding: '2px 6px', borderRadius: t.rSm,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.15)',
                  }}>紧急</span>
                )}
              </div>
            ))}
            {todayTasks.length > 5 && (
              <a href="/tasks" style={{
                display: 'block', textAlign: 'center', padding: t.sp3,
                color: t.primary, textDecoration: 'none',
                fontSize: t.sm, fontWeight: '500',
                filter: 'drop-shadow(0 0 6px rgba(78, 238, 148, 0.3))',
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
          <div style={{
            width: '24px', height: '24px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(78, 238, 148, 0.2), rgba(167, 139, 250, 0.1))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(78, 238, 148, 0.2)',
          }}>
            <Target size={14} style={{ color: t.primary }} />
          </div>
          <span style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', letterSpacing: '0.02em' }}>当前目标</span>
        </div>
        {activeGoal ? (
          <div>
            <div style={{ fontSize: t.md, fontWeight: '600', color: t.text, marginBottom: t.sp1 }}>
              {activeGoal.title}
            </div>
            {activeGoal.description && (
              <div style={{ fontSize: t.sm, color: t.textSecondary, marginBottom: t.sp3, lineHeight: 1.6 }}>
                {activeGoal.description}
              </div>
            )}
            <div style={{ display: 'flex', gap: t.sp2, flexWrap: 'wrap' }}>
              <span style={{
                padding: '4px 10px', borderRadius: t.rSm,
                fontSize: t.xs, fontWeight: '500',
                backgroundColor: activeGoal.priority === 'high' ? 'rgba(239, 68, 68, 0.12)' : activeGoal.priority === 'medium' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(78, 238, 148, 0.12)',
                color: activeGoal.priority === 'high' ? t.error : activeGoal.priority === 'medium' ? t.warning : t.success,
                border: `1px solid ${activeGoal.priority === 'high' ? 'rgba(239, 68, 68, 0.2)' : activeGoal.priority === 'medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(78, 238, 148, 0.2)'}`,
              }}>
                {activeGoal.priority === 'high' ? '高优先' : activeGoal.priority === 'medium' ? '中优先' : '低优先'}
              </span>
              {activeGoal.deadline && (
                <span style={{
                  padding: '4px 10px', borderRadius: t.rSm,
                  fontSize: t.xs, backgroundColor: 'rgba(255, 255, 255, 0.05)', color: t.textMuted,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}>
                  截止 {activeGoal.deadline}
                </span>
              )}
            </div>
          </div>
        ) : (
          <EmptyPot text="还没有种下目标" sub="去目标页播下第一颗种子吧" />
        )}
      </div>

      {/* AI Insight */}
      <div className="animate-in animate-in-delay-3" style={{ ...card, marginBottom: t.sp3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: t.sp2, marginBottom: t.sp3 }}>
          <div className="ai-orb" style={{ width: 28, height: 28, border: '1px solid rgba(78, 238, 148, 0.2)' }}>
            <Lightbulb size={14} style={{ color: t.primary }} />
          </div>
          <span style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', letterSpacing: '0.02em' }}>温室寄语</span>
        </div>
        {latestLog ? (
          <div>
            <div style={{
              fontSize: t.sm, color: t.textSecondary, lineHeight: 1.8,
              whiteSpace: 'pre-wrap', padding: t.sp4,
              background: 'linear-gradient(135deg, rgba(78, 238, 148, 0.06), rgba(167, 139, 250, 0.04))',
              borderRadius: t.rMd,
              border: '1px solid rgba(78, 238, 148, 0.1)',
            }}>
              {latestLog.ai_summary || latestLog.content}
            </div>
            <div style={{ fontSize: t.xs, color: t.textMuted, marginTop: t.sp2 }}>
              {latestLog.log_date}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: `${t.sp5} 0` }}>
            <div className="ai-orb" style={{ margin: `0 auto ${t.sp3}`, width: 48, height: 48 }}>
              <Sparkles size={20} style={{ color: t.primary }} />
            </div>
            <div style={{ color: t.textSecondary, fontSize: t.sm }}>完成今日任务后，温室会给你一份成长寄语</div>
          </div>
        )}
      </div>

      {/* Feedback FAB */}
      <div
        onClick={() => setShowFeedback(true)}
        style={{
          position: 'fixed', bottom: '80px', right: '20px',
          width: '48px', height: '48px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #4EEE94, #3cc07a)',
          color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 40,
          boxShadow: '0 4px 20px rgba(78, 238, 148, 0.35)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          animation: 'breathe 4s ease-in-out infinite',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.12)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageCircle size={20} />
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: t.sp4,
        }} onClick={() => setShowFeedback(false)}>
          <div style={{
            backgroundColor: 'rgba(26, 28, 41, 0.95)', borderRadius: t.rXl,
            padding: t.sp6, width: '100%', maxWidth: '400px',
            border: `1px solid rgba(78, 238, 148, 0.15)`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(78, 238, 148, 0.05)',
            backdropFilter: 'blur(20px)',
            animation: 'scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }} onClick={e => e.stopPropagation()}>
            {feedbackSent ? (
              <div style={{ textAlign: 'center', padding: `${t.sp8} 0` }}>
                <div style={{
                  width: 52, height: 52, borderRadius: t.rFull,
                  margin: `0 auto ${t.sp3}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.18), rgba(167, 139, 250, 0.1))',
                  border: '1px solid rgba(74, 222, 128, 0.2)',
                }}>
                  <Sprout size={24} style={{ color: t.primary }} />
                </div>
                <div style={{ fontSize: t.lg, fontWeight: '600', color: t.text }}>感谢你的浇灌！</div>
                <div style={{ fontSize: t.sm, color: t.textSecondary, marginTop: t.sp2 }}>你的反馈会让温室变得更好</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: t.lg, fontWeight: '600', color: t.text, marginBottom: t.sp5 }}>
                  <Droplets size={18} style={{ color: t.primary, marginRight: 6, verticalAlign: '-3px' }} />
                  给温室浇浇水
                </div>
                <div style={{ marginBottom: t.sp4 }}>
                  <div style={{ fontSize: t.sm, color: t.textSecondary, marginBottom: t.sp2 }}>今天的体验如何？</div>
                  <div style={{ display: 'flex', gap: t.sp2 }}>
                    {[1,2,3,4,5].map(i => (
                      <Star
                        key={i}
                        size={24}
                        onClick={() => setFeedbackRating(i)}
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          transform: i <= feedbackRating ? 'scale(1.2)' : 'scale(1)',
                          color: i <= feedbackRating ? t.warning : 'rgba(255,255,255,0.15)',
                          fill: i <= feedbackRating ? t.warning : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                </div>
                <textarea
                  value={feedbackContent}
                  onChange={e => setFeedbackContent(e.target.value)}
                  placeholder="说说你的感受，好的坏的都行..."
                  style={{
                    width: '100%', minHeight: '90px',
                    padding: t.sp3, borderRadius: t.rMd,
                    border: `1.5px solid rgba(255, 255, 255, 0.08)`,
                    fontSize: t.base, resize: 'vertical', outline: 'none',
                    boxSizing: 'border-box', fontFamily: 'inherit',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', color: t.text,
                    transition: 'border-color 0.2s, box-shadow 0.2s',
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
                    background: feedbackContent.trim()
                      ? 'linear-gradient(135deg, #4EEE94, #3cc07a)'
                      : 'rgba(255, 255, 255, 0.08)',
                    color: feedbackContent.trim() ? 'white' : t.textMuted,
                    fontSize: t.base, fontWeight: '600',
                    cursor: feedbackContent.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: 'inherit', minHeight: '44px',
                    transition: 'all 0.2s',
                    boxShadow: feedbackContent.trim() ? '0 4px 14px rgba(78, 238, 148, 0.3)' : 'none',
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
