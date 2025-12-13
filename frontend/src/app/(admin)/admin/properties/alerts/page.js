"use client";
import React, { useState, useEffect } from "react";
import { useAlertStore } from "@/store/useAlertStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import AlertModal from "@/components/(admin)/modals/AlertModal";
import LanguageSelector from "@/components/shared/LanguageSelector";
import Table from "@/components/shared/Table";
import Pagination from "@/components/shared/Pagination";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { Input, Button, Select } from "@/components/shared/inputs";
import { FaPlus, FaEdit, FaTrash, FaBell } from "react-icons/fa";
import { toast } from "sonner";

const AlertsPage = () => {
  const { alerts, isLoading, fetchAlerts, deleteAlert } = useAlertStore();
  const { languages, fetchLanguages, getDefaultLanguage } = useLanguageStore();

  // Language state
  const [currentLanguage, setCurrentLanguage] = useState("en");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [selectedAlert, setSelectedAlert] = useState(null);
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

  // Fetch alerts on mount
  useEffect(() => {
    fetchAlerts();
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

  // Fetch alerts when language changes
  useEffect(() => {
    if (currentLanguage) {
      fetchAlerts(currentLanguage);
    }
  }, [currentLanguage]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter and sort alerts
  const getFilteredAndSortedAlerts = () => {
    let filtered = alerts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((alert) =>
        alert.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const filteredAlerts = getFilteredAndSortedAlerts();

  // Pagination
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle add
  const handleAdd = () => {
    setSelectedAlert(null);
    setIsAddModalOpen(true);
  };

  // Handle edit
  const handleEdit = (alert) => {
    setSelectedAlert(alert);
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (alert) => {
    setSelectedAlert(alert);
    setIsDeleteModalOpen(true);
  };

  // Handle success callbacks
  const handleAddSuccess = (result) => {
    toast.success("Alert added successfully!");
    setIsAddModalOpen(false);
    fetchAlerts(currentLanguage); // Refresh the list with current language
  };

  const handleEditSuccess = (result) => {
    toast.success("Alert updated successfully!");
    setIsEditModalOpen(false);
    fetchAlerts(currentLanguage); // Refresh the list with current language
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteAlert(selectedAlert.id);
      toast.success("Alert deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedAlert(null);
      fetchAlerts(currentLanguage); // Refresh the list with current language
    } catch (error) {
      const errorData = error.response?.data;
      toast.error(
        errorData?.error || errorData?.message || "Failed to delete alert"
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
              <FaBell className="text-neutral-400" />
            </div>
          )}
          <span className="font-semibold text-neutral-800">{row.name}</span>
        </div>
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
          <h1 className="text-3xl font-bold text-neutral-800">
            Alerts & House Rules
          </h1>
          <p className="text-neutral-500 mt-1">
            Manage property alerts and house rules
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector
            selectedLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
          />
          <Button icon={<FaPlus />} onClick={handleAdd}>
            Add Alert
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4">
        <Input
          placeholder="Search alerts by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<FaBell />}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedAlerts}
        onSort={handleSort}
        sortConfig={sortConfig}
        isLoading={isLoading}
        emptyMessage="No alerts found. Add your first alert to get started!"
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
      <AlertModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
        mode="add"
        currentLanguage={currentLanguage}
      />

      {/* Edit Modal */}
      <AlertModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        mode="edit"
        alert={selectedAlert}
        currentLanguage={currentLanguage}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Alert"
        message="Are you sure you want to delete this alert?"
        itemName={selectedAlert?.name}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AlertsPage;
