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
      
      // 사용자 정보만 로컬스토리지에 저장 (토큰 체크 제거)
      if (data) {
        localStorage.setItem('user', JSON.stringify(data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 로그아웃
  logout() {
    localStorage.removeItem('user');
    // token 제거는 불필요
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // 토큰 가져오기 (현재는 사용 안함)
  getToken() {
    return null;
  },

  // 로그인 상태 확인 - 토큰 대신 사용자 정보로 체크
  isAuthenticated() {
    return !!this.getCurrentUser();
  }
};
