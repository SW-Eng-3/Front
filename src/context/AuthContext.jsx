import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

// 인증 상태를 전역으로 관리하기 위한 Context 생성
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 로그인한 사용자 정보
  const [loading, setLoading] = useState(true); // 로딩 상태 (앱 시작 시 토큰 확인 중일 때 사용)

  // 앱이 처음 로드될 때 로컬 스토리지에서 토큰을 확인하여 자동 로그인 처리
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId && token) {
      fetchProfile(userId);
    } else {
      setLoading(false);
    }
  }, []);

  // 사용자 프로필 정보를 서버에서 가져옴
  const fetchProfile = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/profile`);
      setUser(response.data);
    } catch (error) {
      console.error('프로필 정보를 가져오는데 실패했습니다.', error);
      logout(); // 실패 시 로그아웃 처리
    } finally {
      setLoading(false);
    }
  };

  // 로그인 함수: 이메일과 비밀번호를 받아 서버에 인증 요청 후 토큰 저장
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, userId } = response.data;
    
    // 로컬 스토리지에 인증 정보 저장
    localStorage.setItem('token', accessToken);
    localStorage.setItem('userId', userId);
    
    // 로그인 직후 프로필 정보 로드
    await fetchProfile(userId);
  };

  // 회원가입 함수
  const signup = async (signupData) => {
    await api.post('/auth/signup', signupData);
  };

  // 로그아웃 함수: 스토리지 비우고 상태 초기화
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 다른 컴포넌트에서 쉽게 인증 정보에 접근할 수 있게 하는 Custom Hook
export const useAuth = () => useContext(AuthContext);
