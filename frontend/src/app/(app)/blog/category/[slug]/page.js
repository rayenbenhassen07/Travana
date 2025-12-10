"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBlogStore } from "@/store/useBlogStore";
import { useBlogCategoryStore } from "@/store/useBlogCategoryStore";
import { useBlogTagStore } from "@/store/useBlogTagStore";
import { useBlogLikeStore } from "@/store/useBlogLikeStore";
import useAuthStore from "@/store/useAuthStore";
import BlogCard from "@/components/(app)/blog/BlogCard";
import PopularPostsSection from "@/components/(app)/blog/PopularPostsSection";
import PopularTagsSection from "@/components/(app)/blog/PopularTagsSection";
import { FaArrowLeft } from "react-icons/fa";

const CategoryPage = () => {
  const params = useParams();
  const router = useRouter();
  const {
    blogs,
    isLoading,
    totalPages,
    currentPage,
    fetchBlogs,
    fetchPopularBlogs,
  } = useBlogStore();
  const {
    categories,
    fetchCategories,
    isLoading: categoriesLoading,
  } = useBlogCategoryStore();
  const { tags, fetchPopularTags } = useBlogTagStore();
  const { toggleBlogLike, checkBlogLike, likedBlogs, likeCounts } =
    useBlogLikeStore();
  const { user, token } = useAuthStore();
  const isAuthenticated = !!(user && token);

  const [page, setPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);

  useEffect(() => {
    fetchPopularTags(10);
    loadPopularBlogs();
  }, []);

  useEffect(() => {
    if (params.slug) {
      // Fetch blogs filtered by category
      const filters = { category: params.slug };
      if (selectedTag) filters.tag = selectedTag;

      fetchBlogs(page, 9, filters);

      // Find current category info
      const category = categories.find((c) => c.slug === params.slug);
      setCurrentCategory(category);
    }
  }, [page, params.slug, categories, selectedTag]);

  // Check like status for blogs when they load
  useEffect(() => {
    if (isAuthenticated && blogs.length > 0) {
      blogs.forEach((blog) => {
        checkBlogLike(blog.id);
      });
    }
  }, [blogs, isAuthenticated]);

  // Check like status for popular blogs when they load
  useEffect(() => {
    if (isAuthenticated && popularBlogs.length > 0) {
      popularBlogs.forEach((blog) => {
        checkBlogLike(blog.id);
      });
    }
  }, [popularBlogs, isAuthenticated]);

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

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Content Area */}
          <main className="lg:col-span-8 space-y-6">
            {/* Category Header */}
            {currentCategory && (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => router.push("/blog")}
                      className="text-neutral-600 hover:text-primary-500 transition-colors"
                    >
                      <FaArrowLeft size={20} />
                    </button>
                    <div>
                      <h1 className="text-3xl font-[family-name:var(--font-poppins)] font-bold text-secondary-950 flex items-center gap-3">
                        {currentCategory.name}
                      </h1>
                      {currentCategory.description && (
                        <p className="text-neutral-600 mt-2 font-[family-name:var(--font-inter)]">
                          {currentCategory.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-500 font-[family-name:var(--font-montserrat)]">
                      {blogs.length}
                    </div>
                    <div className="text-sm text-neutral-600 font-[family-name:var(--font-inter)]">
                      Articles
                    </div>
                  </div>
                </div>
              </div>
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
            {!isLoading && blogs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {blogs.map((blog) => (
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
            {!isLoading && blogs.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-neutral-100">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-2xl font-[family-name:var(--font-poppins)] font-bold text-secondary-950 mb-2">
                  Aucun article dans cette catégorie
                </h3>
                <p className="text-sm text-neutral-600 mb-6 max-w-md mx-auto font-[family-name:var(--font-inter)]">
                  Il n'y a pas encore d'articles publiés dans cette catégorie.
                  Revenez bientôt !
                </p>
                <button
                  onClick={() => router.push("/blog")}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md text-sm font-[family-name:var(--font-inter)]"
                >
                  Voir tous les articles
                </button>
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
              isLoading={!tags.length && categoriesLoading}
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
    </div>
  );
};

export default CategoryPage;
