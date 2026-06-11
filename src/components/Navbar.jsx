import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, LogOut, User } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("성공적으로 로그아웃 되었습니다.");
    navigate("/");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="bg-primary-50 p-2 rounded-xl group-hover:bg-primary-100 transition-colors border border-primary-100">
                <GraduationCap className="h-7 w-7 text-primary-600" />
              </div>
              <span className="ml-3 text-2xl font-black text-gray-900 tracking-tight group-hover:text-primary-600 transition-colors">
                Grad-Link
              </span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-2">
              {user && (
                <>
                  <Link
                    to="/community"
                    className={`inline-flex items-center px-4 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                      isActive("/community")
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:scale-95"
                    }`}
                  >
                    커뮤니티
                  </Link>
                  <Link
                    to="/mentoring"
                    className={`inline-flex items-center px-4 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                      isActive("/mentoring")
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:scale-95"
                    }`}
                  >
                    멘토 찾기
                  </Link>
                </>
              )}
              {(user?.role === "GRADUATE" || user?.role === "PROFESSOR") && (
                <Link
                  to="/mentoring/manage"
                  className={`inline-flex items-center px-4 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                    isActive("/mentoring/manage")
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:scale-95"
                  }`}
                >
                  오피스 아워 설정
                </Link>
              )}
              {user?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className={`inline-flex items-center px-4 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                    isActive("/admin")
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:scale-95"
                  }`}
                >
                  관리자
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[11px] font-black tracking-widest uppercase bg-gray-100 text-gray-500 border border-gray-200 shadow-sm mr-2">
                  {user.role === "STUDENT"
                    ? "재학생"
                    : user.role === "GRADUATE"
                      ? "졸업생"
                      : user.role === "PROFESSOR"
                        ? "교수"
                        : "관리자"}
                </span>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2.5 text-sm font-bold text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-2xl transition-all active:scale-95 border border-transparent hover:border-primary-100"
                >
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  {user.name}님
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2.5 text-sm font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all active:scale-95 border border-transparent hover:border-red-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-2xl text-sm font-black text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all active:scale-95"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-2xl bg-primary-600 text-white font-black text-sm shadow-lg shadow-primary-600/30 transition-all duration-200 hover:bg-primary-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
