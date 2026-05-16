import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mentoringApi } from '../../api/client';
import { Calendar, Clock, Plus, Trash2, Save, Info } from 'lucide-react';

const ManageSchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '09:00',
    endTime: '10:00',
  });

  const { user } = useAuth();

  useEffect(() => {
    if (user?.userId) {
      fetchMySchedules();
    }
  }, [user]);

  const fetchMySchedules = async () => {
    setLoading(true);
    try {
      const response = await mentoringApi.getMentorSchedules(user.userId);
      setSchedules(response.data);
    } catch (error) {
      console.error('Failed to fetch schedules', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!formData.date) {
      alert('날짜를 선택해주세요.');
      return;
    }
    try {
      const startDateTime = `${formData.date}T${formData.startTime}:00`;
      const endDateTime = `${formData.date}T${formData.endTime}:00`;
      
      await mentoringApi.registerSchedule({
        startTime: startDateTime,
        endTime: endDateTime,
      });
      fetchMySchedules();
      alert('일정이 등록되었습니다.');
    } catch (error) {
      console.error('Failed to add schedule', error);
      alert('일정 등록에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">오피스 아워 설정</h1>
      <p className="text-gray-500 mb-8">멘티들이 커피챗을 신청할 수 있는 가능한 시간대를 설정하세요.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 border border-primary-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Plus className="h-5 w-5 mr-2 text-primary-600" />
              시간대 추가
            </h2>
            <form onSubmit={handleAddSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
                <input
                  type="date"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-2"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시작 시간</label>
                <input
                  type="time"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-2"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">종료 시간</label>
                <input
                  type="time"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-2"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                <Save className="h-4 w-4 mr-2" />
                저장하기
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                현재 등록된 일정
              </h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">로딩 중...</div>
              ) : schedules.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                  <Info className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                  <p>등록된 오피스 아워가 없습니다.</p>
                  <p className="text-xs">상단 왼쪽 폼을 이용해 시간을 추가해 보세요.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {schedules.map((schedule) => {
                    const start = new Date(schedule.startTime);
                    const end = new Date(schedule.endTime);
                    return (
                      <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-primary-300 transition-colors">
                        <div className="flex items-center">
                          <div className="bg-primary-50 p-2 rounded-lg mr-4">
                            <Clock className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {start.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                            </p>
                            <p className="text-sm text-gray-500">
                              {start.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })} - {end.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </p>
                          </div>
                        </div>
                        <button 
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="삭제"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSchedulePage;
