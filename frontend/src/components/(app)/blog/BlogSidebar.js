import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShare,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaEye,
  FaClock,
} from "react-icons/fa";

const BlogSidebar = ({
  blog,
  blogLiked,
  likeCount,
  commentsCount,
  onLike,
  onCommentClick,
  shareUrl,
  relatedBlogs = [],
  isLoadingRelated = false,
}) => {
  const router = useRouter();
  const [showShareMenu, setShowShareMenu] = React.useState(false);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(blog?.title || "")}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      (blog?.title || "") + " " + shareUrl
    )}`,
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <aside className="lg:w-80 flex-shrink-0">
      <div className="lg:sticky lg:top-24 space-y-4">
        {/* Actions Card */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
          <div className="space-y-3">
            {/* Like Button */}
            <button
              onClick={onLike}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all cursor-pointer ${
                blogLiked
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-neutral-50 text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
              }`}
            >
              {blogLiked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
              <span>{likeCount} Likes</span>
            </button>

            {/* Comments Button */}
            {blog?.allow_comments && (
              <button
                onClick={onCommentClick}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium text-sm bg-neutral-50 text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-all cursor-pointer"
              >
                <FaComment size={16} />
                <span>{commentsCount} Comments</span>
              </button>
            )}

            {/* Share Button */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium text-sm bg-neutral-50 text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-all cursor-pointer"
              >
                <FaShare size={16} />
                <span>Share</span>
              </button>

              {showShareMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10 cursor-pointer"
                    onClick={() => setShowShareMenu(false)}
                  />
                  <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 p-3 z-20">
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={shareLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors text-sm cursor-pointer"
                      >
                        <FaFacebook size={16} />
                        <span>Facebook</span>
                      </a>
                      <a
                        href={shareLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-sky-50 text-sky-600 transition-colors text-sm cursor-pointer"
                      >
                        <FaTwitter size={16} />
                        <span>Twitter</span>
                      </a>
                      <a
                        href={shareLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-700 transition-colors text-sm cursor-pointer"
                      >
                        <FaLinkedin size={16} />
                        <span>LinkedIn</span>
                      </a>
                      <a
                        href={shareLinks.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors text-sm cursor-pointer"
                      >
                        <FaWhatsapp size={16} />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {isLoadingRelated ? (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
            <div className="h-5 w-32 bg-neutral-200 rounded mb-3 animate-pulse"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-16 h-16 bg-neutral-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-neutral-200 rounded w-full"></div>
                    <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-2 bg-neutral-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : relatedBlogs.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
            <h3 className="text-sm font-bold text-secondary-950 mb-3 font-[family-name:var(--font-poppins)]">
              Articles similaires
            </h3>
            <div className="space-y-3">
              {relatedBlogs.slice(0, 5).map((relatedBlog) => (
                <div
                  key={relatedBlog.id}
                  onClick={() => router.push(`/blog/${relatedBlog.slug}`)}
                  className="flex gap-3 group cursor-pointer"
                >
                  <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${
                        relatedBlog.thumbnail || relatedBlog.main_image
                      }`}
                      alt={relatedBlog.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-secondary-950 group-hover:text-primary-600 transition-colors line-clamp-2 mb-1 font-[family-name:var(--font-poppins)]">
                      {relatedBlog.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-[family-name:var(--font-inter)]">
                      <span className="flex items-center gap-1">
                        <FaClock className="text-xs" />
                        {relatedBlog.reading_time}min
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEye className="text-xs" />
                        {relatedBlog.views_count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
};

export default BlogSidebar;
