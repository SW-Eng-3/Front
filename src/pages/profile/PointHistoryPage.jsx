import React, { useState, useEffect } from "react";
import { gamificationApi } from "../../api/client";
import {
  Award,
  ArrowLeft,
  History,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// 로딩 중 보여줄 스켈레톤 UI 컴포넌트
const PointHistorySkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-36 rounded-[2rem] mb-8"></div>
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl">
      <div className="h-8 w-48 bg-gray-200 rounded-md mb-8"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex justify-between items-center p-5 border border-gray-100 rounded-2xl"
          >
            <div className="flex items-center gap-5 w-1/2">
              <div className="h-12 w-12 bg-gray-200 rounded-xl shrink-0"></div>
              <div className="w-full">
                <div className="h-5 w-3/4 bg-gray-200 rounded-md mb-2"></div>
                <div className="h-3 w-1/2 bg-gray-100 rounded-md"></div>
              </div>
            </div>
            <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PointHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pointsRes, historyRes] = await Promise.all([
        gamificationApi.getPoints(),
        gamificationApi.getHistory(),
      ]);
      setTotalPoints(pointsRes.data.totalPoints);
      setHistory(historyRes.data);
    } catch (error) {
      console.error("Failed to fetch point data", error);
      toast.error("포인트 내역을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/profile"
        className="group inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary-600 mb-8 transition-colors active:scale-95"
      >
        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 mr-3 group-hover:border-primary-200 group-hover:bg-primary-50 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </div>
        내 프로필로 돌아가기
      </Link>

      {loading ? (
        <PointHistorySkeleton />
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* 포인트 요약 카드 */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-[2rem] shadow-xl overflow-hidden mb-8 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="relative z-10 p-10 text-white flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm font-black tracking-widest uppercase mb-2">
                  나의 보유 포인트
                </p>
                <div className="flex items-baseline gap-2">
                  <h1 className="text-5xl font-black tracking-tight">
                    {totalPoints.toLocaleString()}
                  </h1>
                  <span className="text-2xl font-bold text-primary-200">P</span>
                </div>
              </div>
              <div className="bg-white/20 p-5 rounded-3xl backdrop-blur-sm border border-white/10 shadow-inner">
                <Award className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>

          {/* 포인트 내역 리스트 */}
          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/30">
              <h2 className="text-xl font-black text-gray-900 flex items-center">
                <div className="bg-primary-50 p-2.5 rounded-xl mr-3">
                  <History className="h-6 w-6 text-primary-600" />
                </div>
                포인트 적립 및 사용 내역
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {history.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-black text-lg">
                      아직 포인트 내역이 없습니다.
                    </p>
                    <p className="text-gray-400 text-sm mt-2 font-medium">
                      커뮤니티 활동과 멘토링을 통해 포인트를 모아보세요!
                    </p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center">
                        <div
                          className={`p-3.5 rounded-xl mr-5 ${item.amount > 0 ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}
                        >
                          {item.amount > 0 ? (
                            <TrendingUp className="h-6 w-6" />
                          ) : (
                            <TrendingDown className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-base">
                            {item.reasonDescription}
                          </p>
                          <p className="text-xs font-bold text-gray-400 mt-1.5">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`font-black text-2xl ${item.amount > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {item.amount > 0 ? "+" : ""}
                        {item.amount.toLocaleString()}{" "}
                        <span className="text-sm font-bold opacity-80">P</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointHistoryPage;
