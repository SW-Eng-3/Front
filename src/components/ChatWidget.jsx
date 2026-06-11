import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  X,
  ChevronRight,
  User,
  Clock,
  MessageCircle,
  Send,
  ArrowLeft,
} from "lucide-react";
import { chatApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const ChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("list"); // 'list' or 'detail'
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleOpenChat = (event) => {
      const { roomId, seniorName, studentName } = event.detail || {};
      setIsOpen(true);
      if (roomId) {
        setSelectedRoom({ roomId, seniorName, studentName });
        setView("detail");
      } else {
        setView("list");
      }
    };
    window.addEventListener("openChat", handleOpenChat);
    return () => window.removeEventListener("openChat", handleOpenChat);
  }, []);

  useEffect(() => {
    if (user && isOpen && view === "list") {
      fetchChatRooms();
    }
  }, [user, isOpen, view]);

  useEffect(() => {
    let interval;
    if (user && isOpen && view === "detail" && selectedRoom) {
      if (messages.length === 0) setLoadingMessages(true);
      fetchMessages();
      interval = setInterval(fetchMessages, 3000); // 3초마다 폴링
    } else {
      setLoadingMessages(false);
    }
    return () => clearInterval(interval);
  }, [user, isOpen, view, selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatRooms = async () => {
    setLoading(true);
    try {
      const response = await chatApi.getMyRooms();
      setChatRooms(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch chat rooms", error);
      toast.error("채팅 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedRoom) return;
    try {
      const response = await chatApi.getMessages(selectedRoom.roomId);
      const data = response.data;
      if (Array.isArray(data)) {
        setMessages(data);
      } else if (data?.content && Array.isArray(data.content)) {
        setMessages(data.content);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setView("detail");
    setMessages([]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom || sending) return;
    setSending(true);
    try {
      await chatApi.sendMessage(selectedRoom.roomId, {
        content: newMessage.trim(),
      });
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("메시지 전송 실패");
    } finally {
      setSending(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 h-[600px] max-h-[80vh] bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="bg-primary-600 p-5 flex items-center justify-between shadow-md z-10">
            <div className="flex items-center gap-3 overflow-hidden">
              {view === "detail" && (
                <button
                  onClick={() => setView("list")}
                  className="text-white hover:bg-white/20 p-2 rounded-xl transition-all active:scale-95"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              {view === "list" && (
                <div className="bg-white/20 p-2.5 rounded-xl flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
              )}
              <h3 className="text-lg font-black text-white truncate tracking-wide">
                {view === "list"
                  ? "나의 커피챗"
                  : selectedRoom.studentName === user.name
                    ? selectedRoom.seniorName
                    : selectedRoom.studentName}
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-100 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all flex-shrink-0 active:scale-95"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden flex flex-col bg-gray-50/50">
            {view === "list" ? (
              /* List View */
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-600"></div>
                  </div>
                ) : chatRooms.length > 0 ? (
                  chatRooms.map((room) => (
                    <button
                      key={room.roomId}
                      onClick={() => handleRoomSelect(room)}
                      className="w-full text-left flex items-center p-4 rounded-2xl bg-white hover:bg-primary-50 transition-all border border-gray-100 hover:border-primary-200 shadow-sm active:scale-95 group"
                    >
                      <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:border-primary-100 transition-colors">
                        <User className="h-6 w-6 text-gray-500 group-hover:text-primary-600" />
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black text-gray-900 truncate">
                            {room.studentName === user.name
                              ? room.seniorName
                              : room.studentName}
                          </p>
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                            {room.lastMessageAt
                              ? new Date(room.lastMessageAt).toLocaleTimeString(
                                  "ko-KR",
                                  { hour: "2-digit", minute: "2-digit" },
                                )
                              : ""}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-gray-500 mt-1.5 truncate">
                          {room.lastMessage || "새로운 대화를 시작해보세요."}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="bg-white p-5 rounded-[1.5rem] mb-4 shadow-sm border border-gray-100">
                      <MessageSquare className="h-10 w-10 text-gray-200" />
                    </div>
                    <p className="text-gray-400 font-bold text-sm">
                      진행중인 대화가 없습니다.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Detail View (Chat Messages) */
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-hide">
                  {loadingMessages ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-600 mb-2"></div>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, i) => {
                        const isMe = msg.senderName === user.name;
                        return (
                          <div
                            key={msg.id || i}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm font-medium ${
                                isMe
                                  ? "bg-primary-600 text-white rounded-tr-sm border border-primary-700"
                                  : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm"
                              }`}
                            >
                              <p className="leading-relaxed whitespace-pre-wrap">
                                {msg.content}
                              </p>
                              <p
                                className={`text-[10px] mt-1.5 font-bold ${isMe ? "text-primary-200 text-right" : "text-gray-400"}`}
                              >
                                {new Date(msg.createdAt).toLocaleTimeString(
                                  "ko-KR",
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      {messages.length === 0 && (
                        <div className="text-center py-20">
                          <p className="text-xs text-gray-400 font-bold bg-white px-4 py-2 rounded-full inline-block border border-gray-100 shadow-sm">
                            가볍게 인사를 건네보세요 👋
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 bg-white border-t border-gray-100 flex gap-2 shrink-0"
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지 입력..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="bg-primary-600 text-white px-4 py-3 rounded-2xl hover:bg-primary-700 disabled:opacity-50 disabled:active:scale-100 transition-all shadow-md shadow-primary-600/30 active:scale-95 flex items-center justify-center"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Footer (only in list view) */}
          {view === "list" && (
            <div className="p-4 bg-white border-t border-gray-100 text-center shrink-0">
              <Link
                to="/chat/rooms"
                onClick={() => setIsOpen(false)}
                className="text-xs font-black text-gray-400 hover:text-primary-600 transition-colors uppercase tracking-widest flex items-center justify-center gap-1"
              >
                전체화면으로 보기 <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center h-16 w-16 rounded-[1.5rem] shadow-2xl shadow-primary-600/40 transition-all duration-300 hover:-translate-y-1 active:scale-95 z-50 ${
          isOpen
            ? "bg-gray-900 text-white shadow-gray-900/30"
            : "bg-primary-600 text-white"
        }`}
      >
        <div className="relative">
          {isOpen ? (
            <X className="h-8 w-8" />
          ) : (
            <MessageSquare className="h-8 w-8" />
          )}
          {!isOpen && chatRooms.some((r) => r.unreadCount > 0) && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-4 ring-white">
              N
            </span>
          )}
        </div>
      </button>
    </div>
  );
};

export default ChatWidget;
