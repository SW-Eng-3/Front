import React, { useState, useEffect } from 'react';
import { gamificationApi } from '../../api/client';
import { Award, ArrowLeft, History, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const PointHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pointsRes, historyRes] = await Promise.all([
          gamificationApi.getPoints(),
          gamificationApi.getHistory(),
        ]);
        setTotalPoints(pointsRes.data.totalPoints);
        setHistory(historyRes.data);
      } catch (error) {
        console.error('Failed to fetch point data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/profile" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        내 프로필로 돌아가기
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-primary-600 p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium uppercase tracking-wider">보유 포인트</p>
              <h1 className="text-4xl font-bold mt-1">{totalPoints.toLocaleString()} P</h1>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <Award className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <History className="h-5 w-5 mr-2 text-primary-600" />
            포인트 적립/사용 내역
          </h2>

          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-center py-8 text-gray-500">내역이 없습니다.</p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-4 ${item.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {item.amount > 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.reasonDescription}</p>
                      <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className={`font-bold text-lg ${item.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()} P
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointHistoryPage;
