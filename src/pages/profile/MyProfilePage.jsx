import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/client';
import { User, Mail, Award, Edit2, Save, X, Coffee, Briefcase, GraduationCap, MapPin, ChevronRight } from 'lucide-react';
import MyMentoringList from '../../components/mentoring/MyMentoringList';
import { MAJOR_LABELS, JOB_LABELS, COUNTRY_LABELS } from '../../utils/constants';

const MyProfilePage = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'mentoring'
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
      const updateData = {
        ...formData,
        major: formData.major || null,
        jobCategory: formData.jobCategory || null,
        country: formData.country || null,
      };
      
      await authApi.updateProfile(updateData);
      const response = await authApi.getProfile(user.userId);
      setUser(response.data);
      setIsEditing(false);
      alert('프로필이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('Failed to update profile', error);
      const message = error.response?.data?.message || '프로필 수정에 실패했습니다.';
      alert(message);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
        {/* Profile Header Background */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 h-48 relative">
          <div className="absolute -bottom-16 left-10">
            <div className="h-32 w-32 rounded-3xl border-4 border-white bg-white shadow-lg flex items-center justify-center overflow-hidden">
               <div className="bg-primary-50 w-full h-full flex items-center justify-center">
                 <User className="h-16 w-16 text-primary-300" />
               </div>
            </div>
          </div>
        </div>
        
        <div className="pt-20 px-10 pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100">
                  {user.role === 'STUDENT' ? '재학생' : user.role === 'GRADUATE' ? '졸업생' : user.role === 'PROFESSOR' ? '교수님' : '관리자'}
                </span>
                <span className="text-gray-400 text-sm font-medium flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </span>
              </div>
            </div>
            {!isEditing && activeTab === 'profile' && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-primary-200 transition-all"
              >
                <Edit2 className="h-4 w-4 text-primary-600" />
                프로필 수정
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-10 p-1 bg-gray-50 rounded-2xl w-fit">
            <button
              onClick={() => { setActiveTab('profile'); setIsEditing(false); }}
              className={`py-2.5 px-8 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'profile'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              프로필 정보
            </button>
            <button
              onClick={() => { setActiveTab('mentoring'); setIsEditing(false); }}
              className={`py-2.5 px-8 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'mentoring'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              멘토링 내역
            </button>
          </div>

          {activeTab === 'profile' ? (
            isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">전공</label>
                    <select
                      className="block w-full rounded-xl border-gray-200 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-3 transition-all"
                      value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    >
                      <option value="">전공 선택</option>
                      {Object.entries(MAJOR_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">현재 직장/소속</label>
                    <input
                      type="text"
                      placeholder="예: 구글 코리아, 연세대학교 등"
                      className="block w-full rounded-xl border-gray-200 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-3 transition-all"
                      value={formData.currentCompany}
                      onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">직무 카테고리</label>
                    <select
                      className="block w-full rounded-xl border-gray-200 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-3 transition-all"
                      value={formData.jobCategory}
                      onChange={(e) => setFormData({ ...formData, jobCategory: e.target.value })}
                    >
                      <option value="">직무 선택</option>
                      {Object.entries(JOB_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">활동 국가</label>
                    <select
                      className="block w-full rounded-xl border-gray-200 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-3 transition-all"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    >
                      <option value="">국가 선택</option>
                      {Object.entries(COUNTRY_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">자기소개</label>
                  <textarea
                    rows={5}
                    placeholder="후배들이나 동료들에게 보여줄 멋진 소개글을 작성해 보세요."
                    className="block w-full rounded-xl border-gray-200 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-4 transition-all"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <X className="h-4 w-4" />
                    취소하기
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-all transform hover:-translate-y-0.5"
                  >
                    <Save className="h-4 w-4" />
                    프로필 저장하기
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Points Card */}
                  <Link to="/profile/points" className="group bg-primary-50 p-6 rounded-2xl border border-primary-100 hover:bg-primary-600 transition-all">
                    <div className="flex items-center justify-between mb-2">
                       <Award className="h-6 w-6 text-primary-600 group-hover:text-white" />
                       <ChevronRight className="h-4 w-4 text-primary-300 group-hover:text-white" />
                    </div>
                    <p className="text-sm font-bold text-primary-700 group-hover:text-primary-100">보유 포인트</p>
                    <h3 className="text-2xl font-black text-primary-900 group-hover:text-white mt-1">{user.points.toLocaleString()} P</h3>
                  </Link>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <GraduationCap className="h-6 w-6 text-gray-400 mb-2" />
                    <p className="text-sm font-bold text-gray-500">전공</p>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{user.majorDescription || user.major || '미설정'}</h3>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <Briefcase className="h-6 w-6 text-gray-400 mb-2" />
                    <p className="text-sm font-bold text-gray-500">현재 소속</p>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{user.currentCompany || '미설정'}</h3>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <Coffee className="h-6 w-6 text-gray-400 mb-2" />
                    <p className="text-sm font-bold text-gray-500">직무</p>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{user.jobCategoryDescription || user.jobCategory || '미설정'}</h3>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <MapPin className="h-6 w-6 text-gray-400 mb-2" />
                    <p className="text-sm font-bold text-gray-500">활동 국가</p>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{user.countryDescription || user.country || '미설정'}</h3>
                  </div>
                </div>

                <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 relative">
                  <div className="absolute -top-3 left-8 px-4 py-1 bg-white border border-gray-100 rounded-full text-xs font-bold text-primary-600 shadow-sm">
                    자기소개
                  </div>
                  <p className="text-gray-700 whitespace-pre-line text-lg leading-relaxed italic">
                    {user.bio ? `"${user.bio}"` : '등록된 소개글이 없습니다. 멋진 자기소개를 추가해 보세요!'}
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="animate-in fade-in slide-in-from-right-2 duration-300">
              <MyMentoringList />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
