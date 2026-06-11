import React, { useState } from "react";
import { mentoringApi } from "../../api/client";
import { X, Send } from "lucide-react";
import toast from "react-hot-toast";

const MentoringRequestModal = ({ mentor, onClose, onSuccess }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("신청 메시지를 입력해주세요.");
      return;
    }

    const mentorId = mentor?.userId || mentor?.id || mentor?.mentorId;

    if (!mentorId) {
      toast.error("멘토 정보를 확인할 수 없습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setLoading(true);
    try {
      const applyData = {
        mentorId: mentorId,
        message: message.trim(),
      };
      await mentoringApi.applyMentoring(applyData);
      toast.success("멘토링 신청이 성공적으로 완료되었습니다!");
      onSuccess();
    } catch (error) {
      console.error("Failed to apply for mentoring:", error);
      const messageFromServer = error.response?.data?.message || error.message;
      toast.error(`신청 실패: ${messageFromServer}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-xl font-black text-gray-900">
            {mentor.name}{" "}
            <span className="font-bold text-lg text-gray-500">
              님에게 멘토 신청
            </span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-8">
            <label className="block text-sm font-black text-gray-900 mb-3 tracking-widest uppercase">
              신청 메시지
            </label>
            <textarea
              className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none resize-none h-36 font-medium leading-relaxed"
              placeholder="무엇을 물어보고 싶은지, 간단한 자기소개를 포함해 메시지를 작성해주세요."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            ></textarea>
            <p className="mt-3 text-[11px] font-bold text-primary-600 bg-primary-50 px-3 py-2 rounded-lg border border-primary-100 inline-block">
              💡 멘토가 수락하면 커피챗을 통해 연락처와 대화를 나눌 수 있습니다.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 px-4 border border-gray-200 rounded-2xl text-sm font-black text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 px-4 bg-primary-600 text-white rounded-2xl text-sm font-black hover:bg-primary-700 transition-all flex items-center justify-center shadow-lg shadow-primary-600/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              disabled={loading}
            >
              <Send className="h-4 w-4 mr-2" />
              {loading ? "전송 중..." : "신청하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentoringRequestModal;
