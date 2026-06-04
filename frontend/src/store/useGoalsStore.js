import { create } from 'zustand';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../api/apiClient';

const useGoalsStore = create((set, get) => ({
  goals: [],
  loading: false,
  error: null,

  // 获取目标列表
  fetchGoals: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await getGoals(params);
      if (res.code === 0) {
        set({ goals: res.data, loading: false });
      } else {
        set({ error: res.message, loading: false });
      }
    } catch (err) {
      set({ error: err.message || '获取目标失败', loading: false });
    }
  },

  // 创建目标
  addGoal: async (goalData) => {
    set({ loading: true, error: null });
    try {
      const res = await createGoal(goalData);
      if (res.code === 0) {
        get().fetchGoals();
        return res.data;
      } else {
        set({ error: res.message, loading: false });
        return null;
      }
    } catch (err) {
      set({ error: err.message || '创建目标失败', loading: false });
      return null;
    }
  },

  // 更新目标
  updateGoal: async (goalId, data) => {
    set({ loading: true, error: null });
    try {
      const res = await updateGoal(goalId, data);
      if (res.code === 0) {
        get().fetchGoals();
        return res.data;
      } else {
        set({ error: res.message, loading: false });
        return null;
      }
    } catch (err) {
      set({ error: err.message || '更新目标失败', loading: false });
      return null;
    }
  },

  // 删除目标
  deleteGoal: async (goalId) => {
    set({ loading: true, error: null });
    try {
      const res = await deleteGoal(goalId);
      if (res.code === 0) {
        get().fetchGoals();
        return true;
      } else {
        set({ error: res.message, loading: false });
        return false;
      }
    } catch (err) {
      set({ error: err.message || '删除目标失败', loading: false });
      return false;
    }
  },

  // 清除错误
  clearError: () => set({ error: null })
}));

export default useGoalsStore;
