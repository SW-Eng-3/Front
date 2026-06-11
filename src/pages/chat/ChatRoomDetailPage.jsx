import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chatApi } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Send, Clock, User, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

const ChatRoomDetailPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [room, setRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    if (user) {
      fetchRoom();
    }
  }, [user, authLoading, roomId, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room?.messages]);

  const fetchRoom = async () => {
    setLoading(true);
    try {
      const response = await chatApi.getRoom(roomId);
      setRoom(response.data);
    } catch (err) {
      console.error("Failed to load chat room", err);
      toast.error("채팅방 정보를 불러오는데 실패했습니다.");
      navigate("/chat/rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      await chatApi.sendMessage(roomId, {
        roomId,
        content: message.trim(),
      });
      setMessage("");
      fetchRoom(); // 메시지 전송 후 새로고침
    } catch (err) {
      console.error("Failed to send message", err);
      toast.error("메시지 전송에 실패했습니다.");
    } finally {
      setSending(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-100 border-t-primary-600 mb-4"></div>
        <p className="text-gray-400 font-bold">채팅방을 불러오는 중...</p>
      </div>
    );
  }

  if (!user || !room) return null;

  const participantName =
    room.studentName === user.name ? room.seniorName : room.studentName;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate("/chat/rooms")}
        className="group flex items-center text-sm font-bold text-gray-500 hover:text-primary-600 mb-8 transition-colors active:scale-95"
      >
        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 mr-3 group-hover:border-primary-200 group-hover:bg-primary-50 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </div>
        목록으로
      </button>

      <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[70vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* 헤더 */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary-100 flex items-center justify-center border border-primary-200">
              <User className="h-6 w-6 text-primary-700" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                {participantName}
              </h1>
              <p className="text-xs font-bold text-primary-600 tracking-widest mt-0.5">
                1:1 커피챗
              </p>
            </div>
          </div>
          <div className="text-xs font-bold text-gray-400 flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
            <Clock className="h-4 w-4" />
            {room.lastMessageAt
              ? new Date(room.lastMessageAt).toLocaleString()
              : "최근 대화 없음"}
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-gray-50/30">
          {room.messages?.length > 0 ? (
            room.messages.map((messageItem) => {
              const isMine = messageItem.senderId === user.userId;
              return (
                <div
                  key={messageItem.messageId}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-3xl p-5 shadow-sm border ${
                      isMine
                        ? "bg-primary-600 text-white rounded-tr-sm border-primary-700"
                        : "bg-white text-gray-900 rounded-tl-sm border-gray-200"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 mb-2 text-[11px] font-bold ${isMine ? "text-primary-200 justify-end" : "text-gray-400 justify-start"}`}
                    >
                      <span>{isMine ? "나" : messageItem.senderName}</span>
                      <span>•</span>
                      <span>
                        {new Date(messageItem.createdAt).toLocaleTimeString(
                          "ko-KR",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
                      {messageItem.content}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-16">
              <div className="bg-white p-6 rounded-full shadow-sm border border-gray-100 mb-4">
                <MessageSquare className="h-10 w-10 text-gray-300" />
              </div>
              <p className="font-black text-lg text-gray-600">
                아직 나눈 대화가 없습니다.
              </p>
              <p className="mt-2 text-sm font-medium">
                따뜻한 인사로 먼저 대화를 시작해보세요!
              </p>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* 입력 폼 */}
        <form
          onSubmit={handleSendMessage}
          className="p-6 border-t border-gray-100 bg-white shrink-0"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm font-medium focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 resize-none outline-none transition-all h-[88px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={sending || !message.trim()}
              className="inline-flex items-center justify-center h-[88px] w-full sm:w-[100px] shrink-0 rounded-2xl bg-primary-600 text-white font-black hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoomDetailPage;
