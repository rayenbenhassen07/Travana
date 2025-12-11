"use client";
import React, { useState, useEffect } from "react";
import { useCityStore } from "@/store/useCityStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import CityModal from "@/components/(admin)/modals/CityModal";
import LanguageSelector from "@/components/shared/LanguageSelector";
import Table from "@/components/shared/Table";
import Pagination from "@/components/shared/Pagination";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { Input, Button } from "@/components/shared/inputs";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaGlobe,
} from "react-icons/fa";
import { toast } from "sonner";

const CitiesPage = () => {
  const { cities, isLoading, fetchCities, deleteCity } = useCityStore();
  const { languages, fetchLanguages, getDefaultLanguage } = useLanguageStore();

  // Language state
  const [currentLanguage, setCurrentLanguage] = useState("en");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [selectedCity, setSelectedCity] = useState(null);
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

  // Fetch cities on mount
  useEffect(() => {
    fetchCities();
    fetchLanguages();
  }, [fetchCities, fetchLanguages]);

  // Set default language when languages are loaded
  useEffect(() => {
    if (languages.length > 0) {
      const defaultLang = getDefaultLanguage();
      if (defaultLang) {
        setCurrentLanguage(defaultLang.code);
      }
    }
  }, [languages, getDefaultLanguage]);

  // Fetch cities when language changes
  useEffect(() => {
    if (currentLanguage) {
      fetchCities(currentLanguage);
    }
  }, [currentLanguage, fetchCities]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter and sort cities
  const getFilteredAndSortedCities = () => {
    let filtered = cities;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const filteredCities = getFilteredAndSortedCities();

  // Pagination
  const totalPages = Math.ceil(filteredCities.length / itemsPerPage);
  const paginatedCities = filteredCities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle add
  const handleAdd = () => {
    setSelectedCity(null);
    setIsAddModalOpen(true);
  };

  // Handle edit
  const handleEdit = (city) => {
    setSelectedCity(city);
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (city) => {
    setSelectedCity(city);
    setIsDeleteModalOpen(true);
  };

  // Handle success callbacks
  const handleAddSuccess = (result) => {
    toast.success("City added successfully!");
    setIsAddModalOpen(false);
    fetchCities(currentLanguage); // Refresh the list with current language
  };

  const handleEditSuccess = (result) => {
    toast.success("City updated successfully!");
    setIsEditModalOpen(false);
    fetchCities(currentLanguage); // Refresh the list with current language
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteCity(selectedCity.id);
      toast.success("City deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedCity(null);
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.error) {
        toast.error(errorData.error);
      } else {
        toast.error(errorData?.message || "Failed to delete city");
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
      label: "City Name",
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
              <FaMapMarkerAlt className="text-neutral-600" />
            </div>
            <div>
              <span className="font-semibold text-neutral-800">{row.name}</span>
              <div className="text-xs text-neutral-500">/{row.slug}</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (row) => (
        <div className="text-sm text-neutral-600">
          {row.latitude && row.longitude ? (
            <span className="font-mono text-xs">
              {parseFloat(row.latitude).toFixed(4)},{" "}
              {parseFloat(row.longitude).toFixed(4)}
            </span>
          ) : (
            <span className="text-neutral-400">No coordinates</span>
          )}
        </div>
      ),
    },
    {
      key: "listings_count",
      label: "Listings",
      sortable: true,
      render: (row) => (
        <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium">
          {row.listings_count || 0} listings
        </span>
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
          <h1 className="text-3xl font-bold text-neutral-800">Cities</h1>
          <p className="text-neutral-500 mt-1">Manage cities and locations</p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector
            selectedLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            size="md"
          />
          <Button icon={<FaPlus />} onClick={handleAdd}>
            Add City
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4">
        <Input
          placeholder="Search cities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<FaMapMarkerAlt />}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedCities}
        onSort={handleSort}
        sortConfig={sortConfig}
        isLoading={isLoading}
        emptyMessage="No cities found. Add your first city to get started!"
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
      <CityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
        mode="add"
      />

      {/* Edit Modal */}
      <CityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        mode="edit"
        city={selectedCity}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete City"
        message="Are you sure you want to delete this city?"
        itemName={selectedCity?.name}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CitiesPage;
