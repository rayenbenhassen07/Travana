"use client";
import React, { useState, useEffect } from "react";
import {
  Input,
  Textarea,
  SelectWithSearch,
  MultiSelect,
  Button,
} from "@/components/shared/inputs";
import {
  FaInfoCircle,
  FaHome,
  FaMapMarkerAlt,
  FaDollarSign,
  FaImage,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const ListingFormSteps = ({
  initialData = null,
  onSubmit,
  onCancel,
  categories = [],
  cities = [],
  users = [],
  facilities = [],
  alerts = [],
  isSubmitting = false,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: "",
    short_description: "",
    long_description: "",
    category_id: "",
    user_id: "",

    // Step 2: Property Details
    room_count: 1,
    bathroom_count: 1,
    guest_count: 1,
    bed_count: 1,

    // Step 3: Location
    city_id: "",
    adresse: "",
    lat: "",
    long: "",

    // Step 4: Pricing
    price: "",

    // Step 5: Features
    facilities: [],
    alerts: [],

    // Step 6: Images
    images: [],
    existing_images: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  const totalSteps = 6;

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.name || "",
        short_description: initialData.short_description || "",
        long_description: initialData.long_description || "",
        category_id: initialData.property_type?.id || "",
        user_id: initialData.user?.id || "",
        room_count: initialData.room_count || 1,
        bathroom_count: initialData.bathroom_count || 1,
        guest_count: initialData.guest_capacity || 1,
        bed_count: initialData.bed_count || 1,
        city_id: initialData.city?.id || "",
        adresse: initialData.address || "",
        lat: initialData.latitude || "",
        long: initialData.longitude || "",
        price: initialData.rent_price_daily || "",
        facilities: initialData.facilities?.map((f) => f.id) || [],
        alerts: initialData.alerts?.map((a) => a.id) || [],
        images: [],
        existing_images: initialData.images || [],
      });

      // Set existing image previews
      if (initialData.images && initialData.images.length > 0) {
        const existingUrls = initialData.images.map(
          (img) => `${process.env.NEXT_PUBLIC_API_URL}/storage/${img}`
        );
        setImagePreviewUrls(existingUrls);
      }
    }
  }, [initialData]);

  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.title.trim()) errors.title = "Title is required";
      if (!formData.category_id) errors.category_id = "Category is required";
      if (!formData.user_id) errors.user_id = "Owner is required";
    } else if (step === 2) {
      if (!formData.room_count || formData.room_count < 1) {
        errors.room_count = "Minimum 1 room required";
      }
      if (!formData.guest_count || formData.guest_count < 1) {
        errors.guest_count = "Minimum 1 guest required";
      }
    } else if (step === 3) {
      if (!formData.city_id) errors.city_id = "City is required";
      if (!formData.adresse.trim()) errors.adresse = "Address is required";
    } else if (step === 4) {
      if (!formData.price || formData.price <= 0) {
        errors.price = "Valid price is required";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    // Create preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index) => {
    const isExistingImage = index < formData.existing_images.length;

    if (isExistingImage) {
      // Remove from existing images
      setFormData((prev) => ({
        ...prev,
        existing_images: prev.existing_images.filter((_, i) => i !== index),
      }));
    } else {
      // Remove from new images
      const newImageIndex = index - formData.existing_images.length;
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== newImageIndex),
      }));
    }

    // Remove preview URL
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Prepare form data for submission
    const submitData = new FormData();

    // Append basic fields
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((image) => {
          submitData.append("images[]", image);
        });
      } else if (key === "existing_images") {
        submitData.append(
          "existing_images",
          JSON.stringify(formData.existing_images)
        );
      } else if (key === "facilities" || key === "alerts") {
        formData[key].forEach((id) => {
          submitData.append(`${key}[]`, id);
        });
      } else {
        submitData.append(key, formData[key]);
      }
    });

    if (initialData) {
      submitData.append("_method", "PUT");
    }

    onSubmit(submitData);
  };

  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step < currentStep
                      ? "bg-green-500 text-white"
                      : step === currentStep
                      ? "bg-primary-500 text-white"
                      : "bg-neutral-200 text-neutral-500"
                  }`}
                >
                  {step < currentStep ? <FaCheckCircle /> : step}
                </div>
                <p className="text-xs mt-2 text-neutral-600 hidden md:block">
                  {step === 1 && "Basic Info"}
                  {step === 2 && "Details"}
                  {step === 3 && "Location"}
                  {step === 4 && "Pricing"}
                  {step === 5 && "Features"}
                  {step === 6 && "Images"}
                </p>
              </div>
              {step < totalSteps && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? "bg-green-500" : "bg-neutral-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FaInfoCircle className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-neutral-800">
                Basic Information
              </h3>
            </div>

            <Input
              label="Listing Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Luxury Beachfront Villa"
              error={formErrors.title}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectWithSearch
                label="Category"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                options={categories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                }))}
                error={formErrors.category_id}
                required
              />

              <SelectWithSearch
                label="Owner"
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                error={formErrors.user_id}
                required
              />
            </div>

            <Textarea
              label="Short Description"
              name="short_description"
              value={formData.short_description}
              onChange={handleInputChange}
              placeholder="Brief overview (max 500 characters)"
              rows={3}
            />

            <Textarea
              label="Full Description"
              name="long_description"
              value={formData.long_description}
              onChange={handleInputChange}
              placeholder="Detailed description of the property"
              rows={5}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FaHome className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-neutral-800">
                Property Details
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Rooms"
                type="number"
                name="room_count"
                value={formData.room_count}
                onChange={handleInputChange}
                min="1"
                error={formErrors.room_count}
                required
              />

              <Input
                label="Bathrooms"
                type="number"
                name="bathroom_count"
                value={formData.bathroom_count}
                onChange={handleInputChange}
                min="1"
                required
              />

              <Input
                label="Guests"
                type="number"
                name="guest_count"
                value={formData.guest_count}
                onChange={handleInputChange}
                min="1"
                error={formErrors.guest_count}
                required
              />

              <Input
                label="Beds"
                type="number"
                name="bed_count"
                value={formData.bed_count}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            <div className="bg-neutral-50 p-4 rounded-xl">
              <p className="text-sm text-neutral-600">
                <strong>Tip:</strong> Accurate property details help guests find
                the perfect match for their needs.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FaMapMarkerAlt className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-neutral-800">
                Location
              </h3>
            </div>

            <SelectWithSearch
              label="City"
              name="city_id"
              value={formData.city_id}
              onChange={handleInputChange}
              options={cities.map((city) => ({
                value: city.id,
                label: city.name,
              }))}
              error={formErrors.city_id}
              required
            />

            <Input
              label="Address"
              name="adresse"
              value={formData.adresse}
              onChange={handleInputChange}
              placeholder="Full street address"
              error={formErrors.adresse}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Latitude (optional)"
                type="number"
                name="lat"
                value={formData.lat}
                onChange={handleInputChange}
                placeholder="e.g., 36.8065"
                step="any"
              />

              <Input
                label="Longitude (optional)"
                type="number"
                name="long"
                value={formData.long}
                onChange={handleInputChange}
                placeholder="e.g., 10.1815"
                step="any"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FaDollarSign className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-neutral-800">
                Pricing
              </h3>
            </div>

            <Input
              label="Price per Night"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              error={formErrors.price}
              required
            />

            {formData.price > 0 && (
              <div className="bg-primary-50 p-4 rounded-xl">
                <p className="text-sm text-primary-700">
                  <strong>Price Preview:</strong> ${formData.price} per night
                </p>
                <p className="text-xs text-primary-600 mt-2">
                  Weekly: ~${(formData.price * 7).toFixed(2)} • Monthly: ~$
                  {(formData.price * 30).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <FaCheckCircle className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-neutral-800">
                Features & Amenities
              </h3>
            </div>

            <MultiSelect
              label="Facilities & Amenities"
              name="facilities"
              value={formData.facilities}
              onChange={handleInputChange}
              options={facilities.map((facility) => ({
                value: facility.id,
                label: facility.name,
              }))}
              placeholder="Select facilities"
              maxDisplay={3}
            />

            <MultiSelect
              label="Special Features & Alerts"
              name="alerts"
              value={formData.alerts}
              onChange={handleInputChange}
              options={alerts.map((alert) => ({
                value: alert.id,
                label: alert.name,
              }))}
              placeholder="Select special features"
              maxDisplay={3}
            />

            <div className="bg-neutral-50 p-4 rounded-xl">
              <p className="text-sm text-neutral-600">
                <strong>Tip:</strong> Select all amenities and features that
                apply to make your listing more attractive to guests.
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FaImage className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-neutral-800">
                Property Images
              </h3>
            </div>

            <div className="space-y-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 file:cursor-pointer"
              />

              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-40 object-cover rounded-xl border-2 border-neutral-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {imagePreviewUrls.length === 0 && (
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center">
                  <FaImage className="mx-auto text-neutral-400 text-4xl mb-3" />
                  <p className="text-neutral-500">No images uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderStepIndicator()}

      <div className="min-h-[400px]">{renderStep()}</div>

      <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="secondary"
              onClick={handlePrevious}
              icon={<FaArrowLeft />}
            >
              Previous
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>

          {currentStep < totalSteps ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              icon={<FaArrowRight />}
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
              isLoading={isSubmitting}
            >
              {initialData ? "Update Property" : "Create Property"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingFormSteps;
