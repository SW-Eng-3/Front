import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, testLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const trimmedEmail = email.trim();
      const fullEmail = trimmedEmail.includes('@') ? trimmedEmail : `${trimmedEmail}@yc.ac.kr`;
      await login(fullEmail, password);
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.';
      console.error('Login failed', err);
      setError(errorMessage);
    }
  };

  const handleTestLogin = (roleType) => {
    testLogin(roleType);
    navigate('/');
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center">
          <GraduationCap className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Grad-Link 로그인
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              이메일 주소
            </label>
            <div className="mt-2 flex rounded-md shadow-sm">
              <input
                id="email"
                name="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="학번 또는 아이디"
                className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-0 px-4 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
              <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                @yc.ac.kr
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                비밀번호
              </label>
              <div className="text-sm">
                <Link to="/reset-password" name="reset-password-link" className="font-semibold text-primary-600 hover:text-primary-500">
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              로그인
            </button>
          </div>
        </form>

        {/* 테스트 로그인 섹션 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-center text-blue-700 font-semibold mb-3">⚙️ 테스트용 계정으로 로그인</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleTestLogin('professor')}
              className="px-3 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
            >
              교수 로그인
            </button>
            <button
              type="button"
              onClick={() => handleTestLogin('student')}
              className="px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              학생 로그인
            </button>
            <button
              type="button"
              onClick={() => handleTestLogin('mentor')}
              className="px-3 py-2 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
            >
              멘토 로그인
            </button>
            <button
              type="button"
              onClick={() => handleTestLogin('admin')}
              className="px-3 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              관리자 로그인
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="font-semibold leading-6 text-primary-600 hover:text-primary-500">
            지금 가입하세요
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
