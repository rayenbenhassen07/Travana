import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaClock,
  FaEye,
  FaChevronRight,
  FaFire,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

const BlogCard = ({
  blog,
  onLikeClick,
  isLiked = false,
  likeCount = 0,
  isAuthenticated = false,
  featured = false,
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/blog/${blog.slug}`);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    onLikeClick?.(blog.id);
  };

  return (
    <article
      onClick={handleCardClick}
      className="group bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border border-neutral-100"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${
            blog.thumbnail || blog.main_image
          }`}
          alt={blog.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

        {/* Featured Badge */}
        {(featured || blog.is_featured) && (
          <div className="absolute top-3 right-3">
            <span className="bg-accent-amber text-secondary-950 px-2.5 py-1 rounded-full text-xs font-[family-name:var(--font-montserrat)] font-bold shadow-md flex items-center gap-1">
              <FaFire className="text-xs" />À la une
            </span>
          </div>
        )}

        {/* Like Button - Always visible */}
        <button
          onClick={handleLikeClick}
          className="absolute top-3 left-3 bg-white/90 hover:bg-white backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-md transition-all hover:scale-110"
          title={isLiked ? "Unlike" : "Like"}
        >
          <div className="flex items-center gap-1.5">
            {isLiked ? (
              <FaHeart className="text-red-500 text-sm" />
            ) : (
              <FaRegHeart className="text-neutral-700 text-sm" />
            )}
            <span className="text-xs font-semibold text-neutral-700">
              {likeCount !== undefined ? likeCount : blog.likes_count || 0}
            </span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {blog.categories?.slice(0, 2).map((category) => (
            <span
              key={category.id}
              className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-neutral-700 text-white font-[family-name:var(--font-inter)]"
            >
              {category.name}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-base md:text-lg font-[family-name:var(--font-poppins)] font-bold text-secondary-950 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-neutral-600 mb-3 line-clamp-2 leading-relaxed font-[family-name:var(--font-inter)]">
          {blog.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <div className="flex items-center gap-3 text-xs text-neutral-500 font-[family-name:var(--font-inter)]">
            <span className="flex items-center gap-1">
              <FaClock className="text-neutral-700 text-xs" />
              {blog.reading_time}min
            </span>
            <span className="flex items-center gap-1">
              <FaEye className="text-neutral-700 text-xs" />
              {blog.views_count}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-primary-600 font-semibold text-xs group-hover:gap-2 transition-all font-[family-name:var(--font-inter)]">
            <span>Lire</span>
            <FaChevronRight className="text-xs" />
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
