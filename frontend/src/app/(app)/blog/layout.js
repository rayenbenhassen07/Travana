"use client";

import { usePathname } from "next/navigation";
import BlogNavbar from "@/components/(app)/blog/BlogNavbar";

const BlogLayout = ({ children }) => {
  const pathname = usePathname();

  // Extract category slug from pathname if it's a category page
  const categoryMatch = pathname?.match(/\/blog\/category\/([^/]+)/);
  const selectedCategory = categoryMatch ? categoryMatch[1] : "";

  return (
    <div className="min-h-screen bg-neutral-50">
      <BlogNavbar selectedCategory={selectedCategory} />
      <div>{children}</div>
    </div>
  );
};

export default BlogLayout;
