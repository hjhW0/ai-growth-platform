import React, { useState, useEffect } from 'react';
import { getAIPlan, getAIAdvice, sendAIMessageStream, getAIHistory, getDailyReview, getGrowthLogs, getAutoWeeklyReport } from '../api/apiClient';
import ChatBox from '../components/ChatBox';
import PlanTab from '../components/PlanTab';
import ReviewTab from '../components/ReviewTab';
import WeeklyReportTab from '../components/WeeklyReportTab';
import { t, card } from '../styles/tokens';

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

  useEffect(() => { loadHistory(); loadGrowthLogs(); }, []);

  const loadHistory = async () => {
    try {
      const data = await getAIHistory();
      setChatHistory((data.history || []).reverse());
    } catch (error) { console.error('加载历史失败:', error); }
  };

  const loadGrowthLogs = async () => {
    try {
      const res = await getGrowthLogs({ limit: 5 });
      setGrowthLogs(res.data || []);
    } catch (error) { console.error('加载成长日志失败:', error); }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || loading) return;
    const userMsg = message;
    setMessage('');
    setLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg, chat_type: 'general', created_at: new Date().toISOString() }, { role: 'assistant', content: '', chat_type: 'general', created_at: new Date().toISOString() }]);
    try {
      await sendAIMessageStream(userMsg, conversationId,
        (token, isReplace) => {
          setChatHistory(prev => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            updated[lastIdx] = { ...updated[lastIdx], content: isReplace ? token : updated[lastIdx].content + token };
            return updated;
          });
        },
        (cid) => { if (cid) setConversationId(cid); }
      );
    } catch (error) { console.error('发送失败:', error); }
    setLoading(false);
  };

  const handleGeneratePlan = async () => {
    if (!goal.trim() || loading) return;
    setLoading(true);
    try { const data = await getAIPlan(goal); setPlan(data.plan); } catch (error) { console.error('生成计划失败:', error); }
    setLoading(false);
  };

  const handleGenerateReview = async () => {
    if (loading) return;
    setLoading(true);
    try { const res = await getDailyReview(); setReview(res.data.review); setReviewData(res.data.data); loadGrowthLogs(); } catch (error) { console.error('生成复盘失败:', error); }
    setLoading(false);
  };

  const handleGetAdvice = async () => {
    if (loading) return;
    setLoading(true);
    try { const data = await getAIAdvice(''); setPlan(data.advice); setActiveTab('plan'); } catch (error) { console.error('获取建议失败:', error); }
    setLoading(false);
  };

  const handleGenerateWeeklyReport = async () => {
    if (loading) return;
    setLoading(true);
    try { const res = await getAutoWeeklyReport(); setWeeklyReport(res.data.report); setWeekData(res.data.data); loadGrowthLogs(); } catch (error) { console.error('生成周报告失败:', error); }
    setLoading(false);
  };

  const tabs = [
    { id: 'chat', label: '对话', icon: '💬' },
    { id: 'plan', label: '规划', icon: '🎯' },
    { id: 'review', label: '复盘', icon: '📝' },
    { id: 'report', label: '周报', icon: '📊' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: t.sp4 }}>
        <h2 style={{ fontSize: t.xl, fontWeight: '700', color: t.text, margin: 0, letterSpacing: '-0.02em' }}>AI 中心</h2>
        <button onClick={handleGetAdvice} style={{
          padding: '6px 12px', borderRadius: t.rMd, cursor: 'pointer',
          fontSize: t.sm, fontWeight: '600', fontFamily: 'inherit',
          backgroundColor: t.warningLight, color: t.warning,
          border: `1px solid rgba(245,158,11,0.2)`,
          transition: 'all 0.15s',
        }}>
          💡 成长建议
        </button>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: t.sp2, marginBottom: t.sp4,
        backgroundColor: t.surface, padding: '4px',
        borderRadius: t.rMd, border: `1px solid ${t.border}`,
      }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, padding: `${t.sp2} ${t.sp3}`, borderRadius: t.rSm,
            cursor: 'pointer', fontSize: t.sm, fontWeight: '500',
            fontFamily: 'inherit', minHeight: '36px',
            border: 'none',
            backgroundColor: activeTab === tab.id ? t.primaryLight : 'transparent',
            color: activeTab === tab.id ? t.primary : t.textMuted,
            transition: 'all 0.15s',
          }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'chat' && <ChatBox message={message} setMessage={setMessage} chatHistory={chatHistory} loading={loading} onSend={handleSendMessage} />}
      {activeTab === 'plan' && <PlanTab goal={goal} setGoal={setGoal} plan={plan} loading={loading} onGenerate={handleGeneratePlan} />}
      {activeTab === 'review' && <ReviewTab review={review} reviewData={reviewData} growthLogs={growthLogs} loading={loading} onGenerate={handleGenerateReview} />}
      {activeTab === 'report' && <WeeklyReportTab weeklyReport={weeklyReport} weekData={weekData} loading={loading} onGenerate={handleGenerateWeeklyReport} />}
    </div>
  );
}

export default AICenter;
