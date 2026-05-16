import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/client';
import { GraduationCap } from 'lucide-react';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'STUDENT',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      setError('이메일 주소를 먼저 입력해주세요.');
      return;
    }
    setIsSending(true);
    try {
      const emailInput = formData.email.trim();
      const fullEmail = emailInput.includes('@') ? emailInput : `${emailInput}@yc.ac.kr`;
      // Swagger: POST /api/v1/auth/email/send?email={email}
      await authApi.sendEmail(fullEmail);
      setIsEmailSent(true);
      setError('');
      alert('인증 코드가 전송되었습니다. 이메일을 확인해주세요.');
    } catch (err) {
      console.error('Email send error:', err);
      setError(err.response?.data?.message || '인증 코드 전송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const emailInput = formData.email.trim();
      const fullEmail = emailInput.includes('@') ? emailInput : `${emailInput}@yc.ac.kr`;
      const response = await authApi.verifyEmail({
        email: fullEmail,
        code: verificationCode.trim(),
      });
      if (response.data) {
        setIsEmailVerified(true);
        setError('');
        alert('이메일 인증이 완료되었습니다.');
      } else {
        setError('인증 코드가 올바르지 않거나 만료되었습니다.');
      }
    } catch (err) {
      setError('이메일 인증에 실패했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      setError('이메일 인증이 필요합니다.');
      return;
    }
    try {
      const emailInput = formData.email.trim();
      const signupData = {
        ...formData,
        email: emailInput.includes('@') ? emailInput : `${emailInput}@yc.ac.kr`,
      };
      await signup(signupData);
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } catch (err) {
      setError('회원가입에 실패했습니다. 입력 정보를 확인해주세요.');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center">
          <GraduationCap className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Grad-Link 회원가입
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              이름
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              이메일 주소
            </label>
            <div className="mt-2 flex space-x-2">
              <div className="flex-1 flex rounded-md shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  disabled={isEmailVerified}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="학번 또는 아이디"
                  className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-0 px-4 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500"
                />
                <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm bg-gray-50">
                  @yc.ac.kr
                </span>
              </div>
              <button
                type="button"
                disabled={isEmailVerified || isSending}
                onClick={handleSendCode}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isSending ? '전송중...' : (isEmailSent ? '재전송' : '인증발송')}
              </button>
            </div>
          </div>

          {isEmailSent && !isEmailVerified && (
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium leading-6 text-gray-900">
                인증 코드
              </label>
              <div className="mt-2 flex space-x-2">
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="6자리 코드 입력"
                  className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  인증하기
                </button>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              비밀번호
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
              회원 유형
            </label>
            <div className="mt-2">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              >
                <option value="STUDENT">재학생</option>
                <option value="GRADUATE">졸업생</option>
                <option value="PROFESSOR">교수</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              가입하기
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-semibold leading-6 text-primary-600 hover:text-primary-500">
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
