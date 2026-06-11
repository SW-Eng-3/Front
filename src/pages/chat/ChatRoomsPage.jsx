import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { chatApi } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import {
  MessageSquare,
  ArrowRight,
  Clock,
  User,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const ChatRoomSkeleton = () => (
  <ul className="divide-y divide-gray-50">
    {[1, 2, 3, 4].map((i) => (
      <li
        key={i}
        className="px-8 py-6 animate-pulse flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div className="flex items-start gap-4 w-full md:w-2/3">
          <div className="h-14 w-14 rounded-[1.25rem] bg-gray-200 shrink-0"></div>
          <div className="w-full">
            <div className="h-5 w-32 bg-gray-200 rounded-md mb-3"></div>
            <div className="h-4 w-full max-w-md bg-gray-100 rounded-md"></div>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
        </div>
      </li>
    ))}
  </ul>
);

const ChatRoomsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    if (user) {
      fetchRooms();
    }
  }, [user, authLoading, navigate]);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await chatApi.getMyRooms();
      setRooms(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to load chat rooms", err);
      setError("채팅방 목록을 불러오는데 실패했습니다.");
      toast.error("채팅방 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="p-8 text-center text-gray-500 font-bold animate-pulse">
        인증 확인 중...
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            나의 커피챗
          </h1>
          <p className="text-gray-500 mt-2 text-lg font-medium">
            멘토·멘티와 나누는 1:1 대화방입니다.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        {loading ? (
          <ChatRoomSkeleton />
        ) : error ? (
          <div className="p-16 text-center bg-red-50/30">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <p className="font-bold text-gray-800">{error}</p>
            <button
              onClick={fetchRooms}
              className="mt-4 text-primary-600 font-black hover:text-primary-800 transition-colors"
            >
              다시 시도하기
            </button>
          </div>
        ) : rooms.length === 0 ? (
          <div className="p-20 text-center">
            <div className="bg-gray-50 p-6 rounded-full inline-block mb-6 border border-gray-100">
              <MessageSquare className="h-12 w-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">
              진행 중인 채팅이 없습니다
            </h2>
            <p className="mt-2 text-gray-500 font-medium">
              마음에 드는 멘토에게 먼저 다가가 커피챗을 요청해보세요.
            </p>
            <Link
              to="/mentoring"
              className="mt-8 inline-flex items-center px-8 py-3.5 bg-primary-600 text-white rounded-2xl font-black shadow-lg shadow-primary-600/30 hover:bg-primary-700 hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              멘토 찾으러 가기
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {rooms.map((room) => (
              <li
                key={room.roomId}
                className="transition-all hover:bg-primary-50/30 group"
              >
                <Link to={`/chat/rooms/${room.roomId}`} className="block">
                  <div className="px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-primary-50 border border-primary-100 group-hover:bg-primary-600 group-hover:text-white text-primary-600 transition-colors shadow-sm">
                        <User className="h-7 w-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-black text-gray-900 group-hover:text-primary-700 transition-colors">
                            {room.studentName === user.name
                              ? room.seniorName
                              : room.studentName}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-black tracking-widest uppercase border ${
                              room.status === "ACTIVE"
                                ? "bg-green-50 text-green-600 border-green-200"
                                : "bg-gray-100 text-gray-500 border-gray-200"
                            }`}
                          >
                            {room.status === "ACTIVE" ? "진행중" : "종료됨"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1 max-w-lg font-medium">
                          {room.lastMessage || "새로운 대화를 시작해보세요."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center md:items-end gap-2 text-xs font-bold text-gray-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {room.lastMessageAt
                          ? new Date(room.lastMessageAt).toLocaleString()
                          : "최근 대화 없음"}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatRoomsPage;
