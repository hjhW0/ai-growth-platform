import React, { useState, useEffect } from 'react';
import { getAIPlan, getAIAdvice, sendAIMessageStream, getAIHistory, getDailyReview, getGrowthLogs, getAutoWeeklyReport } from '../api/apiClient';
import ChatBox from '../components/ChatBox';
import PlanTab from '../components/PlanTab';
import ReviewTab from '../components/ReviewTab';
import WeeklyReportTab from '../components/WeeklyReportTab';

function AICenter() {
  const [activeTab, setActiveTab] = useState('chat');
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  const [goal, setGoal] = useState('');
  const [plan, setPlan] = useState('');

  const [review, setReview] = useState('');
  const [reviewData, setReviewData] = useState(null);
  const [growthLogs, setGrowthLogs] = useState([]);

  const [weeklyReport, setWeeklyReport] = useState('');
  const [weekData, setWeekData] = useState(null);

  useEffect(() => {
    loadHistory();
    loadGrowthLogs();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getAIHistory();
      const history = (data.history || []).reverse();
      setChatHistory(history);
    } catch (error) {
      console.error('加载历史失败:', error);
    }
  };

  const loadGrowthLogs = async () => {
    try {
      const res = await getGrowthLogs({ limit: 5 });
      setGrowthLogs(res.data || []);
    } catch (error) {
      console.error('加载成长日志失败:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || loading) return;
    const userMsg = message;
    setMessage('');
    setLoading(true);

    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: userMsg, chat_type: 'general', created_at: new Date().toISOString() },
      { role: 'assistant', content: '', chat_type: 'general', created_at: new Date().toISOString() }
    ]);

    try {
      await sendAIMessageStream(userMsg, conversationId,
        (token, isReplace) => {
          setChatHistory(prev => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            if (isReplace) {
              updated[lastIdx] = { ...updated[lastIdx], content: token };
            } else {
              updated[lastIdx] = { ...updated[lastIdx], content: updated[lastIdx].content + token };
            }
            return updated;
          });
        },
        (cid) => {
          if (cid) setConversationId(cid);
        }
      );
    } catch (error) {
      console.error('发送失败:', error);
    }
    setLoading(false);
  };

  const handleGeneratePlan = async () => {
    if (!goal.trim() || loading) return;
    setLoading(true);
    try {
      const data = await getAIPlan(goal);
      setPlan(data.plan);
    } catch (error) {
      console.error('生成计划失败:', error);
    }
    setLoading(false);
  };

  const handleGenerateReview = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await getDailyReview();
      setReview(res.data.review);
      setReviewData(res.data.data);
      loadGrowthLogs();
    } catch (error) {
      console.error('生成复盘失败:', error);
    }
    setLoading(false);
  };

  const handleGetAdvice = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await getAIAdvice('');
      setPlan(data.advice);
      setActiveTab('plan');
    } catch (error) {
      console.error('获取建议失败:', error);
    }
    setLoading(false);
  };

  const handleGenerateWeeklyReport = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await getAutoWeeklyReport();
      setWeeklyReport(res.data.report);
      setWeekData(res.data.data);
      loadGrowthLogs();
    } catch (error) {
      console.error('生成周报告失败:', error);
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'chat', label: 'AI 对话', icon: '💬' },
    { id: 'plan', label: 'AI 规划师', icon: '🎯' },
    { id: 'review', label: 'AI 复盘', icon: '📝' },
    { id: 'report', label: 'AI 周报', icon: '📊' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#333', margin: 0 }}>🤖 AI 中心</h2>
        <button onClick={handleGetAdvice} style={{
          backgroundColor: '#f59e0b',
          color: 'white',
          border: 'none',
          padding: '8px 14px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '600',
          minHeight: '36px',
          transition: 'background-color 0.2s'
        }}>
          💡 成长建议
        </button>
      </div>

      {/* 标签页 */}
      <div style={{
        display: 'flex',
        gap: '6px',
        marginBottom: '16px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              backgroundColor: activeTab === tab.id ? '#6366f1' : 'white',
              color: activeTab === tab.id ? 'white' : '#666',
              border: activeTab === tab.id ? 'none' : '1px solid #eee',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              minHeight: '36px',
              transition: 'all 0.2s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'chat' && (
        <ChatBox
          message={message}
          setMessage={setMessage}
          chatHistory={chatHistory}
          loading={loading}
          onSend={handleSendMessage}
        />
      )}

      {activeTab === 'plan' && (
        <PlanTab
          goal={goal}
          setGoal={setGoal}
          plan={plan}
          loading={loading}
          onGenerate={handleGeneratePlan}
        />
      )}

      {activeTab === 'review' && (
        <ReviewTab
          review={review}
          reviewData={reviewData}
          growthLogs={growthLogs}
          loading={loading}
          onGenerate={handleGenerateReview}
        />
      )}

      {activeTab === 'report' && (
        <WeeklyReportTab
          weeklyReport={weeklyReport}
          weekData={weekData}
          loading={loading}
          onGenerate={handleGenerateWeeklyReport}
        />
      )}
    </div>
  );
}

export default AICenter;
