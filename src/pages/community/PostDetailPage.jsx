import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { communityApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { User, Clock, ArrowLeft, Send, Award, Pin, ShieldAlert, MessageCircle } from 'lucide-react';
import { POST_CATEGORY_LABELS } from '../../utils/constants';
import ReportModal from '../../components/community/ReportModal';

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await communityApi.getPost(postId);
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
    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    try {
      await communityApi.addComment(postId, { content: commentContent.trim() });
      setCommentContent('');
      await fetchPost();
      alert('답변이 등록되었습니다!');
    } catch (error) {
      console.error('Failed to add comment', error);
      const msg = error.response?.data?.message || '답변 등록에 실패했습니다.';
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecommend = async (commentId) => {
    try {
      await communityApi.recommendComment(commentId, true);
      fetchPost();
    } catch (error) {
      console.error('Failed to recommend comment', error);
    }
  };

  const handlePin = async () => {
    try {
      await communityApi.pinPost(postId, !post.isPinned);
      fetchPost();
    } catch (error) {
      console.error('Failed to pin post', error);
    }
  };

  const getRoleLabel = (role) => {
    const roles = {
      STUDENT: '재학생',
      GRADUATE: '졸업생',
      PROFESSOR: '교수',
      ADMIN: '관리자'
    };
    return roles[role] || role;
  };

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-100 border-t-primary-600"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors"
        >
          <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 mr-3 group-hover:border-primary-100 group-hover:bg-primary-50">
            <ArrowLeft className="h-4 w-4" />
          </div>
          목록으로 돌아가기
        </button>
        <button
          onClick={() => setReportTarget({ id: post.id, type: 'POST' })}
          className="flex items-center text-xs font-bold text-red-400 hover:text-red-600 transition-colors bg-red-50 px-3 py-1.5 rounded-lg border border-red-100"
        >
          <ShieldAlert className="h-4 w-4 mr-1.5" />
          게시글 신고
        </button>
      </div>

      <article className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 mb-12">
        <div className="px-8 py-10 border-b border-gray-50 bg-gradient-to-b from-gray-50/50 to-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 text-xs font-black rounded-lg bg-primary-100 text-primary-700 tracking-wider">
                {POST_CATEGORY_LABELS[post.category] || post.category}
              </span>
              {post.isPinned && (
                <span className="flex items-center text-xs font-black text-white bg-primary-600 px-3 py-1 rounded-lg shadow-sm">
                  <Pin className="h-3.5 w-3.5 mr-1.5 fill-white" />
                  상단 고정됨
                </span>
              )}
            </div>
            <div className="flex items-center text-xs font-bold text-gray-400 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>
          
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-4xl font-black text-gray-900 leading-tight flex-1">{post.title}</h1>
            {(user?.role === 'PROFESSOR' || user?.role === 'ADMIN') && (
              <button
                onClick={handlePin}
                className={`p-3 rounded-2xl transition-all shadow-sm border ${
                  post.isPinned 
                    ? 'text-white bg-primary-600 border-primary-600' 
                    : 'text-gray-400 bg-white border-gray-100 hover:border-primary-200 hover:text-primary-600'
                }`}
                title={post.isPinned ? "고정 해제" : "상단 고정"}
              >
                <Pin className="h-6 w-6" />
              </button>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-2xl bg-primary-50 flex items-center justify-center border border-primary-100 mr-4">
                <User className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-base font-black text-gray-900">
                  {post.anonymous ? '익명 사용자' : post.authorName}
                </p>
                {!post.anonymous && post.authorRole && (
                  <p className="text-xs font-bold text-primary-600 mt-0.5">
                    {getRoleLabel(post.authorRole)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-8 py-12 text-gray-800 leading-relaxed text-lg whitespace-pre-line font-medium">
          {post.content}
        </div>
      </article>

      <section className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-gray-900 flex items-center">
            <MessageCircle className="h-7 w-7 mr-3 text-primary-600" />
            전체 답변 <span className="ml-2 text-primary-600 bg-primary-50 px-3 py-0.5 rounded-full text-lg">{post.comments?.length || 0}</span>
          </h2>
        </div>

        <div className="space-y-8 mb-16">
          {post.comments?.map((comment) => (
            <div 
              key={comment.id} 
              className={`bg-white p-8 rounded-3xl shadow-xl transition-all border ${
                comment.isRecommended 
                  ? 'ring-4 ring-primary-500/10 border-primary-200' 
                  : 'border-gray-100'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center mr-4 border border-gray-100">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="text-base font-black text-gray-900">{comment.authorName}</p>
                      {comment.authorRole && (
                        <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                          {getRoleLabel(comment.authorRole)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-gray-400 mt-1">{new Date(comment.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {comment.isRecommended && (
                    <span className="flex items-center text-xs font-black text-white bg-primary-600 px-3 py-1.5 rounded-lg shadow-sm">
                      <Award className="h-4 w-4 mr-1.5 fill-white" />
                      베스트 답변
                    </span>
                  )}
                  {!comment.isRecommended && (user?.role === 'GRADUATE' || user?.role === 'ADMIN') && (
                    <button
                      onClick={() => handleRecommend(comment.id)}
                      className="text-xs font-black text-primary-600 hover:bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100 transition-colors"
                    >
                      베스트 지정
                    </button>
                  )}
                  <button
                    onClick={() => setReportTarget({ id: comment.id, type: 'COMMENT' })}
                    className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                    title="신고"
                  >
                    <ShieldAlert className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 text-base leading-relaxed font-medium whitespace-pre-line bg-gray-50/50 p-5 rounded-2xl">
                {comment.content}
              </p>
            </div>
          ))}
          {(!post.comments || post.comments.length === 0) && (
            <div className="bg-white py-20 rounded-3xl shadow-lg border border-dashed border-gray-200 text-center">
              <MessageCircle className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-bold text-lg">아직 답변이 없습니다.</p>
              <p className="text-gray-400 text-sm mt-1">첫 번째 조언의 주인공이 되어보세요!</p>
            </div>
          )}
        </div>

        {user && (
          <form onSubmit={handleCommentSubmit} className="bg-white p-8 rounded-3xl shadow-2xl border border-primary-100 ring-4 ring-primary-50/50">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center">
              <Send className="h-5 w-5 mr-2 text-primary-600" />
              답변 남기기
            </h3>
            <textarea
              id="comment"
              rows={5}
              className="block w-full rounded-2xl border-gray-200 shadow-inner focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base border p-5 transition-all"
              placeholder="따뜻한 조언이나 의견을 남겨주세요..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              required
            ></textarea>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-8 py-3.5 border border-transparent text-base font-black rounded-2xl shadow-xl text-white bg-primary-600 hover:bg-primary-700 transition-all transform hover:-translate-y-1 active:scale-95"
              >
                <Send className="h-5 w-5 mr-2" />
                답변 등록하기
              </button>
            </div>
          </form>
        )}
      </section>

      {reportTarget && (
        <ReportModal
          targetId={reportTarget.id}
          targetType={reportTarget.type}
          onClose={() => setReportTarget(null)}
        />
      )}
    </div>
  );
};

export default PostDetailPage;
