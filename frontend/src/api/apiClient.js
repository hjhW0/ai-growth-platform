import axios from 'axios';

const API_BASE = '/api';

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器：添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理错误
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // token 过期或无效
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ error: '网络错误' });
  }
);

// ========== 用户认证 ==========

export const register = async (username, password) => {
  const data = await api.post('/auth/register', { username, password });
  if (data.access_token) {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

export const login = async (username, password) => {
  const data = await api.post('/auth/login', { username, password });
  if (data.access_token) {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getMe = () => api.get('/auth/me');

// ========== 目标管理 ==========

export const createGoal = (data) => api.post('/goals/', data);

export const getGoals = (params = {}) => api.get('/goals/', { params });

export const getGoal = (goalId) => api.get(`/goals/${goalId}`);

export const updateGoal = (goalId, data) => api.put(`/goals/${goalId}`, data);

export const deleteGoal = (goalId) => api.delete(`/goals/${goalId}`);

export const generateTasks = (goalId) => api.post(`/goals/${goalId}/generate-tasks`);

// ========== 每日任务 ==========

export const createTask = (data) => api.post('/tasks/', data);

export const getTasks = (params = {}) => api.get('/tasks/', { params });

export const getTask = (taskId) => api.get(`/tasks/${taskId}`);

export const updateTask = (taskId, data) => api.put(`/tasks/${taskId}`, data);

export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);

export const completeTask = (taskId) => api.post(`/tasks/${taskId}/complete`);

// ========== 打卡 ==========

export const checkIn = (data) => api.post('/checkin/', data);

export const getCheckinStatus = (params = {}) => api.get('/checkin/status', { params });

export const getStreak = () => api.get('/checkin/streak');

export const getCheckinHistory = (params = {}) => api.get('/checkin/history', { params });

// ========== 统计数据 ==========

export const getTodayStats = () => api.get('/stats/today');

export const getWeekStats = () => api.get('/stats/week');

export const getMonthStats = () => api.get('/stats/month');

export const getOverview = () => api.get('/stats/overview');

// ========== AI 功能 ==========

export const getAIPlan = (goal) => api.post('/ai/plan', { goal });

export const getAIReview = (tasksCompleted, mood) => api.post('/ai/review', { tasks_completed: tasksCompleted, mood });

export const getAIAdvice = (growthHistory) => api.post('/ai/advice', { growth_history: growthHistory });

export const getAIWeeklyReport = (weeklyData) => api.post('/ai/weekly-report', { weekly_data: weeklyData });

export const sendAIMessage = (message, conversationId) => api.post('/ai/chat', { message, conversation_id: conversationId });

// SSE 流式对话
export const sendAIMessageStream = async (message, conversationId, onToken, onDone) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/ai/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message, conversation_id: conversationId })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = JSON.parse(line.slice(6));
      if (data.replace) {
        // BAD_PATTERNS 命中，替换全部
        onToken(data.replace, true);
      } else if (data.content) {
        onToken(data.content);
      }
      if (data.done && onDone) {
        onDone(data.conversation_id);
      }
    }
  }
};

export const getAIHistory = (params = {}) => api.get('/ai/history', { params });

export const getDailyReview = () => api.post('/ai/daily-review');

export const getGrowthLogs = (params = {}) => api.get('/ai/growth-logs', { params });

export const getAutoWeeklyReport = () => api.post('/ai/auto-weekly-report');

// ========== 反馈系统 ==========

export const submitFeedback = (content, rating = 5) => api.post('/feedback', { content, rating });

export const getFeedbacks = (params = {}) => api.get('/feedback', { params });

export default api;
