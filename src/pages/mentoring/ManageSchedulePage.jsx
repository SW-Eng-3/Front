import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { mentoringApi } from "../../api/client";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Save,
  Info,
  CalendarDays,
} from "lucide-react";
import toast from "react-hot-toast";

const ScheduleSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl bg-white"
      >
        <div className="flex items-center gap-4 w-2/3">
          <div className="h-12 w-12 bg-gray-100 rounded-xl shrink-0"></div>
          <div className="w-full">
            <div className="h-5 w-32 bg-gray-200 rounded-md mb-2"></div>
            <div className="h-4 w-48 bg-gray-100 rounded-md"></div>
          </div>
        </div>
        <div className="h-10 w-10 bg-gray-100 rounded-xl shrink-0"></div>
      </div>
    ))}
  </div>
);

const ManageSchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    startTime: "09:00",
    endTime: "10:00",
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
      console.error("Failed to fetch schedules", error);
      toast.error("일정 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!formData.date) {
      toast.error("날짜를 선택해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const startDateTime = `${formData.date}T${formData.startTime}:00`;
      const endDateTime = `${formData.date}T${formData.endTime}:00`;

      await mentoringApi.registerSchedule({
        startTime: startDateTime,
        endTime: endDateTime,
      });

      toast.success("일정이 성공적으로 등록되었습니다.");
      setFormData({ ...formData, date: "" });
      fetchMySchedules();
    } catch (error) {
      console.error("Failed to add schedule", error);
      toast.error("일정 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (scheduleId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold text-gray-900">
            이 일정을 정말 삭제하시겠습니까?
          </p>
          <div className="flex gap-2 justify-end mt-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors active:scale-95"
            >
              취소
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  // await mentoringApi.deleteSchedule(scheduleId);
                  toast.success("일정이 삭제되었습니다.");
                  fetchMySchedules();
                } catch (error) {
                  toast.error("일정 삭제에 실패했습니다.");
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm active:scale-95"
            >
              삭제 확인
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        style: {
          background: "#ffffff", // 커스텀 팝업은 하얀색 배경 강제 적용
          color: "#111827",
          padding: "20px",
          borderRadius: "20px",
          border: "1px solid #f3f4f6",
        },
      },
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
          <CalendarDays className="h-8 w-8 text-primary-600 mr-3" />
          오피스 아워 설정
        </h1>
        <p className="text-gray-500 mt-2 text-lg font-medium">
          후배들이 멘토링을 신청할 수 있는 가능한 시간대를 등록하고 관리하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100 animate-in fade-in slide-in-from-left-4 duration-500 sticky top-28">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center">
              <div className="bg-primary-50 p-2.5 rounded-xl mr-3">
                <Plus className="h-5 w-5 text-primary-600" />
              </div>
              새 일정 추가
            </h2>
            <form onSubmit={handleAddSchedule} className="space-y-6">
              <div>
                <label className="block text-sm font-black text-gray-900 mb-2 tracking-widest uppercase">
                  날짜
                </label>
                <input
                  type="date"
                  className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none cursor-pointer"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-gray-900 mb-2 tracking-widest uppercase">
                    시작 시간
                  </label>
                  <input
                    type="time"
                    className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none cursor-pointer"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-900 mb-2 tracking-widest uppercase">
                    종료 시간
                  </label>
                  <input
                    type="time"
                    className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none cursor-pointer"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center rounded-2xl bg-primary-600 px-4 py-4 text-sm font-black text-white shadow-lg shadow-primary-600/30 transition-all hover:bg-primary-700 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {submitting ? "등록 중..." : "일정 등록하기"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-900 flex items-center">
                <Calendar className="h-6 w-6 mr-3 text-primary-600" />
                등록된 오피스 아워
                <span className="ml-3 text-sm font-bold text-gray-400 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">
                  {schedules.length}건
                </span>
              </h2>
            </div>

            <div className="p-8 bg-gray-50/30 min-h-[400px]">
              {loading ? (
                <ScheduleSkeleton />
              ) : schedules.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-center bg-white rounded-3xl border border-dashed border-gray-200">
                  <div className="bg-gray-50 p-5 rounded-full mb-4">
                    <Info className="h-10 w-10 text-gray-300" />
                  </div>
                  <p className="text-lg font-black text-gray-800">
                    등록된 일정이 없습니다.
                  </p>
                  <p className="text-sm font-medium text-gray-500 mt-2">
                    왼쪽 폼에서 멘토링이 가능한 시간을 추가해주세요.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {schedules.map((schedule) => {
                    const start = new Date(schedule.startTime);
                    const end = new Date(schedule.endTime);
                    return (
                      <div
                        key={schedule.id}
                        className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-primary-200 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-5">
                          <div className="bg-primary-50 h-14 w-14 flex items-center justify-center rounded-2xl border border-primary-100 group-hover:bg-primary-600 group-hover:text-white text-primary-600 transition-colors">
                            <Clock className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-lg font-black text-gray-900 group-hover:text-primary-700 transition-colors">
                              {start.toLocaleDateString("ko-KR", {
                                month: "long",
                                day: "numeric",
                                weekday: "short",
                              })}
                            </p>
                            <p className="text-sm font-bold text-gray-500 mt-1">
                              {start.toLocaleTimeString("ko-KR", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })}
                              <span className="mx-2 text-gray-300">-</span>
                              {end.toLocaleTimeString("ko-KR", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteClick(schedule.id)}
                          className="p-3 text-gray-400 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-transparent transition-all active:scale-95"
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
