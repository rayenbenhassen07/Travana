"use client";
import React, { useState, useEffect } from "react";
import { useFacilityCategoryStore } from "@/store/useFacilityCategoryStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import FacilityCategoryModal from "@/components/(admin)/modals/FacilityCategoryModal";
import LanguageSelector from "@/components/shared/LanguageSelector";
import Table from "@/components/shared/Table";
import Pagination from "@/components/shared/Pagination";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { Input, Button } from "@/components/shared/inputs";
import { FaPlus, FaEdit, FaTrash, FaTag } from "react-icons/fa";
import { toast } from "sonner";

const FacilityCategoriesPage = () => {
  const {
    facilityCategories,
    isLoading,
    fetchFacilityCategories,
    deleteFacilityCategory,
  } = useFacilityCategoryStore();
  const { languages, fetchLanguages, getDefaultLanguage } = useLanguageStore();

  // Language state
  const [currentLanguage, setCurrentLanguage] = useState("en");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting states
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch facility categories on mount
  useEffect(() => {
    fetchFacilityCategories();
    fetchLanguages();
  }, []);

  // Set default language when languages are loaded
  useEffect(() => {
    if (languages.length > 0) {
      const defaultLang = getDefaultLanguage();
      if (defaultLang) {
        setCurrentLanguage(defaultLang.code);
      }
    }
  }, [languages.length]);

  // Fetch facility categories when language changes
  useEffect(() => {
    if (currentLanguage) {
      fetchFacilityCategories(currentLanguage);
    }
  }, [currentLanguage]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter and sort facility categories
  const getFilteredAndSortedCategories = () => {
    let filtered = facilityCategories;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Handle add
  const handleAdd = () => {
    setSelectedCategory(null);
    setIsAddModalOpen(true);
  };

  // Handle edit
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  // Handle success callbacks
  const handleAddSuccess = (result) => {
    toast.success("Facility category added successfully!");
    setIsAddModalOpen(false);
    fetchFacilityCategories(currentLanguage);
  };

  const handleEditSuccess = (result) => {
    toast.success("Facility category updated successfully!");
    setIsEditModalOpen(false);
    fetchFacilityCategories(currentLanguage);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedCategory) return;

    setIsSubmitting(true);
    try {
      await deleteFacilityCategory(selectedCategory.id);
      toast.success("Facility category deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      fetchFacilityCategories(currentLanguage);
    } catch (error) {
      toast.error("Failed to delete facility category");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Table columns
  const columns = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      render: (category) => (
        <span className="font-mono text-neutral-500">#{category.id}</span>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (category) => (
        <div className="flex items-center gap-3">
          <span className="font-semibold text-neutral-800">
            {category.name}
          </span>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      sortable: false,
      render: (category) => (
        <span className="text-neutral-600 line-clamp-2">
          {category.description || "No description"}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      sortable: true,
      render: (category) => (
        <span
          className={`px-2 py-1 rounded-lg text-xs font-semibold ${
            category.is_active
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {category.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (category) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(category)}
            className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer"
            title="Edit"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(category)}
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
          <h1 className="text-3xl font-bold text-neutral-800">
            Facility Categories
          </h1>
          <p className="text-neutral-500 mt-1">
            Manage your facility categories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector
            selectedLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
          />
          <Button onClick={handleAdd} icon={<FaPlus />}>
            Add Category
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4">
        <div className="flex-1">
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<FaTag />}
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedCategories}
        isLoading={isLoading}
        onSort={handleSort}
        sortConfig={sortConfig}
        emptyMessage="No facility categories found. Add your first category to get started!"
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

      {/* Modals */}
      <FacilityCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        mode="add"
        currentLanguage={currentLanguage}
        onSuccess={handleAddSuccess}
      />

      <FacilityCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        category={selectedCategory}
        currentLanguage={currentLanguage}
        onSuccess={handleEditSuccess}
      />

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Facility Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default FacilityCategoriesPage;
