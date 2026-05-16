import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/client';

// 인증 상태를 전역으로 관리하기 위한 Context 생성
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 로그인한 사용자 정보
  const [loading, setLoading] = useState(true); // 로딩 상태 (앱 시작 시 토큰 확인 중일 때 사용)

  // 앱이 처음 로드될 때 로컬 스토리지에서 토큰을 확인하여 자동 로그인 처리
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const cachedUser = localStorage.getItem('user');

    if (token && userId) {
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch {
          localStorage.removeItem('user');
        }
      }
      fetchProfile(userId);
    } else {
      setLoading(false);
    }
  }, []);

  // 사용자 프로필 정보를 서버에서 가져옴
  const fetchProfile = async (userId) => {
    setLoading(true);
    try {
      const response = await authApi.getProfile(userId);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('프로필 정보를 가져오는데 실패했습니다.', error);
      if (!localStorage.getItem('user')) {
        logout(); // 캐시된 사용자 정보가 없으면 로그아웃 처리
      }
    } finally {
      setLoading(false);
    }
  };

  // 로그인 함수: 이메일과 비밀번호를 받아 서버에 인증 요청 후 토큰 저장
  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    const { accessToken, userId } = response.data;
    
    // 로컬 스토리지에 인증 정보 저장
    localStorage.setItem('token', accessToken);
    localStorage.setItem('userId', userId);
    
    // 로그인 직후 프로필 정보 로드
    await fetchProfile(userId);
  };

  // 회원가입 함수
  const signup = async (signupData) => {
    await authApi.signup(signupData);
  };

  // 로그아웃 함수: 스토리지 비우고 상태 초기화
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    setUser(null);
  };

  // 테스트 로그인 함수 (개발 환경에서만 사용)
  const testLogin = (roleType) => {
    const testAccounts = {
      professor: {
        userId: '10000000-0000-0000-0000-000000000001',
        name: '테스트교수',
        email: 'prof@yc.ac.kr',
        role: 'PROFESSOR',
        points: 1000,
        major: 'COMPUTER_SCIENCE'
      },
      student: {
        userId: '10000000-0000-0000-0000-000000000002',
        name: '테스트학생',
        email: 'student@yc.ac.kr',
        role: 'STUDENT',
        points: 250,
        major: 'COMPUTER_SCIENCE'
      },
      mentor: {
        userId: '10000000-0000-0000-0000-000000000003',
        name: '테스트멘토',
        email: 'mentor@yc.ac.kr',
        role: 'GRADUATE',
        points: 750,
        major: 'COMPUTER_SCIENCE'
      },
      admin: {
        userId: '10000000-0000-0000-0000-000000000004',
        name: '테스트관리자',
        email: 'admin@yc.ac.kr',
        role: 'ADMIN',
        points: 9999
      }
    };

    const testUser = testAccounts[roleType];
    if (testUser) {
      localStorage.setItem('token', 'test-token-' + roleType);
      localStorage.setItem('userId', testUser.userId);
      localStorage.setItem('user', JSON.stringify(testUser));
      setUser(testUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser, testLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

// 다른 컴포넌트에서 쉽게 인증 정보에 접근할 수 있게 하는 Custom Hook
export const useAuth = () => useContext(AuthContext);
