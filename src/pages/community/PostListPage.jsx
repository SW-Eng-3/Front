import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { communityApi } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import {
  MessageSquare,
  User,
  Clock,
  Plus,
  Pin,
  AlertCircle,
  Search,
} from "lucide-react";
import { POST_CATEGORY, POST_CATEGORY_LABELS } from "../../utils/constants";

const PostListSkeleton = () => (
  <ul className="divide-y divide-gray-50">
    {[1, 2, 3, 4, 5].map((i) => (
      <li key={i} className="px-8 py-6 animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 w-2/3">
            <div className="h-4 w-12 bg-gray-200 rounded-md"></div>
            <div className="h-6 w-full bg-gray-200 rounded-md"></div>
          </div>
          <div className="h-5 w-16 bg-gray-100 rounded-full"></div>
        </div>
        <div className="h-4 w-full bg-gray-100 rounded-md mb-2"></div>
        <div className="h-4 w-3/4 bg-gray-100 rounded-md mb-5"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gray-200"></div>
              <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
            </div>
            <div className="h-4 w-10 bg-gray-200 rounded-md"></div>
          </div>
          <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
        </div>
      </li>
    ))}
  </ul>
);

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [category, debouncedSearchTerm, user]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await communityApi.getPosts({
        category: category || undefined,
        keyword: debouncedSearchTerm || undefined,
      });
      const responseData = response.data;

      let postsArray = [];
      if (Array.isArray(responseData)) {
        postsArray = responseData;
      } else if (responseData?.content) {
        postsArray = responseData.content;
      }

      const sortedPosts = postsArray.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Failed to fetch posts", error);
      setError("게시글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading)
    return (
      <div className="p-8 text-center text-gray-500 font-bold animate-pulse">
        인증 확인 중...
      </div>
    );
  if (!user) return null;

  const categories = [
    { value: "", label: "전체" },
    { value: POST_CATEGORY.QA, label: POST_CATEGORY_LABELS[POST_CATEGORY.QA] },
    {
      value: POST_CATEGORY.FREE,
      label: POST_CATEGORY_LABELS[POST_CATEGORY.FREE],
    },
    {
      value: POST_CATEGORY.JOB,
      label: POST_CATEGORY_LABELS[POST_CATEGORY.JOB],
    },
    {
      value: POST_CATEGORY.PROFESSOR_NOTICE,
      label: POST_CATEGORY_LABELS[POST_CATEGORY.PROFESSOR_NOTICE],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            지식 공유 커뮤니티
          </h1>
          <p className="text-gray-500 mt-2 text-lg font-medium">
            선배, 후배, 교수님과 함께 지식을 나눠보세요.
          </p>
        </div>
        <Link
          to="/community/create"
          className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-primary-600 text-white font-black text-sm shadow-lg shadow-primary-600/30 transition-all duration-200 hover:bg-primary-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
        >
          <Plus className="h-5 w-5 mr-2" />새 글 작성하기
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-4 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="궁금한 내용을 검색해보세요"
            className="block w-full pl-14 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-6 py-3.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${
                category === cat.value
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:bg-primary-50 active:scale-95"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-[2rem] overflow-hidden border border-gray-100">
        {loading ? (
          <PostListSkeleton />
        ) : error ? (
          <div className="py-24 text-center px-4 bg-red-50/30">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-gray-800 font-bold">{error}</p>
            <button
              onClick={fetchPosts}
              className="mt-4 text-primary-600 font-black hover:text-primary-800 transition-colors"
            >
              다시 시도하기
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {posts.map((post) => (
              <li
                key={post.id}
                className="transition-all hover:bg-primary-50/30 group"
              >
                <Link to={`/community/${post.id}`} className="block">
                  <div className="px-8 py-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {post.category === POST_CATEGORY.PROFESSOR_NOTICE && (
                          <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-black uppercase tracking-wider">
                            공지
                          </span>
                        )}
                        {post.isPinned && (
                          <Pin className="h-4 w-4 text-primary-600 fill-primary-600" />
                        )}
                        <h2 className="text-xl font-bold text-gray-900 truncate max-w-2xl group-hover:text-primary-700 transition-colors">
                          {post.title}
                        </h2>
                      </div>
                      <span className="px-3 py-1.5 text-[11px] font-black tracking-widest uppercase rounded-xl bg-gray-100 text-gray-500 border border-gray-200">
                        {POST_CATEGORY_LABELS[post.category] || post.category}
                      </span>
                    </div>
                    <p className="text-gray-500 font-medium text-sm line-clamp-1 mb-5">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center text-sm text-gray-500">
                          <div className="h-8 w-8 rounded-xl bg-primary-50 flex items-center justify-center mr-3 border border-primary-100 group-hover:bg-primary-100 transition-colors">
                            <User className="h-4 w-4 text-primary-600" />
                          </div>
                          <span className="font-bold text-gray-700">
                            {post.anonymous ? "익명" : post.authorName}
                          </span>
                          {!post.anonymous && post.authorRole && (
                            <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-black bg-white text-gray-500 border border-gray-200 shadow-sm">
                              {post.authorRole === "STUDENT"
                                ? "재학생"
                                : post.authorRole === "GRADUATE"
                                  ? "졸업생"
                                  : post.authorRole === "PROFESSOR"
                                    ? "교수"
                                    : "관리자"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-400 font-bold">
                          <MessageSquare className="h-4 w-4 mr-1.5" />
                          <span>{post.comments?.length || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-400 font-bold">
                        <Clock className="h-4 w-4 mr-1.5" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
            {posts.length === 0 && (
              <li className="px-6 py-32 text-center flex flex-col items-center">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-6">
                  <Search className="h-12 w-12 text-gray-300" />
                </div>
                <p className="text-gray-900 text-xl font-black">
                  검색 결과가 없습니다.
                </p>
                <p className="text-gray-500 text-sm mt-2 font-medium">
                  다른 검색어나 카테고리를 선택해보세요.
                </p>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PostListPage;
