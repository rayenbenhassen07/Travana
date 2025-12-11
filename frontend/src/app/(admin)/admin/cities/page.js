"use client";
import React, { useState, useEffect } from "react";
import { useCityStore } from "@/store/useCityStore";
import Table from "@/components/shared/Table";
import Pagination from "@/components/shared/Pagination";
import Modal from "@/components/shared/Modal";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { Input, Button } from "@/components/shared/inputs";
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "sonner";

const CitiesPage = () => {
  const { cities, isLoading, fetchCities, addCity, updateCity, deleteCity } =
    useCityStore();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({ name: "" });
  const [formErrors, setFormErrors] = useState({});
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
  }, [fetchCities]);

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

  // Reset form
  const resetForm = () => {
    setFormData({ name: "" });
    setFormErrors({});
    setSelectedCity(null);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "City name is required";
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
  const handleEdit = (city) => {
    setSelectedCity(city);
    setFormData({ name: city.name });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (city) => {
    setSelectedCity(city);
    setIsDeleteModalOpen(true);
  };

  // Submit add
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await addCity(formData.name);
      toast.success("City added successfully!");
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      const errorData = error.response?.data;

      // Handle validation errors
      if (errorData?.errors) {
        const errors = {};
        Object.keys(errorData.errors).forEach((key) => {
          errors[key] = errorData.errors[key][0];
        });
        setFormErrors(errors);

        // Show first error in toast
        const firstError = Object.values(errorData.errors)[0][0];
        toast.error(firstError);
      } else {
        toast.error(errorData?.message || "Failed to add city");
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
      await updateCity(selectedCity.id, formData.name);
      toast.success("City updated successfully!");
      setIsEditModalOpen(false);
      resetForm();
    } catch (error) {
      const errorData = error.response?.data;

      // Handle validation errors
      if (errorData?.errors) {
        const errors = {};
        Object.keys(errorData.errors).forEach((key) => {
          errors[key] = errorData.errors[key][0];
        });
        setFormErrors(errors);

        // Show first error in toast
        const firstError = Object.values(errorData.errors)[0][0];
        toast.error(firstError);
      } else {
        toast.error(errorData?.message || "Failed to update city");
      }
    } finally {
      setIsSubmitting(false);
    }
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

      // Show detailed error message
      if (errorData?.error) {
        toast.error(errorData.error);
      } else {
        toast.error(errorData?.message || "Failed to delete city");
      }

      // Keep modal open to show the error
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
            <FaMapMarkerAlt className="text-neutral-600" />
          </div>
          <span className="font-semibold text-neutral-800">{row.name}</span>
        </div>
      ),
    },
    {
      key: "listings_count",
      label: "Listings",
      sortable: true,
      render: (row) => (
        <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium">
          {row.listings?.length || 0} listings
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
          <h1 className="text-3xl font-bold text-neutral-800">Cities</h1>
          <p className="text-neutral-500 mt-1">Manage cities and locations</p>
        </div>
        <Button icon={<FaPlus />} onClick={handleAdd}>
          Add City
        </Button>
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
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New City"
        size="md"
      >
        <form onSubmit={handleSubmitAdd} className="space-y-4">
          <Input
            label="City Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter city name"
            error={formErrors.name}
            required
            icon={<FaMapMarkerAlt />}
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
              Add City
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit City"
        size="md"
      >
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          <Input
            label="City Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter city name"
            error={formErrors.name}
            required
            icon={<FaMapMarkerAlt />}
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
              Update City
            </Button>
          </div>
        </form>
      </Modal>

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
