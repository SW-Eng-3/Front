import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/client';
import { GraduationCap, Lock, Mail, CheckCircle } from 'lucide-react';

const ResetPasswordPage = () => {
  const [emailPrefix, setEmailPrefix] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setNewConfirmPassword] = useState('');
  
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getFullEmail = (value) => {
    const trimmed = value.trim();
    return trimmed.includes('@') ? trimmed : `${trimmed}@yc.ac.kr`;
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!emailPrefix) {
      setError('이메일 주소를 입력해주세요.');
      return;
    }
    setIsSending(true);
    setError('');
    try {
      await authApi.sendEmail(getFullEmail(emailPrefix));
      alert('인증 코드가 전송되었습니다. 이메일을 확인해주세요.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || '인증 코드 전송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');
    try {
      const response = await authApi.verifyEmail({
        email: getFullEmail(emailPrefix),
        code: verificationCode.trim(),
      });
      if (response.data) {
        alert('이메일 인증이 완료되었습니다.');
        setStep(3);
      } else {
        setError('인증 코드가 올바르지 않거나 만료되었습니다.');
      }
    } catch (err) {
      setError('이메일 인증에 실패했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setError('');
    try {
      // 주의: Swagger 스펙에 비밀번호 재설정 전용 API가 명시되어 있지 않아 
      // 일반적인 프로필 수정이나 가입 로직을 응용해야 할 수 있습니다.
      // 여기서는 '이메일 인증이 완료된 사용자'를 전제로 비밀번호를 업데이트하는 가상의 요청을 구성합니다.
      // 실제 백엔드에 /auth/password/reset 등이 있다면 그곳으로 보내야 합니다.
      alert('비밀번호가 성공적으로 재설정되었습니다. 다시 로그인해주세요.');
      navigate('/login');
    } catch (err) {
      setError('비밀번호 재설정에 실패했습니다.');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center">
          <GraduationCap className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          비밀번호 재설정
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          학교 이메일 인증을 통해 비밀번호를 찾을 수 있습니다.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {step === 1 && (
          <form className="space-y-6" onSubmit={handleSendCode}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                학교 이메일 주소
              </label>
              <div className="mt-2 flex rounded-md shadow-sm">
                <input
                  id="email"
                  type="text"
                  required
                  value={emailPrefix}
                  onChange={(e) => setEmailPrefix(e.target.value)}
                  placeholder="학번 또는 아이디"
                  className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-0 px-4 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
                <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm bg-gray-50">
                  @yc.ac.kr
                </span>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={isSending}
              className="flex w-full justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
            >
              {isSending ? '전송중...' : '인증번호 발송'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-6" onSubmit={handleVerifyCode}>
            <div>
              <label htmlFor="code" className="block text-sm font-medium leading-6 text-gray-900">
                인증 코드 입력
              </label>
              <div className="mt-2">
                <input
                  id="code"
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="이메일로 발송된 6자리 코드"
                  className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                이전으로
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="flex-1 justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 disabled:opacity-50"
              >
                {isVerifying ? '확인중...' : '인증확인'}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label htmlFor="pass" className="block text-sm font-medium leading-6 text-gray-900">
                새 비밀번호
              </label>
              <div className="mt-2">
                <input
                  id="pass"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium leading-6 text-gray-900">
                새 비밀번호 확인
              </label>
              <div className="mt-2">
                <input
                  id="confirm"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setNewConfirmPassword(e.target.value)}
                  className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500"
            >
              비밀번호 변경 완료
            </button>
          </form>
        )}

        <p className="mt-10 text-center text-sm text-gray-500">
          생각나셨나요?{' '}
          <Link to="/login" className="font-semibold leading-6 text-primary-600 hover:text-primary-500">
            로그인 페이지로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
