import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { chatApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, ArrowRight, Clock, User } from 'lucide-react';

const ChatRoomsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
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
      console.error('Failed to load chat rooms', err);
      setError('채팅방 목록을 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="p-8 text-center text-gray-500">인증 확인 중...</div>;
  }

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900">나의 커피챗</h1>
          <p className="text-gray-500 mt-2 text-lg">진행 중인 1:1 커피챗을 확인하고 이어서 대화를 나눠보세요.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-100 border-t-primary-600 mb-4"></div>
            <p className="text-gray-500">커피챗방을 불러오는 중입니다...</p>
          </div>
        ) : error ? (
          <div className="p-16 text-center text-red-600">
            <p className="font-bold">{error}</p>
            <button onClick={fetchRooms} className="mt-4 text-primary-600 font-semibold hover:underline">다시 시도</button>
          </div>
        ) : rooms.length === 0 ? (
          <div className="p-16 text-center">
            <MessageSquare className="mx-auto h-14 w-14 text-primary-600" />
            <h2 className="mt-6 text-2xl font-bold text-gray-900">아직 열린 커피챗이 없습니다.</h2>
            <p className="mt-2 text-gray-500">멘토링 페이지에서 선배님과 커피챗을 시작해보세요.</p>
            <Link to="/mentoring" className="mt-6 inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all">
              멘토 찾으러 가기
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {rooms.map((room) => (
              <li key={room.roomId}>
                <Link to={`/chat/rooms/${room.roomId}`} className="block hover:bg-gray-50 transition-all">
                  <div className="px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary-50 text-primary-700">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{room.studentName === user.name ? room.seniorName : room.studentName}</p>
                        <p className="text-sm text-gray-500 mt-1">{room.status === 'ACTIVE' ? '활성 커피챗' : '종료된 커피챗'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2">
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-2xl">{room.lastMessage || '아직 메시지가 없습니다.'}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{room.lastMessageAt ? new Date(room.lastMessageAt).toLocaleString() : '-'}</span>
                      </div>
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
