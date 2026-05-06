import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { User, Briefcase, GraduationCap, MapPin, Search } from 'lucide-react';

const MentorListPage = () => {
  const [mentors, setMentors] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    major: '',
    jobCategory: '',
    country: '',
  });

  useEffect(() => {
    fetchMentors();
  }, [filters]);

  const fetchMentors = async () => {
    try {
      const response = await api.get('/mentoring/mentors', { params: filters });
      setMentors(response.data);
    } catch (error) {
      console.error('Failed to fetch mentors', error);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">멘토 찾기</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="이름 검색"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-2"
              value={filters.name}
              onChange={handleChange}
            />
          </div>
          <select
            name="major"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-2"
            value={filters.major}
            onChange={handleChange}
          >
            <option value="">전공 선택</option>
            <option value="COMPUTER_SCIENCE">컴퓨터공학</option>
            <option value="ELECTRONIC_ENGINEERING">전자공학</option>
            <option value="MECHANICAL_ENGINEERING">기계공학</option>
            <option value="BUSINESS_ADMINISTRATION">경영학</option>
          </select>
          <select
            name="jobCategory"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-2"
            value={filters.jobCategory}
            onChange={handleChange}
          >
            <option value="">직무 선택</option>
            <option value="BACKEND_DEVELOPER">백엔드 개발자</option>
            <option value="FRONTEND_DEVELOPER">프론트엔드 개발자</option>
            <option value="DATA_SCIENTIST">데이터 사이언티스트</option>
            <option value="PRODUCT_MANAGER">PM/PO</option>
          </select>
          <select
            name="country"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-2"
            value={filters.country}
            onChange={handleChange}
          >
            <option value="">국가 선택</option>
            <option value="KOREA">한국</option>
            <option value="USA">미국</option>
            <option value="JAPAN">일본</option>
            <option value="GERMANY">독일</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <div key={mentor.userId} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{mentor.name}</h3>
                  <p className="text-sm text-gray-500">{mentor.role === 'PROFESSOR' ? '교수' : '졸업생'}</p>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {mentor.majorDescription || mentor.major}
                </div>
                {mentor.currentCompany && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {mentor.currentCompany} • {mentor.jobCategoryDescription || mentor.jobCategory}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {mentor.countryDescription || mentor.country}
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-6">
                {mentor.bio || '등록된 소개가 없습니다.'}
              </p>
              <button
                className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
                onClick={() => alert('멘토링 신청 기능은 구현 중입니다.')}
              >
                멘토링 신청하기
              </button>
            </div>
          </div>
        ))}
      </div>
      {mentors.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          조건에 맞는 멘토를 찾을 수 없습니다.
        </div>
      )}
    </div>
  );
};

export default MentorListPage;
