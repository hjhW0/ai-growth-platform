import React, { useState, useEffect } from 'react';
import { createTask, getTasks, completeTask, deleteTask, updateTask } from '../api/apiClient';
import { getToday, formatDateChinese, getWeekday, formatDate } from '../utils/dateFormatter';

const CARD = {
  backgroundColor: '#111111',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '12px',
  border: '1px solid #27272a'
};

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, [selectedDate]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks({ date: selectedDate });
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('加载任务失败:', error);
    }
    setLoading(false);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await createTask({ title: newTask, task_date: selectedDate, priority });
      setNewTask('');
      loadTasks();
    } catch (error) {
      console.error('添加任务失败:', error);
    }
  };

  const handleComplete = async (taskId) => {
    try {
      await completeTask(taskId);
      loadTasks();
    } catch (error) {
      console.error('完成任务失败:', error);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('确定要删除这个任务吗？')) {
      try {
        await deleteTask(taskId);
        loadTasks();
      } catch (error) {
        console.error('删除失败:', error);
      }
    }
  };

  const changeDate = (days) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(formatDate(date));
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div>
      <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#fafafa', marginBottom: '16px' }}>📋 每日任务</h2>

      {/* 日期选择器 */}
      <div style={{ ...CARD, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => changeDate(-1)} style={dateBtnStyle}>←</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#fafafa' }}>{formatDateChinese(selectedDate)}</div>
          <div style={{ color: '#71717a', fontSize: '12px' }}>{getWeekday(selectedDate)}</div>
        </div>
        <button onClick={() => changeDate(1)} style={dateBtnStyle}>→</button>
      </div>

      {/* 进度条 */}
      {totalCount > 0 && (
        <div style={CARD}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
            <span style={{ color: '#a1a1aa' }}>今日进度</span>
            <span style={{ color: '#fafafa', fontWeight: '500' }}>{completedCount}/{totalCount} ({progress}%)</span>
          </div>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '3px', height: '4px' }}>
            <div style={{
              backgroundColor: progress >= 80 ? '#22c55e' : progress >= 50 ? '#f59e0b' : '#6366f1',
              borderRadius: '3px',
              height: '4px',
              width: `${progress}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      {/* 添加任务 */}
      <form onSubmit={handleAddTask} style={CARD}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="输入新任务..."
            style={{
              flex: 1,
              minWidth: '120px',
              padding: '10px 12px',
              border: '1px solid #27272a',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#0a0a0a',
              color: '#fafafa',
              transition: 'border-color 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#27272a'}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #27272a',
              borderRadius: '8px',
              fontSize: '13px',
              outline: 'none',
              backgroundColor: '#0a0a0a',
              color: '#fafafa'
            }}
          >
            <option value="high">🔴 高</option>
            <option value="medium">🟡 中</option>
            <option value="low">🟢 低</option>
          </select>
          <button type="submit" style={{
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            minHeight: '44px',
            transition: 'all 0.2s ease'
          }}>
            添加
          </button>
        </div>
      </form>

      {/* 任务列表 */}
      {loading ? (
        <div style={CARD}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #1a1a1a' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: '#1a1a1a' }} />
              <div style={{ flex: 1, height: 14, backgroundColor: '#1a1a1a', borderRadius: 4 }} />
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>✨</div>
          <div style={{ color: '#71717a', fontSize: '14px' }}>暂无任务</div>
          <div style={{ color: '#52525b', fontSize: '13px', marginTop: '4px' }}>在上方输入框添加一个吧</div>
        </div>
      ) : (
        tasks.map(task => (
          <div key={task.id} style={{
            ...CARD,
            display: 'flex',
            alignItems: 'center',
            opacity: task.status === 'completed' ? 0.5 : 1,
            transition: 'opacity 0.2s'
          }}>
            <input
              type="checkbox"
              checked={task.status === 'completed'}
              onChange={() => task.status !== 'completed' && handleComplete(task.id)}
              style={{ marginRight: '12px', width: '18px', height: '18px', cursor: 'pointer', accentColor: '#22c55e' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{
                textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                color: task.status === 'completed' ? '#52525b' : '#fafafa',
                fontSize: '14px'
              }}>
                {task.title}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#22c55e', marginLeft: '8px', marginRight: '8px', flexShrink: 0 }}>
              {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'}
            </span>
            <button
              onClick={() => handleDelete(task.id)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#3f3f46',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px 8px',
                minHeight: '32px',
                flexShrink: 0,
                transition: 'color 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
              onMouseOut={e => e.currentTarget.style.color = '#3f3f46'}
            >
              ×
            </button>
          </div>
        ))
      )}
    </div>
  );
}

const dateBtnStyle = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #27272a',
  padding: '8px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '13px',
  color: '#a1a1aa',
  minHeight: '40px',
  transition: 'all 0.2s ease'
};

export default Tasks;
