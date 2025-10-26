import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api/v1' : 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 로직 제거
api.interceptors.request.use(
  (config) => {
    // 토큰 로직 제거 - 현재는 토큰 없이 사용
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 제거 대신 사용자 정보만 제거
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
