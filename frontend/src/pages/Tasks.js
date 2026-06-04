import React, { useState, useEffect } from 'react';
import { createTask, getTasks, completeTask, deleteTask, updateTask } from '../api/apiClient';
import { getToday, formatDateChinese, getWeekday, formatDate } from '../utils/dateFormatter';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');

  useEffect(() => {
    loadTasks();
  }, [selectedDate]);

  const loadTasks = async () => {
    try {
      const data = await getTasks({ date: selectedDate });
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('加载任务失败:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await createTask({
        title: newTask,
        task_date: selectedDate,
        priority
      });
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

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      <h2 style={{ marginBottom: '24px', color: '#333' }}>📋 每日任务</h2>

      {/* 日期选择器 */}
      <div style={{
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <button onClick={() => changeDate(-1)} style={dateBtnStyle}>
          ← 前一天
        </button>
        <div style={{ textAlign: 'center' }}>
          <h3>{formatDateChinese(selectedDate)}</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>{getWeekday(selectedDate)}</p>
        </div>
        <button onClick={() => changeDate(1)} style={dateBtnStyle}>
          后一天 →
        </button>
      </div>

      {/* 进度条 */}
      <div style={{
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>今日进度</span>
          <span>{completedCount}/{totalCount} ({progress}%)</span>
        </div>
        <div style={{ backgroundColor: '#f0f0f0', borderRadius: '4px', height: '8px' }}>
          <div style={{
            backgroundColor: progress >= 80 ? '#10b981' : progress >= 50 ? '#f59e0b' : '#6366f1',
            borderRadius: '4px',
            height: '8px',
            width: `${progress}%`,
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      {/* 添加任务 */}
      <form onSubmit={handleAddTask} style={{
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="输入新任务..."
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px'
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
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            添加
          </button>
        </div>
      </form>

      {/* 任务列表 */}
      <div>
        {tasks.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            padding: '60px',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#999',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
            <p>暂无任务</p>
            <p style={{ fontSize: '14px' }}>添加一个吧</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} style={{
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              opacity: task.status === 'completed' ? 0.7 : 1
            }}>
              <input
                type="checkbox"
                checked={task.status === 'completed'}
                onChange={() => task.status !== 'completed' && handleComplete(task.id)}
                style={{ marginRight: '16px', width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <div style={{ flex: 1 }}>
                <span style={{
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  color: task.status === 'completed' ? '#999' : '#333',
                  fontSize: '16px'
                }}>
                  {task.title}
                </span>
              </div>
              <span style={{
                fontSize: '12px',
                color: priorityColors[task.priority] || '#999',
                marginRight: '12px'
              }}>
                {task.priority === 'high' ? '🔴 高' : task.priority === 'medium' ? '🟡 中' : '🟢 低'}
              </span>
              <button
                onClick={() => handleDelete(task.id)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const dateBtnStyle = {
  backgroundColor: '#f5f5f5',
  border: '1px solid #ddd',
  padding: '8px 16px',
  borderRadius: '8px',
  cursor: 'pointer'
};

export default Tasks;
