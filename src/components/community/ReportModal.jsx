import React, { useState } from "react";
import { reportApi } from "../../api/client";
import { ShieldAlert, X } from "lucide-react";
import toast from "react-hot-toast";

const ReportModal = ({ targetId, targetType, onClose }) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await reportApi.createReport({
        targetId,
        targetType,
        reason,
        description,
      });
      toast.success("신고가 정상적으로 접수되었습니다.");
      onClose();
    } catch (error) {
      console.error("Report failed", error);
      toast.error("신고 접수에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="px-8 py-6 border-b border-red-100 flex justify-between items-center bg-red-50/50">
          <h3 className="text-xl font-black text-red-700 flex items-center">
            <ShieldAlert className="h-6 w-6 mr-2" />
            신고하기
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-black text-gray-900 mb-3 tracking-widest uppercase">
              신고 사유
            </label>
            <select
              className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm transition-all focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
              }}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">사유를 선택해주세요</option>
              <option value="SPAM">스팸 및 홍보성 글</option>
              <option value="INAPPROPRIATE_CONTENT">
                부적절한 내용 (음란물 등)
              </option>
              <option value="ABUSIVE_LANGUAGE">욕설 및 혐오 발언</option>
              <option value="HARASSMENT">개인 정보 유출 및 괴롭힘</option>
              <option value="FRAUD">사기 및 거짓 정보</option>
              <option value="OTHER">기타 사유</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-black text-gray-900 mb-3 tracking-widest uppercase">
              상세 내용 (선택)
            </label>
            <textarea
              className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm transition-all focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none resize-none leading-relaxed"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="신고 내용을 자세히 적어주시면 처리에 도움이 됩니다."
            ></textarea>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white border border-gray-200 text-gray-600 py-3.5 rounded-2xl text-sm font-black hover:bg-gray-50 transition-colors active:scale-95"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting || !reason}
              className="flex-1 bg-red-600 text-white py-3.5 rounded-2xl text-sm font-black hover:bg-red-700 transition-all shadow-lg shadow-red-600/30 disabled:opacity-50 disabled:active:scale-100 active:scale-95"
            >
              {submitting ? "접수 중..." : "신고 제출"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
