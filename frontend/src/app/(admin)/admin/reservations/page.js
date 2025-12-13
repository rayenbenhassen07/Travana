"use client";
import React, { useState, useEffect } from "react";
// import { useReservationStore } from "@/store/useReservationStore";
import { useUserStore } from "@/store/useUserStore";
import Table from "@/components/shared/Table";
import Pagination from "@/components/shared/Pagination";
import Modal from "@/components/shared/Modal";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import {
  Input,
  Textarea,
  SelectWithSearch,
  Button,
} from "@/components/shared/inputs";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendar,
  FaUser,
  FaHome,
  FaUsers,
  FaDollarSign,
} from "react-icons/fa";
import { toast } from "sonner";
import axios from "@/lib/axios";

const ReservationsPage = () => {
  const {
    reservations,
    isLoading,
    fetchReservations,
    addReservation,
    updateReservation,
    deleteReservation,
  } = useReservationStore();
  const { users, fetchUsers } = useUserStore();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isListingViewModalOpen, setIsListingViewModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    user_id: "",
    listing_id: "",
    start_date: "",
    end_date: "",
    guest_count: 1,
    client_type: "family",
    details: "",
    is_blocked: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Listings state
  const [listings, setListings] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting states
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Filter state
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch data on mount
  useEffect(() => {
    fetchReservations();
    fetchUsers();
    fetchListings();
  }, []);

  // Fetch listings
  const fetchListings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/listings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle paginated response
      if (response.data.data) {
        setListings(response.data.data);
      } else {
        setListings(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    }
  };

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter and sort reservations
  const getFilteredAndSortedReservations = () => {
    let filtered = reservations;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((reservation) => {
        const userName = reservation.user?.name?.toLowerCase() || "";
        const listingTitle = reservation.listing?.title?.toLowerCase() || "";
        const search = searchQuery.toLowerCase();
        return (
          userName.includes(search) ||
          listingTitle.includes(search) ||
          reservation.id.toString().includes(search)
        );
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter((reservation) => {
        const startDate = new Date(reservation.start_date);
        const endDate = new Date(reservation.end_date);

        if (statusFilter === "blocked") {
          return reservation.is_blocked;
        } else if (statusFilter === "upcoming") {
          return !reservation.is_blocked && startDate > today;
        } else if (statusFilter === "active") {
          return (
            !reservation.is_blocked && startDate <= today && endDate >= today
          );
        } else if (statusFilter === "completed") {
          return !reservation.is_blocked && endDate < today;
        }
        return true;
      });
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle nested properties
      if (sortConfig.key === "user_name") {
        aValue = a.user?.name || "";
        bValue = b.user?.name || "";
      } else if (sortConfig.key === "listing_title") {
        aValue = a.listing?.title || "";
        bValue = b.listing?.title || "";
      }

      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  };

  const filteredReservations = getFilteredAndSortedReservations();

  // Pagination
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset form
  const resetForm = () => {
    setFormData({
      user_id: "",
      listing_id: "",
      start_date: "",
      end_date: "",
      guest_count: 1,
      client_type: "family",
      details: "",
      is_blocked: false,
    });
    setFormErrors({});
    setSelectedReservation(null);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.listing_id) {
      errors.listing_id = "Listing is required";
    }
    if (!formData.start_date) {
      errors.start_date = "Start date is required";
    }
    if (!formData.end_date) {
      errors.end_date = "End date is required";
    }
    if (
      formData.start_date &&
      formData.end_date &&
      formData.start_date >= formData.end_date
    ) {
      errors.end_date = "End date must be after start date";
    }
    if (!formData.is_blocked && !formData.user_id) {
      errors.user_id = "User is required for regular reservations";
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
  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setFormData({
      user_id: reservation.user_id || "",
      listing_id: reservation.listing_id,
      start_date: reservation.start_date
        ? reservation.start_date.split("T")[0]
        : "",
      end_date: reservation.end_date ? reservation.end_date.split("T")[0] : "",
      guest_count: reservation.guest_count || 1,
      client_type: reservation.client_type || "family",
      details: reservation.details || "",
      is_blocked: reservation.is_blocked || false,
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Handle view
  const handleView = (reservation) => {
    setSelectedReservation(reservation);
    setIsViewModalOpen(true);
  };

  // Handle delete
  const handleDelete = (reservation) => {
    setSelectedReservation(reservation);
    setIsDeleteModalOpen(true);
  };

  // Submit add
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await addReservation(formData);
      toast.success("Reservation created successfully!");
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
        toast.error(errorData?.message || "Failed to create reservation");
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
      await updateReservation(selectedReservation.id, formData);
      toast.success("Reservation updated successfully!");
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
        toast.error(errorData?.message || "Failed to update reservation");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteReservation(selectedReservation.id);
      toast.success("Reservation deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedReservation(null);
    } catch (error) {
      const errorData = error.response?.data;
      toast.error(
        errorData?.error || errorData?.message || "Failed to delete reservation"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get status badge
  const getStatusBadge = (reservation) => {
    if (reservation.is_blocked) {
      return (
        <span className="px-3 py-1 bg-neutral-700 text-white rounded-full text-sm font-medium">
          Blocked
        </span>
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(reservation.start_date);
    const endDate = new Date(reservation.end_date);

    if (endDate < today) {
      return (
        <span className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded-full text-sm font-medium">
          Completed
        </span>
      );
    } else if (startDate <= today && endDate >= today) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Active
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
          Upcoming
        </span>
      );
    }
  };

  // Client type options
  const clientTypeOptions = [
    { value: "family", label: "Family" },
    { value: "group", label: "Group" },
    { value: "one", label: "Individual" },
  ];

  // Status filter options
  const statusFilterOptions = [
    { value: "all", label: "All Reservations" },
    { value: "upcoming", label: "Upcoming" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "blocked", label: "Blocked Dates" },
  ];

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
      key: "user_name",
      label: "Guest",
      sortable: true,
      render: (row) => (
        <div>
          {row.user ? (
            <span className="font-semibold text-neutral-800">
              {row.user.name}
            </span>
          ) : (
            <span className="text-neutral-400 italic">No user</span>
          )}
        </div>
      ),
    },
    {
      key: "listing_title",
      label: "Listing",
      sortable: true,
      render: (row) => (
        <span className="text-neutral-700">{row.listing?.title || "N/A"}</span>
      ),
    },
    {
      key: "start_date",
      label: "Check-in",
      sortable: true,
      render: (row) => (
        <span className="text-neutral-600">
          {new Date(row.start_date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "end_date",
      label: "Check-out",
      sortable: true,
      render: (row) => (
        <span className="text-neutral-600">
          {new Date(row.end_date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Reservation Date",
      sortable: true,
      render: (row) => (
        <span className="text-neutral-600">
          {new Date(row.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "guest_count",
      label: "Guests",
      render: (row) => (
        <div className="flex items-center gap-2">
          <FaUsers className="text-neutral-400" />
          <span className="text-neutral-700">{row.guest_count || "N/A"}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => getStatusBadge(row),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(row)}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all cursor-pointer"
            title="View"
          >
            <FaCalendar size={16} />
          </button>
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
          <h1 className="text-3xl font-bold text-neutral-800">Reservations</h1>
          <p className="text-neutral-500 mt-1">
            Manage bookings and blocked dates
          </p>
        </div>
        <Button icon={<FaPlus />} onClick={handleAdd}>
          Add Reservation
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Search by guest name, listing, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<FaCalendar />}
          />
          <SelectWithSearch
            name="status_filter"
            placeholder="Filter by status..."
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusFilterOptions}
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedReservations}
        onSort={handleSort}
        sortConfig={sortConfig}
        isLoading={isLoading}
        emptyMessage="No reservations found. Create your first reservation to get started!"
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
        title="Create New Reservation"
        size="lg"
      >
        <form onSubmit={handleSubmitAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectWithSearch
              label="Listing"
              name="listing_id"
              value={formData.listing_id}
              onChange={(e) =>
                setFormData({ ...formData, listing_id: e.target.value })
              }
              options={listings.map((listing) => ({
                value: listing.id,
                label: listing.title,
              }))}
              error={formErrors.listing_id}
              required
            />

            <SelectWithSearch
              label="Guest"
              name="user_id"
              value={formData.user_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: e.target.value })
              }
              options={users.map((user) => ({
                value: user.id,
                label: `${user.name} (${user.email})`,
              }))}
              error={formErrors.user_id}
              required={!formData.is_blocked}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Check-in Date"
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
              error={formErrors.start_date}
              required
              icon={<FaCalendar />}
            />

            <Input
              label="Check-out Date"
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
              error={formErrors.end_date}
              required
              icon={<FaCalendar />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Number of Guests"
              type="number"
              name="guest_count"
              value={formData.guest_count}
              onChange={(e) =>
                setFormData({ ...formData, guest_count: e.target.value })
              }
              min="1"
              icon={<FaUsers />}
            />

            <SelectWithSearch
              label="Client Type"
              name="client_type"
              value={formData.client_type}
              onChange={(e) =>
                setFormData({ ...formData, client_type: e.target.value })
              }
              options={clientTypeOptions}
            />
          </div>

          <Textarea
            label="Details / Notes"
            name="details"
            value={formData.details}
            onChange={(e) =>
              setFormData({ ...formData, details: e.target.value })
            }
            placeholder="Enter any additional details or notes"
            rows={3}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_blocked"
              checked={formData.is_blocked}
              onChange={(e) =>
                setFormData({ ...formData, is_blocked: e.target.checked })
              }
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
            />
            <label
              htmlFor="is_blocked"
              className="text-sm font-medium text-neutral-700 cursor-pointer"
            >
              Block these dates (no guest required)
            </label>
          </div>

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
              Create Reservation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Reservation"
        size="lg"
      >
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectWithSearch
              label="Listing"
              name="listing_id"
              value={formData.listing_id}
              onChange={(e) =>
                setFormData({ ...formData, listing_id: e.target.value })
              }
              options={listings.map((listing) => ({
                value: listing.id,
                label: listing.title,
              }))}
              error={formErrors.listing_id}
              required
            />

            <SelectWithSearch
              label="Guest"
              name="user_id"
              value={formData.user_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: e.target.value })
              }
              options={users.map((user) => ({
                value: user.id,
                label: `${user.name} (${user.email})`,
              }))}
              error={formErrors.user_id}
              required={!formData.is_blocked}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Check-in Date"
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
              error={formErrors.start_date}
              required
              icon={<FaCalendar />}
            />

            <Input
              label="Check-out Date"
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
              error={formErrors.end_date}
              required
              icon={<FaCalendar />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Number of Guests"
              type="number"
              name="guest_count"
              value={formData.guest_count}
              onChange={(e) =>
                setFormData({ ...formData, guest_count: e.target.value })
              }
              min="1"
              icon={<FaUsers />}
            />

            <SelectWithSearch
              label="Client Type"
              name="client_type"
              value={formData.client_type}
              onChange={(e) =>
                setFormData({ ...formData, client_type: e.target.value })
              }
              options={clientTypeOptions}
            />
          </div>

          <Textarea
            label="Details / Notes"
            name="details"
            value={formData.details}
            onChange={(e) =>
              setFormData({ ...formData, details: e.target.value })
            }
            placeholder="Enter any additional details or notes"
            rows={3}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_blocked_edit"
              checked={formData.is_blocked}
              onChange={(e) =>
                setFormData({ ...formData, is_blocked: e.target.checked })
              }
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
            />
            <label
              htmlFor="is_blocked_edit"
              className="text-sm font-medium text-neutral-700 cursor-pointer"
            >
              Block these dates (no guest required)
            </label>
          </div>

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
              Update Reservation
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Reservation Details"
        size="md"
      >
        {selectedReservation && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-800">
                Reservation #{selectedReservation.id}
              </h3>
              {getStatusBadge(selectedReservation)}
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FaHome className="text-neutral-400 mt-1" />
                <div>
                  <p className="text-sm text-neutral-500">Listing</p>
                  <p className="font-semibold text-neutral-800">
                    {selectedReservation.listing?.title || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaUser className="text-neutral-400 mt-1" />
                <div>
                  <p className="text-sm text-neutral-500">Guest</p>
                  <p className="font-semibold text-neutral-800">
                    {selectedReservation.user?.name || "No guest"}
                  </p>
                  {selectedReservation.user?.email && (
                    <p className="text-sm text-neutral-600">
                      {selectedReservation.user.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaCalendar className="text-neutral-400 mt-1" />
                <div>
                  <p className="text-sm text-neutral-500">Dates</p>
                  <p className="font-semibold text-neutral-800">
                    {new Date(
                      selectedReservation.start_date
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(
                      selectedReservation.end_date
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaUsers className="text-neutral-400 mt-1" />
                <div>
                  <p className="text-sm text-neutral-500">Guests & Type</p>
                  <p className="font-semibold text-neutral-800">
                    {selectedReservation.guest_count || "N/A"} guests •{" "}
                    {selectedReservation.client_type || "N/A"}
                  </p>
                </div>
              </div>

              {selectedReservation.details && (
                <div className="pt-3 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500 mb-2">Details</p>
                  <p className="text-neutral-700">
                    {selectedReservation.details}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 ">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsViewModalOpen(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsListingViewModalOpen(true);
                }}
                className="flex-1"
              >
                <FaHome />
                View Listing
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEdit(selectedReservation);
                }}
                className="flex-1"
              >
                Edit Reservation
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Listing View Modal */}
      <Modal
        isOpen={isListingViewModalOpen}
        onClose={() => setIsListingViewModalOpen(false)}
        title="Listing Details"
        size="lg"
      >
        {selectedReservation?.listing && (
          <div className="space-y-4">
            {/* Listing Image */}
            {selectedReservation.listing.images &&
              selectedReservation.listing.images.length > 0 && (
                <div className="w-full h-64 rounded-xl overflow-hidden bg-neutral-100">
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
                    }/storage/${selectedReservation.listing.images[0]}`}
                    alt={selectedReservation.listing.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/images/placeholder.jpg";
                    }}
                  />
                </div>
              )}

            <div className="space-y-3">
              <div>
                <h3 className="text-2xl font-bold text-neutral-800">
                  {selectedReservation.listing.title}
                </h3>
                {selectedReservation.listing.category && (
                  <p className="text-sm text-neutral-500 mt-1">
                    {selectedReservation.listing.category.name}
                  </p>
                )}
              </div>

              {selectedReservation.listing.short_description && (
                <p className="text-neutral-600">
                  {selectedReservation.listing.short_description}
                </p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-neutral-200">
                {selectedReservation.listing.room_count && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">
                      {selectedReservation.listing.room_count}
                    </p>
                    <p className="text-sm text-neutral-500">Rooms</p>
                  </div>
                )}
                {selectedReservation.listing.bathroom_count && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">
                      {selectedReservation.listing.bathroom_count}
                    </p>
                    <p className="text-sm text-neutral-500">Bathrooms</p>
                  </div>
                )}
                {selectedReservation.listing.guest_count && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">
                      {selectedReservation.listing.guest_count}
                    </p>
                    <p className="text-sm text-neutral-500">Guests</p>
                  </div>
                )}
                {selectedReservation.listing.bed_count && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">
                      {selectedReservation.listing.bed_count}
                    </p>
                    <p className="text-sm text-neutral-500">Beds</p>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3 bg-primary-50 p-4 rounded-xl">
                <FaDollarSign className="text-primary-600 mt-1 text-xl" />
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 font-medium">
                    Price per Night
                  </p>
                  <p className="text-3xl font-bold text-primary-600">
                    $
                    {selectedReservation.listing.price ||
                      selectedReservation.listing.price_per_night}
                  </p>
                </div>
              </div>

              {selectedReservation.listing.adresse && (
                <div className="flex items-start gap-3">
                  <FaHome className="text-neutral-400 mt-1" />
                  <div>
                    <p className="text-sm text-neutral-500">Location</p>
                    <p className="font-medium text-neutral-800">
                      {selectedReservation.listing.adresse ||
                        selectedReservation.listing.address}
                    </p>
                    {selectedReservation.listing.city && (
                      <p className="text-sm text-neutral-600">
                        {selectedReservation.listing.city.name}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {selectedReservation.listing.long_description && (
                <div className="pt-3 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500 mb-2 font-medium">
                    Description
                  </p>
                  <p className="text-neutral-700 leading-relaxed">
                    {selectedReservation.listing.long_description ||
                      selectedReservation.listing.description}
                  </p>
                </div>
              )}

              {selectedReservation.listing.facilities &&
                selectedReservation.listing.facilities.length > 0 && (
                  <div className="pt-3 border-t border-neutral-200">
                    <p className="text-sm text-neutral-500 mb-3 font-medium">
                      Facilities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedReservation.listing.facilities.map(
                        (facility) => (
                          <span
                            key={facility.id}
                            className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                          >
                            {facility.name}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

              {selectedReservation.listing.alerts &&
                selectedReservation.listing.alerts.length > 0 && (
                  <div className="pt-3 border-t border-neutral-200">
                    <p className="text-sm text-neutral-500 mb-3 font-medium">
                      Important Alerts
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedReservation.listing.alerts.map((alert) => (
                        <span
                          key={alert.id}
                          className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-medium"
                        >
                          {alert.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* All Images Gallery */}
              {selectedReservation.listing.images &&
                selectedReservation.listing.images.length > 1 && (
                  <div className="pt-3 border-t border-neutral-200">
                    <p className="text-sm text-neutral-500 mb-3 font-medium">
                      Image Gallery
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedReservation.listing.images.map(
                        (image, index) => (
                          <div
                            key={index}
                            className="aspect-video rounded-lg overflow-hidden bg-neutral-100"
                          >
                            <img
                              src={`${
                                process.env.NEXT_PUBLIC_API_URL ||
                                "http://localhost:8000"
                              }/storage/${image}`}
                              alt={`${
                                selectedReservation.listing.title
                              } - Image ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = "/images/placeholder.jpg";
                              }}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Owner Information */}
              {selectedReservation.listing.user && (
                <div className="pt-3 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500 mb-2 font-medium">
                    Property Owner
                  </p>
                  <div className="flex items-center gap-3 bg-neutral-50 p-3 rounded-lg">
                    <FaUser className="text-neutral-400" />
                    <div>
                      <p className="font-medium text-neutral-800">
                        {selectedReservation.listing.user.name}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {selectedReservation.listing.user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsListingViewModalOpen(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Reservation"
        message="Are you sure you want to delete this reservation?"
        itemName={`Reservation #${selectedReservation?.id}`}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default ReservationsPage;
