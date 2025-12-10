"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBlogCategoryStore } from "@/store/useBlogCategoryStore";

/**
 * Navigation bar for blog pages with categories
 * Fixed at the top of all blog-related pages
 */
const BlogNavbar = ({ selectedCategory = "" }) => {
  const router = useRouter();
  const { categories, fetchCategories, isLoading } = useBlogCategoryStore();

  useEffect(() => {
    fetchCategories(true);
  }, []);

  const handleCategoryClick = (slug) => {
    if (slug) {
      router.push(`/blog/category/${slug}`);
    } else {
      router.push("/blog");
    }
  };

  return (
    <div className=" top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {isLoading ? (
              // Skeleton loading state
              <>
                <div className="px-5 py-2.5 rounded-lg bg-neutral-200 animate-pulse h-10 w-36"></div>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="px-5 py-2.5 rounded-lg bg-neutral-200 animate-pulse h-10 w-28"
                  ></div>
                ))}
              </>
            ) : (
              // Actual categories
              <>
                <button
                  onClick={() => handleCategoryClick("")}
                  className={`px-5 py-2.5 cursor-pointer  rounded-lg shadow-sm whitespace-nowrap flex items-center gap-2 text-sm font-[family-name:var(--font-inter)] transition-all ${
                    !selectedCategory
                      ? "bg-primary-500 text-white shadow-md"
                      : "bg-white text-neutral-600  hover:text-primary-700"
                  }`}
                >
                  Tous les articles
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.slug)}
                    className={`px-5 py-2.5 cursor-pointer rounded-lg   whitespace-nowrap flex items-center gap-2 text-sm font-[family-name:var(--font-inter)] transition-all ${
                      selectedCategory === category.slug
                        ? "bg-primary-500 text-white shadow-md"
                        : "bg-white text-neutral-600  hover:text-primary-700"
                    }`}
                  >
                    <span>{category.name}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogNavbar;
