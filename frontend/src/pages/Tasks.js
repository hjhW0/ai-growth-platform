import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, Check, Trash2, ListChecks, Sprout } from 'lucide-react';
import { createTask, getTasks, completeTask, deleteTask, updateTask, trackEvent } from '../api/apiClient';
import { getToday, formatDateChinese, getWeekday, formatDate } from '../utils/dateFormatter';
import { t, card, input, btnPrimary, focusBorder, blurBorder } from '../styles/tokens';
import EmptyPot from '../components/EmptyPot';
import ErrorState from '../components/ErrorState';
import { SkeletonList } from '../components/Skeleton';

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
      setError('温室信号有点弱，任务没加载到');
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
    if (window.confirm('确定要移除这个任务吗？')) {
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
    high: { color: t.error, bg: t.errorLight, label: '紧急' },
    medium: { color: t.warning, bg: t.warningLight, label: '普通' },
    low: { color: t.success, bg: t.successLight, label: '轻松' },
  };

  const getProgressText = () => {
    if (progress === 100) return '🎉 全部搞定！';
    if (progress >= 80) return '快完成了，冲刺！';
    if (progress >= 50) return '过半了，节奏很好';
    if (progress > 0) return '刚刚起步，加油';
    return '今天还没开始';
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
          background: 'rgba(255, 255, 255, 0.04)', border: `1px solid rgba(255, 255, 255, 0.08)`,
          padding: '6px 12px', borderRadius: t.rSm,
          cursor: 'pointer', color: t.textSecondary,
          fontFamily: 'inherit', minHeight: '36px',
          display: 'flex', alignItems: 'center',
        }}><ChevronLeft size={16} /></button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: t.md, fontWeight: '600', color: t.text }}>
            {formatDateChinese(selectedDate)}
          </div>
          <div style={{ fontSize: t.xs, color: t.textMuted }}>
            {getWeekday(selectedDate)} {isToday && '· 今天'}
          </div>
        </div>
        <button onClick={() => changeDate(1)} style={{
          background: 'rgba(255, 255, 255, 0.04)', border: `1px solid rgba(255, 255, 255, 0.08)`,
          padding: '6px 12px', borderRadius: t.rSm,
          cursor: 'pointer', color: t.textSecondary,
          fontFamily: 'inherit', minHeight: '36px',
          display: 'flex', alignItems: 'center',
        }}><ChevronRight size={16} /></button>
      </div>

      {/* Progress summary */}
      {tasks.length > 0 && (
        <div className="animate-in animate-in-delay-1" style={{
          display: 'flex', gap: t.sp3, marginBottom: t.sp4,
        }}>
          {[
            { value: tasks.length, label: '总计', color: t.primary },
            { value: completedTasks.length, label: '完成', color: t.success },
            { value: `${progress}%`, label: '完成率', color: progress >= 80 ? t.success : progress >= 50 ? t.warning : t.primary },
          ].map((item, idx) => (
            <div key={idx} className="card-hover" style={{
              ...card, flex: 1, padding: t.sp4, textAlign: 'center',
              background: `linear-gradient(135deg, ${item.color}10, rgba(255, 255, 255, 0.02))`,
              border: `1px solid ${item.color}18`,
              cursor: 'default',
            }}>
              <div style={{
                fontSize: t['2xl'], fontWeight: '700', color: item.color,
                textShadow: `0 0 12px ${item.color}25`,
              }}>{item.value}</div>
              <div style={{ fontSize: t.xs, color: t.textMuted }}>{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Add task section */}
      <div className="animate-in animate-in-delay-2" style={{ ...card, marginBottom: t.sp4 }}>
        {!showAdd ? (
          <button onClick={() => setShowAdd(true)} style={{
            width: '100%', padding: `${t.sp3} 0`,
            background: 'none', border: `1.5px dashed rgba(78, 238, 148, 0.2)`,
            borderRadius: t.rMd, cursor: 'pointer',
            fontSize: t.base, color: t.textMuted,
            fontFamily: 'inherit', minHeight: '44px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: t.sp2,
            transition: 'all 0.2s',
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(78, 238, 148, 0.4)'; e.currentTarget.style.color = t.primary; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(78, 238, 148, 0.2)'; e.currentTarget.style.color = t.textMuted; }}
          >
            <Plus size={16} /> 播下一颗新种子
          </button>
        ) : (
          <form onSubmit={handleAddTask}>
            <input
              type="text" value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="今天想完成什么呢..."
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
                    border: `1.5px solid ${priority === key ? cfg.color : 'rgba(255, 255, 255, 0.08)'}`,
                    backgroundColor: priority === key ? cfg.bg : 'transparent',
                    color: priority === key ? cfg.color : t.textMuted,
                    transition: 'all 0.2s',
                  }}>
                    {cfg.label}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => { setShowAdd(false); setNewTask(''); }} style={{
                padding: '6px 12px', background: 'none', border: `1px solid rgba(255, 255, 255, 0.08)`,
                borderRadius: t.rSm, cursor: 'pointer', fontSize: t.sm,
                color: t.textSecondary, fontFamily: 'inherit',
              }}>取消</button>
              <button type="submit" disabled={!newTask.trim()} style={{
                ...btnPrimary,
                padding: '6px 16px', minHeight: '36px', fontSize: t.sm,
                opacity: newTask.trim() ? 1 : 0.5,
              }}>种下</button>
            </div>
          </form>
        )}
      </div>

      {/* Progress hint */}
      {tasks.length > 0 && (
        <div style={{
          fontSize: t.xs, color: t.textMuted, textAlign: 'center',
          marginBottom: t.sp3, padding: `0 ${t.sp2}`,
        }}>
          {getProgressText()}
        </div>
      )}

      {/* Task list */}
      {loading ? (
        <SkeletonList count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => { setLoading(true); setError(null); loadTasks(); }} />
      ) : tasks.length === 0 ? (
        <div className="animate-in" style={{ ...card }}>
          <EmptyPot text="这片土壤还空着" sub="播下第一颗种子吧" />
        </div>
      ) : (
        <div>
          {/* Pending tasks */}
          {pendingTasks.length > 0 && (
            <div className="animate-in animate-in-delay-2" style={{ ...card, marginBottom: t.sp3 }}>
              <div style={{ fontSize: t.xs, color: t.textMuted, fontWeight: '600', marginBottom: t.sp3, letterSpacing: '0.03em' }}>
                待浇灌 · {pendingTasks.length}
              </div>
              {pendingTasks.map((task, idx) => (
                <div key={task.id} className="card-hover" style={{
                  display: 'flex', alignItems: 'center', gap: t.sp3,
                  padding: `${t.sp3} 0`,
                  borderBottom: idx < pendingTasks.length - 1 ? `1px solid rgba(255, 255, 255, 0.04)` : 'none',
                  cursor: 'default',
                }}>
                  <button onClick={() => handleComplete(task.id)} style={{
                    width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                    border: `2px solid rgba(78, 238, 148, 0.25)`, backgroundColor: 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', padding: 0,
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = t.success; e.currentTarget.style.backgroundColor = 'rgba(78, 238, 148, 0.1)'; e.currentTarget.style.boxShadow = '0 0 8px rgba(78, 238, 148, 0.2)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(78, 238, 148, 0.25)'; e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <Check size={12} style={{ opacity: 0 }} />
                  </button>
                  <span style={{ flex: 1, fontSize: t.base, color: t.text, minWidth: 0 }}>{task.title}</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: t.rSm, fontSize: t.xs, fontWeight: '500',
                    backgroundColor: priorityConfig[task.priority]?.bg || 'rgba(255, 255, 255, 0.05)',
                    color: priorityConfig[task.priority]?.color || t.textMuted,
                    border: `1px solid ${priorityConfig[task.priority]?.color || t.border}20`,
                    flexShrink: 0,
                  }}>
                    {priorityConfig[task.priority]?.label || task.priority}
                  </span>
                  <button onClick={() => handleDelete(task.id)} style={{
                    background: 'none', border: 'none', color: t.textMuted,
                    cursor: 'pointer', padding: '4px',
                    flexShrink: 0, transition: 'color 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.color = t.error}
                  onMouseOut={e => e.currentTarget.style.color = t.textMuted}
                  ><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}

          {/* Completed tasks */}
          {completedTasks.length > 0 && (
            <div className="animate-in animate-in-delay-3" style={{ ...card }}>
              <div style={{ fontSize: t.xs, color: t.textMuted, fontWeight: '600', marginBottom: t.sp3, letterSpacing: '0.03em' }}>
                已收获 · {completedTasks.length}
              </div>
              {completedTasks.map((task, idx) => (
                <div key={task.id} style={{
                  display: 'flex', alignItems: 'center', gap: t.sp3,
                  padding: `${t.sp3} 0`,
                  borderBottom: idx < completedTasks.length - 1 ? `1px solid rgba(255, 255, 255, 0.04)` : 'none',
                  opacity: 0.6,
                }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #4EEE94, #3cc07a)',
                    border: `2px solid ${t.success}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 8px rgba(78, 238, 148, 0.25)',
                  }}>
                    <Check size={12} style={{ color: 'white' }} />
                  </div>
                  <span style={{
                    flex: 1, fontSize: t.base, color: t.textMuted,
                    textDecoration: 'line-through',
                  }}>{task.title}</span>
                  <button onClick={() => handleDelete(task.id)} style={{
                    background: 'none', border: 'none', color: t.textMuted,
                    cursor: 'pointer', padding: '4px',
                    flexShrink: 0, transition: 'color 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.color = t.error}
                  onMouseOut={e => e.currentTarget.style.color = t.textMuted}
                  ><Trash2 size={14} /></button>
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
