import api from './api';

export const subscriptionService = {
  // 구독 목록 조회
  async getSubscriptions(userId) {
    try {
      const response = await api.get(`/subscriptions?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 구독 상세 조회
  async getSubscription(id) {
    try {
      const response = await api.get(`/subscriptions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 구독 추가
  async createSubscription(subscriptionData) {
    try {
      const response = await api.post('/subscriptions', subscriptionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 구독 수정
  async updateSubscription(id, subscriptionData) {
    try {
      const response = await api.put(`/subscriptions/${id}`, subscriptionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 구독 삭제
  async deleteSubscription(id) {
    try {
      const response = await api.delete(`/subscriptions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 구독 활성화/비활성화
  async toggleSubscriptionStatus(id, isActive) {
    try {
      const response = await api.patch(`/subscriptions/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
