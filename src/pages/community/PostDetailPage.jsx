import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { User, Clock, ArrowLeft, Send, Award } from 'lucide-react';

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${postId}`);
      setPost(response.data);
    } catch (error) {
      console.error('Failed to fetch post', error);
      alert('게시글을 찾을 수 없습니다.');
      navigate('/community');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    try {
      await api.post(`/posts/${postId}/comments`, { content: commentContent });
      setCommentContent('');
      fetchPost();
    } catch (error) {
      console.error('Failed to add comment', error);
    }
  };

  const handleRecommend = async (commentId) => {
    try {
      await api.patch(`/posts/comments/${commentId}/recommend`, null, { params: { isRecommended: true } });
      fetchPost();
    } catch (error) {
      console.error('Failed to recommend comment', error);
    }
  };

  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        뒤로가기
      </button>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
              {post.category}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center text-sm text-gray-500">
            <User className="h-5 w-5 mr-2" />
            <span className="font-medium text-gray-900 mr-2">
              {post.isAnonymous ? '익명' : post.authorName}
            </span>
          </div>
        </div>
        <div className="px-6 py-8 prose max-w-none text-gray-800">
          {post.content.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Send className="h-5 w-5 mr-2" />
          답변 {post.comments?.length || 0}
        </h2>

        <div className="space-y-6 mb-12">
          {post.comments?.map((comment) => (
            <div key={comment.id} className={`bg-white p-6 rounded-lg shadow ${comment.isRecommended ? 'ring-2 ring-primary-500' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{comment.authorName}</p>
                    <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {comment.isRecommended && (
                  <span className="flex items-center text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                    <Award className="h-4 w-4 mr-1" />
                    우수 답변
                  </span>
                )}
                {!comment.isRecommended && (user?.role === 'GRADUATE' || user?.role === 'ADMIN') && (
                  <button
                    onClick={() => handleRecommend(comment.id)}
                    className="text-xs text-primary-600 hover:text-primary-800 font-medium"
                  >
                    우수 답변으로 지정
                  </button>
                )}
              </div>
              <p className="text-gray-800 text-sm whitespace-pre-line">{comment.content}</p>
            </div>
          ))}
          {post.comments?.length === 0 && (
            <p className="text-center text-gray-500 py-8">첫 번째 답변을 남겨보세요!</p>
          )}
        </div>

        {user && (
          <form onSubmit={handleCommentSubmit} className="bg-white p-6 rounded-lg shadow">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              답변 작성하기
            </label>
            <textarea
              id="comment"
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-3"
              placeholder="내용을 입력하세요..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              required
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                답변 등록
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
