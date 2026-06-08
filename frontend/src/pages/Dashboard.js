import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Bot,
  CheckCircle2,
  Flame,
  Leaf,
  Lightbulb,
  MessageCircle,
  Plus,
  Sparkles,
  Sprout,
  Star,
  Target,
  Trophy,
} from 'lucide-react';
import { getTodayStats, getTasks, getStreak, getGoals, getGrowthLogs, submitFeedback, trackEvent } from '../api/apiClient';
import { getToday } from '../utils/dateFormatter';
import { t, card, cardGlow, focusBorder, blurBorder } from '../styles/tokens';
import EmptyPot from '../components/EmptyPot';
import ErrorState from '../components/ErrorState';
import { SkeletonCard } from '../components/Skeleton';

const badgeCatalog = [
  { id: 'first-task', label: '第一片叶', desc: '完成 1 个任务', Icon: Leaf },
  { id: 'three-streak', label: '三日晨光', desc: '连续打卡 3 天', Icon: Flame },
  { id: 'full-day', label: '满格收获', desc: '今日任务全完成', Icon: Trophy },
  { id: 'goal-seed', label: '播种者', desc: '拥有进行中目标', Icon: Sprout },
  { id: 'task-pack', label: '小森林', desc: '今日安排 5 个任务', Icon: Target },
  { id: 'week-streak', label: '一周绿意', desc: '连续打卡 7 天', Icon: Award },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return { text: '夜深了', sub: '早点休息，明天的小苗还会等你。' };
  if (hour < 9) return { text: '早安', sub: '先做一个小任务，温室就会亮起来。' };
  if (hour < 12) return { text: '上午好', sub: '阳光正好，适合专注推进一点。' };
  if (hour < 14) return { text: '中午好', sub: '休息也是成长的一部分。' };
  if (hour < 18) return { text: '下午好', sub: '节奏已经起来了，继续稳稳往前。' };
  if (hour < 21) return { text: '晚上好', sub: '回收今天的成果，给自己一点反馈。' };
  return { text: '夜晚好', sub: '今天辛苦了，把剩下的事轻轻收个尾。' };
}

function ProgressRing({ rate }) {
  const safeRate = Math.max(0, Math.min(100, rate || 0));
  return (
    <div style={{
      width: 112,
      height: 112,
      borderRadius: '50%',
      background: `conic-gradient(${t.primary} ${safeRate * 3.6}deg, #dceee2 0deg)`,
      padding: 9,
      boxShadow: 'inset 0 0 0 1px rgba(34, 197, 94, 0.12)',
      flexShrink: 0,
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 18px rgba(31, 85, 52, 0.08)',
      }}>
        <strong style={{ fontSize: t['2xl'], color: t.text, lineHeight: 1 }}>{safeRate}%</strong>
        <span style={{ fontSize: t.xs, color: t.textMuted, marginTop: 3 }}>今日绿意</span>
      </div>
    </div>
  );
}

