"use client";
import React, { useState, useEffect } from "react";
import { useListingStore } from "@/store/useListingStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useFacilityStore } from "@/store/useFacilityStore";
import { useAlertStore } from "@/store/useAlertStore";
import { useUserStore } from "@/store/useUserStore";
import { useCityStore } from "@/store/useCityStore";
import Table from "@/components/shared/Table";
import Pagination from "@/components/shared/Pagination";
import Modal from "@/components/shared/Modal";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import ListingFormSteps from "@/components/(admin)/ListingFormSteps";
import { Input, SelectWithSearch, Button } from "@/components/shared/inputs";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaHome,
  FaBed,
  FaUsers,
  FaDollarSign,
  FaMapMarkerAlt,
  FaImage,
} from "react-icons/fa";
import { toast } from "sonner";
import Image from "next/image";

const ListingsPage = () => {
  const {
    listings,
    isLoading,
    totalPages: storeTotalPages,
    currentPage: storeCurrentPage,
    itemsPerPage,
    fetchListings,
    addListing,
    updateListing,
    deleteListing,
  } = useListingStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { facilities, fetchFacilities } = useFacilityStore();
  const { alerts, fetchAlerts } = useAlertStore();
  const { users, fetchUsers } = useUserStore();
  const { cities, fetchCities } = useCityStore();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Form states
  const [selectedListing, setSelectedListing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting states
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");

  // Fetch data on mount
  useEffect(() => {
    fetchCategories();
    fetchFacilities();
    fetchAlerts();
    fetchUsers();
    fetchCities();
  }, [fetchCategories, fetchFacilities, fetchAlerts, fetchUsers, fetchCities]);

  // Fetch listings when filters change
  useEffect(() => {
    const filters = {};
    if (searchQuery) filters.search = searchQuery;
    if (filterCity) filters.city_id = filterCity;
    if (filterCategory) filters.category_id = filterCategory;
    if (filterMinPrice) filters.min_price = filterMinPrice;
    if (filterMaxPrice) filters.max_price = filterMaxPrice;

    fetchListings(currentPage, itemsPerPage, filters);
  }, [
    currentPage,
    searchQuery,
    filterCity,
    filterCategory,
    filterMinPrice,
    filterMaxPrice,
    fetchListings,
    itemsPerPage,
  ]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Sort data
  const sortedData = React.useMemo(() => {
    let sorted = [...listings];

    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties
        if (sortConfig.key === "category") {
          aValue = a.category?.title || "";
          bValue = b.category?.title || "";
        } else if (sortConfig.key === "city") {
          aValue = a.city?.name || "";
          bValue = b.city?.name || "";
        } else if (sortConfig.key === "user") {
          aValue = a.user?.name || "";
          bValue = b.user?.name || "";
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return sorted;
  }, [listings, sortConfig]);

  // Handle add
  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  // Handle edit
  const handleEdit = (listing) => {
    setSelectedListing(listing);
    setIsEditModalOpen(true);
  };

  // Handle view
  const handleView = (listing) => {
    setSelectedListing(listing);
    setIsViewModalOpen(true);
  };

  // Handle delete
  const handleDelete = (listing) => {
    setSelectedListing(listing);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedListing) return;

    try {
      await deleteListing(selectedListing.id);
      toast.success("Listing deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedListing(null);
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Cannot delete listing with active reservations");
      } else {
        toast.error("Failed to delete listing");
      }
    }
  };

  // Handle form submit
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      if (selectedListing) {
        await updateListing(selectedListing.id, formData);
        toast.success("Listing updated successfully!");
        setIsEditModalOpen(false);
      } else {
        await addListing(formData);
        toast.success("Listing created successfully!");
        setIsAddModalOpen(false);
      }

      setSelectedListing(null);
    } catch (error) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors) {
          Object.values(errors).forEach((errArray) => {
            errArray.forEach((err) => toast.error(err));
          });
        } else {
          toast.error("Validation failed. Please check your input.");
        }
      } else {
        toast.error("Failed to save listing");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedListing(null);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setFilterCity("");
    setFilterCategory("");
    setFilterMinPrice("");
    setFilterMaxPrice("");
    setCurrentPage(1);
  };

  // Table columns
  const columns = [
    { key: "id", label: "ID", sortable: true },
    {
      key: "images",
      label: "Image",
      sortable: false,
      render: (listing) => {
        const firstImage =
          listing.images && listing.images.length > 0
            ? listing.images[0]
            : null;
        return firstImage ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${firstImage}`}
            alt={listing.title}
            width={64}
            height={64}
            className="w-16 h-16 object-cover rounded-xl"
          />
        ) : (
          <div className="w-16 h-16 bg-neutral-200 rounded-xl flex items-center justify-center">
            <FaImage className="text-neutral-400 text-xl" />
          </div>
        );
      },
    },
    { key: "title", label: "Title", sortable: true },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (listing) => listing.category?.title || "N/A",
    },
    {
      key: "city",
      label: "City",
      sortable: true,
      render: (listing) => listing.city?.name || "N/A",
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (listing) => `$${parseFloat(listing.price).toFixed(2)}`,
    },
    {
      key: "details",
      label: "Details",
      sortable: false,
      render: (listing) => (
        <div className="flex gap-3 text-xs text-neutral-600">
          <span className="flex items-center gap-1">
            <FaBed /> {listing.room_count}
          </span>
          <span className="flex items-center gap-1">
            <FaUsers /> {listing.guest_count}
          </span>
        </div>
      ),
    },
    {
      key: "reservations_count",
      label: "Reservations",
      sortable: true,
      render: (listing) => (
        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-semibold">
          {listing.reservations_count || 0}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (listing) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(listing)}
            className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer"
            title="View"
          >
            <FaEye size={16} />
          </button>
          <button
            onClick={() => handleEdit(listing)}
            className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer"
            title="Edit"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(listing)}
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
            Listings Management
          </h1>
          <p className="text-neutral-600 mt-1">Manage property listings</p>
        </div>
        <Button variant="primary" icon={<FaPlus />} onClick={handleAdd}>
          Add Listing
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Search by title, description, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:col-span-2"
          />

          <SelectWithSearch
            placeholder="Select City"
            name="filterCity"
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            options={cities.map((city) => ({
              value: city.id,
              label: city.name,
            }))}
          />

          <SelectWithSearch
            placeholder="Select Category"
            name="filterCategory"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.title,
            }))}
          />

          <Button variant="secondary" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            placeholder="Min Price"
            value={filterMinPrice}
            onChange={(e) => setFilterMinPrice(e.target.value)}
            min="0"
            step="0.01"
          />

          <Input
            type="number"
            placeholder="Max Price"
            value={filterMaxPrice}
            onChange={(e) => setFilterMaxPrice(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        {(searchQuery ||
          filterCity ||
          filterCategory ||
          filterMinPrice ||
          filterMaxPrice) && (
          <div className="text-sm text-neutral-600">
            <span className="font-semibold">Active filters:</span>{" "}
            {searchQuery && `Search: "${searchQuery}"`}
            {filterCity &&
              ` | City: ${cities.find((c) => c.id == filterCity)?.name}`}
            {filterCategory &&
              ` | Category: ${
                categories.find((c) => c.id == filterCategory)?.title
              }`}
            {filterMinPrice && ` | Min: $${filterMinPrice}`}
            {filterMaxPrice && ` | Max: $${filterMaxPrice}`}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm">
        <Table
          columns={columns}
          data={sortedData}
          isLoading={isLoading}
          sortConfig={sortConfig}
          onSort={handleSort}
        />

        {/* Pagination */}
        {storeTotalPages > 1 && (
          <div className="p-4 border-t border-neutral-200">
            <Pagination
              currentPage={currentPage}
              totalPages={storeTotalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCancel}
        title="Add New Listing"
        size="large"
      >
        <ListingFormSteps
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          categories={categories}
          cities={cities}
          users={users}
          facilities={facilities}
          alerts={alerts}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCancel}
        title="Edit Listing"
        size="large"
      >
        <ListingFormSteps
          initialData={selectedListing}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          categories={categories}
          cities={cities}
          users={users}
          facilities={facilities}
          alerts={alerts}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Listing Details"
        size="large"
      >
        {selectedListing && (
          <div className="space-y-6">
            {/* Images */}
            {selectedListing.images && selectedListing.images.length > 0 && (
              <div>
                <h3 className="font-semibold text-neutral-800 mb-3">Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedListing.images.map((image, index) => (
                    <img
                      key={index}
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${image}`}
                      alt={`${selectedListing.title} - ${index + 1}`}
                      className="w-full h-40 object-cover rounded-xl border-2 border-neutral-200"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                  Title
                </h4>
                <p className="text-neutral-800">{selectedListing.title}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                  Category
                </h4>
                <p className="text-neutral-800">
                  {selectedListing.category?.title || "N/A"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                  City
                </h4>
                <p className="text-neutral-800">
                  {selectedListing.city?.name || "N/A"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                  Owner
                </h4>
                <p className="text-neutral-800">
                  {selectedListing.user?.name || "N/A"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                  Price
                </h4>
                <p className="font-bold text-primary-600">
                  ${parseFloat(selectedListing.price).toFixed(2)} / night
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                  Address
                </h4>
                <p className="text-neutral-800">{selectedListing.adresse}</p>
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                Short Description
              </h4>
              <p className="text-neutral-800">
                {selectedListing.short_description || "N/A"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                Full Description
              </h4>
              <p className="text-neutral-800">
                {selectedListing.long_description || "N/A"}
              </p>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-neutral-50 p-4 rounded-xl">
              <div className="text-center">
                <FaBed className="text-primary-500 text-2xl mx-auto mb-2" />
                <p className="text-xs text-neutral-600">Rooms</p>
                <p className="text-lg font-bold text-neutral-800">
                  {selectedListing.room_count}
                </p>
              </div>
              <div className="text-center">
                <FaHome className="text-primary-500 text-2xl mx-auto mb-2" />
                <p className="text-xs text-neutral-600">Bathrooms</p>
                <p className="text-lg font-bold text-neutral-800">
                  {selectedListing.bathroom_count}
                </p>
              </div>
              <div className="text-center">
                <FaUsers className="text-primary-500 text-2xl mx-auto mb-2" />
                <p className="text-xs text-neutral-600">Guests</p>
                <p className="text-lg font-bold text-neutral-800">
                  {selectedListing.guest_count}
                </p>
              </div>
              <div className="text-center">
                <FaBed className="text-primary-500 text-2xl mx-auto mb-2" />
                <p className="text-xs text-neutral-600">Beds</p>
                <p className="text-lg font-bold text-neutral-800">
                  {selectedListing.bed_count}
                </p>
              </div>
            </div>

            {/* Facilities */}
            {selectedListing.facilities &&
              selectedListing.facilities.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-neutral-600 mb-2">
                    Facilities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedListing.facilities.map((facility) => (
                      <span
                        key={facility.id}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm"
                      >
                        {facility.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Special Features */}
            {selectedListing.alerts && selectedListing.alerts.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-neutral-600 mb-2">
                  Special Features
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedListing.alerts.map((alert) => (
                    <span
                      key={alert.id}
                      className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-lg text-sm"
                    >
                      {alert.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {(selectedListing.lat || selectedListing.long) && (
              <div>
                <h4 className="text-sm font-semibold text-neutral-600 mb-2">
                  Coordinates
                </h4>
                <p className="text-neutral-800">
                  Latitude: {selectedListing.lat || "N/A"}, Longitude:{" "}
                  {selectedListing.long || "N/A"}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={selectedListing?.title}
        warningMessage={
          selectedListing?.reservations_count > 0
            ? `This listing has ${selectedListing.reservations_count} reservation(s). Deleting it will affect these reservations.`
            : null
        }
      />
    </div>
  );
};

export default ListingsPage;
