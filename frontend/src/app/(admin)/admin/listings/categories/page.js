"use client";
import React, { useState, useEffect } from "react";
import { useCategoryStore } from "@/store/useCategoryStore";
import Table from "@/components/shared/Table";
import Pagination from "@/components/shared/Pagination";
import Modal from "@/components/shared/Modal";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { Input, Textarea, Button, FileInput } from "@/components/shared/inputs";
import { FaPlus, FaEdit, FaTrash, FaTag, FaImage } from "react-icons/fa";
import { toast } from "sonner";

const CategoriesPage = () => {
  const {
    categories,
    isLoading,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryStore();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    logo: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting states
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "asc",
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter and sort categories
  const getFilteredAndSortedCategories = () => {
    let filtered = categories;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((category) =>
        category.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  };

  const filteredCategories = getFilteredAndSortedCategories();

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset form
  const resetForm = () => {
    setFormData({ title: "", description: "", logo: null });
    setFormErrors({});
    setSelectedCategory(null);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Title is required";
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
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      title: category.title,
      description: category.description || "",
      logo: category.logo,
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  // Submit add
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      if (formData.logo && formData.logo instanceof File) {
        formDataToSend.append("logo", formData.logo);
      }

      await addCategory(formDataToSend);
      toast.success("Category added successfully!");
      setIsAddModalOpen(false);
      resetForm();
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
        toast.error(errorData?.message || "Failed to add category");
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
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("_method", "PUT");

      if (formData.logo && formData.logo instanceof File) {
        formDataToSend.append("logo", formData.logo);
      }

      await updateCategory(selectedCategory.id, formDataToSend);
      toast.success("Category updated successfully!");
      setIsEditModalOpen(false);
      resetForm();
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
        toast.error(errorData?.message || "Failed to update category");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteCategory(selectedCategory.id);
      toast.success("Category deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      const errorData = error.response?.data;
      toast.error(
        errorData?.error || errorData?.message || "Failed to delete category"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
    }
  };

  // Table columns
  const columns = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-neutral-500">#{row.id}</span>
      ),
    },
    {
      key: "logo",
      label: "Logo",
      render: (row) => (
        <div className="flex items-center">
          {row.logo ? (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${row.logo}`}
              alt={row.title}
              className="w-12 h-12 object-cover rounded-lg border-2 border-neutral-200"
            />
          ) : (
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center border-2 border-neutral-200">
              <FaImage className="text-neutral-400" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-neutral-800">{row.title}</span>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (row) => (
        <span className="text-neutral-600 line-clamp-2">
          {row.description || "No description"}
        </span>
      ),
    },
    {
      key: "listings_count",
      label: "Listings",
      sortable: true,
      render: (row) => (
        <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium">
          {row.listings_count || 0}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer"
            title="Edit"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer"
            title="Delete"
          >
            <FaTrash size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Categories</h1>
          <p className="text-neutral-500 mt-1">Manage listing categories</p>
        </div>
        <Button icon={<FaPlus />} onClick={handleAdd}>
          Add Category
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4">
        <Input
          placeholder="Search categories by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<FaTag />}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedCategories}
        onSort={handleSort}
        sortConfig={sortConfig}
        isLoading={isLoading}
        emptyMessage="No categories found. Add your first category to get started!"
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Category"
        size="md"
      >
        <form onSubmit={handleSubmitAdd} className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter category title"
            error={formErrors.title}
            required
            icon={<FaTag />}
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter category description"
            rows={3}
          />

          <FileInput
            label="Logo"
            name="logo"
            onChange={handleFileChange}
            accept="image/*"
            icon={<FaImage />}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
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
              Add Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Category"
        size="md"
      >
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter category title"
            error={formErrors.title}
            required
            icon={<FaTag />}
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter category description"
            rows={3}
          />

          <FileInput
            label="Logo"
            name="logo"
            onChange={handleFileChange}
            accept="image/*"
            currentFile={formData.logo}
            icon={<FaImage />}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
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
              Update Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        itemName={selectedCategory?.title}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CategoriesPage;
