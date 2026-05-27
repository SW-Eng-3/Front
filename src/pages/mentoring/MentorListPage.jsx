import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mentoringApi, chatApi } from '../../api/client';
import { User, Users, Briefcase, GraduationCap, MapPin, Search, Filter, Coffee, MessageSquare } from 'lucide-react';
import MentoringRequestModal from '../../components/mentoring/MentoringRequestModal';
import { MAJOR_LABELS, JOB_LABELS, COUNTRY_LABELS } from '../../utils/constants';

const MentorListPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    major: '',
    jobCategory: '',
    country: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchMentors();
    }
  }, [filters, user]);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const response = await mentoringApi.getMentors(filters);
      setMentors(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch mentors', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="p-8 text-center text-gray-500">인증 확인 중...</div>;
  }

  if (!user) return null;

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyClick = (mentor) => {
    setSelectedMentor(mentor);
    setIsModalOpen(true);
  };

  const handleChatWithMentor = async (mentor) => {
    const seniorId = mentor.userId || mentor.id || mentor.mentorId;
    if (!seniorId) {
      alert('멘토 정보를 확인할 수 없습니다.');
      return;
    }

    try {
      const response = await chatApi.getOrCreateSeniorRoomByQuery(seniorId);
      const room = response.data;
      if (room?.roomId) {
        navigate(`/chat/rooms/${room.roomId}`);
      } else {
        alert('커피챗방을 열지 못했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Failed to open chat room', error);
      alert('커피챗방을 열 수 없습니다.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary-600" />
              멘토 찾기
            </h1>
            <p className="text-gray-500 mt-2 text-lg">성공적인 커리어를 쌓은 선배님들께 조언을 구해보세요.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-700">
            <Filter className="h-4 w-4 text-primary-600" />
            상세 필터
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="이름으로 검색"
                className="pl-10 block w-full rounded-xl border-gray-200 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-2.5 transition-all"
                value={filters.name}
                onChange={handleChange}
              />
            </div>
            <select
              name="major"
              className="block w-full rounded-xl border-gray-200 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-2.5 transition-all appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1em_1em]"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")' }}
              value={filters.major}
              onChange={handleChange}
            >
              <option value="">모든 전공</option>
              {Object.entries(MAJOR_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select
              name="jobCategory"
              className="block w-full rounded-xl border-gray-200 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-2.5 transition-all appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1em_1em]"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")' }}
              value={filters.jobCategory}
              onChange={handleChange}
            >
              <option value="">모든 직무</option>
              {Object.entries(JOB_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select
              name="country"
              className="block w-full rounded-xl border-gray-200 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-2.5 transition-all appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1em_1em]"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")' }}
              value={filters.country}
              onChange={handleChange}
            >
              <option value="">모든 국가</option>
              {Object.entries(COUNTRY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-100 border-t-primary-600"></div>
          <p className="mt-4 text-gray-500 font-medium">멘토님들을 찾는 중입니다...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mentors.map((mentor) => (
            <div key={mentor.userId || mentor.id || mentor.mentorId} className="group bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-primary-50 flex items-center justify-center border border-primary-100 group-hover:bg-primary-600 transition-colors">
                    <User className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                    mentor.role === 'PROFESSOR' 
                      ? 'bg-purple-50 text-purple-700 border-purple-100' 
                      : 'bg-blue-50 text-blue-700 border-blue-100'
                  }`}>
                    {mentor.role === 'PROFESSOR' ? '교수님' : '선배님'}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-1">{mentor.name}</h3>
                <p className="text-sm text-gray-500 mb-6 font-medium">{mentor.majorDescription || mentor.major}</p>
                
                <div className="space-y-3 mb-8">
                  {mentor.currentCompany && (
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{mentor.currentCompany}</span>
                      <span className="mx-1.5 text-gray-300">•</span>
                      <span className="text-gray-500">{mentor.jobCategoryDescription || mentor.jobCategory}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">{mentor.countryDescription || mentor.country}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-50 pt-6">
                  <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem] leading-relaxed mb-6">
                    {mentor.bio || '등록된 소개글이 아직 없습니다. 따뜻한 조언이 기다리고 있습니다!'}
                  </p>
                  <div className="grid gap-3">
                  <button
                    className="w-full bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 transition-all text-sm font-bold shadow-sm flex items-center justify-center gap-2"
                    onClick={() => handleApplyClick(mentor)}
                  >
                    <Users className="h-4 w-4" />
                    멘토 신청하기
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChatWithMentor(mentor)}
                    className="w-full border border-primary-200 text-primary-700 py-3 rounded-xl hover:bg-primary-50 transition-all text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <Coffee className="h-4 w-4" />
                    커피챗 시작하기
                  </button>
                </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {isModalOpen && (
        <MentoringRequestModal
          mentor={selectedMentor}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            alert('성공적으로 신청되었습니다!');
          }}
        />
      )}

      {!loading && mentors.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl shadow-inner border border-dashed border-gray-200">
          <Search className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800">조건에 맞는 멘토를 찾을 수 없습니다</h3>
          <p className="text-gray-500 mt-2">다른 필터 조건을 선택해 보세요.</p>
          <button 
            onClick={() => setFilters({ name: '', major: '', jobCategory: '', country: '' })}
            className="mt-6 text-primary-600 font-bold hover:underline"
          >
            필터 초기화하기
          </button>
        </div>
      )}
    </div>
  );
};

export default MentorListPage;
