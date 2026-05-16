import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mentoringApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Clock, CheckCircle, XCircle, MessageSquare, User, Send, Inbox } from 'lucide-react';

const MyMentoringList = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await mentoringApi.getMyRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch mentoring requests', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
    try {
      await mentoringApi.updateStatus(requestId, status);
      alert(`신청을 ${status === 'ACCEPTED' ? '수락' : status === 'REJECTED' ? '거절' : '완료'}했습니다.`);
      fetchRequests();
    } catch (error) {
      console.error('Failed to update status', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'REQUESTED':
        return <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase bg-yellow-100 text-yellow-700 border border-yellow-200"><Clock className="h-3 w-3 mr-1.5" /> 대기 중</span>;
      case 'ACCEPTED':
        return <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase bg-green-100 text-green-700 border border-green-200"><CheckCircle className="h-3 w-3 mr-1.5" /> 수락됨</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase bg-red-100 text-red-700 border border-red-200"><XCircle className="h-3 w-3 mr-1.5" /> 거절됨</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase bg-blue-100 text-blue-700 border border-blue-200"><CheckCircle className="h-3 w-3 mr-1.5" /> 완료됨</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase bg-gray-100 text-gray-700 border border-gray-200">취소됨</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase bg-gray-50 text-gray-500">{status}</span>;
    }
  };

  if (loading) return (
    <div className="py-20 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-100 border-t-primary-600"></div>
    </div>
  );

  const sentRequests = requests.filter(req => req.menteeId === user.userId);
  const receivedRequests = requests.filter(req => req.mentorId === user.userId);

  return (
    <div className="space-y-12">
      {/* 내가 신청한 커피챗 */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-gray-900 flex items-center">
            <div className="bg-primary-100 p-2 rounded-xl mr-3">
              <Send className="h-5 w-5 text-primary-600" />
            </div>
            내가 신청한 커피챗
          </h3>
          <span className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">{sentRequests.length}건</span>
        </div>
        <div className="grid gap-4">
          {sentRequests.length > 0 ? (
            sentRequests.map((req) => (
              <div key={req.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg transition-all hover:shadow-xl">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-2xl bg-primary-50 flex items-center justify-center mr-4 border border-primary-100">
                      <User className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-base font-black text-gray-900">{req.mentorName} 멘토님</p>
                      <p className="text-xs font-bold text-gray-400 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(req.status)}
                </div>
                <div className="mt-5 bg-gray-50/50 p-4 rounded-2xl text-sm text-gray-700 flex items-start border border-gray-100 italic">
                  <MessageSquare className="h-4 w-4 mr-3 mt-0.5 text-primary-300 flex-shrink-0" />
                  {req.message}
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
              <Inbox className="h-10 w-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-bold">아직 신청한 커피챗이 없습니다.</p>
              <Link to="/mentoring" className="text-primary-600 text-sm font-bold mt-2 inline-block hover:underline">멘토님 찾아보기</Link>
            </div>
          )}
        </div>
      </div>

      {/* 내가 받은 커피챗 (멘토인 경우) */}
      {(user.role === 'PROFESSOR' || user.role === 'GRADUATE') && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-gray-900 flex items-center">
              <div className="bg-indigo-100 p-2 rounded-xl mr-3">
                <Inbox className="h-5 w-5 text-indigo-600" />
              </div>
              나에게 온 커피챗 신청
            </h3>
            <span className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">{receivedRequests.length}건</span>
          </div>
          <div className="grid gap-4">
            {receivedRequests.length > 0 ? (
              receivedRequests.map((req) => (
                <div key={req.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg transition-all hover:shadow-xl">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center mr-4 border border-indigo-100">
                        <User className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-base font-black text-gray-900">{req.menteeName} 님</p>
                        <p className="text-xs font-bold text-gray-400 mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {req.status === 'REQUESTED' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')}
                          className="px-5 py-2 bg-primary-600 text-white text-xs font-black rounded-xl hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
                        >
                          수락하기
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                          className="px-5 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-black rounded-xl hover:bg-gray-50 transition-all"
                        >
                          거절하기
                        </button>
                      </div>
                    ) : req.status === 'ACCEPTED' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'COMPLETED')}
                          className="px-5 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                        >
                          면담 완료 처리
                        </button>
                        {getStatusBadge(req.status)}
                      </div>
                    ) : (
                      getStatusBadge(req.status)
                    )}
                  </div>
                  <div className="mt-5 bg-gray-50/50 p-4 rounded-2xl text-sm text-gray-700 flex items-start border border-gray-100 italic">
                    <MessageSquare className="h-4 w-4 mr-3 mt-0.5 text-indigo-300 flex-shrink-0" />
                    {req.message}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                <Inbox className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-bold">받은 커피챗 신청이 없습니다.</p>
                <p className="text-gray-400 text-sm mt-1">프로필을 더 멋지게 꾸며보세요!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMentoringList;
