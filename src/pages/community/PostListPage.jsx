import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, User, Clock, Plus } from 'lucide-react';

const PostListPage = () => {
  const [posts, setPosts] = useState([]); // 게시글 목록 상태
  const [category, setCategory] = useState(''); // 현재 선택된 카테고리 필터
  const { user } = useAuth(); // 현재 로그인한 사용자 정보

  // 카테고리가 바뀔 때마다 게시글 목록을 다시 가져옴
  useEffect(() => {
    fetchPosts();
  }, [category]);

  // 서버에서 게시글 목록을 가져오는 함수
  const fetchPosts = async () => {
    try {
      // 카테고리가 있으면 쿼리 파라미터로 전달
      const response = await api.get('/posts', { params: { category: category || undefined } });
      setPosts(response.data);
    } catch (error) {
      console.error('게시글을 가져오는데 실패했습니다.', error);
    }
  };

  // UI에 표시할 카테고리 옵션들
  const categories = [
    { value: '', label: '전체' },
    { value: 'QNA', label: '질문답변' },
    { value: 'FREE', label: '자유게시판' },
    { value: 'JOB', label: '취업/진로' },
    { value: 'NOTICE', label: '공지사항' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 상단 헤더: 제목과 글쓰기 버튼 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">커뮤니티</h1>
        {user && (
          <Link
            to="/community/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            글쓰기
          </Link>
        )}
      </div>

      {/* 카테고리 탭 필터 */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              category === cat.value
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 게시글 리스트 카드 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={`/community/${post.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-primary-600 truncate">
                      {/* 공지사항인 경우 별도 표시 */}
                      {post.category === 'NOTICE' && <span className="mr-2 px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">공지</span>}
                      {post.title}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {post.category}
                      </p>
                    </div>
                  </div>
                  {/* 메타 정보: 작성자, 댓글 수, 작성일 */}
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {post.isAnonymous ? '익명' : post.authorName}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <MessageSquare className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {post.comments?.length || 0}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <p>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
          {/* 게시글이 없는 경우 처리 */}
          {posts.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              게시글이 없습니다.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PostListPage;
