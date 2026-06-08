import React, { useEffect, useState } from 'react';
import { Target, Sparkles, Check, Edit3, Trash2, Plus } from 'lucide-react';
import useGoalsStore from '../store/useGoalsStore';
import { generateTasks, trackEvent } from '../api/apiClient';
import { t, card, input, btnPrimary, focusBorder, blurBorder } from '../styles/tokens';
import EmptyPot from '../components/EmptyPot';

const priorityConfig = {
  high: { color: t.error, bg: t.errorLight, label: '高优先' },
  medium: { color: t.warning, bg: t.warningLight, label: '中优先' },
  low: { color: t.success, bg: t.successLight, label: '低优先' },
};
const statusConfig = {
  active: { color: t.primary, bg: t.primaryLight, label: '进行中' },
  completed: { color: t.success, bg: t.successLight, label: '已完成' },
  paused: { color: t.textMuted, bg: 'rgba(255, 255, 255, 0.05)', label: '已暂停' },
  archived: { color: t.textMuted, bg: 'rgba(255, 255, 255, 0.05)', label: '已归档' },
};

export default function Goals() {
  const { goals, loading, error, fetchGoals, addGoal, updateGoal, deleteGoal, clearError } = useGoalsStore();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', goal_type: 'learning', priority: 'medium', deadline: '' });
  const [generatingId, setGeneratingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchGoals(); }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    if (editingGoal) {
      await updateGoal(editingGoal.id, formData);
    } else {
      await addGoal(formData);
      trackEvent('create_goal', JSON.stringify({ priority: formData.priority, type: formData.goal_type }));
    }
    setFormData({ title: '', description: '', goal_type: 'learning', priority: 'medium', deadline: '' });
    setEditingGoal(null);
    setShowForm(false);
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({ title: goal.title, description: goal.description || '', goal_type: goal.goal_type, priority: goal.priority, deadline: goal.deadline || '' });
    setShowForm(true);
  };

  const handleDelete = async (goalId) => { if (window.confirm('确定要移除这颗种子吗？')) await deleteGoal(goalId); };
  const handleComplete = async (goal) => { await updateGoal(goal.id, { status: 'completed' }); trackEvent('complete_goal'); };

  const handleGenerateTasks = async (goal) => {
    setGeneratingId(goal.id);
    try {
      const res = await generateTasks(goal.id);
      if (res.code === 0) {
        trackEvent('ai_generate_tasks', JSON.stringify({ goal_id: goal.id, tasks_created: res.data.tasks_created }));
        showToast(`AI 已帮你拆解出 ${res.data.tasks_created} 个任务！`);
      } else {
        showToast(res.message || '生成失败', 'error');
      }
      fetchGoals();
    } catch (err) { showToast(err.message || 'AI 调用失败', 'error'); }
    finally { setGeneratingId(null); }
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const goalProgress = goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: t.sp4 }}>
        <h2 style={{ fontSize: t.xl, fontWeight: '700', color: t.text, margin: 0, letterSpacing: '-0.02em' }}>
          成长目标
        </h2>
        <button onClick={() => { setEditingGoal(null); setFormData({ title: '', description: '', goal_type: 'learning', priority: 'medium', deadline: '' }); setShowForm(true); }}
          style={{
            ...btnPrimary, padding: '8px 16px', minHeight: '36px', fontSize: t.sm,
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
          <Plus size={14} /> 播种
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          padding: `${t.sp3} ${t.sp5}`, borderRadius: t.rMd, zIndex: 200,
          fontSize: t.sm, maxWidth: '90%', textAlign: 'center',
          background: toast.type === 'error'
            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
            : 'linear-gradient(135deg, #4EEE94, #3cc07a)',
          color: 'white',
          boxShadow: toast.type === 'error'
            ? '0 4px 20px rgba(239, 68, 68, 0.3)'
            : '0 4px 20px rgba(78, 238, 148, 0.3)',
          animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          {toast.message}
        </div>
      )}

      {/* Goal progress */}
      {goals.length > 0 && (
        <div className="animate-in" style={{
          ...card, marginBottom: t.sp4,
          background: 'linear-gradient(135deg, rgba(78, 238, 148, 0.06) 0%, rgba(167, 139, 250, 0.04) 100%)',
          border: '1px solid rgba(78, 238, 148, 0.1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: t.sp3 }}>
            <span style={{ fontSize: t.sm, fontWeight: '600', color: t.text }}>
              {goalProgress === 100 ? '🎉 全部目标已完成！' : '整体进度'}
            </span>
            <span style={{ fontSize: t.sm, color: t.textSecondary }}>
              {completedGoals.length}/{goals.length}
            </span>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderRadius: t.rFull,
            height: '8px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              borderRadius: t.rFull,
              width: `${goalProgress}%`,
              transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              background: goalProgress >= 80
                ? 'linear-gradient(90deg, #4EEE94, #34d399)'
                : goalProgress >= 50
                  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  : 'linear-gradient(90deg, #4EEE94, #a78bfa)',
              boxShadow: goalProgress >= 80
                ? '0 0 12px rgba(78, 238, 148, 0.4)'
                : goalProgress >= 50
                  ? '0 0 12px rgba(245, 158, 11, 0.3)'
                  : '0 0 8px rgba(78, 238, 148, 0.2)',
            }} />
          </div>
          <div style={{ textAlign: 'right', marginTop: t.sp2, fontSize: t.xs, color: t.textMuted }}>
            {goalProgress >= 80 ? '快全部达成了！' : goalProgress >= 50 ? '过半了，继续加油' : goalProgress > 0 ? '刚刚起步，慢慢来' : '还没有完成的目标'}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          ...card, backgroundColor: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239,68,68,0.12)',
          color: t.error, fontSize: t.sm, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: t.sp3,
        }}>
          <span>{error}</span>
          <button onClick={clearError} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.error, fontSize: t.lg }}>✕</button>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 100, padding: t.sp4,
        }}>
          <div style={{
            backgroundColor: 'rgba(26, 28, 41, 0.95)', padding: t.sp6, borderRadius: t.rXl,
            width: '100%', maxWidth: '420px', border: '1px solid rgba(78, 238, 148, 0.15)',
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(78, 238, 148, 0.05)',
            backdropFilter: 'blur(20px)',
            animation: 'scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <h3 style={{ margin: `0 0 ${t.sp5} 0`, fontSize: t.lg, fontWeight: '600', color: t.text }}>
              {editingGoal ? '编辑目标' : '播下一颗新种子 🌱'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: t.sp4 }}>
                <label style={{ fontSize: t.sm, color: t.textSecondary, fontWeight: '500', display: 'block', marginBottom: t.sp2 }}>目标名称 *</label>
                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="你想达成什么呢..." required style={input} onFocus={focusBorder} onBlur={blurBorder} />
              </div>
              <div style={{ marginBottom: t.sp4 }}>
                <label style={{ fontSize: t.sm, color: t.textSecondary, fontWeight: '500', display: 'block', marginBottom: t.sp2 }}>详细描述</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="为什么想做这件事？" rows="3" style={{ ...input, resize: 'vertical' }} onFocus={focusBorder} onBlur={blurBorder} />
              </div>
              <div style={{ display: 'flex', gap: t.sp3, marginBottom: t.sp4 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: t.sm, color: t.textSecondary, fontWeight: '500', display: 'block', marginBottom: t.sp2 }}>类型</label>
                  <select value={formData.goal_type} onChange={e => setFormData({ ...formData, goal_type: e.target.value })} style={input}>
                    <option value="learning">学习</option><option value="career">职业</option><option value="health">健康</option><option value="hobby">兴趣</option><option value="other">其他</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: t.sm, color: t.textSecondary, fontWeight: '500', display: 'block', marginBottom: t.sp2 }}>优先级</label>
                  <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} style={input}>
                    <option value="high">高</option><option value="medium">中</option><option value="low">低</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: t.sp5 }}>
                <label style={{ fontSize: t.sm, color: t.textSecondary, fontWeight: '500', display: 'block', marginBottom: t.sp2 }}>截止日期</label>
                <input type="date" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} style={input} />
              </div>
              <div style={{ display: 'flex', gap: t.sp3, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => { setShowForm(false); setEditingGoal(null); }} style={{
                  padding: `${t.sp3} ${t.sp5}`,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: t.textSecondary, border: `1px solid rgba(255, 255, 255, 0.08)`,
                  borderRadius: t.rMd, cursor: 'pointer', fontSize: t.sm,
                  fontFamily: 'inherit', minHeight: '40px',
                }}>取消</button>
                <button type="submit" style={{ ...btnPrimary, minHeight: '40px', fontSize: t.sm }}>
                  {editingGoal ? '保存' : '种下'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goals list */}
      {loading ? (
        <div>{[1,2,3].map(i => (
          <div key={i} style={{
            ...card, marginBottom: t.sp3,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)',
            backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
            height: 80,
          }} />
        ))}</div>
      ) : goals.length === 0 ? (
        <div style={{ ...card }}>
          <EmptyPot text="温室里还没有种子" sub="点击上方「播种」种下第一颗目标" />
        </div>
      ) : (
        <div>
          {/* Active goals */}
          {activeGoals.length > 0 && (
            <div className="animate-in" style={{ marginBottom: t.sp4 }}>
              <div style={{ fontSize: t.xs, color: t.textMuted, fontWeight: '600', marginBottom: t.sp3, letterSpacing: '0.03em' }}>
                成长中 · {activeGoals.length}
              </div>
              {activeGoals.map(goal => {
                const pc = priorityConfig[goal.priority] || priorityConfig.medium;
                return (
                  <div key={goal.id} className="card-hover" style={{
                    ...card, marginBottom: t.sp3,
                    borderLeft: `3px solid ${pc.color}`,
                    cursor: 'default',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: t.sp3 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ margin: `0 0 ${t.sp2} 0`, fontSize: t.md, fontWeight: '600', color: t.text }}>{goal.title}</h3>
                        {goal.description && <p style={{ color: t.textSecondary, margin: `0 0 ${t.sp3} 0`, fontSize: t.sm, lineHeight: 1.6 }}>{goal.description}</p>}
                        <div style={{ display: 'flex', gap: t.sp2, flexWrap: 'wrap' }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: t.rSm, fontSize: t.xs, fontWeight: '500',
                            backgroundColor: pc.bg, color: pc.color,
                            border: `1px solid ${pc.color}20`,
                          }}>{pc.label}</span>
                          {goal.deadline && <span style={{
                            padding: '2px 8px', borderRadius: t.rSm, fontSize: t.xs,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)', color: t.textMuted,
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                          }}>截止 {goal.deadline}</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                        <button onClick={() => handleGenerateTasks(goal)} disabled={generatingId === goal.id} title="AI生成任务" style={{
                          width: '32px', height: '32px', borderRadius: t.rSm,
                          cursor: generatingId === goal.id ? 'not-allowed' : 'pointer',
                          backgroundColor: 'rgba(78, 238, 148, 0.1)', color: t.primary,
                          border: '1px solid rgba(78, 238, 148, 0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s',
                          animation: generatingId === goal.id ? 'pulse 1s infinite' : 'none',
                        }}><Sparkles size={14} /></button>
                        <button onClick={() => handleComplete(goal)} title="收获" style={{
                          width: '32px', height: '32px', borderRadius: t.rSm, cursor: 'pointer',
                          backgroundColor: 'rgba(78, 238, 148, 0.1)', color: t.success,
                          border: '1px solid rgba(78, 238, 148, 0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}><Check size={14} /></button>
                        <button onClick={() => handleEdit(goal)} title="编辑" style={{
                          width: '32px', height: '32px', borderRadius: t.rSm, cursor: 'pointer',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)', color: t.textSecondary,
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}><Edit3 size={14} /></button>
                        <button onClick={() => handleDelete(goal.id)} title="移除" style={{
                          width: '32px', height: '32px', borderRadius: t.rSm, cursor: 'pointer',
                          backgroundColor: 'rgba(239, 68, 68, 0.08)', color: t.error,
                          border: '1px solid rgba(239, 68, 68, 0.12)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Other goals */}
          {completedGoals.length > 0 && (
            <div className="animate-in animate-in-delay-1">
              <div style={{ fontSize: t.xs, color: t.textMuted, fontWeight: '600', marginBottom: t.sp3, letterSpacing: '0.03em' }}>
                已收获 · {completedGoals.length}
              </div>
              {completedGoals.map(goal => {
                const sc = statusConfig[goal.status] || statusConfig.active;
                return (
                  <div key={goal.id} style={{ ...card, marginBottom: t.sp3, opacity: 0.6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          margin: 0, fontSize: t.base, fontWeight: '500', color: t.textSecondary,
                          textDecoration: goal.status === 'completed' ? 'line-through' : 'none',
                        }}>{goal.title}</h3>
                      </div>
                      <span style={{
                        padding: '2px 8px', borderRadius: t.rSm, fontSize: t.xs, fontWeight: '500',
                        flexShrink: 0, marginLeft: t.sp3,
                        backgroundColor: sc.bg, color: sc.color,
                      }}>
                        {sc.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
