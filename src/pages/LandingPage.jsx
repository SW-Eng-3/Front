import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Coffee,
  Award,
  GraduationCap,
  MessageSquare,
  Bell,
  ChevronRight,
  PlusCircle,
  Search,
  User,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mentoringApi, communityApi, gamificationApi } from '../api/client';

const LandingPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    recentPosts: [],
    mentoringRequests: [],
    points: user?.points || 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        communityApi.getPosts(),
        mentoringApi.getMyRequests(),
        gamificationApi.getPoints()
      ]);

      const postsRes = results[0].status === 'fulfilled' ? results[0].value : null;
      const mentoringRes = results[1].status === 'fulfilled' ? results[1].value : null;
      const pointsRes = results[2].status === 'fulfilled' ? results[2].value : null;

      setDashboardData({
        recentPosts: postsRes?.data && Array.isArray(postsRes.data) ? postsRes.data.slice(0, 3) : [],
        mentoringRequests: mentoringRes?.data && Array.isArray(mentoringRes.data) ? mentoringRes.data.slice(0, 3) : [],
        points: pointsRes?.data?.totalPoints !== undefined ? pointsRes.data.totalPoints : (user?.points || 0)
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'REQUESTED':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const featureCards = [
    {
      title: '멘토링과 커피챗',
      description: '졸업생, 교수, 선배와 1:1로 만나 진로와 커리어 고민을 나눌 수 있습니다.',
      icon: Users,
      color: 'primary',
      stat: '1:1'
    },
    {
      title: '지식 공유 커뮤니티',
      description: '질문, 진로 고민, 공모전과 채용 정보를 함께 공유하고 답변을 받을 수 있습니다.',
      icon: BookOpen,
      color: 'green',
      stat: 'Q&A'
    },
    {
      title: '포인트 리워드',
      description: '활동을 통해 포인트를 쌓고, 커뮤니티 안에서 의미 있는 기여를 인정받습니다.',
      icon: Award,
      color: 'yellow',
      stat: 'P'
    }
  ];

  const colorClasses = {
    primary: {
      iconBg: 'bg-primary-50',
      iconText: 'text-primary-600',
      hoverBg: 'group-hover:bg-primary-600',
      link: 'text-primary-600 hover:text-primary-800',
      badgeBg: 'bg-primary-100',
      stat: 'text-primary-600'
    },
    green: {
      iconBg: 'bg-green-50',
      iconText: 'text-green-600',
      hoverBg: 'group-hover:bg-green-600',
      link: 'text-green-600 hover:text-green-800',
      badgeBg: 'bg-green-100',
      stat: 'text-green-600'
    },
    yellow: {
      iconBg: 'bg-yellow-50',
      iconText: 'text-yellow-600',
      hoverBg: 'group-hover:bg-yellow-500',
      link: 'text-yellow-600 hover:text-yellow-800',
      badgeBg: 'bg-yellow-100',
      stat: 'text-yellow-600'
    }
  };

  const renderAuthenticatedDashboard = () => {
    return (
      <div className="bg-transparent min-h-screen pb-12">
        <div className="bg-gradient-to-b from-primary-600 to-primary-700 rounded-b-[4rem] pb-32 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-white rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] bg-primary-300 rounded-full blur-[100px]" />
          </div>

          <header className="py-16 relative z-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30 shadow-xl">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-white">
                    반가워요, {user.name}님
                  </h1>
                  <p className="mt-2 text-primary-100 text-xl font-medium opacity-90">
                    오늘도 선후배와 함께 멋진 커리어를 만들어가볼까요?
                  </p>
                </div>
              </div>
            </div>
          </header>
        </div>

        <main className="-mt-24 relative z-20">
          <div className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-10">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div className="bg-white overflow-hidden shadow-2xl rounded-[2.5rem] border border-gray-100 transition-all hover:scale-[1.02] duration-300 group">
                    <div className="p-8">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-primary-50 rounded-2xl p-5 group-hover:bg-primary-600 transition-colors duration-500">
                          <Award className="h-10 w-10 text-primary-600 group-hover:text-white transition-colors duration-500" />
                        </div>
                        <div className="ml-8 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-black text-gray-400 uppercase tracking-widest">나의 활동 포인트</dt>
                            <dd className="flex items-baseline mt-2">
                              <div className="text-4xl font-black text-gray-900 tracking-tight">
                                {dashboardData.points.toLocaleString()} <span className="text-xl font-bold text-primary-600">P</span>
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50/50 px-8 py-5 border-t border-gray-100">
                      <Link to="/profile/points" className="text-sm text-primary-600 hover:text-primary-800 font-black flex items-center transition-colors">
                        포인트 내역 확인 <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow-2xl rounded-[2.5rem] border border-gray-100 transition-all hover:scale-[1.02] duration-300 group">
                    <div className="p-8">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-50 rounded-2xl p-5 group-hover:bg-green-600 transition-colors duration-500">
                          <Coffee className="h-10 w-10 text-green-600 group-hover:text-white transition-colors duration-500" />
                        </div>
                        <div className="ml-8 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-black text-gray-400 uppercase tracking-widest">진행 중인 요청</dt>
                            <dd className="flex items-baseline mt-2">
                              <div className="text-4xl font-black text-gray-900 tracking-tight">
                                {dashboardData.mentoringRequests.filter((req) => req.status === 'REQUESTED' || req.status === 'ACCEPTED').length}{' '}
                                <span className="text-xl font-bold text-green-600">건</span>
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50/50 px-8 py-5 border-t border-gray-100">
                      <Link to="/profile" className="text-sm text-green-600 hover:text-green-800 font-black flex items-center transition-colors">
                        커피챗 관리하기 <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow-2xl rounded-[3rem] border border-gray-100 overflow-hidden">
                  <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-white to-gray-50/30">
                    <h3 className="text-2xl font-black text-gray-900 flex items-center">
                      <div className="bg-primary-100 p-2 rounded-xl mr-4">
                        <TrendingUp className="h-6 w-6 text-primary-600" />
                      </div>
                      실시간 커피챗 현황
                    </h3>
                    <Link to="/profile" className="text-sm font-black text-primary-600 hover:text-primary-800 bg-primary-50 px-4 py-2 rounded-xl transition-all">
                      전체보기
                    </Link>
                  </div>
                  <ul className="divide-y divide-gray-50">
                    {loading ? (
                      <li className="px-10 py-16 text-center text-gray-400">
                        <div className="animate-pulse flex flex-col items-center">
                          <div className="h-12 w-12 bg-gray-100 rounded-full mb-4" />
                          <div className="h-4 w-48 bg-gray-100 rounded-full mb-2" />
                          <div className="h-3 w-32 bg-gray-50 rounded-full" />
                        </div>
                      </li>
                    ) : dashboardData.mentoringRequests.length > 0 ? (
                      dashboardData.mentoringRequests.map((req) => (
                        <li key={req.id} className="px-10 py-6 hover:bg-primary-50/30 transition-all group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200 group-hover:border-primary-200 group-hover:bg-white transition-all">
                                <User className="h-7 w-7 text-gray-400 group-hover:text-primary-500" />
                              </div>
                              <div className="ml-6">
                                <p className="text-lg font-black text-gray-900 group-hover:text-primary-700 transition-colors">
                                  {user.role === 'STUDENT' ? `${req.mentorName} 멘토` : `${req.menteeName} 학생`}
                                </p>
                                <p className="text-sm font-bold text-gray-400 mt-1 flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                                  {new Date(req.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 bg-white px-5 py-2.5 rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                              {getStatusIcon(req.status)}
                              <span className="text-sm font-black text-gray-700 uppercase tracking-wider">{req.statusDescription || req.status}</span>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="px-10 py-24 text-center text-gray-500 flex flex-col items-center bg-gray-50/30">
                        <div className="bg-white p-6 rounded-full shadow-inner mb-6 border border-dashed border-gray-200">
                          <Coffee className="h-16 w-16 text-gray-200" />
                        </div>
                        <p className="text-xl font-black text-gray-400">아직 시작한 요청이 없습니다.</p>
                        <Link to="/mentoring" className="mt-6 text-primary-600 font-black hover:underline text-lg">
                          첫 번째 커피챗을 요청해보세요!
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="space-y-10">
                <div className="bg-white shadow-2xl rounded-[3rem] border border-gray-100 overflow-hidden p-2">
                  <div className="p-6 grid grid-cols-2 gap-4">
                    <Link to="/community/create" className="flex flex-col items-center justify-center p-6 rounded-[2rem] border border-gray-50 bg-gray-50/50 hover:bg-primary-600 hover:text-white transition-all duration-500 shadow-sm group">
                      <div className="bg-white p-3 rounded-2xl shadow-sm mb-3 group-hover:bg-primary-500 transition-colors">
                        <PlusCircle className="h-8 w-8 text-primary-600 group-hover:text-white" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">글쓰기</span>
                    </Link>
                    <Link to="/mentoring" className="flex flex-col items-center justify-center p-6 rounded-[2rem] border border-gray-50 bg-gray-50/50 hover:bg-primary-600 hover:text-white transition-all duration-500 shadow-sm group">
                      <div className="bg-white p-3 rounded-2xl shadow-sm mb-3 group-hover:bg-primary-500 transition-colors">
                        <Search className="h-8 w-8 text-primary-600 group-hover:text-white" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">멘토 찾기</span>
                    </Link>
                    <Link to="/profile" className="flex flex-col items-center justify-center p-6 rounded-[2rem] border border-gray-50 bg-gray-50/50 hover:bg-primary-600 hover:text-white transition-all duration-500 shadow-sm group">
                      <div className="bg-white p-3 rounded-2xl shadow-sm mb-3 group-hover:bg-primary-500 transition-colors">
                        <User className="h-8 w-8 text-primary-600 group-hover:text-white" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">프로필</span>
                    </Link>
                    <Link to="/community" className="flex flex-col items-center justify-center p-6 rounded-[2rem] border border-gray-50 bg-gray-50/50 hover:bg-primary-600 hover:text-white transition-all duration-500 shadow-sm group">
                      <div className="bg-white p-3 rounded-2xl shadow-sm mb-3 group-hover:bg-primary-500 transition-colors">
                        <MessageSquare className="h-8 w-8 text-primary-600 group-hover:text-white" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">게시판</span>
                    </Link>
                  </div>
                </div>

                <div className="bg-white shadow-2xl rounded-[3rem] border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
                    <h3 className="text-lg font-black text-gray-900 flex items-center uppercase tracking-widest">
                      <Bell className="mr-3 h-5 w-5 text-primary-600" />
                      최신 피드
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {loading ? (
                      <div className="px-8 py-10 text-center text-gray-400 text-sm font-medium">소식을 가져오는 중...</div>
                    ) : dashboardData.recentPosts.length > 0 ? (
                      dashboardData.recentPosts.map((post) => (
                        <Link key={post.id} to={`/community/${post.id}`} className="block px-8 py-6 hover:bg-primary-50/30 transition-all group">
                          <p className="text-base font-black text-gray-900 truncate mb-2 group-hover:text-primary-700">{post.title}</p>
                          <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg mr-3 border border-gray-200">{post.category}</span>
                            <span>{post.authorName}</span>
                            <span className="mx-2 opacity-30">/</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="px-8 py-12 text-center text-gray-500 text-sm font-bold">새로운 글이 없습니다.</div>
                    )}
                    <div className="px-8 py-5 bg-gray-50/80 text-center">
                      <Link to="/community" className="text-sm font-black text-primary-600 hover:text-primary-800 transition-colors uppercase tracking-widest">
                        커뮤니티 전체보기
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };

  const renderUnauthenticatedLanding = () => {
    return (
      <div className="bg-transparent min-h-screen pb-12">
        <div className="bg-gradient-to-b from-primary-600 to-primary-700 rounded-b-[4rem] pb-32 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-white rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] bg-primary-300 rounded-full blur-[100px]" />
          </div>

          <header className="py-16 relative z-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="max-w-3xl animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30 shadow-xl">
                    <GraduationCap className="h-10 w-10 text-white" />
                  </div>
                  <span className="text-sm font-black text-primary-100 uppercase tracking-[0.25em]">Grad-Link</span>
                </div>
                <h1 className="mt-8 text-4xl font-black tracking-tight text-white sm:text-5xl">
                  선배와 교수님을 더 가까이 만나는 커리어 홈
                </h1>
                <p className="mt-4 text-primary-100 text-xl font-medium opacity-90">
                  로그인하면 멘토링 요청, 커뮤니티 글, 포인트 활동을 한 화면에서 바로 이어갈 수 있습니다.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to="/signup"
                    className="inline-flex items-center rounded-2xl bg-white px-6 py-3 text-sm font-black text-primary-700 shadow-xl transition-all hover:bg-primary-50"
                  >
                    시작하기 <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-black text-white backdrop-blur-md transition-all hover:bg-white/20"
                  >
                    로그인
                  </Link>
                </div>
              </div>
            </div>
          </header>
        </div>

        <main className="-mt-24 relative z-20">
          <div className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-10">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                  {featureCards.map((feature) => {
                    const Icon = feature.icon;
                    const styles = colorClasses[feature.color];

                    return (
                      <div key={feature.title} className="bg-white overflow-hidden shadow-2xl rounded-[2.5rem] border border-gray-100 transition-all hover:scale-[1.02] duration-300 group">
                        <div className="p-8">
                          <div className={`${styles.iconBg} ${styles.hoverBg} inline-flex rounded-2xl p-5 transition-colors duration-500`}>
                            <Icon className={`h-9 w-9 ${styles.iconText} group-hover:text-white transition-colors duration-500`} />
                          </div>
                          <p className={`mt-7 text-4xl font-black tracking-tight ${styles.stat}`}>{feature.stat}</p>
                          <h2 className="mt-2 text-lg font-black text-gray-900">{feature.title}</h2>
                          <p className="mt-3 text-sm font-semibold leading-6 text-gray-500">{feature.description}</p>
                        </div>
                        <div className="bg-gray-50/50 px-8 py-5 border-t border-gray-100">
                          <Link to="/login" className={`text-sm font-black flex items-center transition-colors ${styles.link}`}>
                            로그인 후 이용 <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white shadow-2xl rounded-[3rem] border border-gray-100 overflow-hidden">
                  <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-white to-gray-50/30">
                    <h3 className="text-2xl font-black text-gray-900 flex items-center">
                      <div className="bg-primary-100 p-2 rounded-xl mr-4">
                        <TrendingUp className="h-6 w-6 text-primary-600" />
                      </div>
                      로그인 후 바로 이어지는 활동
                    </h3>
                    <Link to="/signup" className="text-sm font-black text-primary-600 hover:text-primary-800 bg-primary-50 px-4 py-2 rounded-xl transition-all">
                      가입하기
                    </Link>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {[
                      ['멘토를 찾고 커피챗 요청을 보낼 수 있어요.', Coffee],
                      ['커뮤니티에서 진로 질문과 정보를 공유할 수 있어요.', MessageSquare],
                      ['활동 포인트와 내 요청 현황을 홈에서 확인할 수 있어요.', Award]
                    ].map(([text, Icon]) => (
                      <div key={text} className="px-10 py-6 hover:bg-primary-50/30 transition-all group">
                        <div className="flex items-center">
                          <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200 group-hover:border-primary-200 group-hover:bg-white transition-all">
                            <Icon className="h-7 w-7 text-gray-400 group-hover:text-primary-500" />
                          </div>
                          <p className="ml-6 text-lg font-black text-gray-900 group-hover:text-primary-700 transition-colors">
                            {text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div className="bg-white shadow-2xl rounded-[3rem] border border-gray-100 overflow-hidden p-2">
                  <div className="p-6 grid grid-cols-2 gap-4">
                    <Link to="/login" className="flex flex-col items-center justify-center p-6 rounded-[2rem] border border-gray-50 bg-gray-50/50 hover:bg-primary-600 hover:text-white transition-all duration-500 shadow-sm group">
                      <div className="bg-white p-3 rounded-2xl shadow-sm mb-3 group-hover:bg-primary-500 transition-colors">
                        <PlusCircle className="h-8 w-8 text-primary-600 group-hover:text-white" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">글쓰기</span>
                    </Link>
                    <Link to="/login" className="flex flex-col items-center justify-center p-6 rounded-[2rem] border border-gray-50 bg-gray-50/50 hover:bg-primary-600 hover:text-white transition-all duration-500 shadow-sm group">
                      <div className="bg-white p-3 rounded-2xl shadow-sm mb-3 group-hover:bg-primary-500 transition-colors">
                        <Search className="h-8 w-8 text-primary-600 group-hover:text-white" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">멘토 찾기</span>
                    </Link>
                    <Link to="/login" className="flex flex-col items-center justify-center p-6 rounded-[2rem] border border-gray-50 bg-gray-50/50 hover:bg-primary-600 hover:text-white transition-all duration-500 shadow-sm group">
                      <div className="bg-white p-3 rounded-2xl shadow-sm mb-3 group-hover:bg-primary-500 transition-colors">
                        <User className="h-8 w-8 text-primary-600 group-hover:text-white" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">프로필</span>
                    </Link>
                    <Link to="/login" className="flex flex-col items-center justify-center p-6 rounded-[2rem] border border-gray-50 bg-gray-50/50 hover:bg-primary-600 hover:text-white transition-all duration-500 shadow-sm group">
                      <div className="bg-white p-3 rounded-2xl shadow-sm mb-3 group-hover:bg-primary-500 transition-colors">
                        <MessageSquare className="h-8 w-8 text-primary-600 group-hover:text-white" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">게시판</span>
                    </Link>
                  </div>
                </div>

                <div className="bg-white shadow-2xl rounded-[3rem] border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
                    <h3 className="text-lg font-black text-gray-900 flex items-center uppercase tracking-widest">
                      <Bell className="mr-3 h-5 w-5 text-primary-600" />
                      미리 보는 홈
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-50">
                    <div className="px-8 py-6">
                      <p className="text-base font-black text-gray-900 mb-2">나의 커피챗 요청</p>
                      <p className="text-sm font-semibold text-gray-500">요청 상태와 일정이 이곳에 표시됩니다.</p>
                    </div>
                    <div className="px-8 py-6">
                      <p className="text-base font-black text-gray-900 mb-2">최신 커뮤니티 글</p>
                      <p className="text-sm font-semibold text-gray-500">관심 있는 글을 빠르게 확인할 수 있습니다.</p>
                    </div>
                    <div className="px-8 py-5 bg-gray-50/80 text-center">
                      <Link to="/login" className="text-sm font-black text-primary-600 hover:text-primary-800 transition-colors uppercase tracking-widest">
                        로그인하고 시작하기
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };

  return user ? renderAuthenticatedDashboard() : renderUnauthenticatedLanding();
};

export default LandingPage;
