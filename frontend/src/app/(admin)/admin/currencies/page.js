"use client";
import React, { useState, useEffect } from "react";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import CurrencyModal from "@/components/(admin)/modals/CurrencyModal";
import LanguageSelector from "@/components/shared/LanguageSelector";
import Table from "@/components/shared/Table";
import Pagination from "@/components/shared/Pagination";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { Input, Button } from "@/components/shared/inputs";
import { FaPlus, FaEdit, FaTrash, FaDollarSign, FaStar } from "react-icons/fa";
import { toast } from "sonner";

const CurrenciesPage = () => {
  const { currencies, isLoading, fetchCurrencies, deleteCurrency } =
    useCurrencyStore();
  const { languages, fetchLanguages, getDefaultLanguage } = useLanguageStore();

  // Language state
  const [currentLanguage, setCurrentLanguage] = useState("en");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting states
  const [sortConfig, setSortConfig] = useState({
    key: "code",
    direction: "asc",
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch currencies on mount
  useEffect(() => {
    fetchCurrencies();
    fetchLanguages();
  }, [fetchCurrencies, fetchLanguages]);

  // Set default language when languages are loaded
  useEffect(() => {
    if (languages.length > 0) {
      const defaultLang = getDefaultLanguage();
      if (defaultLang) {
        setCurrentLanguage(defaultLang.code);
      }
    }
  }, [languages, getDefaultLanguage]);

  // Fetch currencies when language changes
  useEffect(() => {
    if (currentLanguage) {
      fetchCurrencies(currentLanguage);
    }
  }, [currentLanguage, fetchCurrencies]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter and sort currencies
  const getFilteredAndSortedCurrencies = () => {
    let filtered = currencies;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (currency) =>
          currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          currency.symbol.includes(searchQuery)
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

  const filteredCurrencies = getFilteredAndSortedCurrencies();

  // Pagination
  const totalPages = Math.ceil(filteredCurrencies.length / itemsPerPage);
  const paginatedCurrencies = filteredCurrencies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle add
  const handleAdd = () => {
    setSelectedCurrency(null);
    setIsAddModalOpen(true);
  };

  // Handle edit
  const handleEdit = (currency) => {
    setSelectedCurrency(currency);
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (currency) => {
    setSelectedCurrency(currency);
    setIsDeleteModalOpen(true);
  };

  // Handle modal close and refresh
  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    fetchCurrencies(currentLanguage); // Refresh the list with current language
  };

  // Handle success callbacks
  const handleAddSuccess = (result) => {
    toast.success("Currency added successfully!");
    setIsAddModalOpen(false);
    fetchCurrencies(currentLanguage); // Refresh the list with current language
  };

  const handleEditSuccess = (result) => {
    toast.success("Currency updated successfully!");
    setIsEditModalOpen(false);
    fetchCurrencies(currentLanguage); // Refresh the list with current language
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteCurrency(selectedCurrency.id);
      toast.success("Currency deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedCurrency(null);
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.error) {
        toast.error(errorData.error);
      } else {
        toast.error(errorData?.message || "Failed to delete currency");
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
      key: "code",
      label: "Currency",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-neutral-600">
              {row.symbol}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-800">{row.code}</span>
              {row.is_default && (
                <FaStar className="text-yellow-500" size={14} title="Default" />
              )}
            </div>
            <div className="text-xs text-neutral-500">{row.name}</div>
          </div>
        </div>
      ),
    },
    {
      key: "exchange_rate",
      label: "Exchange Rate",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-neutral-700">
          {parseFloat(row.exchange_rate).toFixed(4)}
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
          <h1 className="text-3xl font-bold text-neutral-800">Currencies</h1>
          <p className="text-neutral-500 mt-1">
            Manage currencies and exchange rates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector
            selectedLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            size="md"
          />
          <Button icon={<FaPlus />} onClick={handleAdd}>
            Add Currency
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4">
        <Input
          placeholder="Search currencies by code or symbol..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<FaDollarSign />}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedCurrencies}
        onSort={handleSort}
        sortConfig={sortConfig}
        isLoading={isLoading}
        emptyMessage="No currencies found. Add your first currency to get started!"
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
      <CurrencyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
        mode="add"
      />

      {/* Edit Modal */}
      <CurrencyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        mode="edit"
        currency={selectedCurrency}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Currency"
        message="Are you sure you want to delete this currency?"
        itemName={`${selectedCurrency?.code} (${selectedCurrency?.symbol})`}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CurrenciesPage;
