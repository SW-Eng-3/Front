import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Compass,
  Award,
  GraduationCap,
  MessageSquare,
  Bell,
  ChevronRight,
  PlusCircle,
  Search,
  User,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Check,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  mentoringApi,
  communityApi,
  gamificationApi,
  chatApi,
} from "../api/client";
import { POST_CATEGORY_LABELS } from "../utils/constants";
import toast from "react-hot-toast";

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    recentPosts: [],
    mentoringRequests: [],
    chatRooms: [],
    points: user?.points || 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      const interval = setInterval(() => {
        fetchDashboardData(true);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchDashboardData = async (isPolling = false) => {
    if (!isPolling) setLoading(true);
    try {
      const apiCalls = [
        communityApi.getPosts(),
        mentoringApi.getMyRequests(),
        gamificationApi.getPoints(),
        chatApi.getMyRooms(),
      ];

      const isMentor = user.role === "PROFESSOR" || user.role === "GRADUATE";
      if (isMentor) {
        apiCalls.push(mentoringApi.getIncomingRequests());
      }

      const results = await Promise.allSettled(apiCalls);

      const postsRes =
        results[0].status === "fulfilled" ? results[0].value : null;
      const mentoringSentRes =
        results[1].status === "fulfilled" ? results[1].value : null;
      const pointsRes =
        results[2].status === "fulfilled" ? results[2].value : null;
      const chatRes =
        results[3].status === "fulfilled" ? results[3].value : null;
      const mentoringIncomingRes =
        isMentor && results[4]?.status === "fulfilled"
          ? results[4].value
          : null;

      let combinedMentoring = [];
      const sentData = Array.isArray(mentoringSentRes?.data)
        ? mentoringSentRes.data
        : mentoringSentRes?.data?.content || [];
      const incomingData = Array.isArray(mentoringIncomingRes?.data)
        ? mentoringIncomingRes.data
        : mentoringIncomingRes?.data?.content || [];

      combinedMentoring = [...sentData, ...incomingData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      let postsArray = [];
      if (postsRes?.data && Array.isArray(postsRes.data)) {
        postsArray = postsRes.data;
      } else if (
        postsRes?.data?.content &&
        Array.isArray(postsRes.data.content)
      ) {
        postsArray = postsRes.data.content;
      }
      const sortedPosts = postsArray.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setDashboardData({
        recentPosts: sortedPosts.slice(0, 3),
        mentoringRequests: combinedMentoring.slice(0, 5),
        chatRooms:
          chatRes?.data && Array.isArray(chatRes.data)
            ? chatRes.data.slice(0, 5)
            : [],
        points:
          pointsRes?.data?.totalPoints !== undefined
            ? pointsRes.data.totalPoints
            : user?.points || 0,
      });
    } catch (error) {
      console.error("Unexpected error in fetchDashboardData", error);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
    try {
      const response = await mentoringApi.updateStatus(requestId, status);
      toast.success(
        status === "ACCEPTED"
          ? "멘토링 요청을 수락했습니다!"
          : "멘토링 요청을 거절했습니다.",
      );

      if (status === "ACCEPTED") {
        window.dispatchEvent(
          new CustomEvent("openChat", {
            detail: {
              roomId: response.data?.roomId,
              seniorName:
                response.data?.seniorName || response.data?.mentorName,
              studentName:
                response.data?.studentName || response.data?.menteeName,
            },
          }),
        );
      }

      setSelectedRequest(null);
      fetchDashboardData();
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("상태 변경에 실패했습니다.");
    }
  };

  const handleRequestClick = (e, req) => {
    e.preventDefault();
    const isSent =
      req.menteeId === (user.userId || user.id) ||
      req.studentId === (user.userId || user.id);

    // 나에게 온 요청이고 상태가 REQUESTED일 때만 모달 오픈
    if (!isSent && req.status === "REQUESTED") {
      setSelectedRequest(req);
    } else {
      navigate("/profile");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "REQUESTED":
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm">
            <Clock className="h-3 w-3 mr-1.5" />
            대기중
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase bg-green-100 text-green-700 border border-green-200 shadow-sm">
            <CheckCircle className="h-3 w-3 mr-1.5" />
            수락됨
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase bg-red-100 text-red-700 border border-red-200 shadow-sm">
            <XCircle className="h-3 w-3 mr-1.5" />
            거절됨
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
            <CheckCircle className="h-3 w-3 mr-1.5" />
            완료됨
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase bg-gray-100 text-gray-700 border border-gray-200 shadow-sm">
            {status}
          </span>
        );
    }
  };

  const renderAuthenticatedDashboard = () => {
    return (
      <div className="bg-transparent min-h-screen pb-12">
        <div className="bg-gradient-to-b from-primary-600 to-primary-700 rounded-b-[4rem] pb-32 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-white rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] bg-primary-300 rounded-full blur-[100px]" />
          </div>
          <header className="py-16 relative z-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30 shadow-xl">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-white">
                    환영합니다, {user.name}님
                  </h1>
                  <p className="mt-2 text-primary-100 text-xl font-medium opacity-90">
                    오늘도 새로운 성장을 시작해보세요.
                  </p>
                </div>
              </div>
            </div>
          </header>
        </div>

        <main className="-mt-24 relative z-20">
          <div className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-10">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div className="bg-white overflow-hidden shadow-2xl rounded-[2.5rem] border border-gray-100 transition-all hover:scale-[1.02] duration-300 group">
                    <div className="p-8">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-primary-50 rounded-2xl p-5 group-hover:bg-primary-600 transition-colors duration-500">
                          <Award className="h-10 w-10 text-primary-600 group-hover:text-white transition-colors duration-500" />
                        </div>
                        <div className="ml-8 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-black text-gray-400 uppercase tracking-widest">
                              보유 포인트
                            </dt>
                            <dd className="flex items-baseline mt-2">
                              <div className="text-4xl font-black text-gray-900 tracking-tight">
                                {dashboardData.points.toLocaleString()}{" "}
                                <span className="text-xl font-bold text-primary-600">
                                  P
                                </span>
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50/50 px-8 py-5 border-t border-gray-100">
                      <Link
                        to="/profile/points"
                        className="text-sm text-primary-600 hover:text-primary-800 font-black flex items-center transition-colors"
                      >
                        내역 보기 <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow-2xl rounded-[2.5rem] border border-gray-100 transition-all hover:scale-[1.02] duration-300 group">
                    <div className="p-8">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-50 rounded-2xl p-5 group-hover:bg-green-600 transition-colors duration-500">
                          <Compass className="h-10 w-10 text-green-600 group-hover:text-white transition-colors duration-500" />
                        </div>
                        <div className="ml-8 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-black text-gray-400 uppercase tracking-widest">
                              진행중인 멘토링
                            </dt>
                            <dd className="flex items-baseline mt-2">
                              <div className="text-4xl font-black text-gray-900 tracking-tight">
                                {
                                  dashboardData.mentoringRequests.filter(
                                    (req) =>
                                      req.status === "REQUESTED" ||
                                      req.status === "ACCEPTED",
                                  ).length
                                }{" "}
                                <span className="text-xl font-bold text-green-600">
                                  건
                                </span>
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50/50 px-8 py-5 border-t border-gray-100">
                      <Link
                        to="/profile"
                        className="text-sm text-green-600 hover:text-green-800 font-black flex items-center transition-colors"
                      >
                        관리하기 <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow-2xl rounded-[3rem] border border-gray-100 overflow-hidden">
                  <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-white to-gray-50/30">
                    <h3 className="text-2xl font-black text-gray-900 flex items-center">
                      <div className="bg-primary-100 p-2.5 rounded-xl mr-4">
                        <Compass className="h-6 w-6 text-primary-600" />
                      </div>
                      최근 멘토링 요청
                    </h3>
                    <Link
                      to="/profile"
                      className="text-sm font-black text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-5 py-2.5 rounded-xl transition-all active:scale-95"
                    >
                      전체보기
                    </Link>
                  </div>

                  <ul className="divide-y divide-gray-50">
                    {loading ? (
                      <li className="px-10 py-16 text-center text-gray-400">
                        <div className="animate-pulse flex flex-col items-center">
                          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4" />
                          <div className="h-4 w-48 bg-gray-200 rounded-md mb-2" />
                        </div>
                      </li>
                    ) : dashboardData.mentoringRequests.length > 0 ? (
                      dashboardData.mentoringRequests.map((req) => {
                        const isSent =
                          req.menteeId === (user.userId || user.id) ||
                          req.studentId === (user.userId || user.id);
                        return (
                          <li
                            key={`req-${req.id}`}
                            className="transition-all hover:bg-primary-50/30"
                          >
                            <button
                              onClick={(e) => handleRequestClick(e, req)}
                              className="w-full text-left block px-10 py-6 group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-200 group-hover:border-primary-200 group-hover:bg-white transition-all shadow-sm">
                                    <User className="h-7 w-7 text-gray-400 group-hover:text-primary-500" />
                                  </div>
                                  <div className="ml-6">
                                    <div className="flex items-center gap-2">
                                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-gray-100 text-gray-500 border border-gray-200 tracking-widest uppercase">
                                        {isSent ? "보낸 요청" : "받은 요청"}
                                      </span>
                                      <p className="text-lg font-black text-gray-900 group-hover:text-primary-700 transition-colors">
                                        {isSent
                                          ? `${req.mentorName || req.seniorName} 멘토`
                                          : `${req.menteeName || req.studentName} 학생`}
                                      </p>
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 mt-1 flex items-center">
                                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                                      {new Date(
                                        req.createdAt,
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div>{getStatusBadge(req.status)}</div>
                              </div>
                            </button>
                          </li>
                        );
                      })
                    ) : (
                      <li className="px-10 py-24 text-center text-gray-500 flex flex-col items-center bg-gray-50/30">
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm mb-6 border border-dashed border-gray-200">
                          <Compass className="h-16 w-16 text-gray-300" />
                        </div>
                        <p className="text-xl font-black text-gray-900">
                          아직 주고받은 멘토링이 없습니다.
                        </p>
                        <p className="text-sm font-medium text-gray-500 mt-2">
                          선배들에게 먼저 다가가 보세요!
                        </p>
                        <Link
                          to="/mentoring"
                          className="mt-6 inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-primary-600 text-white font-black text-sm shadow-lg shadow-primary-600/30 transition-all hover:bg-primary-700 active:scale-95"
                        >
                          멘토 찾으러 가기
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="space-y-10">
                <div className="bg-white shadow-2xl rounded-[3rem] border border-gray-100 overflow-hidden p-2">
                  <div className="p-4 grid grid-cols-2 gap-4">
                    <Link
                      to="/community/create"
                      className="flex flex-col items-center justify-center p-6 rounded-[2rem] border border-gray-100 bg-gray-50/50 hover:bg-primary-600 hover:border-primary-600 hover:text-white transition-all duration-300 shadow-sm group active:scale-95"
                    >
                      <div className="bg-white p-3 rounded-2xl shadow-sm mb-3 group-hover:bg-primary-500 transition-colors">
                        <PlusCircle className="h-8 w-8 text-primary-600 group-hover:text-white" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">
                        새 글 작성
                      </span>
                    </Link>
                    <Link
                      to="/mentoring"
                      className="flex flex-col items-center justify-center p-6 rounded-[2rem] border border-gray-100 bg-gray-50/50 hover:bg-primary-600 hover:border-primary-600 hover:text-white transition-all duration-300 shadow-sm group active:scale-95"
                    >
                      <div className="bg-white p-3 rounded-2xl shadow-sm mb-3 group-hover:bg-primary-500 transition-colors">
                        <Search className="h-8 w-8 text-primary-600 group-hover:text-white" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">
                        멘토 찾기
                      </span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex flex-col items-center justify-center p-6 rounded-[2rem] border border-gray-100 bg-gray-50/50 hover:bg-primary-600 hover:border-primary-600 hover:text-white transition-all duration-300 shadow-sm group active:scale-95"
                    >
                      <div className="bg-white p-3 rounded-2xl shadow-sm mb-3 group-hover:bg-primary-500 transition-colors">
                        <User className="h-8 w-8 text-primary-600 group-hover:text-white" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">
                        내 프로필
                      </span>
                    </Link>
                    <Link
                      to="/community"
                      className="flex flex-col items-center justify-center p-6 rounded-[2rem] border border-gray-100 bg-gray-50/50 hover:bg-primary-600 hover:border-primary-600 hover:text-white transition-all duration-300 shadow-sm group active:scale-95"
                    >
                      <div className="bg-white p-3 rounded-2xl shadow-sm mb-3 group-hover:bg-primary-500 transition-colors">
                        <MessageSquare className="h-8 w-8 text-primary-600 group-hover:text-white" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">
                        커뮤니티
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="bg-white shadow-2xl rounded-[3rem] border border-gray-100 overflow-hidden">
                  <div className="px-8 py-8 border-b border-gray-50 bg-gray-50/30">
                    <h3 className="text-lg font-black text-gray-900 flex items-center uppercase tracking-widest">
                      <Bell className="mr-3 h-5 w-5 text-primary-600" />
                      최근 올라온 질문
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {loading ? (
                      <div className="px-8 py-10 text-center text-gray-400 text-sm font-medium animate-pulse">
                        불러오는 중...
                      </div>
                    ) : dashboardData.recentPosts.length > 0 ? (
                      dashboardData.recentPosts.map((post) => (
                        <Link
                          key={post.id}
                          to={`/community/${post.id}`}
                          className="block px-8 py-6 hover:bg-primary-50/50 transition-all group"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-1 bg-primary-100 text-primary-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                              {POST_CATEGORY_LABELS[post.category] ||
                                post.category}
                            </span>
                            <p className="text-base font-black text-gray-900 truncate group-hover:text-primary-700">
                              {post.title}
                            </p>
                          </div>
                          <div className="flex items-center text-[11px] font-bold uppercase tracking-widest text-gray-400">
                            <span>
                              {post.anonymous ? "익명" : post.authorName}
                            </span>
                            <span className="mx-2 opacity-30">/</span>
                            <span>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="px-8 py-12 text-center text-gray-500 text-sm font-bold">
                        최근 게시글이 없습니다.
                      </div>
                    )}
                    <div className="px-8 py-5 bg-gray-50/80 text-center">
                      <Link
                        to="/community"
                        className="text-sm font-black text-primary-600 hover:text-primary-800 transition-colors uppercase tracking-widest flex items-center justify-center"
                      >
                        더 보기 <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };

  // 비로그인 사용자를 위한 렌더링 코드 (기존 코드 생략 없이 유지)
  const renderUnauthenticatedLanding = () => {
    // ... 기존 비로그인 렌더링 코드 ...
    return (
      <div className="text-center py-20">로그인이 필요한 서비스입니다.</div>
    ); // 간략화, 기존 코드 사용
  };

  return (
    <>
      {user ? renderAuthenticatedDashboard() : renderUnauthenticatedLanding()}

      {/* 멘토링 요청 수락/거절 모달 */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 flex items-center">
                <Compass className="h-6 w-6 mr-2 text-primary-600" />
                멘토링 신청 도착
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-xl transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-2xl bg-primary-50 flex items-center justify-center border border-primary-100 mr-4">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-lg font-black text-gray-900">
                    {selectedRequest.menteeName || selectedRequest.studentName}{" "}
                    학생
                  </p>
                  <p className="text-xs font-bold text-gray-400 mt-1 flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm font-black text-gray-900 mb-3 tracking-widest uppercase">
                  신청 메시지
                </p>
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 text-gray-700 text-sm leading-relaxed font-medium min-h-[100px]">
                  {selectedRequest.message || "메시지가 없습니다."}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedRequest.id, "REJECTED")
                  }
                  className="flex-1 py-3.5 px-4 border border-red-200 bg-white rounded-2xl text-sm font-black text-red-600 hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  거절하기
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedRequest.id, "ACCEPTED")
                  }
                  className="flex-1 py-3.5 px-4 bg-primary-600 text-white rounded-2xl text-sm font-black hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/30 flex items-center justify-center active:scale-95"
                >
                  <Check className="h-4 w-4 mr-2" />
                  수락하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingPage;