function AchievementShelf({ badges }) {
  return (
    <div className="animate-in animate-in-delay-2" style={{ ...card, marginBottom: t.sp3 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: t.sp4 }}>
        <div>
          <div style={{ fontSize: t.md, fontWeight: 700, color: t.text }}>成就徽章</div>
          <div style={{ fontSize: t.xs, color: t.textMuted, marginTop: 2 }}>先放 6 枚核心徽章，后续可扩展成完整徽章墙</div>
        </div>
        <span style={{
          fontSize: t.xs,
          fontWeight: 700,
          color: t.primaryDark,
          background: t.primaryLight,
          borderRadius: t.rFull,
          padding: '5px 9px',
        }}>
          {badges.filter(b => b.unlocked).length}/{badges.length}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: t.sp3 }}>
        {badges.map(({ Icon, unlocked, label, desc }) => (
          <div key={label} style={{
            minHeight: 104,
            borderRadius: t.rLg,
            padding: t.sp3,
            background: unlocked ? 'linear-gradient(145deg, #f0fdf4, #ffffff)' : '#f5f8f6',
            border: `1px solid ${unlocked ? 'rgba(34, 197, 94, 0.22)' : t.borderLight}`,
            textAlign: 'center',
            opacity: unlocked ? 1 : 0.58,
          }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: t.rMd,
              margin: `0 auto ${t.sp2}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: unlocked ? t.primaryLight : '#e8eee9',
              color: unlocked ? t.primaryDark : t.textMuted,
            }}>
              <Icon size={17} />
            </div>
            <div style={{ fontSize: t.xs, fontWeight: 700, color: t.text }}>{label}</div>
            <div style={{ fontSize: 10, color: t.textMuted, marginTop: 3, lineHeight: 1.35 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
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
        getTodayStats(),
        getTasks({ date: today }),
        getStreak(),
        getGoals({ status: 'active' }),
        getGrowthLogs({ limit: 1 }),
      ]);
      const goals = goalsData.data || goalsData.goals || [];
      const logs = logsData.data || [];
      setStats(statsData);
      setTodayTasks(tasksData.tasks || []);
      setStreak(streakData.streak || 0);
      setActiveGoal(goals[0] || null);
      setLatestLog(logs[0] || null);
      setError(null);
    } catch (err) {
      console.error('加载数据失败:', err);
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
        setFeedbackContent('');
        setFeedbackRating(5);
        setFeedbackSent(false);
      }, 1400);
    } catch (e) {
      setFeedbackSent(false);
    }
  };

  const completedCount = stats?.completed || 0;
  const totalCount = stats?.total || 0;
  const rate = stats?.rate || 0;
  const allDone = totalCount > 0 && completedCount === totalCount;
  const greeting = getGreeting();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user.username || '同学';

  const badges = useMemo(() => badgeCatalog.map((badge) => ({
    ...badge,
    unlocked:
      (badge.id === 'first-task' && completedCount > 0) ||
      (badge.id === 'three-streak' && streak >= 3) ||
      (badge.id === 'full-day' && allDone) ||
      (badge.id === 'goal-seed' && Boolean(activeGoal)) ||
      (badge.id === 'task-pack' && totalCount >= 5) ||
      (badge.id === 'week-streak' && streak >= 7),
  })), [activeGoal, allDone, completedCount, streak, totalCount]);

  if (loading) {
    return (
      <div>
        <SkeletonCard lines={2} height={152} />
        <SkeletonCard lines={3} height={168} />
        <SkeletonCard lines={2} height={120} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => { setLoading(true); setError(null); loadData(); }} />;
  }

  return (
    <div>
      <section className="animate-in" style={{
        ...cardGlow,
        marginBottom: t.sp4,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          right: -28,
          top: -30,
          width: 130,
          height: 130,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.18), transparent 68%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', gap: t.sp4, alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 9px',
              borderRadius: t.rFull,
              background: '#ffffff',
              color: t.primaryDark,
              border: `1px solid ${t.border}`,
              fontSize: t.xs,
              fontWeight: 700,
              marginBottom: t.sp3,
            }}>
              <Sprout size={13} />
              清新温室
            </div>
            <h1 style={{
              margin: 0,
              color: t.text,
              fontSize: t['2xl'],
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
            }}>
              {greeting.text}，{username}
            </h1>
            <p style={{
              margin: `${t.sp2} 0 0`,
              color: t.textSecondary,
              fontSize: t.sm,
              lineHeight: 1.7,
              maxWidth: 240,
            }}>
              {greeting.sub}
            </p>
          </div>
          <ProgressRing rate={rate} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: t.sp2,
          marginTop: t.sp5,
        }}>
          {[
            { label: '完成', value: `${completedCount}/${totalCount}`, color: t.primaryDark },
            { label: '连续', value: `${streak}天`, color: t.warning },
            { label: '状态', value: allDone ? '收获' : rate > 0 ? '生长' : '待浇水', color: allDone ? t.success : t.textSecondary },
          ].map(item => (
            <div key={item.label} style={{
              padding: `${t.sp3} ${t.sp2}`,
              borderRadius: t.rMd,
              background: 'rgba(255,255,255,0.72)',
              border: `1px solid ${t.borderLight}`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: t.md, fontWeight: 800, color: item.color }}>{item.value}</div>
              <div style={{ fontSize: t.xs, color: t.textMuted, marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="animate-in animate-in-delay-1" style={{ ...card, marginBottom: t.sp3 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: t.sp4 }}>
          <div>
            <div style={{ fontSize: t.md, color: t.text, fontWeight: 700 }}>今日任务</div>
            <div style={{ fontSize: t.xs, color: t.textMuted, marginTop: 2 }}>
              完成任务会让桌宠变开心
            </div>
          </div>
          <Link to="/tasks" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            color: t.primaryDark,
            fontSize: t.sm,
            fontWeight: 700,
          }}>
            <Plus size={14} />
            添加
          </Link>
        </div>

        {todayTasks.length === 0 ? (
          <EmptyPot text="今天是一张白纸" sub="去种下第一件小任务吧" />
        ) : (
          <div>
            {todayTasks.slice(0, 4).map((task) => (
              <div key={task.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: t.sp3,
                padding: `${t.sp3} 0`,
                borderBottom: `1px solid ${t.borderLight}`,
              }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: t.rFull,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${task.status === 'completed' ? t.success : '#b9d8c4'}`,
                  background: task.status === 'completed' ? t.success : '#ffffff',
                  color: '#ffffff',
                  flexShrink: 0,
                }}>
                  {task.status === 'completed' && <CheckCircle2 size={15} />}
                </div>
                <span style={{
                  flex: 1,
                  color: task.status === 'completed' ? t.textMuted : t.text,
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  fontSize: t.base,
                  minWidth: 0,
                }}>
                  {task.title}
                </span>
                {task.priority === 'high' && (
                  <span style={{
                    padding: '3px 7px',
                    borderRadius: t.rSm,
                    background: t.errorLight,
                    color: t.error,
                    fontSize: t.xs,
                    fontWeight: 700,
                  }}>
                    紧急
                  </span>
                )}
              </div>
            ))}
            {todayTasks.length > 4 && (
              <Link to="/tasks" style={{ display: 'block', textAlign: 'center', paddingTop: t.sp3, color: t.primaryDark, fontSize: t.sm, fontWeight: 700 }}>
                查看剩余 {todayTasks.length - 4} 项
              </Link>
            )}
          </div>
        )}
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: t.sp3, marginBottom: t.sp3 }}>
        <section className="animate-in animate-in-delay-2" style={{
          ...card,
          background: activeGoal ? '#ffffff' : 'linear-gradient(145deg, #ffffff, #f0fdf4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: t.sp2, marginBottom: t.sp3 }}>
            <Target size={17} style={{ color: t.primaryDark }} />
            <strong style={{ color: t.text, fontSize: t.md }}>当前目标</strong>
          </div>
          {activeGoal ? (
            <>
              <div style={{ color: t.text, fontWeight: 700, fontSize: t.base }}>{activeGoal.title}</div>
              {activeGoal.description && (
                <p style={{ margin: `${t.sp2} 0 ${t.sp3}`, color: t.textSecondary, fontSize: t.sm, lineHeight: 1.65 }}>
                  {activeGoal.description}
                </p>
              )}
              <div style={{ display: 'flex', gap: t.sp2, flexWrap: 'wrap' }}>
                <span style={{ padding: '4px 9px', borderRadius: t.rSm, background: t.primaryLight, color: t.primaryDark, fontSize: t.xs, fontWeight: 700 }}>
                  生长中
                </span>
                {activeGoal.deadline && (
                  <span style={{ padding: '4px 9px', borderRadius: t.rSm, background: t.surfaceAlt, color: t.textMuted, fontSize: t.xs }}>
                    截止 {activeGoal.deadline}
                  </span>
                )}
              </div>
            </>
          ) : (
            <EmptyPot text="还没有种下目标" sub="去目标页播下第一颗种子" />
          )}
        </section>

        <section className="animate-in animate-in-delay-3" style={{
          ...card,
          background: 'linear-gradient(145deg, #ffffff 0%, #f7f5ff 100%)',
          border: '1px solid #ded9ff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: t.sp2, marginBottom: t.sp3 }}>
            <Bot size={17} style={{ color: t.accentPurple }} />
            <strong style={{ color: t.text, fontSize: t.md }}>AI 教练预热</strong>
          </div>
          <p style={{ margin: `0 0 ${t.sp3}`, color: t.textSecondary, fontSize: t.sm, lineHeight: 1.7 }}>
            先把 AI 中心作为教练入口：根据目标、今日完成率和复盘记录，给你下一步建议。
          </p>
          <Link to="/ai" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: t.sm,
            color: t.accentPurple,
            fontWeight: 800,
          }}>
            <Sparkles size={15} />
            去找 AI 教练
          </Link>
        </section>
      </div>

      <AchievementShelf badges={badges} />

      <section className="animate-in animate-in-delay-3" style={{ ...card, marginBottom: t.sp3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: t.sp2, marginBottom: t.sp3 }}>
          <Lightbulb size={17} style={{ color: t.warning }} />
          <strong style={{ color: t.text, fontSize: t.md }}>温室寄语</strong>
        </div>
        {latestLog ? (
          <>
            <div style={{
              fontSize: t.sm,
              color: t.textSecondary,
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
              padding: t.sp4,
              background: t.surfaceAlt,
              borderRadius: t.rMd,
              border: `1px solid ${t.borderLight}`,
            }}>
              {latestLog.ai_summary || latestLog.content}
            </div>
            <div style={{ fontSize: t.xs, color: t.textMuted, marginTop: t.sp2 }}>{latestLog.log_date}</div>
          </>
        ) : (
          <div style={{ color: t.textSecondary, fontSize: t.sm, lineHeight: 1.7 }}>
            完成今日任务后，温室会给你一份成长寄语。
          </div>
        )}
      </section>

      <button
        onClick={() => setShowFeedback(true)}
        aria-label="提交反馈"
        style={{
          position: 'fixed',
          bottom: '88px',
          left: '20px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${t.primary}, ${t.primaryDark})`,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 40,
          border: 'none',
          boxShadow: '0 12px 24px rgba(34, 197, 94, 0.24)',
        }}
      >
        <MessageCircle size={20} />
      </button>

      {showFeedback && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(22, 49, 36, 0.28)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: t.sp4,
        }} onClick={() => setShowFeedback(false)}>
          <div style={{
            ...card,
            width: '100%',
            maxWidth: 400,
            animation: 'scaleIn 0.2s ease-out',
          }} onClick={e => e.stopPropagation()}>
            {feedbackSent ? (
              <div style={{ textAlign: 'center', padding: `${t.sp6} 0` }}>
                <Sprout size={38} style={{ color: t.primary, marginBottom: t.sp3 }} />
                <div style={{ fontSize: t.lg, fontWeight: 700, color: t.text }}>收到反馈了</div>
                <div style={{ fontSize: t.sm, color: t.textSecondary, marginTop: t.sp2 }}>温室会继续变好。</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: t.lg, fontWeight: 700, color: t.text, marginBottom: t.sp4 }}>给温室浇浇水</div>
                <div style={{ display: 'flex', gap: t.sp2, marginBottom: t.sp4 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      size={24}
                      onClick={() => setFeedbackRating(i)}
                      style={{
                        cursor: 'pointer',
                        color: i <= feedbackRating ? t.warning : '#cbd5cf',
                        fill: i <= feedbackRating ? t.warning : 'transparent',
                      }}
                    />
                  ))}
                </div>
                <textarea
                  value={feedbackContent}
                  onChange={e => setFeedbackContent(e.target.value)}
                  placeholder="说说哪里还可以更好..."
                  style={{
                    width: '100%',
                    minHeight: 96,
                    padding: t.sp3,
                    borderRadius: t.rMd,
                    border: `1.5px solid ${t.border}`,
                    fontSize: t.base,
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    backgroundColor: '#ffffff',
                    color: t.text,
                  }}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
                <button
                  onClick={handleSubmitFeedback}
                  disabled={!feedbackContent.trim()}
                  style={{
                    width: '100%',
                    marginTop: t.sp4,
                    padding: t.sp3,
                    borderRadius: t.rMd,
                    border: 'none',
                    background: feedbackContent.trim() ? `linear-gradient(135deg, ${t.primary}, ${t.primaryDark})` : t.surfaceAlt,
                    color: feedbackContent.trim() ? '#ffffff' : t.textMuted,
                    fontSize: t.base,
                    fontWeight: 700,
                    cursor: feedbackContent.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: 'inherit',
                    minHeight: 44,
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
