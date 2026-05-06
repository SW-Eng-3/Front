import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { User, Mail, Award, Edit2, Save, X } from 'lucide-react';

const MyProfilePage = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    major: user?.major || '',
    currentCompany: user?.currentCompany || '',
    jobCategory: user?.jobCategory || '',
    country: user?.country || '',
    bio: user?.bio || '',
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/me/profile', formData);
      const response = await api.get(`/users/${user.userId}/profile`);
      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('프로필 수정에 실패했습니다.');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-primary-600 h-32"></div>
        <div className="px-6 pb-8">
          <div className="relative -mt-16 mb-6">
            <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow">
              <User className="h-16 w-16 text-gray-400" />
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 text-gray-600 hover:text-primary-600"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">전공</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-2"
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  >
                    <option value="COMPUTER_SCIENCE">컴퓨터공학</option>
                    <option value="ELECTRONIC_ENGINEERING">전자공학</option>
                    <option value="MECHANICAL_ENGINEERING">기계공학</option>
                    <option value="BUSINESS_ADMINISTRATION">경영학</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">현재 직장/소속</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-2"
                    value={formData.currentCompany}
                    onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">직무 카테고리</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-2"
                    value={formData.jobCategory}
                    onChange={(e) => setFormData({ ...formData, jobCategory: e.target.value })}
                  >
                    <option value="BACKEND_DEVELOPER">백엔드 개발자</option>
                    <option value="FRONTEND_DEVELOPER">프론트엔드 개발자</option>
                    <option value="DATA_SCIENTIST">데이터 사이언티스트</option>
                    <option value="PRODUCT_MANAGER">PM/PO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">활동 국가</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-2"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  >
                    <option value="KOREA">한국</option>
                    <option value="USA">미국</option>
                    <option value="JAPAN">일본</option>
                    <option value="GERMANY">독일</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">소개</label>
                <textarea
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-2"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  취소
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  저장하기
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500">{user.role}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-3 text-gray-400" />
                  {user.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Award className="h-5 w-5 mr-3 text-gray-400" />
                  {user.points} 포인트
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-3 text-gray-400">전공:</span>
                  {user.majorDescription || user.major || '미설정'}
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-3 text-gray-400">직장:</span>
                  {user.currentCompany || '미설정'}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">소개</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {user.bio || '등록된 소개가 없습니다.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
