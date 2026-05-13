import React, { useState, useEffect } from 'react';
import api from '../../api/client';
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
      const response = await api.get('/mentoring/my-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch mentoring requests', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
    try {
      await api.patch(`/mentoring/${requestId}/status`, null, { params: { status } });
      alert(`신청을 ${status === 'ACCEPTED' ? '수락' : '거절'}했습니다.`);
      fetchRequests();
    } catch (error) {
      console.error('Failed to update status', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> 대기 중</span>;
      case 'ACCEPTED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> 수락됨</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> 거절됨</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" /> 완료됨</span>;
      default:
        return null;
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">로딩 중...</div>;

  const sentRequests = requests.filter(req => req.menteeId === user.userId);
  const receivedRequests = requests.filter(req => req.mentorId === user.userId);

  return (
    <div className="space-y-8">
      {/* 내가 신청한 커피챗 */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Send className="h-5 w-5 mr-2 text-primary-600" />
          내가 신청한 커피챗
        </h3>
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
          <ul className="divide-y divide-gray-100">
            {sentRequests.length > 0 ? (
              sentRequests.map((req) => (
                <li key={req.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{req.mentorName} 멘토님</p>
                        <p className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>
                  <div className="mt-3 bg-gray-50 p-3 rounded text-sm text-gray-700 flex items-start">
                    <MessageSquare className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                    {req.message}
                  </div>
                </li>
              ))
            ) : (
              <li className="p-8 text-center text-gray-500 text-sm">신청한 커피챗이 없습니다.</li>
            )}
          </ul>
        </div>
      </div>

      {/* 내가 받은 커피챗 (멘토인 경우) */}
      {(user.role === 'MENTOR' || user.role === 'PROFESSOR' || user.role === 'GRADUATE') && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Inbox className="h-5 w-5 mr-2 text-primary-600" />
            나에게 온 커피챗 신청
          </h3>
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
            <ul className="divide-y divide-gray-100">
              {receivedRequests.length > 0 ? (
                receivedRequests.map((req) => (
                  <li key={req.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{req.menteeName} 님</p>
                          <p className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {req.status === 'PENDING' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')}
                            className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded hover:bg-primary-700"
                          >
                            수락
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                            className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50"
                          >
                            거절
                          </button>
                        </div>
                      ) : (
                        getStatusBadge(req.status)
                      )}
                    </div>
                    <div className="mt-3 bg-gray-50 p-3 rounded text-sm text-gray-700 flex items-start">
                      <MessageSquare className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                      {req.message}
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-8 text-center text-gray-500 text-sm">받은 커피챗 신청이 없습니다.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMentoringList;
