import React, { useState, useEffect } from "react";
import MultilingualModal from "@/components/shared/MultilingualModal";
import { useFacilityCategoryStore } from "@/store/useFacilityCategoryStore";
import { toast } from "sonner";

const FacilityCategoryModal = ({
  isOpen,
  onClose,
  mode = "add",
  category = null,
  currentLanguage = "en",
  onSuccess,
}) => {
  const { addFacilityCategory, updateFacilityCategory } =
    useFacilityCategoryStore();
  const [translations, setTranslations] = useState({});
  const [additionalData, setAdditionalData] = useState({
    is_active: true,
  });
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (isOpen && mode === "edit" && category?.id) {
      // Load existing translations - handle object format keyed by language code
      const loadedTranslations = {};
      if (category.translations && typeof category.translations === "object") {
        Object.keys(category.translations).forEach((langCode) => {
          loadedTranslations[langCode] = {
            name: category.translations[langCode].name || "",
            description: category.translations[langCode].description || "",
          };
        });
      }
      setTranslations(loadedTranslations);

      // Load additional data
      setAdditionalData({
        is_active: category.is_active !== undefined ? category.is_active : true,
      });

      setKey((prev) => prev + 1);
    } else if (isOpen && mode === "add") {
      setTranslations({});
      setAdditionalData({
        is_active: true,
      });
      setKey((prev) => prev + 1);
    }
  }, [isOpen, mode, category?.id, category]);

  const handleSuccess = async (formData) => {
    try {
      const categoryFormData = new FormData();
      categoryFormData.append(
        "is_active",
        additionalData.is_active ? "1" : "0"
      );

      // Convert translations array to object format for backend
      // Backend expects: { "en": { "name": "...", "description": "..." }, ... }
      const translationsObject = {};
      if (Array.isArray(formData.translations)) {
        formData.translations.forEach((trans) => {
          const { language_code, ...rest } = trans;
          translationsObject[language_code] = rest;
        });
      } else {
        // Fallback if already in object format
        Object.assign(translationsObject, formData.translations);
      }

      // Add translations as JSON string
      categoryFormData.append(
        "translations",
        JSON.stringify(translationsObject)
      );

      let result;
      if (mode === "add") {
        result = await addFacilityCategory(categoryFormData);
      } else if (mode === "edit" && category?.id) {
        categoryFormData.append("_method", "PUT");
        result = await updateFacilityCategory(category.id, categoryFormData);
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
        `Failed to ${mode === "add" ? "add" : "update"} facility category`;
      toast.error(errorMessage);
      throw error;
    }
  };

  const fields = [
    {
      name: "name",
      label: "Category Name",
      placeholder: "Enter category name",
      required: true,
      type: "text",
    },
    {
      name: "description",
      label: "Description",
      placeholder: "Enter category description",
      required: false,
      type: "textarea",
      rows: 3,
    },
  ];

  const additionalFields = (
    <>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active_category"
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
          htmlFor="is_active_category"
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
      title={
        mode === "add" ? "Add New Facility Category" : "Edit Facility Category"
      }
      fields={fields}
      initialTranslations={translations}
      additionalFields={additionalFields}
      onSuccess={handleSuccess}
      mode={mode}
      item={category}
      currentLanguage={currentLanguage}
    />
  );
};

export default FacilityCategoryModal;
