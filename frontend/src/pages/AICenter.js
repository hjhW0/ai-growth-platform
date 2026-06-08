import React, { useState, useEffect } from 'react';
import { Sparkles, Lightbulb, MessageCircle, Compass, RefreshCw, BarChart3 } from 'lucide-react';
import { getAIPlan, getAIAdvice, sendAIMessageStream, getAIHistory, getDailyReview, getGrowthLogs, getAutoWeeklyReport, trackEvent } from '../api/apiClient';
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
    trackEvent('ai_chat');
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
    trackEvent('ai_plan');
    try { const data = await getAIPlan(goal); setPlan(data.plan); } catch (error) { console.error('生成计划失败:', error); }
    setLoading(false);
  };

  const handleGenerateReview = async () => {
    if (loading) return;
    setLoading(true);
    trackEvent('ai_review');
    try { const res = await getDailyReview(); setReview(res.data.review); setReviewData(res.data.data); loadGrowthLogs(); } catch (error) { console.error('生成复盘失败:', error); }
    setLoading(false);
  };

  const handleGetAdvice = async () => {
    if (loading) return;
    setLoading(true);
    trackEvent('ai_advice');
    try { const data = await getAIAdvice(''); setPlan(data.advice); setActiveTab('plan'); } catch (error) { console.error('获取建议失败:', error); }
    setLoading(false);
  };

  const handleGenerateWeeklyReport = async () => {
    if (loading) return;
    setLoading(true);
    trackEvent('ai_report');
    try { const res = await getAutoWeeklyReport(); setWeeklyReport(res.data.report); setWeekData(res.data.data); loadGrowthLogs(); } catch (error) { console.error('生成周报告失败:', error); }
    setLoading(false);
  };

  const tabs = [
    { id: 'chat', label: '对话', Icon: MessageCircle },
    { id: 'plan', label: '规划', Icon: Compass },
    { id: 'review', label: '复盘', Icon: RefreshCw },
    { id: 'report', label: '周报', Icon: BarChart3 },
  ];

  return (
    <div>
      {/* AI 光球形象 */}
      <div className="animate-in" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        marginBottom: t.sp4, paddingTop: t.sp2,
      }}>
        <div className={`ai-orb ${loading ? 'ai-orb-thinking' : ''}`} style={{ width: 56, height: 56, marginBottom: t.sp2 }}>
          <Sparkles size={22} style={{ color: t.primary }} />
        </div>
        <div style={{
          fontSize: t.sm, color: t.textSecondary, fontWeight: '500',
          textShadow: '0 0 12px rgba(78, 238, 148, 0.2)',
        }}>
          {loading ? '温室正在思考...' : '有什么想聊的？'}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: '2px', marginBottom: t.sp4,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        padding: '4px', borderRadius: t.rMd,
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}>
        {tabs.map(tab => {
          const { Icon } = tab;
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: `${t.sp2} ${t.sp3}`, borderRadius: t.rSm,
              cursor: 'pointer', fontSize: t.sm, fontWeight: active ? '600' : '500',
              fontFamily: 'inherit', minHeight: '36px',
              border: 'none',
              backgroundColor: active ? 'rgba(78, 238, 148, 0.12)' : 'transparent',
              color: active ? t.primary : t.textMuted,
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              boxShadow: active ? '0 0 10px rgba(78, 238, 148, 0.1)' : 'none',
              transform: active ? 'scale(1.02)' : 'scale(1)',
            }}>
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 成长建议按钮 */}
      <div style={{ marginBottom: t.sp3 }}>
        <button onClick={handleGetAdvice} style={{
          width: '100%', padding: `${t.sp3} ${t.sp4}`, borderRadius: t.rMd,
          cursor: 'pointer', fontSize: t.sm, fontWeight: '600', fontFamily: 'inherit',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.05))',
          color: t.warning,
          border: '1px solid rgba(245, 158, 11, 0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          transition: 'all 0.2s',
        }}>
          <Lightbulb size={15} /> 获取成长建议
        </button>
      </div>

      {activeTab === 'chat' && <ChatBox message={message} setMessage={setMessage} chatHistory={chatHistory} loading={loading} onSend={handleSendMessage} />}
      {activeTab === 'plan' && <PlanTab goal={goal} setGoal={setGoal} plan={plan} loading={loading} onGenerate={handleGeneratePlan} />}
      {activeTab === 'review' && <ReviewTab review={review} reviewData={reviewData} growthLogs={growthLogs} loading={loading} onGenerate={handleGenerateReview} />}
      {activeTab === 'report' && <WeeklyReportTab weeklyReport={weeklyReport} weekData={weekData} loading={loading} onGenerate={handleGenerateWeeklyReport} />}
    </div>
  );
}

export default AICenter;
