import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { communityApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, User, Clock, Plus, Pin, AlertCircle, Search } from 'lucide-react';
import { POST_CATEGORY, POST_CATEGORY_LABELS } from '../../utils/constants';

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [category, searchTerm, user]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await communityApi.getPosts({
        category: category || undefined,
        keyword: searchTerm || undefined,
      });
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        setPosts(responseData);
      } else if (responseData?.content) {
        setPosts(responseData.content);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Failed to fetch posts', error);
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) return <div className="p-8 text-center text-gray-500">인증 확인 중...</div>;
  if (!user) return null;

  const categories = [
    { value: '', label: '전체' },
    { value: POST_CATEGORY.QA, label: POST_CATEGORY_LABELS[POST_CATEGORY.QA] },
    { value: POST_CATEGORY.FREE, label: POST_CATEGORY_LABELS[POST_CATEGORY.FREE] },
    { value: POST_CATEGORY.JOB, label: POST_CATEGORY_LABELS[POST_CATEGORY.JOB] },
    { value: POST_CATEGORY.PROFESSOR_NOTICE, label: POST_CATEGORY_LABELS[POST_CATEGORY.PROFESSOR_NOTICE] },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">지식 공유 커뮤니티</h1>
          <p className="text-gray-500 mt-2 text-lg">선배, 후배, 교수님과 함께 지식을 나눠보세요.</p>
        </div>
        <Link
          to="/community/create"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-2xl shadow-lg text-white bg-primary-600 hover:bg-primary-700 transition-all transform hover:-translate-y-1 active:scale-95"
        >
          <Plus className="h-5 w-5 mr-2" />
          새 글 작성하기
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="궁금한 내용을 검색해보세요"
            className="pl-12 block w-full rounded-2xl border-gray-200 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm border p-3.5 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                category === cat.value
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-200 hover:bg-primary-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
        {loading ? (
          <div className="py-32 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-100 border-t-primary-600 mb-4"></div>
            <p className="text-gray-400 font-medium">게시글을 가져오는 중...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center px-4">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">{error}</p>
            <button onClick={fetchPosts} className="mt-4 text-primary-600 font-bold hover:underline">다시 시도하기</button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {filteredPosts.map((post) => (
              <li key={post.id} className="transition-all hover:bg-primary-50/30">
                <Link to={`/community/${post.id}`} className="block">
                  <div className="px-8 py-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {post.category === POST_CATEGORY.PROFESSOR_NOTICE && (
                          <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-black uppercase tracking-wider">공지</span>
                        )}
                        {post.isPinned && <Pin className="h-4 w-4 text-primary-600 fill-primary-600" />}
                        <h2 className="text-xl font-bold text-gray-900 truncate max-w-2xl group-hover:text-primary-600 transition-colors">
                          {post.title}
                        </h2>
                      </div>
                      <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                        {POST_CATEGORY_LABELS[post.category] || post.category}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-1 mb-5">{post.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center text-sm text-gray-500">
                          <div className="h-7 w-7 rounded-full bg-primary-50 flex items-center justify-center mr-2.5 border border-primary-100">
                            <User className="h-4 w-4 text-primary-600" />
                          </div>
                          <span className="font-bold text-gray-700">
                            {post.anonymous ? '익명' : post.authorName}
                          </span>
                          {!post.anonymous && post.authorRole && (
                            <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                              {post.authorRole === 'STUDENT' ? '재학생' : 
                               post.authorRole === 'GRADUATE' ? '졸업생' : 
                               post.authorRole === 'PROFESSOR' ? '교수' : '관리자'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <MessageSquare className="h-4 w-4 mr-1.5" />
                          <span className="font-bold">{post.comments?.length || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-400 font-medium">
                        <Clock className="h-4 w-4 mr-1.5" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
            {filteredPosts.length === 0 && (
              <li className="px-6 py-32 text-center flex flex-col items-center">
                <div className="bg-gray-50 p-6 rounded-full mb-6">
                  <Search className="h-12 w-12 text-gray-200" />
                </div>
                <p className="text-gray-500 text-lg font-bold">검색 결과가 없습니다.</p>
                <p className="text-gray-400 text-sm mt-2">다른 검색어나 카테고리를 선택해보세요.</p>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PostListPage;
