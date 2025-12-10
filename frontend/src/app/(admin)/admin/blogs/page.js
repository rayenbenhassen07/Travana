"use client";
import React, { useState, useEffect } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import { useBlogCategoryStore } from "@/store/useBlogCategoryStore";
import { useBlogTagStore } from "@/store/useBlogTagStore";
import { useUserStore } from "@/store/useUserStore";
import Table from "@/components/shared/Table";
import Pagination from "@/components/shared/Pagination";
import Modal from "@/components/shared/Modal";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import {
  Input,
  Textarea,
  SelectWithSearch,
  MultiSelectWithSearch,
  SimpleImageUpload,
  Checkbox,
  Button,
  RichTextEditor,
  DateInput,
} from "@/components/shared/inputs";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaNewspaper,
  FaStar,
  FaClock,
  FaEyeSlash,
  FaCalendarAlt,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { toast } from "sonner";
import "react-quill-new/dist/quill.snow.css";

const BlogsPage = () => {
  const {
    blogs,
    isLoading,
    totalPages: storeTotalPages,
    currentPage: storeCurrentPage,
    itemsPerPage,
    fetchBlogs,
    addBlog,
    updateBlog,
    deleteBlog,
  } = useBlogStore();
  const { categories, fetchCategories } = useBlogCategoryStore();
  const { tags, fetchTags } = useBlogTagStore();
  const { users, fetchUsers } = useUserStore();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Form states
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    main_image: null,
    thumbnail: null,
    categories: [],
    tags: [],
    published_at: "", // null=draft, future=scheduled, past=published
    is_featured: false,
    allow_comments: true,
    order: 0,
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting states
  const [sortConfig, setSortConfig] = useState({
    key: "published_at",
    direction: "desc",
  });

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [filterFeatured, setFilterFeatured] = useState("");

  // Auto-generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  // Handle title change and auto-generate slug
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: generateSlug(newTitle),
    }));
  };

  // Fetch data on mount
  useEffect(() => {
    fetchCategories(true);
    fetchTags();
    fetchUsers();
  }, [fetchCategories, fetchTags, fetchUsers]);

  // Fetch blogs when filters change
  useEffect(() => {
    const filters = {};
    if (searchQuery) filters.search = searchQuery;
    if (filterStatus) filters.status = filterStatus;
    if (filterCategory) filters.category = filterCategory;
    if (filterTag) filters.tag = filterTag;
    if (
      filterFeatured !== "" &&
      filterFeatured !== null &&
      filterFeatured !== undefined
    ) {
      filters.featured = filterFeatured === "1" ? 1 : 0;
    }

    fetchBlogs(currentPage, itemsPerPage, filters);
  }, [
    currentPage,
    searchQuery,
    filterStatus,
    filterCategory,
    filterTag,
    filterFeatured,
    fetchBlogs,
    itemsPerPage,
  ]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Sort data
  const sortedData = React.useMemo(() => {
    let sorted = [...blogs];

    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "author") {
          aValue = a.author?.name || "";
          bValue = b.author?.name || "";
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return sorted;
  }, [blogs, sortConfig]);

  // Handle view
  const handleView = (blog) => {
    setSelectedBlog(blog);
    setIsViewModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      main_image: null,
      thumbnail: null,
      categories: [],
      tags: [],
      published_at: "", // null=draft, future=scheduled, past=published
      is_featured: false,
      allow_comments: true,
      order: 0,
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
    });
    setFormErrors({});
    setSelectedBlog(null);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    if (!formData.excerpt.trim()) {
      errors.excerpt = "Excerpt is required";
    }
    if (!formData.content.trim()) {
      errors.content = "Content is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add
  const handleAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  // Handle edit
  const handleEdit = (blog) => {
    setSelectedBlog(blog);

    // Format datetime for datetime-local input
    const formatDateTimeLocal = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      main_image: blog.main_image || null,
      thumbnail: blog.thumbnail || null,
      categories: blog.categories?.map((c) => c.id) || [],
      tags: blog.tags?.map((t) => t.id) || [],
      published_at: formatDateTimeLocal(blog.published_at),
      is_featured: blog.is_featured || false,
      allow_comments:
        blog.allow_comments !== undefined ? blog.allow_comments : true,
      order: blog.order || 0,
      meta_title: blog.meta_title || "",
      meta_description: blog.meta_description || "",
      meta_keywords: blog.meta_keywords || "",
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (blog) => {
    setSelectedBlog(blog);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedBlog) return;

    setIsSubmitting(true);
    try {
      await deleteBlog(selectedBlog.id);
      toast.success("Blog deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedBlog(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit add
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      const authUser = JSON.parse(localStorage.getItem("user") || "{}");

      submitData.append("title", formData.title);
      submitData.append("slug", formData.slug);
      submitData.append("excerpt", formData.excerpt);
      submitData.append("content", formData.content);
      submitData.append("is_featured", formData.is_featured ? "1" : "0");
      submitData.append("allow_comments", formData.allow_comments ? "1" : "0");
      submitData.append("order", formData.order || 0);
      submitData.append("author_id", authUser.id || 1);

      // WordPress-style: only published_at (null=draft, future=scheduled, past=published)
      if (formData.published_at) {
        submitData.append("published_at", formData.published_at);
      }
      if (formData.meta_title) {
        submitData.append("meta_title", formData.meta_title);
      }
      if (formData.meta_description) {
        submitData.append("meta_description", formData.meta_description);
      }
      if (formData.meta_keywords) {
        submitData.append("meta_keywords", formData.meta_keywords);
      }

      if (formData.main_image instanceof File) {
        submitData.append("main_image", formData.main_image);
      }

      if (formData.thumbnail instanceof File) {
        submitData.append("thumbnail", formData.thumbnail);
      }

      if (formData.categories && formData.categories.length > 0) {
        formData.categories.forEach((categoryId) => {
          submitData.append("category_ids[]", categoryId);
        });
      }

      if (formData.tags && formData.tags.length > 0) {
        formData.tags.forEach((tagId) => {
          submitData.append("tag_ids[]", tagId);
        });
      }

      await addBlog(submitData);
      toast.success("Blog post added successfully!");
      setIsAddModalOpen(false);
      resetForm();
      fetchBlogs(currentPage, itemsPerPage);
    } catch (error) {
      const errorData = error.response?.data;

      if (errorData?.errors) {
        const errors = {};
        Object.keys(errorData.errors).forEach((key) => {
          errors[key] = errorData.errors[key][0];
        });
        setFormErrors(errors);
        const firstError = Object.values(errorData.errors)[0][0];
        toast.error(firstError);
      } else {
        toast.error(errorData?.message || "Failed to add blog post");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit edit
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("_method", "PUT");

      submitData.append("title", formData.title);
      submitData.append("slug", formData.slug);
      submitData.append("excerpt", formData.excerpt);
      submitData.append("content", formData.content);
      submitData.append("is_featured", formData.is_featured ? "1" : "0");
      submitData.append("allow_comments", formData.allow_comments ? "1" : "0");
      submitData.append("order", formData.order || 0);

      // WordPress-style: only published_at (null=draft, future=scheduled, past=published)
      if (formData.published_at) {
        submitData.append("published_at", formData.published_at);
      }
      if (formData.meta_title) {
        submitData.append("meta_title", formData.meta_title);
      }
      if (formData.meta_description) {
        submitData.append("meta_description", formData.meta_description);
      }
      if (formData.meta_keywords) {
        submitData.append("meta_keywords", formData.meta_keywords);
      }

      if (formData.main_image instanceof File) {
        submitData.append("main_image", formData.main_image);
      }

      if (formData.thumbnail instanceof File) {
        submitData.append("thumbnail", formData.thumbnail);
      }

      if (formData.categories && formData.categories.length > 0) {
        formData.categories.forEach((categoryId) => {
          submitData.append("category_ids[]", categoryId);
        });
      }

      if (formData.tags && formData.tags.length > 0) {
        formData.tags.forEach((tagId) => {
          submitData.append("tag_ids[]", tagId);
        });
      }

      await updateBlog(selectedBlog.id, submitData);
      toast.success("Blog post updated successfully!");
      setIsEditModalOpen(false);
      resetForm();
      fetchBlogs(currentPage, itemsPerPage);
    } catch (error) {
      const errorData = error.response?.data;

      if (errorData?.errors) {
        const errors = {};
        Object.keys(errorData.errors).forEach((key) => {
          errors[key] = errorData.errors[key][0];
        });
        setFormErrors(errors);
        const firstError = Object.values(errorData.errors)[0][0];
        toast.error(firstError);
      } else {
        toast.error(errorData?.message || "Failed to update blog post");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setFilterStatus("");
    setFilterCategory("");
    setFilterTag("");
    setFilterFeatured("");
    setCurrentPage(1);
  };

  // Determine status from published_at (WordPress-style)
  const getBlogStatus = (published_at) => {
    if (!published_at) return "draft";
    const publishDate = new Date(published_at);
    const now = new Date();
    if (publishDate > now) return "scheduled";
    return "published";
  };

  // Get status badge
  const getStatusBadge = (published_at) => {
    const status = getBlogStatus(published_at);
    const statusStyles = {
      published: "bg-green-100 text-green-700",
      draft: "bg-gray-100 text-gray-700",
      scheduled: "bg-blue-100 text-blue-700",
    };

    return (
      <span
        className={`px-2 py-1 rounded-lg text-xs font-semibold ${
          statusStyles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Table columns
  const columns = [
    { key: "id", label: "ID", sortable: true },
    {
      key: "main_image",
      label: "Image",
      sortable: false,
      render: (blog) => {
        const imageUrl = blog.thumbnail || blog.main_image;
        return imageUrl ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${imageUrl}`}
            alt={blog.title}
            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
          />
        ) : (
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-neutral-200 rounded-lg flex items-center justify-center">
            <FaNewspaper className="text-neutral-400 text-sm sm:text-xl" />
          </div>
        );
      },
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (blog) => (
        <div className="min-w-[150px]">
          <div className="font-semibold text-neutral-800 text-sm flex items-center gap-2">
            <span className="line-clamp-1">{blog.title}</span>
            {blog.is_featured && (
              <FaStar
                className="text-yellow-500 flex-shrink-0"
                title="Featured"
              />
            )}
          </div>
          <div className="text-xs text-neutral-500 mt-1 line-clamp-2">
            {blog.excerpt}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (blog) => getStatusBadge(blog.published_at),
    },
    {
      key: "published_at",
      label: "Published",
      sortable: true,
      render: (blog) => (
        <span className="text-xs sm:text-sm">
          {formatDate(blog.published_at)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (blog) => (
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => handleView(blog)}
            className="p-1.5 sm:p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all"
            title="View"
          >
            <FaEye size={14} className="sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => handleEdit(blog)}
            className="p-1.5 sm:p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all"
            title="Edit"
          >
            <FaEdit size={14} className="sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => handleDelete(blog)}
            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Delete"
          >
            <FaTrash size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      ),
    },
  ];

  const hasActiveFilters =
    searchQuery || filterStatus || filterCategory || filterFeatured;

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-800 flex items-center gap-2 sm:gap-3">
            <FaNewspaper className="text-primary-500 text-lg sm:text-xl" />
            Blog Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Manage your blog posts
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button
            variant="secondary"
            onClick={() =>
              (window.location.href = "/admin/blogs/blog-categories")
            }
            className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
          >
            Categories
          </Button>
          <Button
            variant="secondary"
            onClick={() => (window.location.href = "/admin/blogs/blog-tags")}
            className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
          >
            Tags
          </Button>
          <Button
            variant="primary"
            icon={<FaPlus />}
            onClick={handleAdd}
            className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
          >
            <span className="hidden sm:inline">Add Blog</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-neutral-600">Total</p>
              <p className="text-lg sm:text-2xl font-bold text-neutral-800">
                {blogs.length}
              </p>
            </div>
            <FaNewspaper className="text-xl sm:text-3xl text-primary-500" />
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-neutral-600">Published</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">
                {
                  blogs.filter(
                    (b) => getBlogStatus(b.published_at) === "published"
                  ).length
                }
              </p>
            </div>
            <FaEye className="text-xl sm:text-3xl text-green-500" />
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-neutral-600">Drafts</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-600">
                {
                  blogs.filter((b) => getBlogStatus(b.published_at) === "draft")
                    .length
                }
              </p>
            </div>
            <FaEyeSlash className="text-xl sm:text-3xl text-gray-500" />
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-neutral-600">Scheduled</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">
                {
                  blogs.filter(
                    (b) => getBlogStatus(b.published_at) === "scheduled"
                  ).length
                }
              </p>
            </div>
            <FaCalendarAlt className="text-xl sm:text-3xl text-blue-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Input
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-sm"
          />

          <div className="flex gap-2">
            <Button
              variant={showFilters ? "primary" : "secondary"}
              icon={<FaFilter />}
              onClick={() => setShowFilters(!showFilters)}
              className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap"
            >
              Filters{" "}
              {hasActiveFilters &&
                `(${
                  [
                    searchQuery,
                    filterStatus,
                    filterCategory,
                    filterFeatured,
                  ].filter(Boolean).length
                })`}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="secondary"
                icon={<FaTimes />}
                onClick={clearFilters}
                className="text-xs sm:text-sm px-3 sm:px-4"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 pt-3 border-t">
            <SelectWithSearch
              name="filterStatus"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              placeholder="All Statuses"
              options={[
                { value: "", label: "All Statuses" },
                { value: "published", label: "Published" },
                { value: "draft", label: "Draft" },
                { value: "scheduled", label: "Scheduled" },
              ]}
              className="text-sm"
            />

            <SelectWithSearch
              name="filterCategory"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              placeholder="All Categories"
              options={[
                { value: "", label: "All Categories" },
                ...categories.map((cat) => ({
                  value: cat.slug,
                  label: cat.name,
                })),
              ]}
              className="text-sm"
            />

            <SelectWithSearch
              name="filterFeatured"
              value={filterFeatured}
              onChange={(e) => setFilterFeatured(e.target.value)}
              placeholder="All Posts"
              options={[
                { value: "", label: "All Posts" },
                { value: "1", label: "Featured Only" },
                { value: "0", label: "Not Featured" },
              ]}
              className="text-sm"
            />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            data={sortedData}
            isLoading={isLoading}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        </div>

        {/* Pagination */}
        {storeTotalPages > 1 && (
          <div className="p-3 sm:p-4 border-t border-neutral-200">
            <Pagination
              currentPage={currentPage}
              totalPages={storeTotalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          resetForm();
        }}
        title={isAddModalOpen ? "Add New Blog Post" : "Edit Blog Post"}
        size="large"
      >
        <form
          onSubmit={isAddModalOpen ? handleSubmitAdd : handleSubmitEdit}
          className="space-y-6"
        >
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-neutral-800 border-b pb-2">
              Basic Information
            </h3>
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Enter blog post title"
              error={formErrors.title}
              required
            />

            <Input
              label="Slug (Auto-generated)"
              name="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="auto-generated-from-title"
              disabled
            />

            <Textarea
              label="Excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              placeholder="Brief description (shown in previews)"
              error={formErrors.excerpt}
              required
              rows={3}
            />
          </div>

          {/* Content Editor */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-neutral-800 border-b pb-2">
              Content
            </h3>
            <RichTextEditor
              label="Blog Content"
              name="content"
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Write your blog content..."
              error={formErrors.content}
              required
              height="350px"
            />
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-neutral-800 border-b pb-2">
              Images
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SimpleImageUpload
                label="Main Image"
                name="main_image"
                value={formData.main_image}
                onChange={(e) =>
                  setFormData({ ...formData, main_image: e.target.value })
                }
                accept="image/*"
                maxSize={5}
              />

              <SimpleImageUpload
                label="Thumbnail (Preview)"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.value })
                }
                accept="image/*"
                maxSize={2}
              />
            </div>
          </div>

          {/* Categories & Tags */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-neutral-800 border-b pb-2">
              Categories & Tags
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MultiSelectWithSearch
                label="Categories"
                name="categories"
                value={formData.categories}
                onChange={(e) =>
                  setFormData({ ...formData, categories: e.target.value })
                }
                options={categories.map((cat) => ({
                  value: cat.id,
                  label: `${cat.icon || ""} ${cat.name}`,
                }))}
              />

              <MultiSelectWithSearch
                label="Tags"
                name="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                options={tags.map((tag) => ({
                  value: tag.id,
                  label: tag.name,
                }))}
              />
            </div>
          </div>

          {/* Publishing Settings */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-neutral-800 border-b pb-2">
              Publishing Settings
            </h3>

            {/* Quick Action Buttons */}
            <div className="bg-neutral-50 p-4 rounded-lg">
              <p className="text-sm text-neutral-600 mb-3">Quick Actions:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setFormData({ ...formData, published_at: "" })}
                  className="text-sm"
                >
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    const now = new Date();
                    now.setSeconds(0, 0);
                    setFormData({
                      ...formData,
                      published_at: now.toISOString().slice(0, 16),
                    });
                  }}
                  className="text-sm"
                >
                  Publish Now
                </Button>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                💡 Leave blank for draft, or set a future date to schedule
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateInput
                label="Publish Date & Time (Optional)"
                name="published_at"
                type="datetime-local"
                value={formData.published_at}
                onChange={(e) =>
                  setFormData({ ...formData, published_at: e.target.value })
                }
                helperText={
                  formData.published_at
                    ? new Date(formData.published_at) > new Date()
                      ? "⏰ Scheduled"
                      : "✅ Published"
                    : "📝 Draft"
                }
              />

              <Input
                label="Display Order"
                name="order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <Checkbox
                label="Featured Post"
                name="is_featured"
                checked={formData.is_featured}
                onChange={(e) =>
                  setFormData({ ...formData, is_featured: e.target.checked })
                }
              />

              <Checkbox
                label="Allow Comments"
                name="allow_comments"
                checked={formData.allow_comments}
                onChange={(e) =>
                  setFormData({ ...formData, allow_comments: e.target.checked })
                }
              />
            </div>
          </div>

          {/* SEO Section */}
          <details className="space-y-4">
            <summary className="text-base font-semibold text-neutral-800 cursor-pointer hover:text-primary-600 transition-colors">
              SEO Settings (Optional)
            </summary>
            <div className="space-y-4 mt-4 pl-4 border-l-2 border-neutral-200">
              <Input
                label="Meta Title"
                name="meta_title"
                value={formData.meta_title}
                onChange={(e) =>
                  setFormData({ ...formData, meta_title: e.target.value })
                }
                placeholder="SEO title (max 60 characters)"
              />

              <Textarea
                label="Meta Description"
                name="meta_description"
                value={formData.meta_description}
                onChange={(e) =>
                  setFormData({ ...formData, meta_description: e.target.value })
                }
                placeholder="SEO description (max 160 characters)"
                rows={2}
              />

              <Input
                label="Meta Keywords"
                name="meta_keywords"
                value={formData.meta_keywords}
                onChange={(e) =>
                  setFormData({ ...formData, meta_keywords: e.target.value })
                }
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </details>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="flex-1"
            >
              {isAddModalOpen ? "Add Blog Post" : "Update Blog Post"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Blog Post Details"
        size="large"
      >
        {selectedBlog && (
          <div className="space-y-4">
            {/* Main Image */}
            {selectedBlog.main_image && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${selectedBlog.main_image}`}
                alt={selectedBlog.title}
                className="w-full h-48 sm:h-64 object-cover rounded-lg"
              />
            )}

            {/* Title & Meta */}
            <div>
              <div className="flex items-start gap-2 mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 flex-1">
                  {selectedBlog.title}
                </h2>
                {selectedBlog.is_featured && (
                  <FaStar className="text-yellow-500 text-lg flex-shrink-0 mt-1" />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-600">
                <span>{selectedBlog.author?.name}</span>
                <span>•</span>
                <span>{formatDate(selectedBlog.published_at)}</span>
                <span>•</span>
                <span>{selectedBlog.reading_time} min read</span>
                <span>•</span>
                <span>{selectedBlog.views_count} views</span>
              </div>
            </div>

            {/* Status */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-neutral-600 mb-2">
                Status
              </h4>
              {getStatusBadge(selectedBlog.published_at)}
            </div>

            {/* Excerpt */}
            {selectedBlog.excerpt && (
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-neutral-600 mb-2">
                  Excerpt
                </h4>
                <p className="text-sm text-neutral-800">
                  {selectedBlog.excerpt}
                </p>
              </div>
            )}

            {/* Content Preview */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-neutral-600 mb-2">
                Content Preview
              </h4>
              <div
                className="prose prose-sm max-w-none text-neutral-800"
                dangerouslySetInnerHTML={{
                  __html: selectedBlog.content?.substring(0, 500) + "...",
                }}
              />
            </div>

            {/* Categories */}
            {selectedBlog.categories && selectedBlog.categories.length > 0 && (
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-neutral-600 mb-2">
                  Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBlog.categories.map((category) => (
                    <span
                      key={category.id}
                      className="px-2 sm:px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs sm:text-sm"
                    >
                      {category.icon} {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {selectedBlog.tags && selectedBlog.tags.length > 0 && (
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-neutral-600 mb-2">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBlog.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 sm:px-3 py-1 bg-neutral-100 text-neutral-700 rounded-lg text-xs sm:text-sm"
                      style={{
                        backgroundColor: tag.color + "20",
                        color: tag.color,
                      }}
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* SEO Info */}
            {(selectedBlog.meta_title || selectedBlog.meta_description) && (
              <div className="bg-neutral-50 p-3 sm:p-4 rounded-lg">
                <h4 className="text-xs sm:text-sm font-semibold text-neutral-600 mb-2">
                  SEO Information
                </h4>
                {selectedBlog.meta_title && (
                  <div className="mb-2">
                    <span className="text-xs text-neutral-500">
                      Meta Title:
                    </span>
                    <p className="text-sm text-neutral-800">
                      {selectedBlog.meta_title}
                    </p>
                  </div>
                )}
                {selectedBlog.meta_description && (
                  <div>
                    <span className="text-xs text-neutral-500">
                      Meta Description:
                    </span>
                    <p className="text-sm text-neutral-800">
                      {selectedBlog.meta_description}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        itemName={selectedBlog?.title}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default BlogsPage;
