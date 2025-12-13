"use client";
import React, { useState, useEffect } from "react";
import { usePropertyTypeStore } from "@/store/usePropertyTypeStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import PropertyTypeModal from "@/components/(admin)/modals/PropertyTypeModal";
import LanguageSelector from "@/components/shared/LanguageSelector";
import Table from "@/components/shared/Table";
import Pagination from "@/components/shared/Pagination";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { Input, Button } from "@/components/shared/inputs";
import { FaPlus, FaEdit, FaTrash, FaHome } from "react-icons/fa";
import { toast } from "sonner";

const PropertyTypesPage = () => {
  const { propertyTypes, isLoading, fetchPropertyTypes, deletePropertyType } =
    usePropertyTypeStore();
  const { languages, fetchLanguages, getDefaultLanguage } = useLanguageStore();

  // Language state
  const [currentLanguage, setCurrentLanguage] = useState("en");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
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

  // Fetch property types on mount
  useEffect(() => {
    fetchPropertyTypes();
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

  // Fetch property types when language changes
  useEffect(() => {
    if (currentLanguage) {
      fetchPropertyTypes(currentLanguage);
    }
  }, [currentLanguage]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter and sort property types
  const getFilteredAndSortedPropertyTypes = () => {
    let filtered = propertyTypes;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((type) =>
        type.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const filteredPropertyTypes = getFilteredAndSortedPropertyTypes();

  // Pagination
  const totalPages = Math.ceil(filteredPropertyTypes.length / itemsPerPage);
  const paginatedPropertyTypes = filteredPropertyTypes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle add
  const handleAdd = () => {
    setSelectedPropertyType(null);
    setIsAddModalOpen(true);
  };

  // Handle edit
  const handleEdit = (propertyType) => {
    setSelectedPropertyType(propertyType);
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (propertyType) => {
    setSelectedPropertyType(propertyType);
    setIsDeleteModalOpen(true);
  };

  // Handle success callbacks
  const handleAddSuccess = (result) => {
    toast.success("Property type added successfully!");
    setIsAddModalOpen(false);
    fetchPropertyTypes(currentLanguage); // Refresh the list with current language
  };

  const handleEditSuccess = (result) => {
    toast.success("Property type updated successfully!");
    setIsEditModalOpen(false);
    fetchPropertyTypes(currentLanguage); // Refresh the list with current language
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedPropertyType) return;

    setIsSubmitting(true);
    try {
      await deletePropertyType(selectedPropertyType.id);
      toast.success("Property type deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedPropertyType(null);
      fetchPropertyTypes(currentLanguage); // Refresh the list with current language
    } catch (error) {
      toast.error("Failed to delete property type");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Table columns
  const columns = [
    { key: "id", label: "ID", sortable: true },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (propertyType) => (
        <div className="flex items-center gap-3">
          {propertyType.icon ? (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${propertyType.icon}`}
              alt={propertyType.name}
              className="w-10 h-10 object-cover rounded-lg border-2 border-neutral-200"
            />
          ) : (
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center border-2 border-neutral-200">
              <FaHome className="text-neutral-400" />
            </div>
          )}
          <span className="font-semibold text-neutral-800">
            {propertyType.name}
          </span>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      sortable: false,
      render: (propertyType) => (
        <div className="max-w-xs truncate">{propertyType.description}</div>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      sortable: true,
      render: (propertyType) => (
        <span
          className={`px-2 py-1 rounded-lg text-xs font-semibold ${
            propertyType.is_active
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {propertyType.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (propertyType) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(propertyType)}
            className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer"
            title="Edit"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(propertyType)}
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
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-3">
            <FaHome /> Property Types
          </h1>
          <p className="text-neutral-600 mt-1">
            Manage property types (Apartment, Villa, Studio, etc.)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector
            selectedLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
          />
          <Button variant="primary" icon={<FaPlus />} onClick={handleAdd}>
            Add Property Type
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <Input
          placeholder="Search property types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm">
        <Table
          columns={columns}
          data={paginatedPropertyTypes}
          isLoading={isLoading}
          sortConfig={sortConfig}
          onSort={handleSort}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-neutral-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Add Modal */}
      <PropertyTypeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
        mode="add"
        currentLanguage={currentLanguage}
      />

      {/* Edit Modal */}
      <PropertyTypeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        mode="edit"
        propertyType={selectedPropertyType}
        currentLanguage={currentLanguage}
      />

      {/* Delete Modal */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={selectedPropertyType?.name}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default PropertyTypesPage;
