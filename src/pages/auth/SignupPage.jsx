import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/client";
import { GraduationCap } from "lucide-react";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "STUDENT",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      toast.error("이메일을 입력해주세요.");
      return;
    }
    setIsSending(true);
    try {
      const emailInput = formData.email.trim();
      const fullEmail = emailInput.includes("@")
        ? emailInput
        : `${emailInput}@yc.ac.kr`;
      await authApi.sendEmail(fullEmail);
      setIsEmailSent(true);
      toast.success("인증 코드가 전송되었습니다. 이메일을 확인해주세요.");
    } catch (err) {
      console.error("Email send error:", err);
      toast.error(err.response?.data?.message || "이메일 전송에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error("인증 코드를 입력해주세요.");
      return;
    }
    try {
      const emailInput = formData.email.trim();
      const fullEmail = emailInput.includes("@")
        ? emailInput
        : `${emailInput}@yc.ac.kr`;
      const response = await authApi.verifyEmail({
        email: fullEmail,
        code: verificationCode.trim(),
      });
      if (response.data) {
        setIsEmailVerified(true);
        toast.success("이메일 인증이 완료되었습니다.");
      } else {
        toast.error("잘못된 인증 코드입니다.");
      }
    } catch (err) {
      toast.error("인증 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      toast.error("이메일 인증을 먼저 완료해주세요.");
      return;
    }
    try {
      const emailInput = formData.email.trim();
      const signupData = {
        ...formData,
        email: emailInput.includes("@") ? emailInput : `${emailInput}@yc.ac.kr`,
      };
      await signup(signupData);
      toast.success("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (err) {
      toast.error("회원가입에 실패했습니다. 다시 시도해주세요.");
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
          계정 만들기
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
        <form
          className="space-y-6 bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-bold leading-6 text-gray-900"
            >
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
                placeholder="홍길동"
                className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 sm:text-sm font-medium outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold leading-6 text-gray-900"
            >
              학교 이메일
            </label>
            <div className="mt-2 flex gap-2">
              <div className="flex-1 flex rounded-2xl shadow-sm overflow-hidden border border-gray-200 focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/20 transition-all bg-gray-50 focus-within:bg-white">
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  disabled={isEmailVerified}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="학번/아이디"
                  className="block w-full min-w-0 flex-1 border-0 bg-transparent px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm font-medium outline-none disabled:text-gray-400"
                />
                <span className="inline-flex items-center px-3 text-gray-500 sm:text-sm font-bold border-l border-gray-200 bg-gray-100">
                  @yc.ac.kr
                </span>
              </div>
              <button
                type="button"
                disabled={isEmailVerified || isSending}
                onClick={handleSendCode}
                className="inline-flex items-center justify-center px-4 py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-black transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50 disabled:active:scale-100 whitespace-nowrap"
              >
                {isSending ? "전송 중..." : isEmailSent ? "재전송" : "인증요청"}
              </button>
            </div>
          </div>

          {isEmailSent && !isEmailVerified && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label
                htmlFor="verificationCode"
                className="block text-sm font-bold leading-6 text-gray-900"
              >
                인증 코드
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="6자리 코드 입력"
                  className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 sm:text-sm font-medium outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="inline-flex items-center justify-center px-5 py-3.5 rounded-2xl bg-primary-600 text-white text-sm font-black transition-all hover:bg-primary-700 active:scale-95 whitespace-nowrap"
                >
                  확인
                </button>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold leading-6 text-gray-900"
            >
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
                placeholder="안전한 비밀번호를 입력해주세요"
                className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 sm:text-sm font-medium outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-bold leading-6 text-gray-900"
            >
              역할
            </label>
            <div className="mt-2">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 sm:text-sm font-medium outline-none transition-all appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em]"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                }}
              >
                <option value="STUDENT">재학생</option>
                <option value="GRADUATE">졸업생</option>
                <option value="PROFESSOR">교수</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="flex w-full justify-center rounded-2xl bg-primary-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-primary-600/30 transition-all duration-200 hover:bg-primary-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            >
              가입 완료하기
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm font-medium text-gray-500">
          이미 계정이 있으신가요?{" "}
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

export default SignupPage;
