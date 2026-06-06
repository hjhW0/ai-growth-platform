import React, { useEffect, useState } from 'react';
import useGoalsStore from '../store/useGoalsStore';
import { generateTasks } from '../api/apiClient';

const CARD = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
};

const INPUT_STYLE = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s'
};

const BTN_PRIMARY = {
  padding: '10px 20px',
  backgroundColor: '#6366f1',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  minHeight: '44px',
  transition: 'background-color 0.2s'
};

const BTN_GHOST = {
  padding: '10px 20px',
  backgroundColor: '#f5f5f5',
  color: '#666',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  minHeight: '44px',
  transition: 'background-color 0.2s'
};

const priorityColors = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981'
};

const priorityLabels = {
  high: '高',
  medium: '中',
  low: '低'
};

const statusLabels = {
  active: '进行中',
  completed: '已完成',
  paused: '已暂停',
  archived: '已归档'
};

export default function Goals() {
  const { goals, loading, error, fetchGoals, addGoal, updateGoal, deleteGoal, clearError } = useGoalsStore();

  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_type: 'learning',
    priority: 'medium',
    deadline: ''
  });
  const [generatingId, setGeneratingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

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
    }

    setFormData({ title: '', description: '', goal_type: 'learning', priority: 'medium', deadline: '' });
    setEditingGoal(null);
    setShowForm(false);
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      goal_type: goal.goal_type,
      priority: goal.priority,
      deadline: goal.deadline || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (goalId) => {
    if (window.confirm('确定要删除这个目标吗？')) {
      await deleteGoal(goalId);
    }
  };

  const handleComplete = async (goal) => {
    await updateGoal(goal.id, { status: 'completed' });
  };

  const handleGenerateTasks = async (goal) => {
    setGeneratingId(goal.id);
    try {
      const res = await generateTasks(goal.id);
      if (res.code === 0) {
        showToast(`AI已生成 ${res.data.tasks_created} 个任务！`);
        fetchGoals();
      } else {
        showToast(res.message || '生成失败', 'error');
      }
    } catch (err) {
      showToast(err.message || 'AI调用失败，请检查服务是否启动', 'error');
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#333', margin: 0 }}>🎯 目标管理</h2>
        <button
          onClick={() => {
            setEditingGoal(null);
            setFormData({ title: '', description: '', goal_type: 'learning', priority: 'medium', deadline: '' });
            setShowForm(true);
          }}
          style={BTN_PRIMARY}
        >
          + 新建目标
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 24px',
          backgroundColor: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 200,
          fontSize: '14px',
          maxWidth: '90%',
          textAlign: 'center'
        }}>
          {toast.message}
        </div>
      )}

      {error && (
        <div style={{
          ...CARD,
          backgroundColor: '#fef2f2',
          color: '#991b1b',
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{error}</span>
          <button onClick={clearError} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b', fontSize: '16px' }}>✕</button>
        </div>
      )}

      {/* 目标表单弹窗 */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#333' }}>
              {editingGoal ? '编辑目标' : '新建目标'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666', fontWeight: '500' }}>目标标题 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="输入目标标题"
                  required
                  style={INPUT_STYLE}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#ddd'}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666', fontWeight: '500' }}>描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="输入目标描述"
                  rows="3"
                  style={{ ...INPUT_STYLE, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#ddd'}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666', fontWeight: '500' }}>类型</label>
                  <select
                    value={formData.goal_type}
                    onChange={(e) => setFormData({ ...formData, goal_type: e.target.value })}
                    style={{ ...INPUT_STYLE, backgroundColor: 'white' }}
                  >
                    <option value="learning">学习</option>
                    <option value="career">职业</option>
                    <option value="health">健康</option>
                    <option value="hobby">兴趣</option>
                    <option value="other">其他</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666', fontWeight: '500' }}>优先级</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    style={{ ...INPUT_STYLE, backgroundColor: 'white' }}
                  >
                    <option value="high">🔴 高</option>
                    <option value="medium">🟡 中</option>
                    <option value="low">🟢 低</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#666', fontWeight: '500' }}>截止日期</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  style={INPUT_STYLE}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingGoal(null); }}
                  style={BTN_GHOST}
                >
                  取消
                </button>
                <button type="submit" style={BTN_PRIMARY}>
                  {editingGoal ? '保存' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 目标列表 */}
      {loading ? (
        <div>
          {[1, 2, 3].map(i => (
            <div key={i} style={CARD}>
              <div style={{ height: 16, width: '60%', backgroundColor: '#f0f0f0', borderRadius: 4, marginBottom: 10 }} />
              <div style={{ height: 12, width: '40%', backgroundColor: '#f0f0f0', borderRadius: 4, marginBottom: 10 }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ height: 20, width: 50, backgroundColor: '#f0f0f0', borderRadius: 4 }} />
                <div style={{ height: 20, width: 50, backgroundColor: '#f0f0f0', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎯</div>
          <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>还没有目标</div>
          <div style={{ color: '#ccc', fontSize: '13px' }}>点击上方"新建目标"按钮开始创建</div>
        </div>
      ) : (
        <div>
          {goals.map((goal) => (
            <div
              key={goal.id}
              style={{
                ...CARD,
                opacity: goal.status === 'completed' ? 0.6 : 1,
                transition: 'opacity 0.2s',
                borderLeft: `3px solid ${priorityColors[goal.priority] || '#ddd'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    margin: '0 0 6px 0',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#333',
                    textDecoration: goal.status === 'completed' ? 'line-through' : 'none'
                  }}>
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p style={{ color: '#999', margin: '0 0 10px 0', fontSize: '13px' }}>
                      {goal.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: `${priorityColors[goal.priority]}15`,
                      color: priorityColors[goal.priority],
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      {priorityLabels[goal.priority]}优先级
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: goal.status === 'completed' ? '#10b98115' : '#6366f115',
                      color: goal.status === 'completed' ? '#10b981' : '#6366f1',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      {statusLabels[goal.status]}
                    </span>
                    {goal.deadline && (
                      <span style={{
                        padding: '2px 8px',
                        backgroundColor: '#f5f5f5',
                        color: '#999',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}>
                        截止: {goal.deadline}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {goal.status === 'active' && (
                    <>
                      <button
                        onClick={() => handleGenerateTasks(goal)}
                        disabled={generatingId === goal.id}
                        title="AI生成任务"
                        style={{
                          padding: '6px 10px',
                          backgroundColor: generatingId === goal.id ? '#e0e0e0' : '#6366f1',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: generatingId === goal.id ? 'not-allowed' : 'pointer',
                          fontSize: '12px',
                          minHeight: '36px',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        {generatingId === goal.id ? '⏳' : '🤖'}
                      </button>
                      <button
                        onClick={() => handleComplete(goal)}
                        title="完成"
                        style={{
                          padding: '6px 10px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          minHeight: '36px',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        ✓
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleEdit(goal)}
                    title="编辑"
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#f5f5f5',
                      color: '#666',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      minHeight: '36px',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    title="删除"
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#fef2f2',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      minHeight: '36px',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
