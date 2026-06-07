import React, { useState, useEffect } from 'react';
import { createTask, getTasks, completeTask, deleteTask, updateTask, trackEvent } from '../api/apiClient';
import { getToday, formatDateChinese, getWeekday, formatDate } from '../utils/dateFormatter';
import { t, card, input, btnPrimary, focusBorder, blurBorder } from '../styles/tokens';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { loadTasks(); }, [selectedDate]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks({ date: selectedDate });
      setTasks(data.tasks || []);
      setError(null);
    } catch (error) {
      console.error('加载任务失败:', error);
      setError('加载任务失败，请稍后重试');
    }
    setLoading(false);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await createTask({ title: newTask, task_date: selectedDate, priority });
      trackEvent('create_task', JSON.stringify({ priority }));
      setNewTask('');
      setShowAdd(false);
      loadTasks();
    } catch (error) { console.error('添加任务失败:', error); }
  };

  const handleComplete = async (taskId) => {
    try { await completeTask(taskId); trackEvent('complete_task'); loadTasks(); }
    catch (error) { console.error('完成任务失败:', error); }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('确定要删除这个任务吗？')) {
      try { await deleteTask(taskId); loadTasks(); }
      catch (error) { console.error('删除失败:', error); }
    }
  };

  const changeDate = (days) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(formatDate(date));
  };

  const isToday = selectedDate === getToday();
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const progress = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const priorityConfig = {
    high: { color: t.error, bg: t.errorLight, label: '高' },
    medium: { color: t.warning, bg: t.warningLight, label: '中' },
    low: { color: t.success, bg: t.successLight, label: '低' },
  };

  return (
    <div>
      {/* Date navigator */}
      <div className="animate-in" style={{
        ...card,
        marginBottom: t.sp4,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `${t.sp3} ${t.sp4}`,
      }}>
        <button onClick={() => changeDate(-1)} style={{
          background: 'none', border: `1px solid ${t.border}`,
          padding: '6px 12px', borderRadius: t.rSm,
          cursor: 'pointer', fontSize: t.base, color: t.textSecondary,
          fontFamily: 'inherit', minHeight: '36px',
        }}>←</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: t.md, fontWeight: '600', color: t.text }}>
            {formatDateChinese(selectedDate)}
          </div>
          <div style={{ fontSize: t.xs, color: t.textMuted }}>
            {getWeekday(selectedDate)} {isToday && '· 今天'}
          </div>
        </div>
        <button onClick={() => changeDate(1)} style={{
          background: 'none', border: `1px solid ${t.border}`,
          padding: '6px 12px', borderRadius: t.rSm,
          cursor: 'pointer', fontSize: t.base, color: t.textSecondary,
          fontFamily: 'inherit', minHeight: '36px',
        }}>→</button>
      </div>

      {/* Progress summary */}
      {tasks.length > 0 && (
        <div className="animate-in animate-in-delay-1" style={{
          display: 'flex', gap: t.sp3, marginBottom: t.sp4,
        }}>
          <div style={{
            ...card, flex: 1, padding: t.sp4, textAlign: 'center',
            background: `linear-gradient(135deg, ${t.primaryLight}, #f0f0ff)`,
            border: `1px solid rgba(91,95,239,0.12)`,
          }}>
            <div style={{ fontSize: t['2xl'], fontWeight: '700', color: t.primary }}>{tasks.length}</div>
            <div style={{ fontSize: t.xs, color: t.textMuted }}>总计</div>
          </div>
          <div style={{
            ...card, flex: 1, padding: t.sp4, textAlign: 'center',
            background: `linear-gradient(135deg, ${t.successLight}, #ecfdf5)`,
            border: `1px solid rgba(16,185,129,0.12)`,
          }}>
            <div style={{ fontSize: t['2xl'], fontWeight: '700', color: t.success }}>{completedTasks.length}</div>
            <div style={{ fontSize: t.xs, color: t.textMuted }}>完成</div>
          </div>
          <div style={{
            ...card, flex: 1, padding: t.sp4, textAlign: 'center',
            background: progress >= 80
              ? `linear-gradient(135deg, ${t.successLight}, #ecfdf5)`
              : `linear-gradient(135deg, ${t.warningLight}, #fffbeb)`,
            border: `1px solid ${progress >= 80 ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)'}`,
          }}>
            <div style={{ fontSize: t['2xl'], fontWeight: '700', color: progress >= 80 ? t.success : t.warning }}>{progress}%</div>
            <div style={{ fontSize: t.xs, color: t.textMuted }}>完成率</div>
          </div>
        </div>
      )}

      {/* Add task section */}
      <div className="animate-in animate-in-delay-2" style={{ ...card, marginBottom: t.sp4 }}>
        {!showAdd ? (
          <button onClick={() => setShowAdd(true)} style={{
            width: '100%', padding: `${t.sp3} 0`,
            background: 'none', border: `1.5px dashed ${t.border}`,
            borderRadius: t.rMd, cursor: 'pointer',
            fontSize: t.base, color: t.textMuted,
            fontFamily: 'inherit', minHeight: '44px',
            transition: 'all 0.15s',
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = t.primary; e.currentTarget.style.color = t.primary; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted; }}
          >
            + 添加新任务
          </button>
        ) : (
          <form onSubmit={handleAddTask}>
            <input
              type="text" value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="输入新任务..."
              autoFocus
              style={{ ...input, marginBottom: t.sp3 }}
              onFocus={focusBorder} onBlur={blurBorder}
            />
            <div style={{ display: 'flex', gap: t.sp2, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                {Object.entries(priorityConfig).map(([key, cfg]) => (
                  <button key={key} type="button" onClick={() => setPriority(key)} style={{
                    padding: '4px 10px', borderRadius: t.rSm, cursor: 'pointer',
                    fontSize: t.xs, fontWeight: '500', fontFamily: 'inherit',
                    border: `1.5px solid ${priority === key ? cfg.color : t.border}`,
                    backgroundColor: priority === key ? cfg.bg : 'transparent',
                    color: priority === key ? cfg.color : t.textMuted,
                    transition: 'all 0.15s',
                  }}>
                    {cfg.label}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => { setShowAdd(false); setNewTask(''); }} style={{
                padding: '6px 12px', background: 'none', border: `1px solid ${t.border}`,
                borderRadius: t.rSm, cursor: 'pointer', fontSize: t.sm,
                color: t.textSecondary, fontFamily: 'inherit',
              }}>取消</button>
              <button type="submit" disabled={!newTask.trim()} style={{
                ...btnPrimary,
                padding: '6px 16px', minHeight: '36px', fontSize: t.sm,
                opacity: newTask.trim() ? 1 : 0.5,
              }}>添加</button>
            </div>
          </form>
        )}
      </div>

      {/* Task list */}
      {loading ? (
        <div style={card}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: t.sp3, padding: `${t.sp3} 0`, borderBottom: `1px solid ${t.borderLight}` }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: t.surfaceAlt }} />
              <div style={{ flex: 1, height: 14, backgroundColor: t.surfaceAlt, borderRadius: t.rSm }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div style={{ ...card, textAlign: 'center', padding: `${t.sp8} ${t.sp5}`, backgroundColor: t.errorLight, border: `1px solid rgba(239,68,68,0.15)` }}>
          <div style={{ fontSize: '32px', marginBottom: t.sp3 }}>😵</div>
          <div style={{ color: t.error, fontSize: t.md, fontWeight: '500', marginBottom: t.sp2 }}>{error}</div>
          <button onClick={() => { setLoading(true); setError(null); loadTasks(); }} style={{
            padding: `${t.sp3} ${t.sp5}`, borderRadius: t.rMd, border: 'none',
            backgroundColor: t.primary, color: 'white', cursor: 'pointer',
            fontSize: t.sm, fontWeight: '600', fontFamily: 'inherit',
          }}>重试</button>
        </div>
      ) : tasks.length === 0 ? (
        <div className="animate-in" style={{ ...card, textAlign: 'center', padding: `${t.sp8} ${t.sp5}` }}>
          <div style={{ fontSize: '40px', marginBottom: t.sp3 }}>📝</div>
          <div style={{ color: t.textSecondary, fontSize: t.md, fontWeight: '500', marginBottom: t.sp1 }}>暂无任务</div>
          <div style={{ color: t.textMuted, fontSize: t.sm }}>点击上方"添加新任务"开始吧</div>
        </div>
      ) : (
        <div>
          {/* Pending tasks */}
          {pendingTasks.length > 0 && (
            <div className="animate-in animate-in-delay-2" style={{ ...card, marginBottom: t.sp3 }}>
              <div style={{ fontSize: t.xs, color: t.textMuted, fontWeight: '600', marginBottom: t.sp3, letterSpacing: '0.03em' }}>
                待完成 · {pendingTasks.length}
              </div>
              {pendingTasks.map((task, idx) => (
                <div key={task.id} style={{
                  display: 'flex', alignItems: 'center', gap: t.sp3,
                  padding: `${t.sp3} 0`,
                  borderBottom: idx < pendingTasks.length - 1 ? `1px solid ${t.borderLight}` : 'none',
                }}>
                  <button onClick={() => handleComplete(task.id)} style={{
                    width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${t.border}`, backgroundColor: 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s', padding: 0,
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = t.success; e.currentTarget.style.backgroundColor = t.successLight; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.backgroundColor = 'transparent'; }}
                  />
                  <span style={{ flex: 1, fontSize: t.base, color: t.text, minWidth: 0 }}>{task.title}</span>
                  <span style={{
                    padding: '2px 6px', borderRadius: t.rSm, fontSize: t.xs, fontWeight: '500',
                    backgroundColor: priorityConfig[task.priority]?.bg || t.surfaceAlt,
                    color: priorityConfig[task.priority]?.color || t.textMuted,
                    flexShrink: 0,
                  }}>
                    {priorityConfig[task.priority]?.label || task.priority}
                  </span>
                  <button onClick={() => handleDelete(task.id)} style={{
                    background: 'none', border: 'none', color: t.textMuted,
                    cursor: 'pointer', fontSize: '16px', padding: '4px',
                    flexShrink: 0, transition: 'color 0.15s',
                  }}
                  onMouseOver={e => e.currentTarget.style.color = t.error}
                  onMouseOut={e => e.currentTarget.style.color = t.textMuted}
                  >×</button>
                </div>
              ))}
            </div>
          )}

          {/* Completed tasks */}
          {completedTasks.length > 0 && (
            <div className="animate-in animate-in-delay-3" style={{ ...card }}>
              <div style={{ fontSize: t.xs, color: t.textMuted, fontWeight: '600', marginBottom: t.sp3, letterSpacing: '0.03em' }}>
                已完成 · {completedTasks.length}
              </div>
              {completedTasks.map((task, idx) => (
                <div key={task.id} style={{
                  display: 'flex', alignItems: 'center', gap: t.sp3,
                  padding: `${t.sp3} 0`,
                  borderBottom: idx < completedTasks.length - 1 ? `1px solid ${t.borderLight}` : 'none',
                  opacity: 0.6,
                }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                    backgroundColor: t.success, border: `2px solid ${t.success}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>✓</span>
                  </div>
                  <span style={{
                    flex: 1, fontSize: t.base, color: t.textMuted,
                    textDecoration: 'line-through',
                  }}>{task.title}</span>
                  <button onClick={() => handleDelete(task.id)} style={{
                    background: 'none', border: 'none', color: t.textMuted,
                    cursor: 'pointer', fontSize: '16px', padding: '4px',
                    flexShrink: 0, transition: 'color 0.15s',
                  }}
                  onMouseOver={e => e.currentTarget.style.color = t.error}
                  onMouseOut={e => e.currentTarget.style.color = t.textMuted}
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Tasks;
