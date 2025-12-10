import React from "react";
import {
  FaHeart,
  FaRegHeart,
  FaReply,
  FaEdit,
  FaTrash,
  FaTimes,
  FaComment,
  FaCheckCircle,
} from "react-icons/fa";

const CommentSection = ({
  comments = [],
  user,
  commentText,
  setCommentText,
  replyTo,
  editingComment,
  isSubmitting,
  onSubmit,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onCancel,
  allowComments = true,
  formRef, // Add formRef prop
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (id) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-teal-500",
    ];
    return colors[id % colors.length];
  };

  if (!allowComments) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 px-2 py-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-secondary-950 flex items-center gap-2 font-[family-name:var(--font-poppins)]">
            <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
              <FaComment className="text-primary-500" size={18} />
            </div>
            <div>
              <div className="text-lg">Discussion</div>
              <div className="text-xs font-normal text-neutral-600">
                {comments.length}{" "}
                {comments.length === 1 ? "comment" : "comments"}
              </div>
            </div>
          </h2>
        </div>
      </div>

      <div className="p-2">
        {/* Comment Form */}
        <div className="mb-8">
          {(replyTo || editingComment) && (
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 p-2 rounded-lg mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  {replyTo ? (
                    <FaReply className="text-white" size={14} />
                  ) : (
                    <FaEdit className="text-white" size={14} />
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-secondary-950 font-[family-name:var(--font-poppins)]">
                    {replyTo
                      ? `Replying to ${replyTo.user.name}`
                      : "Editing comment"}
                  </div>
                  <div className="text-xs text-neutral-600 mt-0.5">
                    {replyTo
                      ? "Your reply will be posted as a response"
                      : "Update your comment below"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="text-neutral-500 hover:text-neutral-700 p-2 hover:bg-white rounded-lg transition-all cursor-pointer"
              >
                <FaTimes size={16} />
              </button>
            </div>
          )}

          <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
            <div className="relative">
              {user && (
                <div className="absolute left-4 top-4 flex items-center gap-3 pointer-events-none">
                  <div
                    className={`w-10 h-10 rounded-full ${getAvatarColor(
                      user.id
                    )} text-white flex items-center justify-center font-bold text-sm shadow-md`}
                  >
                    {getInitials(user.name)}
                  </div>
                </div>
              )}
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  user
                    ? "Share your thoughts on this article..."
                    : "Please login to join the discussion"
                }
                disabled={!user || isSubmitting}
                className={`w-full ${
                  user ? "pl-16" : "pl-4"
                } pr-4 py-4 border-2 border-neutral-200 rounded-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-100 focus:outline-none resize-none text-sm font-[family-name:var(--font-inter)] transition-all disabled:bg-neutral-50 disabled:cursor-not-allowed placeholder:text-neutral-400`}
                rows="4"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-neutral-500 font-[family-name:var(--font-inter)]">
                {user ? (
                  <span className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" />
                    Posting as {user.name}
                  </span>
                ) : (
                  <span>Login required to comment</span>
                )}
              </div>
              <button
                type="submit"
                disabled={!user || isSubmitting || !commentText.trim()}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer disabled:transform-none disabled:shadow-md"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Posting...
                  </span>
                ) : editingComment ? (
                  "Update Comment"
                ) : (
                  "Post Comment"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-2 m-0">
            {comments.map((comment, index) => (
              <div
                key={comment.id}
                className={`bg-neutral-50 hover:bg-neutral-100/50 rounded-xl p-2 transition-all border border-neutral-200 ${
                  index === 0 ? "border-primary-200 bg-primary-50/30" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className={`w-11 h-11 rounded-full ${getAvatarColor(
                      comment.user.id
                    )} text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md`}
                  >
                    {getInitials(comment.user.name)}
                  </div>

                  <div className="flex-1  min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-secondary-950 font-[family-name:var(--font-poppins)]">
                            {comment.user.name}
                          </h4>
                          {index === 0 && (
                            <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                              Latest
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5 font-[family-name:var(--font-inter)]">
                          {formatDate(comment.created_at)}
                        </p>
                      </div>
                      {user && user.id === comment.user.id && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => onEdit(comment)}
                            className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all cursor-pointer"
                            title="Edit comment"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => onDelete(comment.id)}
                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            title="Delete comment"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <p className="text-sm text-neutral-800 mb-4 break-words leading-relaxed font-[family-name:var(--font-inter)]">
                      {comment.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => onLike(comment.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          comment.user_liked
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-white text-neutral-600 hover:bg-red-50 hover:text-red-600 border border-neutral-200"
                        }`}
                      >
                        {comment.user_liked ? (
                          <FaHeart size={14} />
                        ) : (
                          <FaRegHeart size={14} />
                        )}
                        <span>{comment.likes_count || 0}</span>
                      </button>
                      <button
                        onClick={() => onReply(comment)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-neutral-600 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200 transition-all cursor-pointer"
                      >
                        <FaReply size={14} />
                        <span>Reply</span>
                      </button>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-2 space-y-3 pl-2 border-l-2 border-neutral-200">
                        {comment.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="bg-white rounded-lg p-2 shadow-sm border border-neutral-200 hover:shadow-md transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-9 h-9 rounded-full ${getAvatarColor(
                                  reply.user.id
                                )} text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow`}
                              >
                                {getInitials(reply.user.name)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h5 className="font-bold text-xs text-secondary-950 font-[family-name:var(--font-poppins)]">
                                      {reply.user.name}
                                    </h5>
                                    <p className="text-xs text-neutral-500 font-[family-name:var(--font-inter)]">
                                      {formatDate(reply.created_at)}
                                    </p>
                                  </div>
                                  {user && user.id === reply.user.id && (
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => onEdit(reply)}
                                        className="p-1.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-all cursor-pointer"
                                      >
                                        <FaEdit size={12} />
                                      </button>
                                      <button
                                        onClick={() => onDelete(reply.id)}
                                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-all cursor-pointer"
                                      >
                                        <FaTrash size={12} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-neutral-700 break-words leading-relaxed font-[family-name:var(--font-inter)]">
                                  {reply.content}
                                </p>

                                {/* Reply Actions */}
                                <div className="flex items-center gap-3 mt-3">
                                  <button
                                    onClick={() => onLike(reply.id)}
                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                      reply.user_liked
                                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                                        : "bg-white text-neutral-600 hover:bg-red-50 hover:text-red-600 border border-neutral-200"
                                    }`}
                                  >
                                    {reply.user_liked ? (
                                      <FaHeart size={12} />
                                    ) : (
                                      <FaRegHeart size={12} />
                                    )}
                                    <span>{reply.likes_count || 0}</span>
                                  </button>
                                  <button
                                    onClick={() => onReply(reply)}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-neutral-600 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200 transition-all cursor-pointer"
                                  >
                                    <FaReply size={12} />
                                    <span>Reply</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-neutral-50 to-primary-50/20 rounded-xl border-2 border-dashed border-neutral-200">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <FaComment className="text-primary-600 text-2xl" />
            </div>
            <h3 className="text-base font-bold text-secondary-950 mb-2 font-[family-name:var(--font-poppins)]">
              No comments yet
            </h3>
            <p className="text-sm text-neutral-600 font-[family-name:var(--font-inter)]">
              Be the first to share your thoughts on this article!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
