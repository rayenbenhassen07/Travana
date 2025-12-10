"use client";

import { useEffect } from "react";
import { useBlogCategoryStore } from "@/store/useBlogCategoryStore";
import CategoriesSection from "./CategoriesSection";

/**
 * Shared blog header component with categories navigation
 * Use this on all blog-related pages for consistent navigation
 */
const BlogHeader = ({ selectedCategory = "" }) => {
  const { categories, fetchCategories, isLoading } = useBlogCategoryStore();

  useEffect(() => {
    fetchCategories(true);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoriesSection
        categories={categories}
        selectedCategory={selectedCategory}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BlogHeader;
