import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mentoringApi } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import {
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  User,
  Send,
  Inbox,
} from "lucide-react";
import toast from "react-hot-toast";

const MyMentoringList = () => {
  const { user } = useAuth();
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      fetchRequests();
    }
  }, [user?.userId, user?.role]);

  const fetchRequests = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const myRes = await mentoringApi.getMyRequests();
      setSentRequests(
        Array.isArray(myRes.data) ? myRes.data : myRes.data?.content || [],
      );

      if (user.role === "PROFESSOR" || user.role === "GRADUATE") {
        const incomingRes = await mentoringApi.getIncomingRequests();
        setReceivedRequests(
          Array.isArray(incomingRes.data)
            ? incomingRes.data
            : incomingRes.data?.content || [],
        );
      }
    } catch (error) {
      console.error("Failed to fetch mentoring requests", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelMentoring = (requestId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold text-gray-900">
            정말 멘토링 요청을 취소하시겠습니까?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
            >
              닫기
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await mentoringApi.cancelMentoring(requestId);
                  toast.success("요청이 취소되었습니다.");
                  fetchRequests();
                } catch (error) {
                  console.error("Failed to cancel mentoring", error);
                  toast.error("취소에 실패했습니다.");
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              취소 확인
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  const handleUpdateStatus = async (requestId, status) => {
    try {
      const response = await mentoringApi.updateStatus(requestId, status);
      toast.success(
        status === "ACCEPTED"
          ? "멘토링을 수락했습니다."
          : status === "REJECTED"
            ? "멘토링을 거절했습니다."
            : "상태가 변경되었습니다.",
      );

      if (status === "ACCEPTED") {
        const event = new CustomEvent("openChat", {
          detail: {
            roomId: response.data?.roomId,
            seniorName: response.data?.seniorName || response.data?.mentorName,
            studentName:
              response.data?.studentName || response.data?.menteeName,
          },
        });
        window.dispatchEvent(event);
      }

      fetchRequests();
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("상태 변경에 실패했습니다.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "REQUESTED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase bg-yellow-100 text-yellow-700 border border-yellow-200">
            <Clock className="h-3 w-3 mr-1.5" /> 대기중{" "}
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="h-3 w-3 mr-1.5" /> 수락됨{" "}
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase bg-red-100 text-red-700 border border-red-200">
            <XCircle className="h-3 w-3 mr-1.5" /> 거절됨{" "}
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase bg-blue-100 text-blue-700 border border-blue-200">
            <CheckCircle className="h-3 w-3 mr-1.5" /> 완료됨{" "}
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase bg-gray-100 text-gray-700 border border-gray-200">
            취소됨
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase bg-gray-50 text-gray-500">
            {status}
          </span>
        );
    }
  };

  if (loading)
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-100 border-t-primary-600"></div>
      </div>
    );

  return (
    <div className="space-y-12">
      {/* 보낸 요청 (내가 멘티로서 신청한 경우) */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-gray-900 flex items-center">
            <div className="bg-primary-100 p-2 rounded-xl mr-3">
              <Send className="h-5 w-5 text-primary-600" />
            </div>
            내가 보낸 신청
          </h3>
          <span className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
            {sentRequests.length} 건
          </span>
        </div>

        <div className="grid gap-4">
          {sentRequests.length > 0 ? (
            sentRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg transition-all hover:shadow-xl"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-2xl bg-primary-50 flex items-center justify-center mr-4 border border-primary-100">
                      <User className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-base font-black text-gray-900">
                        {req.mentorName} 멘토
                      </p>
                      <p className="text-xs font-bold text-gray-400 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(req.status)}
                    {req.status === "REQUESTED" && (
                      <button
                        onClick={() => handleCancelMentoring(req.id)}
                        className="text-[10px] font-bold text-red-500 hover:text-red-700 underline"
                      >
                        신청 취소
                      </button>
                    )}
                  </div>
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
              <p className="text-gray-500 font-bold">보낸 신청이 없습니다.</p>
              <Link
                to="/mentoring"
                className="text-primary-600 text-sm font-bold mt-2 inline-block hover:underline"
              >
                선배 찾으러 가기
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 받은 요청 (내가 멘토로서 신청받은 경우) */}
      {(user.role === "PROFESSOR" || user.role === "GRADUATE") && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-gray-900 flex items-center">
              <div className="bg-indigo-100 p-2 rounded-xl mr-3">
                <Inbox className="h-5 w-5 text-indigo-600" />
              </div>
              내게 온 신청
            </h3>
            <span className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
              {receivedRequests.length} 건
            </span>
          </div>

          <div className="grid gap-4">
            {receivedRequests.length > 0 ? (
              receivedRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg transition-all hover:shadow-xl"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center mr-4 border border-indigo-100">
                        <User className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-base font-black text-gray-900">
                          {req.menteeName} 학생
                        </p>
                        <p className="text-xs font-bold text-gray-400 mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {req.status === "REQUESTED" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(req.id, "ACCEPTED")}
                          className="px-5 py-2 bg-primary-600 text-white text-xs font-black rounded-xl hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
                        >
                          수락
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                          className="px-5 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-black rounded-xl hover:bg-gray-50 transition-all"
                        >
                          거절
                        </button>
                      </div>
                    ) : req.status === "ACCEPTED" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleUpdateStatus(req.id, "COMPLETED")
                          }
                          className="px-5 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                        >
                          멘토링 완료
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
                <p className="text-gray-500 font-bold">
                  도착한 신청이 없습니다.
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  곧 후배들의 연락이 올 거예요!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMentoringList;
