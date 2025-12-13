"use client";
import React, { useState, useEffect } from "react";
import { usePropertyStore } from "@/store/usePropertyStore";
import { usePropertyTypeStore } from "@/store/usePropertyTypeStore";
import { useFacilityStore } from "@/store/useFacilityStore";
import { useAlertStore } from "@/store/useAlertStore";
import { useUserStore } from "@/store/useUserStore";
import { useCityStore } from "@/store/useCityStore";
import Table from "@/components/shared/Table";
import Pagination from "@/components/shared/Pagination";
import Modal from "@/components/shared/Modal";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import ListingFormSteps from "@/components/(admin)/ListingFormSteps";
import {
  Input,
  SelectWithSearch,
  Select,
  Button,
} from "@/components/shared/inputs";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaHome,
  FaBed,
  FaBath,
  FaUsers,
  FaDollarSign,
  FaMapMarkerAlt,
  FaImage,
} from "react-icons/fa";
import { toast } from "sonner";
import Image from "next/image";

const PropertiesPage = () => {
  const {
    properties,
    isLoading,
    totalPages: storeTotalPages,
    currentPage: storeCurrentPage,
    perPage,
    fetchProperties,
    addProperty,
    updateProperty,
    deleteProperty,
  } = usePropertyStore();
  const { propertyTypes, fetchPropertyTypes } = usePropertyTypeStore();
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
  const [selectedProperty, setSelectedProperty] = useState(null);
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
  const [filterPropertyType, setFilterPropertyType] = useState("");
  const [filterListingType, setFilterListingType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterBedrooms, setFilterBedrooms] = useState("");
  const [filterGuests, setFilterGuests] = useState("");

  // Fetch data on mount
  useEffect(() => {
    fetchPropertyTypes();
    fetchFacilities();
    fetchAlerts();
    fetchUsers();
    fetchCities();
  }, [
    fetchPropertyTypes,
    fetchFacilities,
    fetchAlerts,
    fetchUsers,
    fetchCities,
  ]);

  // Fetch properties when filters change
  useEffect(() => {
    const filters = {};
    if (searchQuery) filters.search = searchQuery;
    if (filterCity) filters.city_id = filterCity;
    if (filterPropertyType) filters.property_type_id = filterPropertyType;
    if (filterListingType) filters.listing_type = filterListingType;
    if (filterStatus) filters.status = filterStatus;
    if (filterMinPrice) filters.min_price = filterMinPrice;
    if (filterMaxPrice) filters.max_price = filterMaxPrice;
    if (filterBedrooms) filters.bedroom_count = filterBedrooms;
    if (filterGuests) filters.guest_capacity = filterGuests;

    fetchProperties(filters);
  }, [
    currentPage,
    searchQuery,
    filterCity,
    filterPropertyType,
    filterListingType,
    filterStatus,
    filterMinPrice,
    filterMaxPrice,
    filterBedrooms,
    filterGuests,
    fetchProperties,
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
    let sorted = [...properties];

    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties
        if (sortConfig.key === "property_type") {
          aValue = a.property_type?.name || "";
          bValue = b.property_type?.name || "";
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
  }, [properties, sortConfig]);

  // Handle add
  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  // Handle edit
  const handleEdit = (property) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  // Handle view
  const handleView = (property) => {
    setSelectedProperty(property);
    setIsViewModalOpen(true);
  };

  // Handle delete
  const handleDelete = (property) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedProperty) return;

    try {
      await deleteProperty(selectedProperty.id);
      toast.success("Property deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      toast.error("Failed to delete property");
    }
  };

  // Handle form submit
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      if (selectedProperty) {
        await updateProperty(selectedProperty.id, formData);
        toast.success("Property updated successfully!");
        setIsEditModalOpen(false);
      } else {
        await addProperty(formData);
        toast.success("Property created successfully!");
        setIsAddModalOpen(false);
      }

      setSelectedProperty(null);
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
        toast.error("Failed to save property");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedProperty(null);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setFilterCity("");
    setFilterPropertyType("");
    setFilterListingType("");
    setFilterStatus("");
    setFilterMinPrice("");
    setFilterMaxPrice("");
    setFilterBedrooms("");
    setFilterGuests("");
    setCurrentPage(1);
  };

  // Table columns
  const columns = [
    { key: "id", label: "ID", sortable: true },
    {
      key: "images",
      label: "Image",
      sortable: false,
      render: (property) => {
        const firstImage =
          property.images && property.images.length > 0
            ? property.images[0]
            : null;
        return firstImage ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${firstImage}`}
            alt={property.name}
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
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (property) => (
        <div>
          <div className="font-medium">{property.name}</div>
          <div className="text-xs text-neutral-500">{property.slug}</div>
        </div>
      ),
    },
    {
      key: "property_type",
      label: "Type",
      sortable: true,
      render: (property) => property.property_type?.name || "N/A",
    },
    {
      key: "city",
      label: "City",
      sortable: true,
      render: (property) => property.city?.name || "N/A",
    },
    {
      key: "listing_type",
      label: "Listing Type",
      sortable: true,
      render: (property) => (
        <span
          className={`px-2 py-1 rounded-lg text-xs font-semibold ${
            property.listing_type === "sale"
              ? "bg-green-100 text-green-700"
              : property.listing_type === "rent"
              ? "bg-blue-100 text-blue-700"
              : "bg-purple-100 text-purple-700"
          }`}
        >
          {property.listing_type?.toUpperCase()}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (property) => {
        if (property.listing_type === "sale") {
          return `$${parseFloat(property.sale_price || 0).toLocaleString()}`;
        } else if (property.listing_type === "rent") {
          return `$${parseFloat(property.rent_price_daily || 0).toFixed(
            2
          )}/day`;
        } else {
          return `$${parseFloat(
            property.sale_price || 0
          ).toLocaleString()} / $${parseFloat(
            property.rent_price_daily || 0
          ).toFixed(2)}/day`;
        }
      },
    },
    {
      key: "details",
      label: "Details",
      sortable: false,
      render: (property) => (
        <div className="flex gap-3 text-xs text-neutral-600">
          <span className="flex items-center gap-1" title="Bedrooms">
            <FaBed /> {property.bedroom_count}
          </span>
          <span className="flex items-center gap-1" title="Bathrooms">
            <FaBath /> {property.bathroom_count}
          </span>
          <span className="flex items-center gap-1" title="Guests">
            <FaUsers /> {property.guest_capacity}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (property) => (
        <span
          className={`px-2 py-1 rounded-lg text-xs font-semibold ${
            property.status === "active"
              ? "bg-green-100 text-green-700"
              : property.status === "inactive"
              ? "bg-gray-100 text-gray-700"
              : property.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {property.status?.toUpperCase()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (property) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(property)}
            className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer"
            title="View"
          >
            <FaEye size={16} />
          </button>
          <button
            onClick={() => handleEdit(property)}
            className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer"
            title="Edit"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(property)}
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
            Properties Management
          </h1>
          <p className="text-neutral-600 mt-1">Manage property listings</p>
        </div>
        <Button variant="primary" icon={<FaPlus />} onClick={handleAdd}>
          Add Property
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search by name, address..."
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
            placeholder="Property Type"
            name="filterPropertyType"
            value={filterPropertyType}
            onChange={(e) => setFilterPropertyType(e.target.value)}
            options={propertyTypes.map((type) => ({
              value: type.id,
              label: type.name,
            }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select
            placeholder="Listing Type"
            name="filterListingType"
            value={filterListingType}
            onChange={(e) => setFilterListingType(e.target.value)}
            options={[
              { value: "", label: "All Types" },
              { value: "sale", label: "For Sale" },
              { value: "rent", label: "For Rent" },
              { value: "both", label: "Both" },
            ]}
          />

          <Select
            placeholder="Status"
            name="filterStatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: "", label: "All Statuses" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "pending", label: "Pending" },
              { value: "sold", label: "Sold" },
            ]}
          />

          <Input
            type="number"
            placeholder="Min Bedrooms"
            value={filterBedrooms}
            onChange={(e) => setFilterBedrooms(e.target.value)}
            min="0"
          />

          <Input
            type="number"
            placeholder="Max Guests"
            value={filterGuests}
            onChange={(e) => setFilterGuests(e.target.value)}
            min="0"
          />

          <Button variant="secondary" onClick={clearFilters}>
            Clear All
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
        title="Add New Property"
        size="large"
      >
        <ListingFormSteps
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          categories={propertyTypes}
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
        title="Edit Property"
        size="large"
      >
        <ListingFormSteps
          initialData={selectedProperty}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          categories={propertyTypes}
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
        title="Property Details"
        size="large"
      >
        {selectedProperty && (
          <div className="space-y-6">
            {/* Images */}
            {selectedProperty.images && selectedProperty.images.length > 0 && (
              <div>
                <h3 className="font-semibold text-neutral-800 mb-3">Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedProperty.images.map((image, index) => (
                    <img
                      key={index}
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${image}`}
                      alt={`${selectedProperty.name} - ${index + 1}`}
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
                  Name
                </h4>
                <p className="text-neutral-800">{selectedProperty.name}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                  Property Type
                </h4>
                <p className="text-neutral-800">
                  {selectedProperty.property_type?.name || "N/A"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                  City
                </h4>
                <p className="text-neutral-800">
                  {selectedProperty.city?.name || "N/A"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                  Owner
                </h4>
                <p className="text-neutral-800">
                  {selectedProperty.user?.name || "N/A"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                  Listing Type
                </h4>
                <p className="text-neutral-800 capitalize">
                  {selectedProperty.listing_type}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                  Status
                </h4>
                <p className="text-neutral-800 capitalize">
                  {selectedProperty.status}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                  Address
                </h4>
                <p className="text-neutral-800">{selectedProperty.address}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                  Size
                </h4>
                <p className="text-neutral-800">
                  {selectedProperty.size_sqm} m²
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="font-semibold text-neutral-800 mb-3">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedProperty.listing_type !== "rent" && (
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                      Sale Price
                    </h4>
                    <p className="font-bold text-primary-600">
                      $
                      {parseFloat(
                        selectedProperty.sale_price || 0
                      ).toLocaleString()}
                    </p>
                  </div>
                )}
                {selectedProperty.listing_type !== "sale" && (
                  <>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                        Daily Rate
                      </h4>
                      <p className="font-bold text-primary-600">
                        $
                        {parseFloat(
                          selectedProperty.rent_price_daily || 0
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                        Weekly Rate
                      </h4>
                      <p className="font-bold text-primary-600">
                        $
                        {parseFloat(
                          selectedProperty.rent_price_weekly || 0
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                        Monthly Rate
                      </h4>
                      <p className="font-bold text-primary-600">
                        $
                        {parseFloat(
                          selectedProperty.rent_price_monthly || 0
                        ).toFixed(2)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-600 mb-1">
                Description
              </h4>
              <p className="text-neutral-800">
                {selectedProperty.description || "N/A"}
              </p>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-neutral-50 p-4 rounded-xl">
              <div className="text-center">
                <FaBed className="text-primary-500 text-2xl mx-auto mb-2" />
                <p className="text-xs text-neutral-600">Bedrooms</p>
                <p className="text-lg font-bold text-neutral-800">
                  {selectedProperty.bedroom_count}
                </p>
              </div>
              <div className="text-center">
                <FaBath className="text-primary-500 text-2xl mx-auto mb-2" />
                <p className="text-xs text-neutral-600">Bathrooms</p>
                <p className="text-lg font-bold text-neutral-800">
                  {selectedProperty.bathroom_count}
                </p>
              </div>
              <div className="text-center">
                <FaUsers className="text-primary-500 text-2xl mx-auto mb-2" />
                <p className="text-xs text-neutral-600">Guests</p>
                <p className="text-lg font-bold text-neutral-800">
                  {selectedProperty.guest_capacity}
                </p>
              </div>
              <div className="text-center">
                <FaBed className="text-primary-500 text-2xl mx-auto mb-2" />
                <p className="text-xs text-neutral-600">Beds</p>
                <p className="text-lg font-bold text-neutral-800">
                  {selectedProperty.bed_count}
                </p>
              </div>
            </div>

            {/* Facilities */}
            {selectedProperty.facilities &&
              selectedProperty.facilities.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-neutral-600 mb-2">
                    Facilities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.facilities.map((facility) => (
                      <span
                        key={facility.id}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm"
                      >
                        {facility.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* House Rules / Alerts */}
            {selectedProperty.alerts && selectedProperty.alerts.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-neutral-600 mb-2">
                  House Rules
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProperty.alerts.map((alert) => (
                    <span
                      key={alert.id}
                      className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-lg text-sm"
                    >
                      {alert.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {(selectedProperty.latitude || selectedProperty.longitude) && (
              <div>
                <h4 className="text-sm font-semibold text-neutral-600 mb-2">
                  Coordinates
                </h4>
                <p className="text-neutral-800">
                  Latitude: {selectedProperty.latitude || "N/A"}, Longitude:{" "}
                  {selectedProperty.longitude || "N/A"}
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
        itemName={selectedProperty?.name}
      />
    </div>
  );
};

export default PropertiesPage;
