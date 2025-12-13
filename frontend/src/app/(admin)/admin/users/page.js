"use client";
import React, { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import UserModal from "@/components/(admin)/modals/UserModal";
import Table from "@/components/shared/Table";
import Pagination from "@/components/shared/Pagination";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { Input, Button } from "@/components/shared/inputs";
import { FaPlus, FaEdit, FaTrash, FaUser } from "react-icons/fa";
import { toast } from "sonner";

const UsersPage = () => {
  const { users, isLoading, fetchUsers, deleteUser } = useUserStore();
  const { fetchLanguages } = useLanguageStore();
  const { fetchCurrencies } = useCurrencyStore();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [selectedUser, setSelectedUser] = useState(null);
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

  // Fetch users, languages, and currencies on mount
  useEffect(() => {
    fetchUsers();
    fetchLanguages();
    fetchCurrencies();
  }, [fetchUsers, fetchLanguages, fetchCurrencies]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter and sort users
  const getFilteredAndSortedUsers = () => {
    let filtered = users;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
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

  const filteredUsers = getFilteredAndSortedUsers();

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle add
  const handleAdd = () => {
    setSelectedUser(null);
    setIsAddModalOpen(true);
  };

  // Handle edit
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Handle success callbacks
  const handleAddSuccess = (result) => {
    toast.success("User added successfully!");
    setIsAddModalOpen(false);
    fetchUsers(); // Refresh the list
  };

  const handleEditSuccess = (result) => {
    toast.success("User updated successfully!");
    setIsEditModalOpen(false);
    fetchUsers(); // Refresh the list
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteUser(selectedUser.id);
      toast.success("User deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.error) {
        toast.error(errorData.error);
      } else {
        toast.error(errorData?.message || "Failed to delete user");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // User type options
  const userTypeOptions = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
  ];

  // Get type badge color
  const getTypeBadge = (type) => {
    return type === "admin"
      ? "bg-primary-100 text-primary-700"
      : "bg-neutral-100 text-neutral-700";
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
            <FaUser className="text-neutral-600 text-sm" />
          </div>
          <span className="font-semibold text-neutral-800">{row.name}</span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (row) => <span className="text-neutral-600">{row.email}</span>,
    },
    {
      key: "user_type",
      label: "Type",
      sortable: true,
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeBadge(
            row.user_type
          )}`}
        >
          {row.user_type === "admin" ? "Admin" : "User"}
        </span>
      ),
    },
    {
      key: "stats",
      label: "Activity",
      render: (row) => (
        <div className="text-sm text-neutral-600">
          {row.listings?.length || 0} listings •{" "}
          {row.listingReservations?.length ||
            row.listing_reservations?.length ||
            0}{" "}
          reservations
        </div>
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
          <h1 className="text-3xl font-bold text-neutral-800">Users</h1>
          <p className="text-neutral-500 mt-1">Manage users and permissions</p>
        </div>
        <Button icon={<FaPlus />} onClick={handleAdd}>
          Add User
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4">
        <Input
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<FaUser />}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedUsers}
        onSort={handleSort}
        sortConfig={sortConfig}
        isLoading={isLoading}
        emptyMessage="No users found. Add your first user to get started!"
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
      <UserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
        mode="add"
      />

      {/* Edit Modal */}
      <UserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        mode="edit"
        user={selectedUser}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        itemName={selectedUser?.name}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default UsersPage;
