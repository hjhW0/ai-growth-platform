import React, { useState, useEffect } from 'react';
import { getTodayStats, getTasks, getStreak, getGoals, getGrowthLogs, submitFeedback } from '../api/apiClient';
import { getToday } from '../utils/dateFormatter';

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
  const today = getToday();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, tasksData, streakData, goalsData, logsData] = await Promise.all([
        getTodayStats(),
        getTasks({ date: today }),
        getStreak(),
        getGoals({ status: 'active' }),
        getGrowthLogs({ limit: 1 })
      ]);
      setStats(statsData);
      setTodayTasks(tasksData.tasks || []);
      setStreak(streakData.streak || 0);
      // 取优先级最高的活跃目标
      const goals = goalsData.data || goalsData.goals || [];
      setActiveGoal(goals.length > 0 ? goals[0] : null);
      // 取最近一条成长日志
      const logs = logsData.data || [];
      setLatestLog(logs.length > 0 ? logs[0] : null);
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackContent.trim()) return;
    try {
      await submitFeedback(feedbackContent, feedbackRating);
      setFeedbackSent(true);
      setTimeout(() => {
        setShowFeedback(false);
        setFeedbackContent('');
        setFeedbackRating(5);
        setFeedbackSent(false);
      }, 1500);
    } catch (e) {
      alert('提交失败，请重试');
    }
  };

  const completedCount = stats?.completed || 0;
  const totalCount = stats?.total || 0;
  const rate = stats?.rate || 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return { icon: '🌙', text: '夜深了，注意休息' };
    if (hour < 12) return { icon: '☀️', text: '早上好' };
    if (hour < 18) return { icon: '☀️', text: '下午好' };
    return { icon: '🌅', text: '晚上好' };
  };

  const greeting = getGreeting();

  // 获取用户名
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user.username || '用户';

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* 第一块：问候 + 核心数据 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '28px',
        color: 'white',
        marginBottom: '16px'
      }}>
        <div style={{ fontSize: '15px', opacity: 0.9, marginBottom: '4px' }}>
          {greeting.icon} {greeting.text}，{username}
        </div>
        <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '20px' }}>
          🔥 已连续打卡 {streak} 天
        </div>

        {/* 今日任务进度 */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px' }}>今日任务</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {completedCount}/{totalCount} 完成
            </span>
          </div>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '6px',
            height: '8px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '6px',
              height: '8px',
              width: `${rate}%`,
              transition: 'width 0.5s ease'
            }} />
          </div>
          <div style={{ textAlign: 'right', marginTop: '6px', fontSize: '13px', opacity: 0.8 }}>
            完成率 {rate}%
          </div>
        </div>
      </div>

      {/* 第二块：当前核心目标 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>
          🎯 当前核心目标
        </div>
        {activeGoal ? (
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
              {activeGoal.title}
            </div>
            {activeGoal.description && (
              <div style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>
                {activeGoal.description}
              </div>
            )}
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#666' }}>
              <span>类型：{activeGoal.goal_type || '未分类'}</span>
              <span>优先级：{activeGoal.priority === 'high' ? '🔴 高' : activeGoal.priority === 'medium' ? '🟡 中' : '🟢 低'}</span>
              {activeGoal.deadline && <span>截止：{activeGoal.deadline}</span>}
            </div>
          </div>
        ) : (
          <div style={{ color: '#ccc', fontSize: '14px' }}>
            暂无活跃目标，去"目标"页面创建一个吧
          </div>
        )}
      </div>

      {/* 第三块：最近 AI 建议 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>
          🤖 最近 AI 建议
        </div>
        {latestLog ? (
          <div>
            <div style={{
              fontSize: '14px',
              color: '#555',
              lineHeight: '1.8',
              whiteSpace: 'pre-wrap'
            }}>
              {latestLog.ai_summary || latestLog.content}
            </div>
            <div style={{ fontSize: '12px', color: '#bbb', marginTop: '10px' }}>
              {latestLog.log_date}
            </div>
          </div>
        ) : (
          <div style={{ color: '#ccc', fontSize: '14px' }}>
            暂无 AI 建议，完成今日任务后可生成复盘
          </div>
        )}
      </div>

      {/* 第四块：今日任务列表 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>
          📋 今日任务
        </div>

        {todayTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#ccc' }}>
            今天还没有任务
          </div>
        ) : (
          <div>
            {todayTasks.slice(0, 5).map(task => (
              <div key={task.id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px solid #f5f5f5'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: `2px solid ${task.status === 'completed' ? '#22c55e' : '#ddd'}`,
                  backgroundColor: task.status === 'completed' ? '#22c55e' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px',
                  flexShrink: 0
                }}>
                  {task.status === 'completed' && (
                    <span style={{ color: 'white', fontSize: '12px' }}>✓</span>
                  )}
                </div>
                <span style={{
                  flex: 1,
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  color: task.status === 'completed' ? '#bbb' : '#333',
                  fontSize: '14px'
                }}>
                  {task.title}
                </span>
                {task.priority === 'high' && (
                  <span style={{ fontSize: '11px', color: '#ef4444', marginLeft: '8px' }}>高</span>
                )}
              </div>
            ))}
            {todayTasks.length > 5 && (
              <a href="/tasks" style={{
                display: 'block',
                textAlign: 'center',
                padding: '12px',
                color: '#6366f1',
                textDecoration: 'none',
                fontSize: '13px'
              }}>
                还有 {todayTasks.length - 5} 项任务 →
              </a>
            )}
          </div>
        )}
      </div>

      {/* 浮动反馈按钮 */}
      <div
        onClick={() => setShowFeedback(true)}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
          zIndex: 100,
          transition: 'transform 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        💬
      </div>

      {/* 反馈弹窗 */}
      {showFeedback && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowFeedback(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }} onClick={e => e.stopPropagation()}>
            {feedbackSent ? (
              <div style={{ textAlign: 'center', padding: '30px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>感谢你的反馈！</div>
                <div style={{ fontSize: '14px', color: '#888', marginTop: '8px' }}>我们会认真改进</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
                  💬 意见反馈
                </div>

                {/* 评分 */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>整体体验</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1,2,3,4,5].map(i => (
                      <span
                        key={i}
                        onClick={() => setFeedbackRating(i)}
                        style={{
                          fontSize: '28px',
                          cursor: 'pointer',
                          transition: 'transform 0.15s',
                          transform: i <= feedbackRating ? 'scale(1.1)' : 'scale(1)'
                        }}
                      >
                        {i <= feedbackRating ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 内容 */}
                <textarea
                  value={feedbackContent}
                  onChange={e => setFeedbackContent(e.target.value)}
                  placeholder="说说你的使用感受，遇到了什么问题，或者想要什么功能..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #e0e0e0',
                    fontSize: '14px',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#667eea'}
                  onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                />

                {/* 提交按钮 */}
                <button
                  onClick={handleSubmitFeedback}
                  disabled={!feedbackContent.trim()}
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: feedbackContent.trim()
                      ? 'linear-gradient(135deg, #667eea, #764ba2)'
                      : '#e0e0e0',
                    color: feedbackContent.trim() ? 'white' : '#999',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: feedbackContent.trim() ? 'pointer' : 'not-allowed'
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
