import api from './api';

export const recommendationService = {
  // AI 추천 요청
  async getAIRecommendations(userId, quizData) {
    try {
      const response = await api.post(`/recommendations/ai?userId=${userId}`, quizData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 추천 기록 조회
  async getRecommendationHistory(userId) {
    try {
      const response = await api.get(`/recommendations/history/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 피드백 제출
  async submitFeedback(recommendationId, userId, isHelpful, comment = '') {
    try {
      const response = await api.post(
        `/recommendations/${recommendationId}/feedback`,
        null,
        {
          params: { userId, isHelpful, comment }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};