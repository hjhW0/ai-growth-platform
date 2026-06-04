import React, { useEffect, useState } from 'react';
import useGoalsStore from '../store/useGoalsStore';
import { generateTasks } from '../api/apiClient';

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

  // Toast 提示
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

  const priorityColors = {
    high: '#e74c3c',
    medium: '#f39c12',
    low: '#27ae60'
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

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>🎯 目标管理</h1>
        <button
          onClick={() => {
            setEditingGoal(null);
            setFormData({ title: '', description: '', goal_type: 'learning', priority: 'medium', deadline: '' });
            setShowForm(true);
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          + 新建目标
        </button>
      </div>

      {/* Toast 提示 */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '12px 24px',
          backgroundColor: toast.type === 'error' ? '#e74c3c' : '#27ae60',
          color: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          fontSize: '14px',
          animation: 'fadeIn 0.3s'
        }}>
          {toast.message}
        </div>
      )}

      {error && (
        <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '20px' }}>
          {error}
          <button onClick={clearError} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* 目标表单 */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ marginTop: 0 }}>{editingGoal ? '编辑目标' : '新建目标'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>目标标题 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="输入目标标题"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="输入目标描述"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>类型</label>
                  <select
                    value={formData.goal_type}
                    onChange={(e) => setFormData({ ...formData, goal_type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="learning">学习</option>
                    <option value="career">职业</option>
                    <option value="health">健康</option>
                    <option value="hobby">兴趣</option>
                    <option value="other">其他</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>优先级</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="high">高</option>
                    <option value="medium">中</option>
                    <option value="low">低</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>截止日期</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingGoal(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  {editingGoal ? '保存' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 目标列表 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>加载中...</div>
      ) : goals.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '16px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎯</div>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>还没有目标</h3>
          <p style={{ color: '#999' }}>点击上方"新建目标"按钮开始创建你的第一个目标</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {goals.map((goal) => (
            <div
              key={goal.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${priorityColors[goal.priority]}`,
                opacity: goal.status === 'completed' ? 0.7 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    margin: '0 0 8px 0',
                    textDecoration: goal.status === 'completed' ? 'line-through' : 'none'
                  }}>
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p style={{ color: '#666', margin: '0 0 10px 0', fontSize: '14px' }}>
                      {goal.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: priorityColors[goal.priority] + '20',
                      color: priorityColors[goal.priority],
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {priorityLabels[goal.priority]}优先级
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: goal.status === 'completed' ? '#27ae6020' : '#3498db20',
                      color: goal.status === 'completed' ? '#27ae60' : '#3498db',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {statusLabels[goal.status]}
                    </span>
                    {goal.deadline && (
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#9b59b620',
                        color: '#9b59b6',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        截止: {goal.deadline}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginLeft: '15px', flexWrap: 'wrap' }}>
                  {goal.status === 'active' && (
                    <>
                      <button
                        onClick={() => handleGenerateTasks(goal)}
                        disabled={generatingId === goal.id}
                        title="AI生成任务"
                        style={{
                          padding: '8px 12px',
                          backgroundColor: generatingId === goal.id ? '#9b59b680' : '#9b59b6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: generatingId === goal.id ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {generatingId === goal.id ? '⏳ 生成中...' : '🤖 AI生成'}
                      </button>
                      <button
                        onClick={() => handleComplete(goal)}
                        title="完成"
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#27ae60',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
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
                      padding: '8px 12px',
                      backgroundColor: '#f39c12',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    title="删除"
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
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
