import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEye, FaClock, FaFire, FaHeart, FaRegHeart } from "react-icons/fa";

const PopularPostsSection = ({
  popularBlogs = [],
  isLoading = false,
  onBlogClick,
  onLikeClick,
  likedBlogs = new Set(),
  likeCounts = {},
  isAuthenticated = false,
}) => {
  const router = useRouter();

  const handleLikeClick = (e, blogId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    onLikeClick?.(blogId);
  };
  // Don't render the section if not loading and no popular blogs
  if (!isLoading && popularBlogs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-neutral-100">
      <h3 className="text-lg font-[family-name:var(--font-poppins)] font-bold text-secondary-950 mb-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center">
          <FaFire className="text-primary-500 text-sm" />
        </div>
        Tendances
      </h3>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-16 h-16 bg-neutral-200 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : popularBlogs.length > 0 ? (
        <div className="space-y-4">
          {popularBlogs.map((blog, index) => (
            <div key={blog.id} className="flex gap-3 group">
              <div
                className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => onBlogClick?.(blog.slug)}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${
                    blog.thumbnail || blog.main_image
                  }`}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4
                  onClick={() => onBlogClick?.(blog.slug)}
                  className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-1.5 text-xs font-[family-name:var(--font-poppins)] cursor-pointer"
                >
                  {blog.title}
                </h4>
                <div className="flex items-center gap-2.5 text-xs text-neutral-500 font-[family-name:var(--font-inter)]">
                  <span className="flex items-center gap-1">
                    <FaEye className="text-neutral-700 text-xs" />
                    {blog.views_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock className="text-secondary-500 text-xs" />
                    {blog.reading_time}min
                  </span>
                  {/* Always show like button */}
                  <button
                    onClick={(e) => handleLikeClick(e, blog.id)}
                    className="flex items-center gap-1 hover:text-red-500 cursor-pointer transition-colors"
                    title={likedBlogs.has(blog.id) ? "Unlike" : "Like"}
                  >
                    {likedBlogs.has(blog.id) ? (
                      <FaHeart className="text-red-500 text-xs" />
                    ) : (
                      <FaRegHeart className="text-xs" />
                    )}
                    <span>
                      {likeCounts[blog.id] !== undefined
                        ? likeCounts[blog.id]
                        : blog.likes_count || 0}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default PopularPostsSection;
