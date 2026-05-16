import React, { useState } from 'react';
import { mentoringApi } from '../../api/client';
import { X, Send } from 'lucide-react';

const MentoringRequestModal = ({ mentor, onClose, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('신청 메시지를 입력해주세요.');
      return;
    }

    const mentorId = mentor?.userId || mentor?.id || mentor?.mentorId;
    if (!mentorId) {
      alert('멘토 정보를 확인할 수 없습니다. 잠시 후 다시 시도해주세요.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      await mentoringApi.applyMentoring({
        mentorId,
        message,
      });
      alert('멘토링 신청이 완료되었습니다.');
      onSuccess();
    } catch (error) {
      console.error('Failed to apply for mentoring', error);
      const messageFromServer = error.response?.data?.message || error.message;
      alert(`멘토링 신청에 실패했습니다. ${messageFromServer}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            {mentor.name} 님에게 커피챗 신청
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              신청 메시지
            </label>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
              placeholder="무엇을 물어보고 싶은지, 간단한 자기소개를 포함해 메시지를 작성해주세요."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            ></textarea>
            <p className="mt-2 text-xs text-gray-500">
              * 멘토가 수락하면 연락처를 확인할 수 있습니다.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
              disabled={loading}
            >
              <Send className="h-4 w-4 mr-2" />
              {loading ? '전송 중...' : '신청하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentoringRequestModal;
