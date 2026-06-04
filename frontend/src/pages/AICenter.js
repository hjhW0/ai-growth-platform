import React, { useState, useEffect } from 'react';
import { getAIPlan, getAIAdvice, sendAIMessageStream, getAIHistory, getDailyReview, getGrowthLogs, getAutoWeeklyReport } from '../api/apiClient';
import ChatBox from '../components/ChatBox';
import PlanTab from '../components/PlanTab';
import ReviewTab from '../components/ReviewTab';
import WeeklyReportTab from '../components/WeeklyReportTab';

function AICenter() {
  const [activeTab, setActiveTab] = useState('chat');
  const [loading, setLoading] = useState(false);

  // 对话状态
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  // 规划状态
  const [goal, setGoal] = useState('');
  const [plan, setPlan] = useState('');

  // 复盘状态
  const [review, setReview] = useState('');
  const [reviewData, setReviewData] = useState(null);
  const [growthLogs, setGrowthLogs] = useState([]);

  // 周报状态
  const [weeklyReport, setWeeklyReport] = useState('');
  const [weekData, setWeekData] = useState(null);

  useEffect(() => {
    loadHistory();
    loadGrowthLogs();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getAIHistory();
      setChatHistory(data.history || []);
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

    // 先插入 user 消息和空的 assistant 消息
    setChatHistory(prev => [
      { role: 'user', content: userMsg, chat_type: 'general', created_at: new Date().toISOString() },
      { role: 'assistant', content: '', chat_type: 'general', created_at: new Date().toISOString() },
      ...prev
    ]);

    try {
      await sendAIMessageStream(userMsg, conversationId,
        // onToken: 逐 token 追加
        (token, isReplace) => {
          setChatHistory(prev => {
            const updated = [...prev];
            if (isReplace) {
              updated[0] = { ...updated[0], content: token };
            } else {
              updated[0] = { ...updated[0], content: updated[0].content + token };
            }
            return updated;
          });
        },
        // onDone: 保存 conversationId
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
    { id: 'chat', label: 'AI 对话' },
    { id: 'plan', label: 'AI 规划师' },
    { id: 'review', label: 'AI 复盘' },
    { id: 'report', label: 'AI 周报' }
  ];

  return (
    <div style={{ paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#333' }}>🤖 AI 中心</h2>
        <button onClick={handleGetAdvice} style={{
          backgroundColor: '#f59e0b', color: 'white', border: 'none',
          padding: '10px 20px', borderRadius: '8px', cursor: 'pointer'
        }}>
          获取成长建议
        </button>
      </div>

      {/* 标签页 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              backgroundColor: activeTab === tab.id ? '#6366f1' : 'white',
              color: activeTab === tab.id ? 'white' : '#333',
              border: '1px solid #6366f1',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {tab.label}
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
