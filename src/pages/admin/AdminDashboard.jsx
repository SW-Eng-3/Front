import React, { useState, useEffect } from "react";
import { reportApi } from "../../api/client";
import {
  UserCheck,
  ShieldAlert,
  Check,
  X,
  AlertCircle,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === "reports") {
      fetchReports();
    }
  }, [activeTab]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await reportApi.getReports();
      setReports(response.data);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessReport = async (reportId, status) => {
    try {
      await reportApi.processReport(reportId, { status });
      toast.success(
        status === "PROCESSED"
          ? "신고가 승인(처리)되었습니다."
          : "신고가 반려되었습니다.",
      );
      fetchReports();
    } catch (error) {
      console.error("Failed to process report", error);
      toast.error("신고 처리에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          관리자 대시보드
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          플랫폼의 주요 운영 항목을 관리합니다.
        </p>
      </div>

      <div className="flex gap-2 mb-10 p-1 bg-gray-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("users")}
          className={`py-3 px-8 rounded-xl font-black text-sm transition-all flex items-center ${
            activeTab === "users"
              ? "bg-white text-primary-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <UserCheck className="h-4 w-4 mr-2" />
          사용자 권한 관리
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`py-3 px-8 rounded-xl font-black text-sm transition-all flex items-center ${
            activeTab === "reports"
              ? "bg-white text-primary-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <ShieldAlert className="h-4 w-4 mr-2" />
          신고 내역 관리
        </button>
      </div>

      {activeTab === "users" ? (
        <div className="bg-white shadow-xl rounded-3xl p-16 text-center border border-gray-100">
          <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            준비 중인 기능입니다
          </h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            사용자 권한 관리 API 연동이 필요합니다.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-100 border-t-primary-600"></div>
            </div>
          ) : reports.length === 0 ? (
            <div className="bg-white py-20 rounded-3xl shadow-lg border border-dashed border-gray-200 text-center">
              <ShieldAlert className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-bold text-lg">
                접수된 신고 내역이 없습니다.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                클린한 커뮤니티가 유지되고 있습니다!
              </p>
            </div>
          ) : (
            reports.map((report) => (
              <div
                key={report.id}
                className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl transition-all hover:shadow-2xl"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase ${
                          report.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : report.status === "PROCESSED"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {report.statusDescription || report.status}
                      </span>
                      <span className="text-xs font-bold text-gray-400 flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        {new Date(report.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900">
                      {report.reasonDescription || report.reason}
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-gray-500 bg-gray-50 p-3 rounded-xl w-fit">
                      <div className="flex items-center">
                        <span className="text-gray-400 mr-2">신고자:</span>
                        <span className="text-gray-900">
                          {report.reporterName}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-400 mr-2">대상:</span>
                        <span className="px-2 py-0.5 bg-white rounded border border-gray-200 text-[10px] mr-2">
                          {report.targetType}
                        </span>
                        <span className="text-gray-900 font-mono text-xs">
                          {report.targetId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {report.status === "PENDING" && (
                      <>
                        <button
                          onClick={() =>
                            handleProcessReport(report.id, "PROCESSED")
                          }
                          className="flex items-center px-6 py-2.5 bg-primary-600 text-white text-sm font-black rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          신고 승인 (처리)
                        </button>
                        <button
                          onClick={() =>
                            handleProcessReport(report.id, "REJECTED")
                          }
                          className="flex items-center px-6 py-2.5 bg-white border border-gray-200 text-red-600 text-sm font-black rounded-xl hover:bg-red-50 hover:border-red-100 transition-all"
                        >
                          <X className="h-4 w-4 mr-2" />
                          반려
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                    <AlertCircle className="h-3.5 w-3.5 mr-1.5 text-red-400" />
                    상세 신고 내용
                  </p>
                  <p className="text-gray-700 font-medium leading-relaxed italic">
                    {report.description
                      ? `"${report.description}"`
                      : "상세 내용이 없습니다."}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
