"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useBlogStore } from "@/store/useBlogStore";
import { useBlogCommentStore } from "@/store/useBlogCommentStore";
import { useBlogLikeStore } from "@/store/useBlogLikeStore";
import useAuthStore from "@/store/useAuthStore";
import BlogSidebar from "@/components/(app)/blog/BlogSidebar";
import CommentSection from "@/components/(app)/blog/CommentSection";
import {
  FaClock,
  FaEye,
  FaCalendar,
  FaUser,
  FaTag,
  FaArrowLeft,
} from "react-icons/fa";
import Loading from "@/components/shared/Loading";

const BlogPostPage = () => {
  const params = useParams();
  const router = useRouter();
  const { getBlog, fetchRelatedBlogs } = useBlogStore();
  const {
    comments,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    toggleLike: toggleCommentLike,
  } = useBlogCommentStore();
  const { toggleBlogLike, checkBlogLike } = useBlogLikeStore();
  const { user } = useAuthStore();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentsRef = useRef(null);
  const commentFormRef = useRef(null); // Ref for the comment form

  // Get like state from the store
  const blogLiked = useBlogLikeStore((state) =>
    blog ? state.isBlogLiked(blog.id) : false
  );
  const likeCount = useBlogLikeStore((state) => {
    if (!blog) return 0;
    const storeCount = state.getBlogLikeCount(blog.id);
    // Use store count if available, otherwise use blog's likes_count
    return storeCount !== undefined ? storeCount : blog.likes_count || 0;
  });

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    loadBlogData();
  }, [params.slug]);

  const loadBlogData = async () => {
    try {
      setIsLoading(true);
      setIsLoadingRelated(true);
      const data = await getBlog(params.slug);
      setBlog(data);

      // Load related blogs separately
      fetchRelatedBlogs(data.id)
        .then((related) => {
          setRelatedBlogs(related);
          setIsLoadingRelated(false);
        })
        .catch((error) => {
          console.error("Failed to load related blogs:", error);
          setIsLoadingRelated(false);
        });

      if (data.allow_comments) {
        await fetchComments(data.id);
      }

      // Always check like status (even if not logged in, it will return false)
      await checkBlogLike(data.id);
    } catch (error) {
      console.error("Failed to load blog:", error);
      setError("Failed to load blog post");
      setIsLoadingRelated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLikeBlog = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      await toggleBlogLike(blog.id);
      // Store will update automatically, no need to set local state
    } catch (error) {
      console.error("Failed to like blog:", error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }

    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingComment) {
        await updateComment(blog.id, editingComment.id, commentText);
        setEditingComment(null);
      } else {
        await addComment(blog.id, commentText, replyTo?.id);
        setReplyTo(null);
      }
      setCommentText("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await deleteComment(blog.id, commentId);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      await toggleCommentLike(blog.id, commentId);
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const startReply = (comment) => {
    setReplyTo(comment);
    setCommentText(`@${comment.user.name} `);
    setEditingComment(null);
    // Scroll to comment form
    setTimeout(() => {
      commentFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      // Focus on textarea
      const textarea = commentFormRef.current?.querySelector("textarea");
      if (textarea) {
        textarea.focus();
        // Move cursor to end
        textarea.setSelectionRange(
          textarea.value.length,
          textarea.value.length
        );
      }
    }, 100);
  };

  const startEdit = (comment) => {
    setEditingComment(comment);
    setCommentText(comment.content);
    setReplyTo(null);
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setReplyTo(null);
    setCommentText("");
  };

  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Back Button Skeleton */}
        <div className="bg-white border-b border-neutral-100 fixed top-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 py-3">
            <div className="h-5 w-24 bg-neutral-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 lg:py-8 pt-20">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Main Content Skeleton */}
            <article className="flex-1 min-w-0">
              <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5 md:p-8 animate-pulse">
                {/* Categories Skeleton */}
                <div className="flex gap-2 mb-3">
                  <div className="h-6 w-20 bg-neutral-200 rounded-full"></div>
                  <div className="h-6 w-24 bg-neutral-200 rounded-full"></div>
                </div>

                {/* Title Skeleton */}
                <div className="space-y-2 mb-3">
                  <div className="h-8 bg-neutral-200 rounded w-full"></div>
                  <div className="h-8 bg-neutral-200 rounded w-3/4"></div>
                </div>

                {/* Meta Info Skeleton */}
                <div className="flex gap-4 pb-4 mb-4 border-b border-neutral-100">
                  <div className="h-4 w-24 bg-neutral-200 rounded"></div>
                  <div className="h-4 w-28 bg-neutral-200 rounded"></div>
                  <div className="h-4 w-20 bg-neutral-200 rounded"></div>
                </div>

                {/* Image Skeleton */}
                <div className="w-full h-[300px] md:h-[400px] bg-neutral-200 rounded-lg mb-6"></div>

                {/* Content Skeleton */}
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-neutral-200 rounded w-full"></div>
                  <div className="h-4 bg-neutral-200 rounded w-full"></div>
                  <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                  <div className="h-4 bg-neutral-200 rounded w-full"></div>
                  <div className="h-4 bg-neutral-200 rounded w-4/5"></div>
                </div>
              </div>

              {/* Comments Skeleton */}
              <div className="mt-6 bg-white rounded-xl shadow-sm border border-neutral-100 p-6 animate-pulse">
                <div className="h-6 w-32 bg-neutral-200 rounded mb-4"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-10 h-10 bg-neutral-200 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                        <div className="h-3 bg-neutral-200 rounded w-full"></div>
                        <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* Sidebar Skeleton */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-4">
                {/* Actions Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4 animate-pulse">
                  <div className="space-y-3">
                    <div className="h-10 bg-neutral-200 rounded-lg"></div>
                    <div className="h-10 bg-neutral-200 rounded-lg"></div>
                    <div className="h-10 bg-neutral-200 rounded-lg"></div>
                  </div>
                </div>

                {/* Related Posts Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4 animate-pulse">
                  <div className="h-5 w-32 bg-neutral-200 rounded mb-3"></div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-16 h-16 bg-neutral-200 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-neutral-200 rounded w-full"></div>
                          <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-3">📝</div>
          <h2 className="text-xl font-bold text-secondary-950 mb-2 font-[family-name:var(--font-poppins)]">
            Blog post not found
          </h2>
          <p className="text-sm text-neutral-600 mb-4 font-[family-name:var(--font-inter)]">
            {error || "The blog post you're looking for doesn't exist"}
          </p>
          <button
            onClick={() => router.push("/blog")}
            className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-2 py-6 lg:py-8">
        {/* Remove extra spacing */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Content */}
          <article className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5 md:p-8">
              {/* Categories */}
              {blog.categories && blog.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {blog.categories.map((category) => (
                    <span
                      key={category.id}
                      className="px-3 py-1 rounded-full text-xs font-semibold font-[family-name:var(--font-inter)]"
                      style={{
                        backgroundColor: `${category.color}20`,
                        color: category.color,
                      }}
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-[family-name:var(--font-poppins)] font-bold text-secondary-950 mb-3 leading-tight">
                {blog.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 pb-4 mb-4 border-b border-neutral-100">
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-[family-name:var(--font-inter)]">
                  <FaUser className="text-primary-500" size={12} />
                  <span>{blog.author?.name || "Anonymous"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-[family-name:var(--font-inter)]">
                  <FaCalendar className="text-primary-500" size={12} />
                  <span>{formatDate(blog.published_at)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-[family-name:var(--font-inter)]">
                  <FaClock className="text-primary-500" size={12} />
                  <span>{blog.reading_time} min</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-[family-name:var(--font-inter)]">
                  <FaEye className="text-primary-500" size={12} />
                  <span>{blog.views_count}</span>
                </div>
              </div>

              {/* Main Image */}
              <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-6">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${blog.main_image}`}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Excerpt */}
              {blog.excerpt && (
                <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg mb-6">
                  <p className="text-sm text-secondary-950 font-[family-name:var(--font-inter)] italic leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              )}

              {/* Content */}
              <div
                className="prose prose-sm md:prose-base max-w-none mb-6 font-[family-name:var(--font-inter)]"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="pt-4 border-t border-neutral-100">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 font-[family-name:var(--font-poppins)]">
                    <FaTag className="text-primary-500" size={14} />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 rounded-full text-xs bg-neutral-100 text-neutral-700 hover:bg-primary-100 hover:text-primary-700 transition-colors cursor-pointer font-[family-name:var(--font-inter)]"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div ref={commentsRef} className="mt-6">
              <CommentSection
                comments={comments}
                user={user}
                commentText={commentText}
                setCommentText={setCommentText}
                replyTo={replyTo}
                editingComment={editingComment}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmitComment}
                onReply={startReply}
                onEdit={startEdit}
                onDelete={handleDeleteComment}
                onLike={handleLikeComment}
                onCancel={cancelEdit}
                allowComments={blog.allow_comments}
                formRef={commentFormRef}
              />
            </div>
          </article>

          {/* Sidebar */}
          <BlogSidebar
            blog={blog}
            blogLiked={blogLiked}
            likeCount={likeCount}
            commentsCount={comments.length}
            onLike={handleLikeBlog}
            onCommentClick={scrollToComments}
            shareUrl={shareUrl}
            relatedBlogs={relatedBlogs}
            isLoadingRelated={isLoadingRelated}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
