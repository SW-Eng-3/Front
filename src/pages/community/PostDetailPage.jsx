import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { communityApi } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Clock,
  ArrowLeft,
  Send,
  Award,
  Pin,
  ShieldAlert,
  MessageCircle,
  MoreVertical,
  Trash2,
  Edit2,
} from "lucide-react";
import { POST_CATEGORY_LABELS } from "../../utils/constants";
import ReportModal from "../../components/community/ReportModal";
import toast from "react-hot-toast";

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState("");
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
      console.error("Failed to fetch post", error);
      toast.error("게시글을 찾을 수 없습니다.");
      navigate("/community");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    try {
      await communityApi.addComment(postId, { content: commentContent.trim() });
      setCommentContent("");
      await fetchPost();
      toast.success("댓글이 등록되었습니다.");
    } catch (error) {
      console.error("Failed to add comment", error);
      toast.error(error.response?.data?.message || "댓글 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecommend = async (commentId) => {
    try {
      await communityApi.recommendComment(commentId, true);
      toast.success("채택되었습니다!");
      fetchPost();
    } catch (error) {
      console.error("Failed to recommend comment", error);
      toast.error("채택 처리에 실패했습니다.");
    }
  };

  const handlePin = async () => {
    try {
      await communityApi.pinPost(postId, !post.isPinned);
      toast.success(
        post.isPinned ? "고정이 해제되었습니다." : "게시글이 고정되었습니다.",
      );
      fetchPost();
    } catch (error) {
      console.error("Failed to pin post", error);
      toast.error("상태 변경에 실패했습니다.");
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;
    try {
      await communityApi.deletePost(postId);
      toast.success("게시글이 삭제되었습니다.");
      navigate("/community");
    } catch (error) {
      console.error("Failed to delete post", error);
      toast.error("삭제에 실패했습니다.");
    }
  };

  const getRoleLabel = (role) => {
    const roles = {
      STUDENT: "재학생",
      GRADUATE: "졸업생",
      PROFESSOR: "교수",
      ADMIN: "관리자",
    };
    return roles[role] || role;
  };

  if (!post)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
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
          <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 mr-3 group-hover:border-primary-200 group-hover:bg-primary-50 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </div>
          목록으로
        </button>
        <button
          onClick={() => setReportTarget({ id: post.id, type: "POST" })}
          className="flex items-center text-xs font-bold text-red-400 hover:text-red-600 transition-colors bg-white hover:bg-red-50 px-4 py-2 rounded-xl border border-gray-200 hover:border-red-200 shadow-sm"
        >
          <ShieldAlert className="h-4 w-4 mr-1.5" />
          신고하기
        </button>
      </div>

      <article className="bg-white shadow-xl rounded-[2rem] overflow-hidden border border-gray-100 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="px-10 py-10 border-b border-gray-100 bg-gray-50/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="px-4 py-1.5 text-xs font-black rounded-xl bg-primary-100 text-primary-700 tracking-wider">
                {POST_CATEGORY_LABELS[post.category] || post.category}
              </span>
              {post.isPinned && (
                <span className="flex items-center text-xs font-black text-white bg-primary-600 px-3 py-1.5 rounded-xl shadow-sm">
                  <Pin className="h-3.5 w-3.5 mr-1.5 fill-white" />
                  고정됨
                </span>
              )}
            </div>
            <div className="flex items-center text-xs font-bold text-gray-400 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="flex justify-between items-start gap-4">
            <h1 className="text-3xl font-black text-gray-900 leading-tight flex-1">
              {post.title}
            </h1>
            {(user?.role === "PROFESSOR" || user?.role === "ADMIN") && (
              <button
                onClick={handlePin}
                className={`p-3 rounded-2xl transition-all shadow-sm border active:scale-95 ${
                  post.isPinned
                    ? "text-white bg-primary-600 border-primary-600"
                    : "text-gray-400 bg-white border-gray-200 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50"
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
                  {post.anonymous ? "익명" : post.authorName}
                </p>
                {!post.anonymous && post.authorRole && (
                  <p className="text-xs font-bold text-primary-600 mt-0.5">
                    {getRoleLabel(post.authorRole)}
                  </p>
                )}
              </div>
            </div>
            {(user?.userId === post.authorId || user?.id === post.authorId) && (
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    navigate("/community/create", { state: { post } })
                  }
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-black rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95 flex items-center"
                >
                  <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                  수정
                </button>
                <button
                  onClick={handleDeletePost}
                  className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-black rounded-xl hover:bg-red-50 transition-all shadow-sm active:scale-95 flex items-center"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-10 py-12 text-gray-800 leading-relaxed text-lg whitespace-pre-line font-medium min-h-[200px]">
          {post.content}
        </div>
      </article>

      <section className="mt-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-gray-900 flex items-center">
            <MessageCircle className="h-7 w-7 mr-3 text-primary-600" />
            댓글
            <span className="ml-3 text-primary-600 bg-primary-50 px-3.5 py-1 rounded-full text-base border border-primary-100">
              {post.comments?.length || 0}
            </span>
          </h2>
        </div>

        <div className="space-y-6 mb-16">
          {post.comments?.map((comment) => (
            <div
              key={comment.id}
              className={`bg-white p-8 rounded-[2rem] shadow-md transition-all border ${
                comment.isRecommended
                  ? "ring-4 ring-primary-500/10 border-primary-300 bg-primary-50/10"
                  : "border-gray-100"
              }`}
            >
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center mr-4 border border-gray-200">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-black text-gray-900">
                        {comment.authorName}
                      </p>
                      {comment.authorRole && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-black tracking-widest bg-gray-100 text-gray-500 border border-gray-200 uppercase">
                          {getRoleLabel(comment.authorRole)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-gray-400 mt-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {comment.isRecommended && (
                    <span className="flex items-center text-xs font-black text-white bg-primary-600 px-3 py-1.5 rounded-xl shadow-sm">
                      <Award className="h-4 w-4 mr-1.5 fill-white" />
                      채택됨
                    </span>
                  )}
                  {!comment.isRecommended &&
                    (user?.role === "GRADUATE" || user?.role === "ADMIN") && (
                      <button
                        onClick={() => handleRecommend(comment.id)}
                        className="text-xs font-black text-primary-600 bg-white hover:bg-primary-50 px-3 py-1.5 rounded-xl border border-primary-200 transition-colors active:scale-95"
                      >
                        채택하기
                      </button>
                    )}
                  <button
                    onClick={() =>
                      setReportTarget({ id: comment.id, type: "COMMENT" })
                    }
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="신고"
                  >
                    <ShieldAlert className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 text-base leading-relaxed font-medium whitespace-pre-line bg-gray-50 px-5 py-4 rounded-2xl border border-gray-100">
                {comment.content}
              </p>
            </div>
          ))}

          {(!post.comments || post.comments.length === 0) && (
            <div className="bg-white py-20 rounded-[2rem] shadow-sm border border-dashed border-gray-200 text-center">
              <MessageCircle className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-bold text-lg">
                아직 등록된 댓글이 없습니다.
              </p>
              <p className="text-gray-400 text-sm mt-1 font-medium">
                첫 번째 댓글을 남겨보세요!
              </p>
            </div>
          )}
        </div>

        {user && (
          <form
            onSubmit={handleCommentSubmit}
            className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100"
          >
            <h3 className="text-lg font-black text-gray-900 mb-5 flex items-center">
              <Send className="h-5 w-5 mr-2 text-primary-600" />
              댓글 작성
            </h3>
            <textarea
              id="comment"
              rows={4}
              className="block w-full rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 text-base p-5 transition-all outline-none resize-none"
              placeholder="따뜻한 댓글을 남겨주세요..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              required
            ></textarea>
            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-8 py-3.5 border border-transparent text-sm font-black rounded-2xl shadow-lg shadow-primary-600/30 text-white bg-primary-600 hover:bg-primary-700 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "등록 중..." : "댓글 등록"}
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
