import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chatApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Send, Clock, User, MessageSquare } from 'lucide-react';

const ChatRoomDetailPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [room, setRoom] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchRoom();
    }
  }, [user, authLoading, roomId, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [room?.messages]);

  const fetchRoom = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await chatApi.getRoom(roomId);
      setRoom(response.data);
    } catch (err) {
      console.error('Failed to load chat room', err);
      setError('커피챗방을 불러오는 중 오류가 발생했습니다.');
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
      setMessage('');
      fetchRoom();
    } catch (err) {
      console.error('Failed to send message', err);
      alert('메시지 전송에 실패했습니다.');
    } finally {
      setSending(false);
    }
  };

  if (authLoading || loading) {
    return <div className="p-8 text-center text-gray-500">커피챗방을 불러오는 중입니다...</div>;
  }

  if (!user) return null;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
          <p className="text-red-600 font-bold">{error}</p>
          <button onClick={fetchRoom} className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-2xl hover:bg-primary-700">다시 시도</button>
        </div>
      </div>
    );
  }

  const participantName = room.studentName === user.name ? room.seniorName : room.studentName;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary-600 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> 커피챗 목록으로 돌아가기
      </button>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">상대</p>
            <h1 className="text-2xl font-bold text-gray-900">{participantName}</h1>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {room.lastMessageAt ? new Date(room.lastMessageAt).toLocaleString() : '메시지 없음'}
          </div>
        </div>

        <div className="min-h-[48vh] max-h-[70vh] overflow-y-auto px-8 py-6 space-y-4 bg-gray-50">
          {room.messages?.length > 0 ? (
            room.messages.map((messageItem) => {
              const isMine = messageItem.senderId === user.userId;
              return (
                <div key={messageItem.messageId} className={`max-w-[85%] ${isMine ? 'ml-auto bg-primary-600 text-white' : 'bg-white text-gray-900'} rounded-3xl p-4 shadow-sm border border-gray-100`}>
                  <div className="flex items-center justify-between mb-2 text-xs text-gray-400">
                    <span>{isMine ? '나' : messageItem.senderName}</span>
                    <span>{new Date(messageItem.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{messageItem.content}</p>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 py-16">
              <MessageSquare className="mx-auto h-12 w-12 text-primary-300 mb-4" />
              <p className="font-bold">아직 대화가 없습니다.</p>
              <p className="mt-2 text-sm">첫 메시지를 보내 대화를 시작해보세요.</p>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-100 bg-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="min-h-[88px] w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
            <button
              type="submit"
              disabled={sending || !message.trim()}
              className="inline-flex items-center justify-center shrink-0 rounded-3xl bg-primary-600 px-6 py-3 text-sm font-bold text-white hover:bg-primary-700 transition-colors disabled:opacity-60"
            >
              <Send className="h-4 w-4 mr-2" />
              보내기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoomDetailPage;
