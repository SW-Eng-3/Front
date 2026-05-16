import React, { useState } from 'react';
import { reportApi } from '../../api/client';
import { ShieldAlert, X } from 'lucide-react';

const ReportModal = ({ targetId, targetType, onClose }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
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
      alert('신고가 접수되었습니다.');
      onClose();
    } catch (error) {
      console.error('Report failed', error);
      alert('신고 접수에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-red-50">
          <h3 className="text-lg font-bold text-red-700 flex items-center">
            <ShieldAlert className="h-5 w-5 mr-2" />
            신고하기
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">신고 사유</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm border p-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">사유를 선택하세요</option>
              <option value="SPAM">스팸/영리적 홍보</option>
              <option value="INAPPROPRIATE_CONTENT">부적절한 콘텐츠</option>
              <option value="ABUSIVE_LANGUAGE">욕설/비하 발언</option>
              <option value="HARASSMENT">괴롭힘/사생활 침해</option>
              <option value="FRAUD">사기/허위 정보</option>
              <option value="OTHER">기타</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상세 내용 (선택)</label>
            <textarea
              className="w-full rounded-md border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm border p-2"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="추가적인 설명이 필요한 경우 입력해주세요."
            ></textarea>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
            >
              {submitting ? '제출 중...' : '신고 제출'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
