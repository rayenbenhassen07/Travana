"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useBlogStore } from "@/store/useBlogStore";
import { useBlogTagStore } from "@/store/useBlogTagStore";
import { useBlogLikeStore } from "@/store/useBlogLikeStore";
import useAuthStore from "@/store/useAuthStore";
import {
  FaSearch,
  FaClock,
  FaEye,
  FaTag,
  FaFire,
  FaCalendar,
  FaChevronRight,
  FaTimes,
  FaFilter,
  FaArrowRight,
  FaTransgender,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import PopularPostsSection from "@/components/(app)/blog/PopularPostsSection";
import PopularTagsSection from "@/components/(app)/blog/PopularTagsSection";
import BlogCard from "@/components/(app)/blog/BlogCard";

const BlogPage = () => {
  const router = useRouter();
  const {
    blogs,
    isLoading,
    totalPages,
    currentPage,
    fetchBlogs,
    fetchPopularBlogs,
  } = useBlogStore();
  const { tags, fetchPopularTags } = useBlogTagStore();
  const { toggleBlogLike, checkBlogLike, likedBlogs, likeCounts } =
    useBlogLikeStore();
  const { user, token } = useAuthStore();
  const isAuthenticated = !!(user && token);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [page, setPage] = useState(1);
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);

  useEffect(() => {
    fetchPopularTags(10);
    loadPopularBlogs();
  }, []);

  useEffect(() => {
    const filters = {};
    if (searchQuery) filters.search = searchQuery;
    if (selectedTag) filters.tag = selectedTag;

    fetchBlogs(page, 9, filters);
  }, [page, searchQuery, selectedTag]);

  // Check like status for popular blogs when they load
  useEffect(() => {
    if (isAuthenticated && popularBlogs.length > 0) {
      popularBlogs.forEach((blog) => {
        checkBlogLike(blog.id);
      });
    }
  }, [popularBlogs, isAuthenticated]);

  // Check like status for main blogs when they load
  useEffect(() => {
    if (isAuthenticated && blogs.length > 0) {
      blogs.forEach((blog) => {
        checkBlogLike(blog.id);
      });
    }
  }, [blogs, isAuthenticated]);

  const loadPopularBlogs = async () => {
    try {
      setIsLoadingPopular(true);
      const data = await fetchPopularBlogs(6, 30);
      setPopularBlogs(data || []);
    } catch (error) {
      console.error("Failed to load popular blogs:", error);
      setPopularBlogs([]);
    } finally {
      setIsLoadingPopular(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag("");
    setPage(1);
  };

  const handleLikeClick = async (blogId) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    try {
      await toggleBlogLike(blogId);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const hasActiveFilters = searchQuery || selectedTag;

  const featuredBlog =
    blogs.find((blog) => blog.is_featured) || blogs[0] || null;
  const regularBlogs = featuredBlog
    ? blogs.filter((blog) => blog.id !== featuredBlog.id)
    : blogs;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        {/* Remove extra spacing */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Content Area */}
          <main className="lg:col-span-8 space-y-6">
            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="bg-white rounded-xl shadow-sm p-4 border border-neutral-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5 font-[family-name:var(--font-inter)]">
                    <FaFilter className="text-primary-500 text-xs" />
                    Filtres actifs:
                  </span>
                  {searchQuery && (
                    <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 font-medium font-[family-name:var(--font-inter)]">
                      "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery("")}
                        className="hover:text-primary-900"
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  )}
                  {selectedTag && (
                    <span className="bg-accent-teal/10 text-accent-teal px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 font-medium font-[family-name:var(--font-inter)]">
                      {tags.find((t) => t.slug === selectedTag)?.name}
                      <button
                        onClick={() => setSelectedTag("")}
                        className="hover:opacity-70"
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary-600 hover:text-primary-700 font-semibold ml-auto underline font-[family-name:var(--font-inter)]"
                  >
                    Tout effacer
                  </button>
                </div>
              </div>
            )}

            {/* Featured Blog */}
            {featuredBlog && page === 1 && !hasActiveFilters && (
              <article
                onClick={() => router.push(`/blog/${featuredBlog.slug}`)}
                className="group relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
              >
                <div className="grid md:grid-cols-5 gap-0">
                  <div className="relative h-64 md:h-full md:col-span-3 overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${featuredBlog.main_image}`}
                      alt={featuredBlog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent-amber text-secondary-950 px-3 py-1 rounded-full text-xs font-[family-name:var(--font-montserrat)] font-semibold shadow-lg flex items-center gap-1">
                        <FaFire className="text-sm" />À la une
                      </span>
                    </div>
                    {/* Like Button on Featured Blog */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isAuthenticated) {
                          router.push("/login");
                          return;
                        }
                        handleLikeClick(featuredBlog.id);
                      }}
                      className="absolute top-4 right-4 bg-white/90 hover:bg-white backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg transition-all hover:scale-110"
                      title={
                        likedBlogs.has(featuredBlog.id) ? "Unlike" : "Like"
                      }
                    >
                      <div className="flex items-center gap-2">
                        {likedBlogs.has(featuredBlog.id) ? (
                          <FaHeart className="text-red-500 text-sm" />
                        ) : (
                          <FaRegHeart className="text-neutral-700 text-sm" />
                        )}
                        <span className="text-xs font-semibold text-neutral-700">
                          {likeCounts[featuredBlog.id] !== undefined
                            ? likeCounts[featuredBlog.id]
                            : featuredBlog.likes_count || 0}
                        </span>
                      </div>
                    </button>
                  </div>

                  <div className="p-6 md:col-span-2 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {featuredBlog.categories?.slice(0, 2).map((category) => (
                        <span
                          key={category.id}
                          className="text-xs px-2.5 py-1 rounded-full font-semibold bg-neutral-700 text-white font-[family-name:var(--font-inter)]"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-xl md:text-xl font-[family-name:var(--font-poppins)] font-bold text-secondary-950 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {featuredBlog.title}
                    </h2>

                    <p className="text-xs text-neutral-600 mb-4 line-clamp-2 leading-relaxed font-[family-name:var(--font-inter)]">
                      {featuredBlog.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mb-4 font-[family-name:var(--font-inter)]">
                      <span className="flex items-center gap-1.5">
                        <FaCalendar className="text-neutral-700 text-xs" />
                        {formatDate(featuredBlog.published_at)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaClock className="text-neutral-700 text-xs" />
                        {featuredBlog.reading_time} min
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaEye className="text-neutral-700 text-xs" />
                        {featuredBlog.views_count}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-primary-600 font-semibold text-xs group-hover:gap-3 transition-all font-[family-name:var(--font-inter)]">
                      <span>Lire l'article</span>
                      <FaArrowRight className="text-xs" />
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-neutral-200"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                      <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                      <div className="h-16 bg-neutral-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Blog Grid */}
            {!isLoading && regularBlogs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {regularBlogs.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    onLikeClick={handleLikeClick}
                    isLiked={likedBlogs.has(blog.id)}
                    likeCount={likeCounts[blog.id]}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && regularBlogs.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-neutral-100">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-2xl font-[family-name:var(--font-poppins)] font-bold text-secondary-950 mb-2">
                  Aucun article trouvé
                </h3>
                <p className="text-sm text-neutral-600 mb-6 max-w-md mx-auto font-[family-name:var(--font-inter)]">
                  Nous n'avons trouvé aucun article correspondant à vos
                  critères. Essayez d'ajuster vos filtres.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md text-sm font-[family-name:var(--font-inter)]"
                  >
                    Effacer tous les filtres
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-700 hover:border-primary-500 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-sm font-[family-name:var(--font-inter)]"
                >
                  Précédent
                </button>

                <div className="flex gap-1.5">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all text-sm font-[family-name:var(--font-montserrat)] ${
                            page === pageNum
                              ? "bg-primary-500 text-white shadow-md"
                              : "border border-neutral-200 text-neutral-700 hover:border-primary-500"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return (
                        <span
                          key={pageNum}
                          className="w-10 h-10 flex items-center justify-center text-neutral-400 text-sm"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-700 hover:border-primary-500 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-sm font-[family-name:var(--font-inter)]"
                >
                  Suivant
                </button>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-5">
            {/* Popular Posts */}
            <PopularPostsSection
              popularBlogs={popularBlogs}
              isLoading={isLoadingPopular}
              onBlogClick={(slug) => router.push(`/blog/${slug}`)}
              onLikeClick={handleLikeClick}
              likedBlogs={likedBlogs}
              likeCounts={likeCounts}
              isAuthenticated={isAuthenticated}
            />

            {/* Popular Tags */}
            <PopularTagsSection
              tags={tags}
              selectedTag={selectedTag}
              onTagChange={(slug) => {
                setSelectedTag(slug);
                setPage(1);
              }}
              // isLoading={!tags.length && categoriesLoading} // optional better loading logic
            />

            {/* Newsletter CTA */}
            <div className="bg-gradient-to-br from-secondary-800 via-secondary-900 to-secondary-950 rounded-xl shadow-md p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTEwIDEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

              <div className="relative z-10">
                <h3 className="text-xl font-[family-name:var(--font-poppins)] font-bold mb-2">
                  Restez informé
                </h3>
                <p className="text-neutral-200 mb-5 text-xs leading-relaxed font-[family-name:var(--font-inter)]">
                  Recevez nos derniers articles de voyage et conseils
                  directement dans votre boîte mail chaque semaine.
                </p>

                <div className="space-y-2.5">
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    className="w-full border border-white text-white px-4 py-2.5 rounded-lg placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm font-[family-name:var(--font-inter)]"
                  />

                  <button className="w-full bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg text-sm font-[family-name:var(--font-inter)]">
                    S'abonner maintenant
                  </button>
                </div>

                <p className="text-xs text-neutral-300 mt-3 font-[family-name:var(--font-inter)]">
                  🔒 Votre vie privée est importante. Pas de spam, désabonnement
                  à tout moment.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen p-4 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-5 border-b border-neutral-100 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-xl font-[family-name:var(--font-poppins)] font-bold text-secondary-950 flex items-center gap-2">
                  <FaFilter className="text-primary-500" />
                  Filtres
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Tags */}
                <div>
                  <h4 className="font-bold text-secondary-950 mb-3 flex items-center gap-2 text-sm font-[family-name:var(--font-poppins)]">
                    <FaTag className="text-primary-500 text-xs" />
                    Tags populaires
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => {
                          setSelectedTag(tag.slug);
                          setPage(1);
                          setShowMobileFilters(false);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all font-[family-name:var(--font-inter)] ${
                          selectedTag === tag.slug
                            ? "bg-primary-500 text-white shadow-md"
                            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                        }`}
                      >
                        #{tag.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white px-5 py-3 rounded-lg font-bold transition-all shadow-md text-sm font-[family-name:var(--font-inter)]"
                >
                  Appliquer les filtres
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="bg-primary-500 hover:bg-primary-600 text-white w-14 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center hover:scale-110"
        >
          <FaFilter size={20} />
        </button>
      </div>
    </div>
  );
};

export default BlogPage;
