import axios from 'axios';

// Axios 인스턴스 생성: 공통 설정(Base URL, 헤더 등)을 적용
const api = axios.create({
  baseURL: '/api/v1', // 모든 요청의 기본 경로
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 모든 요청이 서버로 보내지기 직전에 실행됨
api.interceptors.request.use((config) => {
  // 로컬 스토리지에서 JWT 토큰을 가져옴
  const token = localStorage.getItem('token');
  
  // 토큰이 있으면 모든 요청 헤더에 Authorization 추가
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
