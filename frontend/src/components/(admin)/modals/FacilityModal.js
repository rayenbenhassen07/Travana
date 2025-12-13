import React, { useState, useEffect } from "react";
import MultilingualModal from "@/components/shared/MultilingualModal";
import { useFacilityStore } from "@/store/useFacilityStore";
import { useFacilityCategoryStore } from "@/store/useFacilityCategoryStore";
import { Input, Select, FileInput } from "@/components/shared/inputs";
import { toast } from "sonner";

const FacilityModal = ({
  isOpen,
  onClose,
  mode = "add",
  facility = null,
  currentLanguage = "en",
  onSuccess,
}) => {
  const { addFacility, updateFacility } = useFacilityStore();
  const { facilityCategories, fetchFacilityCategories } =
    useFacilityCategoryStore();
  const [translations, setTranslations] = useState({});
  const [additionalData, setAdditionalData] = useState({
    category_id: "",
    icon: null,
    is_active: true,
    sort_order: 0,
  });
  const [key, setKey] = useState(0);

  // Fetch facility categories when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchFacilityCategories(currentLanguage);
    }
  }, [isOpen, currentLanguage]);

  useEffect(() => {
    if (isOpen && mode === "edit" && facility?.id) {
      // Load existing translations - handle object format keyed by language code
      const loadedTranslations = {};
      if (facility.translations && typeof facility.translations === "object") {
        Object.keys(facility.translations).forEach((langCode) => {
          loadedTranslations[langCode] = {
            name: facility.translations[langCode].name || "",
            description: facility.translations[langCode].description || "",
          };
        });
      }
      setTranslations(loadedTranslations);

      // Load additional data
      setAdditionalData({
        category_id: facility.category_id || "",
        icon: facility.icon || null,
        is_active: facility.is_active !== undefined ? facility.is_active : true,
        sort_order: facility.sort_order || 0,
      });

      setKey((prev) => prev + 1);
    } else if (isOpen && mode === "add") {
      setTranslations({});
      setAdditionalData({
        category_id:
          facilityCategories.length > 0 ? facilityCategories[0].id : "",
        icon: null,
        is_active: true,
        sort_order: 0,
      });
      setKey((prev) => prev + 1);
    }
  }, [isOpen, mode, facility?.id, facility, facilityCategories]);

  const handleSuccess = async (formData) => {
    try {
      const facilityFormData = new FormData();

      // Add icon FIRST if it's a file (order matters for Laravel validation)
      if (additionalData.icon && additionalData.icon instanceof File) {
        facilityFormData.append("icon", additionalData.icon);
      }

      facilityFormData.append("category_id", additionalData.category_id);
      facilityFormData.append(
        "is_active",
        additionalData.is_active ? "1" : "0"
      );
      facilityFormData.append("sort_order", additionalData.sort_order || 0);

      // formData.translations is already an array from MultilingualModal
      const translationsArray = Array.isArray(formData.translations)
        ? formData.translations
        : Object.keys(formData.translations).map((langCode) => ({
            language_code: langCode,
            name: formData.translations[langCode].name,
            description: formData.translations[langCode].description || "",
          }));

      // Append each translation as separate fields
      translationsArray.forEach((translation, index) => {
        facilityFormData.append(
          `translations[${index}][language_code]`,
          translation.language_code
        );
        facilityFormData.append(
          `translations[${index}][name]`,
          translation.name
        );
        facilityFormData.append(
          `translations[${index}][description]`,
          translation.description || ""
        );
      });

      let result;
      if (mode === "add") {
        result = await addFacility(facilityFormData);
      } else if (mode === "edit" && facility?.id) {
        facilityFormData.append("_method", "PUT");
        result = await updateFacility(facility.id, facilityFormData);
      }

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      // Display error in toast
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.translations?.[0] ||
        error.message ||
        `Failed to ${mode === "add" ? "add" : "update"} facility`;
      toast.error(errorMessage);
      throw error;
    }
  };

  const fields = [
    {
      name: "name",
      label: "Facility Name",
      placeholder: "Enter facility name",
      required: true,
      type: "text",
    },
    {
      name: "description",
      label: "Description",
      placeholder: "Enter facility description",
      required: false,
      type: "textarea",
      rows: 3,
    },
  ];

  const additionalFields = (
    <>
      <Select
        label="Category"
        name="category_id"
        value={additionalData.category_id}
        onChange={(e) =>
          setAdditionalData({ ...additionalData, category_id: e.target.value })
        }
        options={facilityCategories
          .filter((cat) => cat.is_active)
          .map((cat) => ({
            value: cat.id,
            label: cat.name,
          }))}
        required
      />

      <FileInput
        label="Icon"
        name="icon"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setAdditionalData({ ...additionalData, icon: file });
          }
        }}
        accept="image/*"
        currentFile={
          mode === "edit" && facility?.icon && typeof facility.icon === "string"
            ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${facility.icon}`
            : null
        }
      />

      <Input
        label="Sort Order"
        name="sort_order"
        type="number"
        value={additionalData.sort_order}
        onChange={(e) =>
          setAdditionalData({
            ...additionalData,
            sort_order: parseInt(e.target.value) || 0,
          })
        }
        placeholder="0"
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active_facility"
          checked={additionalData.is_active}
          onChange={(e) =>
            setAdditionalData({
              ...additionalData,
              is_active: e.target.checked,
            })
          }
          className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
        />
        <label
          htmlFor="is_active_facility"
          className="text-sm font-medium text-neutral-700 cursor-pointer"
        >
          Active
        </label>
      </div>
    </>
  );

  return (
    <MultilingualModal
      key={key}
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add New Facility" : "Edit Facility"}
      fields={fields}
      initialTranslations={translations}
      additionalFields={additionalFields}
      onSuccess={handleSuccess}
      mode={mode}
      item={facility}
      currentLanguage={currentLanguage}
    />
  );
};

export default FacilityModal;
