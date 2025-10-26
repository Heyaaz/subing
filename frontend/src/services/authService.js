import api from './api';

export const authService = {
  // 회원가입
  async signup(userData) {
    try {
      const response = await api.post('/users/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 로그인
  async login(credentials) {
    try {
      const response = await api.post('/users/login', credentials);
      const { data } = response.data;
      
      // 토큰과 사용자 정보를 로컬스토리지에 저장
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 로그아웃
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // 토큰 가져오기
  getToken() {
    return localStorage.getItem('token');
  },

  // 로그인 상태 확인
  isAuthenticated() {
    return !!this.getToken();
  }
};
