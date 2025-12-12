"use client";
import React, { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import Table from "@/components/shared/Table";
import Pagination from "@/components/shared/Pagination";
import Modal from "@/components/shared/Modal";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { Input, Select, Button } from "@/components/shared/inputs";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserShield,
  FaPhone,
} from "react-icons/fa";
import { toast } from "sonner";

const UsersPage = () => {
  const { users, isLoading, fetchUsers, addUser, updateUser, deleteUser } =
    useUserStore();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    user_type: "user",
    send_welcome_email: true,
  });
  const [formErrors, setFormErrors] = useState({});
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

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      user_type: "user",
      send_welcome_email: true,
    });
    setFormErrors({});
    setSelectedUser(null);
  };

  // Validate form
  const validateForm = (isEdit = false) => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    // Password validation only for edit mode when password is provided
    if (isEdit && formData.password && formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
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
  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Don't pre-fill password
      phone: user.phone || "",
      user_type: user.user_type,
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Submit add
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Don't send password field - backend will generate it
      const { password, ...dataToSend } = formData;
      await addUser(dataToSend);
      toast.success("User created successfully! A welcome email has been sent with login credentials.");
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
        toast.error(errorData?.message || "Failed to add user");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit edit
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    setIsSubmitting(true);
    try {
      // Only include password if it's been changed
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        user_type: formData.user_type,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await updateUser(selectedUser.id, updateData);
      toast.success("User updated successfully!");
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
        toast.error(errorData?.message || "Failed to update user");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteUser(selectedUser.id);
      toast.success("User deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
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
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
        size="md"
      >
        <form onSubmit={handleSubmitAdd} className="space-y-4">
          {/* Info Message */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="shrink-0">
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 font-medium">
                  A temporary password will be automatically generated and sent to the user via email.
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  The user will be advised to change their password after first login.
                </p>
              </div>
            </div>
          </div>

          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter user name"
            error={formErrors.name}
            required
            icon={<FaUser />}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter email address"
            error={formErrors.email}
            required
            icon={<FaEnvelope />}
          />

          <Input
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="+216 XX XXX XXX"
            error={formErrors.phone}
            icon={<FaPhone />}
          />

          <Select
            label="User Type"
            name="user_type"
            value={formData.user_type}
            onChange={(e) =>
              setFormData({ ...formData, user_type: e.target.value })
            }
            options={userTypeOptions}
            required
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
              Create User & Send Email
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
        size="md"
      >
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter user name"
            error={formErrors.name}
            required
            icon={<FaUser />}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter email address"
            error={formErrors.email}
            required
            icon={<FaEnvelope />}
          />

          <Input
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="+216 XX XXX XXX"
            error={formErrors.phone}
            icon={<FaPhone />}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Leave blank to keep current password"
            error={formErrors.password}
            icon={<FaLock />}
          />

          <Select
            label="User Type"
            name="user_type"
            value={formData.user_type}
            onChange={(e) =>
              setFormData({ ...formData, user_type: e.target.value })
            }
            options={userTypeOptions}
            required
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
              Update User
            </Button>
          </div>
        </form>
      </Modal>

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
