import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { communityApi } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Save, X } from "lucide-react";
import { POST_CATEGORY, POST_CATEGORY_LABELS } from "../../utils/constants";
import toast from "react-hot-toast";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const editingPost = location.state?.post;
  const isEditMode = !!editingPost;

  const [formData, setFormData] = useState({
    title: editingPost?.title || "",
    content: editingPost?.content || "",
    category: editingPost?.category || POST_CATEGORY.FREE,
    anonymous: editingPost?.anonymous || false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await communityApi.updatePost(editingPost.id, formData);
        toast.success("게시글이 수정되었습니다.");
        navigate(`/community/${editingPost.id}`);
      } else {
        const response = await communityApi.createPost(formData);
        toast.success("게시글이 작성되었습니다.");
        navigate(`/community/${response.data}`);
      }
    } catch (error) {
      console.error("Failed to save post", error);
      toast.error(
        isEditMode
          ? "게시글 수정에 실패했습니다."
          : "게시글 작성에 실패했습니다.",
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center text-sm font-black text-gray-500 hover:text-primary-600 mb-8 transition-colors"
      >
        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 mr-3 group-hover:border-primary-100 group-hover:bg-primary-50 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </div>
        돌아가기
      </button>

      <div className="bg-white shadow-2xl rounded-[2.5rem] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-10 py-8">
          <h1 className="text-2xl font-black text-white">
            {isEditMode ? "게시글 수정" : "새 게시글 작성"}
          </h1>
          <p className="text-primary-100 mt-2 font-medium text-sm">
            {isEditMode
              ? "작성한 글을 수정합니다."
              : "커뮤니티에 공유할 내용을 자유롭게 작성해주세요."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-black text-gray-700 mb-3 tracking-widest uppercase"
              >
                카테고리
              </label>
              <select
                id="category"
                className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em]"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                }}
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {Object.entries(POST_CATEGORY_LABELS).map(([value, label]) => {
                  if (
                    value === POST_CATEGORY.PROFESSOR_NOTICE &&
                    user?.role !== "PROFESSOR"
                  )
                    return null;
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex items-end pb-3">
              <label className="flex items-center group cursor-pointer">
                <div className="relative">
                  <input
                    id="anonymous"
                    type="checkbox"
                    className="sr-only"
                    checked={formData.anonymous}
                    onChange={(e) =>
                      setFormData({ ...formData, anonymous: e.target.checked })
                    }
                  />
                  <div
                    className={`block w-14 h-8 rounded-full transition-colors ${formData.anonymous ? "bg-primary-600" : "bg-gray-200"}`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 shadow-sm ${formData.anonymous ? "transform translate-x-6" : ""}`}
                  ></div>
                </div>
                <span className="ml-4 text-sm font-black text-gray-700 group-hover:text-primary-600 transition-colors tracking-widest uppercase">
                  익명으로 작성
                </span>
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-black text-gray-700 mb-3 tracking-widest uppercase"
            >
              제목
            </label>
            <input
              type="text"
              id="title"
              required
              placeholder="제목을 입력해주세요"
              className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-base transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-black text-gray-700 mb-3 tracking-widest uppercase"
            >
              내용
            </label>
            <textarea
              id="content"
              rows={12}
              required
              placeholder="내용을 입력해주세요"
              className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-5 text-base transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none resize-none leading-relaxed"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-50">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3.5 border border-gray-200 bg-white rounded-2xl text-sm font-black text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              취소
            </button>
            <button
              type="submit"
              className="px-10 py-3.5 rounded-2xl shadow-lg shadow-primary-600/30 text-sm font-black text-white bg-primary-600 hover:bg-primary-700 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditMode ? "수정 완료" : "작성 완료"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
