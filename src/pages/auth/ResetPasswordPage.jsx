import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../api/client";
import { GraduationCap } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [emailPrefix, setEmailPrefix] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setNewConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const getFullEmail = (value) => {
    const trimmed = value.trim();
    return trimmed.includes("@") ? trimmed : `${trimmed}@yc.ac.kr`;
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!emailPrefix) {
      toast.error("이메일을 입력해주세요.");
      return;
    }
    setIsSending(true);
    try {
      await authApi.sendEmail(getFullEmail(emailPrefix));
      toast.success("인증 코드가 이메일로 전송되었습니다.");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "이메일 전송에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const response = await authApi.verifyEmail({
        email: getFullEmail(emailPrefix),
        code: verificationCode.trim(),
      });
      if (response.data) {
        toast.success("인증이 완료되었습니다. 새 비밀번호를 설정해주세요.");
        setStep(3);
      } else {
        toast.error("잘못된 인증 코드입니다.");
      }
    } catch (err) {
      toast.error("인증 확인 중 오류가 발생했습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      toast.success("비밀번호가 성공적으로 변경되었습니다!");
      navigate("/login");
    } catch (err) {
      toast.error("비밀번호 변경에 실패했습니다.");
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-center">
          <div className="bg-primary-50 p-4 rounded-3xl shadow-inner border border-primary-100">
            <GraduationCap className="h-12 w-12 text-primary-600" />
          </div>
        </div>
        <h2 className="mt-8 text-center text-3xl font-black leading-9 tracking-tight text-gray-900">
          비밀번호 찾기
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 font-medium">
          학교 이메일 인증을 통해 비밀번호를 재설정합니다.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
          {step === 1 && (
            <form
              className="space-y-6 animate-in slide-in-from-right-4 duration-300"
              onSubmit={handleSendCode}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold leading-6 text-gray-900"
                >
                  학교 이메일
                </label>
                <div className="mt-2 flex rounded-2xl shadow-sm overflow-hidden border border-gray-200 focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/20 transition-all bg-gray-50 focus-within:bg-white">
                  <input
                    id="email"
                    type="text"
                    required
                    value={emailPrefix}
                    onChange={(e) => setEmailPrefix(e.target.value)}
                    placeholder="학번/아이디"
                    className="block w-full min-w-0 flex-1 border-0 bg-transparent px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm font-medium outline-none"
                  />
                  <span className="inline-flex items-center px-4 text-gray-500 sm:text-sm font-bold border-l border-gray-200 bg-gray-100">
                    @yc.ac.kr
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="flex w-full justify-center rounded-2xl bg-primary-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-primary-600/30 transition-all hover:bg-primary-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                {isSending ? "전송 중..." : "인증 코드 받기"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form
              className="space-y-6 animate-in slide-in-from-right-4 duration-300"
              onSubmit={handleVerifyCode}
            >
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-bold leading-6 text-gray-900"
                >
                  인증 코드
                </label>
                <div className="mt-2">
                  <input
                    id="code"
                    type="text"
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="이메일로 받은 코드를 입력하세요"
                    className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 sm:text-sm font-medium outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 justify-center rounded-2xl bg-white border border-gray-200 px-4 py-3.5 text-sm font-black text-gray-600 transition-all hover:bg-gray-50 active:scale-95"
                >
                  뒤로
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 justify-center rounded-2xl bg-primary-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-primary-600/30 transition-all hover:bg-primary-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                  {isVerifying ? "확인 중..." : "코드 확인"}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form
              className="space-y-6 animate-in slide-in-from-right-4 duration-300"
              onSubmit={handleResetPassword}
            >
              <div>
                <label
                  htmlFor="pass"
                  className="block text-sm font-bold leading-6 text-gray-900"
                >
                  새 비밀번호
                </label>
                <div className="mt-2">
                  <input
                    id="pass"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새로운 비밀번호"
                    className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 sm:text-sm font-medium outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirm"
                  className="block text-sm font-bold leading-6 text-gray-900"
                >
                  새 비밀번호 확인
                </label>
                <div className="mt-2">
                  <input
                    id="confirm"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setNewConfirmPassword(e.target.value)}
                    placeholder="비밀번호 다시 입력"
                    className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 sm:text-sm font-medium outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full justify-center rounded-2xl bg-green-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-green-600/30 transition-all hover:bg-green-700 active:scale-95"
              >
                비밀번호 변경하기
              </button>
            </form>
          )}
        </div>

        <p className="mt-10 text-center text-sm font-medium text-gray-500">
          비밀번호가 기억나셨나요?{" "}
          <Link
            to="/login"
            className="font-black text-primary-600 hover:text-primary-800 transition-colors"
          >
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
