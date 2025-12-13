"use client";
import React, { useState, useEffect } from "react";
import { useFacilityStore } from "@/store/useFacilityStore";
import { useFacilityCategoryStore } from "@/store/useFacilityCategoryStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import FacilityModal from "@/components/(admin)/modals/FacilityModal";
import LanguageSelector from "@/components/shared/LanguageSelector";
import Table from "@/components/shared/Table";
import Pagination from "@/components/shared/Pagination";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { Input, Button, Select } from "@/components/shared/inputs";
import { FaPlus, FaEdit, FaTrash, FaTools, FaImage } from "react-icons/fa";
import { toast } from "sonner";

const FacilitiesPage = () => {
  const { facilities, isLoading, fetchFacilities, deleteFacility } =
    useFacilityStore();
  const { facilityCategories, fetchFacilityCategories } =
    useFacilityCategoryStore();
  const { languages, fetchLanguages, getDefaultLanguage } = useLanguageStore();

  // Language state
  const [currentLanguage, setCurrentLanguage] = useState("en");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting states
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Fetch facilities on mount
  useEffect(() => {
    fetchFacilities();
    fetchLanguages();
    fetchFacilityCategories();
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

  // Fetch facilities when language changes
  useEffect(() => {
    if (currentLanguage) {
      fetchFacilities(currentLanguage);
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

  // Filter and sort facilities
  const getFilteredAndSortedFacilities = () => {
    let filtered = facilities;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((facility) =>
        facility.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory) {
      filtered = filtered.filter(
        (facility) => facility.category_id?.toString() === filterCategory
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

  const filteredFacilities = getFilteredAndSortedFacilities();

  // Pagination
  const totalPages = Math.ceil(filteredFacilities.length / itemsPerPage);
  const paginatedFacilities = filteredFacilities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle add
  const handleAdd = () => {
    setSelectedFacility(null);
    setIsAddModalOpen(true);
  };

  // Handle edit
  const handleEdit = (facility) => {
    setSelectedFacility(facility);
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (facility) => {
    setSelectedFacility(facility);
    setIsDeleteModalOpen(true);
  };

  // Handle success callbacks
  const handleAddSuccess = (result) => {
    toast.success("Facility added successfully!");
    setIsAddModalOpen(false);
    fetchFacilities(currentLanguage); // Refresh the list with current language
  };

  const handleEditSuccess = (result) => {
    toast.success("Facility updated successfully!");
    setIsEditModalOpen(false);
    fetchFacilities(currentLanguage); // Refresh the list with current language
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteFacility(selectedFacility.id);
      toast.success("Facility deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedFacility(null);
      fetchFacilities(currentLanguage); // Refresh the list with current language
    } catch (error) {
      const errorData = error.response?.data;
      toast.error(
        errorData?.error || errorData?.message || "Failed to delete facility"
      );
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
      render: (row) => (
        <span className="font-mono text-neutral-500">#{row.id}</span>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.icon ? (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${row.icon}`}
              alt={row.name}
              className="w-10 h-10 object-cover rounded-lg border-2 border-neutral-200"
            />
          ) : (
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center border-2 border-neutral-200">
              <FaImage className="text-neutral-400" />
            </div>
          )}
          <span className="font-semibold text-neutral-800">{row.name}</span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (row) => (
        <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-primary-100 text-primary-700">
          {row.category?.name || "No Category"}
        </span>
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
      key: "sort_order",
      label: "Sort Order",
      sortable: true,
      render: (row) => (
        <span className="text-neutral-600">{row.sort_order || 0}</span>
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
          <h1 className="text-3xl font-bold text-neutral-800">Facilities</h1>
          <p className="text-neutral-500 mt-1">Manage property facilities</p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector
            selectedLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
          />
          <Button icon={<FaPlus />} onClick={handleAdd}>
            Add Facility
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Search facilities by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<FaTools />}
          />
          <Select
            name="filterCategory"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={[
              { value: "", label: "All Categories" },
              ...facilityCategories
                .filter((cat) => cat.is_active)
                .map((cat) => ({
                  value: cat.id.toString(),
                  label: cat.name,
                })),
            ]}
            placeholder="Filter by category"
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedFacilities}
        onSort={handleSort}
        sortConfig={sortConfig}
        isLoading={isLoading}
        emptyMessage="No facilities found. Add your first facility to get started!"
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
      <FacilityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
        mode="add"
        currentLanguage={currentLanguage}
      />

      {/* Edit Modal */}
      <FacilityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        mode="edit"
        facility={selectedFacility}
        currentLanguage={currentLanguage}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Facility"
        message="Are you sure you want to delete this facility?"
        itemName={selectedFacility?.name}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default FacilitiesPage;
