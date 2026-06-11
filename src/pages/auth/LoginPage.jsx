import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GraduationCap } from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, testLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const trimmedEmail = email.trim();
      const fullEmail = trimmedEmail.includes("@")
        ? trimmedEmail
        : `${trimmedEmail}@yc.ac.kr`;
      await login(fullEmail, password);
      toast.success("환영합니다!");
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
      console.error("Login failed", err);
      toast.error(errorMessage);
    }
  };

  const handleTestLogin = (roleType) => {
    testLogin(roleType);
    toast.success("테스트 계정으로 로그인되었습니다.");
    navigate("/");
  };

  const handleProfessorQuickLogin = async () => {
    try {
      await login("test2@yc.ac.kr", "test");
      toast.success("교수 계정으로 로그인되었습니다.");
      navigate("/");
    } catch (err) {
      toast.error("테스트 로그인 실패");
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
          Grad-Link 시작하기
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 font-medium">
          선후배와 함께 성장하는 커리어 커뮤니티
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
        <form
          className="space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold leading-6 text-gray-900"
            >
              이메일 주소
            </label>
            <div className="mt-2 flex rounded-2xl shadow-sm overflow-hidden border border-gray-200 focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/20 transition-all bg-gray-50 focus-within:bg-white">
              <input
                id="email"
                name="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="학번 또는 아이디"
                className="block w-full min-w-0 flex-1 border-0 bg-transparent px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm font-medium outline-none"
              />
              <span className="inline-flex items-center px-4 text-gray-500 sm:text-sm font-bold border-l border-gray-200 bg-gray-100">
                @yc.ac.kr
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-bold leading-6 text-gray-900"
              >
                비밀번호
              </label>
              <div className="text-sm">
                <Link
                  to="/reset-password"
                  name="reset-password-link"
                  className="font-bold text-primary-600 hover:text-primary-800 transition-colors"
                >
                  비밀번호 찾기
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
                placeholder="비밀번호를 입력해주세요"
                className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 sm:text-sm font-medium outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="flex w-full justify-center rounded-2xl bg-primary-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-primary-600/30 transition-all duration-200 hover:bg-primary-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            >
              로그인
            </button>
          </div>
        </form>

        <div className="mt-8 p-5 bg-gray-50 rounded-3xl border border-gray-200 shadow-inner">
          <p className="text-xs text-center text-gray-500 font-bold mb-4 uppercase tracking-widest">
            빠른 테스트 로그인
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleProfessorQuickLogin}
              className="px-3 py-2.5 text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 hover:shadow-md transition-all rounded-xl border border-purple-200 active:scale-95"
            >
              교수 계정 (테스트)
            </button>
            <button
              type="button"
              onClick={() => handleTestLogin("student")}
              className="px-3 py-2.5 text-xs font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 hover:shadow-md transition-all rounded-xl border border-blue-200 active:scale-95"
            >
              학생 계정
            </button>
            <button
              type="button"
              onClick={() => handleTestLogin("mentor")}
              className="px-3 py-2.5 text-xs font-bold text-green-700 bg-green-100 hover:bg-green-200 hover:shadow-md transition-all rounded-xl border border-green-200 active:scale-95"
            >
              멘토 계정
            </button>
            <button
              type="button"
              onClick={() => handleTestLogin("admin")}
              className="px-3 py-2.5 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 hover:shadow-md transition-all rounded-xl border border-red-200 active:scale-95"
            >
              관리자 계정
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-sm font-medium text-gray-500">
          아직 계정이 없으신가요?{" "}
          <Link
            to="/signup"
            className="font-black text-primary-600 hover:text-primary-800 transition-colors"
          >
            지금 가입하기
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
