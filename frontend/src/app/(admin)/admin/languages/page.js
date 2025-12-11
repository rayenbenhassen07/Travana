"use client";
import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import LanguageModal from "@/components/(admin)/modals/LanguageModal";
import Table from "@/components/shared/Table";
import Pagination from "@/components/shared/Pagination";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { Input, Button } from "@/components/shared/inputs";
import { FaPlus, FaEdit, FaTrash, FaGlobe, FaStar } from "react-icons/fa";
import { toast } from "sonner";

const LanguagesPage = () => {
  const { languages, isLoading, fetchLanguages, deleteLanguage } =
    useLanguageStore();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [selectedLanguage, setSelectedLanguage] = useState(null);
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

  // Fetch languages on mount
  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter and sort languages
  const getFilteredAndSortedLanguages = () => {
    let filtered = languages;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (language) =>
          language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          language.code.toLowerCase().includes(searchQuery.toLowerCase())
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

  const filteredLanguages = getFilteredAndSortedLanguages();

  // Pagination
  const totalPages = Math.ceil(filteredLanguages.length / itemsPerPage);
  const paginatedLanguages = filteredLanguages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle add
  const handleAdd = () => {
    setSelectedLanguage(null);
    setIsAddModalOpen(true);
  };

  // Handle edit
  const handleEdit = (language) => {
    setSelectedLanguage(language);
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (language) => {
    setSelectedLanguage(language);
    setIsDeleteModalOpen(true);
  };

  // Handle modal close and refresh
  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    fetchLanguages(); // Refresh the list
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteLanguage(selectedLanguage.id);
      toast.success("Language deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedLanguage(null);
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.error) {
        toast.error(errorData.error);
      } else {
        toast.error(errorData?.message || "Failed to delete language");
      }
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
      label: "Language",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-800">{row.name}</span>
              {row.is_default && (
                <FaStar className="text-yellow-500" size={14} title="Default" />
              )}
            </div>
            <div className="text-xs text-neutral-500 uppercase">{row.code}</div>
          </div>
        </div>
      ),
    },
    {
      key: "code",
      label: "Code",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-neutral-700 uppercase">{row.code}</span>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            row.is_active
              ? "bg-green-100 text-green-700"
              : "bg-neutral-100 text-neutral-500"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
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
            className="p-2 text-neutral-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all cursor-pointer"
            title="Edit"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-2 text-neutral-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all cursor-pointer"
            title="Delete"
            disabled={row.is_default}
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
          <h1 className="text-3xl font-bold text-neutral-800">Languages</h1>
          <p className="text-neutral-500 mt-1">
            Manage available languages for your platform
          </p>
        </div>
        <Button icon={<FaPlus />} onClick={handleAdd}>
          Add Language
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4">
        <Input
          placeholder="Search languages by name or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<FaGlobe />}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedLanguages}
        onSort={handleSort}
        sortConfig={sortConfig}
        isLoading={isLoading}
        emptyMessage="No languages found. Add your first language to get started!"
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
      <LanguageModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        mode="add"
      />

      {/* Edit Modal */}
      <LanguageModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        mode="edit"
        language={selectedLanguage}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Language"
        message="Are you sure you want to delete this language?"
        itemName={selectedLanguage?.name}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default LanguagesPage;
