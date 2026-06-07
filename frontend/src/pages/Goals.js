import React, { useEffect, useState } from 'react';
import useGoalsStore from '../store/useGoalsStore';
import { generateTasks } from '../api/apiClient';
import { t, card, input, btnPrimary, focusBorder, blurBorder } from '../styles/tokens';

const priorityConfig = {
  high: { color: t.error, bg: t.errorLight, label: '高优先' },
  medium: { color: t.warning, bg: t.warningLight, label: '中优先' },
  low: { color: t.success, bg: t.successLight, label: '低优先' },
};
const statusConfig = {
  active: { color: t.primary, bg: t.primaryLight, label: '进行中' },
  completed: { color: t.success, bg: t.successLight, label: '已完成' },
  paused: { color: t.textMuted, bg: t.surfaceAlt, label: '已暂停' },
  archived: { color: t.textMuted, bg: t.surfaceAlt, label: '已归档' },
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
    editingGoal ? await updateGoal(editingGoal.id, formData) : await addGoal(formData);
    setFormData({ title: '', description: '', goal_type: 'learning', priority: 'medium', deadline: '' });
    setEditingGoal(null);
    setShowForm(false);
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({ title: goal.title, description: goal.description || '', goal_type: goal.goal_type, priority: goal.priority, deadline: goal.deadline || '' });
    setShowForm(true);
  };

  const handleDelete = async (goalId) => { if (window.confirm('确定要删除这个目标吗？')) await deleteGoal(goalId); };
  const handleComplete = async (goal) => { await updateGoal(goal.id, { status: 'completed' }); };

  const handleGenerateTasks = async (goal) => {
    setGeneratingId(goal.id);
    try {
      const res = await generateTasks(goal.id);
      res.code === 0 ? showToast(`AI已生成 ${res.data.tasks_created} 个任务！`) : showToast(res.message || '生成失败', 'error');
      fetchGoals();
    } catch (err) { showToast(err.message || 'AI调用失败', 'error'); }
    finally { setGeneratingId(null); }
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const otherGoals = goals.filter(g => g.status !== 'active');

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: t.sp4 }}>
        <h2 style={{ fontSize: t.xl, fontWeight: '700', color: t.text, margin: 0, letterSpacing: '-0.02em' }}>目标管理</h2>
        <button onClick={() => { setEditingGoal(null); setFormData({ title: '', description: '', goal_type: 'learning', priority: 'medium', deadline: '' }); setShowForm(true); }}
          style={{ ...btnPrimary, padding: '8px 16px', minHeight: '36px', fontSize: t.sm }}>
          + 新建
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          padding: `${t.sp3} ${t.sp5}`, borderRadius: t.rMd, zIndex: 200,
          fontSize: t.sm, maxWidth: '90%', textAlign: 'center',
          backgroundColor: toast.type === 'error' ? t.error : t.success,
          color: 'white', boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
        }}>
          {toast.message}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          ...card, backgroundColor: t.errorLight, border: `1px solid rgba(239,68,68,0.2)`,
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
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 100, padding: t.sp4,
        }}>
          <div style={{
            backgroundColor: t.surface, padding: t.sp6, borderRadius: t.rXl,
            width: '100%', maxWidth: '420px', border: `1px solid ${t.border}`,
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            animation: 'scaleIn 0.2s ease-out',
          }}>
            <h3 style={{ margin: `0 0 ${t.sp5} 0`, fontSize: t.lg, fontWeight: '600', color: t.text }}>
              {editingGoal ? '编辑目标' : '新建目标'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: t.sp4 }}>
                <label style={{ fontSize: t.sm, color: t.textSecondary, fontWeight: '500', display: 'block', marginBottom: t.sp2 }}>目标标题 *</label>
                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="输入目标标题" required style={input} onFocus={focusBorder} onBlur={blurBorder} />
              </div>
              <div style={{ marginBottom: t.sp4 }}>
                <label style={{ fontSize: t.sm, color: t.textSecondary, fontWeight: '500', display: 'block', marginBottom: t.sp2 }}>描述</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="输入目标描述" rows="3" style={{ ...input, resize: 'vertical' }} onFocus={focusBorder} onBlur={blurBorder} />
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
                  padding: `${t.sp3} ${t.sp5}`, backgroundColor: t.surfaceAlt,
                  color: t.textSecondary, border: `1px solid ${t.border}`,
                  borderRadius: t.rMd, cursor: 'pointer', fontSize: t.sm,
                  fontFamily: 'inherit', minHeight: '40px',
                }}>取消</button>
                <button type="submit" style={{ ...btnPrimary, minHeight: '40px', fontSize: t.sm }}>
                  {editingGoal ? '保存' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goals list */}
      {loading ? (
        <div>{[1,2,3].map(i => (
          <div key={i} style={{ ...card, marginBottom: t.sp3 }}>
            <div style={{ height: 14, width: '60%', backgroundColor: t.surfaceAlt, borderRadius: t.rSm, marginBottom: t.sp3 }} />
            <div style={{ height: 12, width: '40%', backgroundColor: t.surfaceAlt, borderRadius: t.rSm }} />
          </div>
        ))}</div>
      ) : goals.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', padding: `${t.sp8} ${t.sp5}` }}>
          <div style={{ fontSize: '40px', marginBottom: t.sp3 }}>🎯</div>
          <div style={{ color: t.textSecondary, fontSize: t.md, fontWeight: '500', marginBottom: t.sp1 }}>还没有目标</div>
          <div style={{ color: t.textMuted, fontSize: t.sm }}>点击上方按钮开始创建</div>
        </div>
      ) : (
        <div>
          {/* Active goals */}
          {activeGoals.length > 0 && (
            <div className="animate-in" style={{ marginBottom: t.sp4 }}>
              <div style={{ fontSize: t.xs, color: t.textMuted, fontWeight: '600', marginBottom: t.sp3, letterSpacing: '0.03em' }}>
                进行中 · {activeGoals.length}
              </div>
              {activeGoals.map(goal => {
                const pc = priorityConfig[goal.priority] || priorityConfig.medium;
                return (
                  <div key={goal.id} style={{
                    ...card, marginBottom: t.sp3,
                    borderLeft: `3px solid ${pc.color}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: t.sp3 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ margin: `0 0 ${t.sp2} 0`, fontSize: t.md, fontWeight: '600', color: t.text }}>{goal.title}</h3>
                        {goal.description && <p style={{ color: t.textSecondary, margin: `0 0 ${t.sp3} 0`, fontSize: t.sm, lineHeight: 1.5 }}>{goal.description}</p>}
                        <div style={{ display: 'flex', gap: t.sp2, flexWrap: 'wrap' }}>
                          <span style={{ padding: '2px 8px', backgroundColor: pc.bg, color: pc.color, borderRadius: t.rSm, fontSize: t.xs, fontWeight: '500' }}>{pc.label}</span>
                          {goal.deadline && <span style={{ padding: '2px 8px', backgroundColor: t.surfaceAlt, color: t.textMuted, borderRadius: t.rSm, fontSize: t.xs }}>截止 {goal.deadline}</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                        <button onClick={() => handleGenerateTasks(goal)} disabled={generatingId === goal.id} title="AI生成任务" style={{
                          width: '32px', height: '32px', borderRadius: t.rSm, cursor: generatingId === goal.id ? 'not-allowed' : 'pointer',
                          backgroundColor: t.primaryLight, color: t.primary, border: `1px solid rgba(91,95,239,0.15)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                        }}>{generatingId === goal.id ? '⏳' : '🤖'}</button>
                        <button onClick={() => handleComplete(goal)} title="完成" style={{
                          width: '32px', height: '32px', borderRadius: t.rSm, cursor: 'pointer',
                          backgroundColor: t.successLight, color: t.success, border: `1px solid rgba(16,185,129,0.15)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                        }}>✓</button>
                        <button onClick={() => handleEdit(goal)} title="编辑" style={{
                          width: '32px', height: '32px', borderRadius: t.rSm, cursor: 'pointer',
                          backgroundColor: t.surfaceAlt, color: t.textSecondary, border: `1px solid ${t.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                        }}>✎</button>
                        <button onClick={() => handleDelete(goal.id)} title="删除" style={{
                          width: '32px', height: '32px', borderRadius: t.rSm, cursor: 'pointer',
                          backgroundColor: t.errorLight, color: t.error, border: `1px solid rgba(239,68,68,0.15)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                        }}>✕</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Other goals */}
          {otherGoals.length > 0 && (
            <div className="animate-in animate-in-delay-1">
              <div style={{ fontSize: t.xs, color: t.textMuted, fontWeight: '600', marginBottom: t.sp3, letterSpacing: '0.03em' }}>
                已完成/已暂停 · {otherGoals.length}
              </div>
              {otherGoals.map(goal => {
                const sc = statusConfig[goal.status] || statusConfig.active;
                return (
                  <div key={goal.id} style={{ ...card, marginBottom: t.sp3, opacity: 0.7 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          margin: 0, fontSize: t.base, fontWeight: '500', color: t.textSecondary,
                          textDecoration: goal.status === 'completed' ? 'line-through' : 'none',
                        }}>{goal.title}</h3>
                      </div>
                      <span style={{ padding: '2px 8px', backgroundColor: sc.bg, color: sc.color, borderRadius: t.rSm, fontSize: t.xs, fontWeight: '500', flexShrink: 0, marginLeft: t.sp3 }}>
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
