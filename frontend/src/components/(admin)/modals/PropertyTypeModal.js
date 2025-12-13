import React, { useState, useEffect } from "react";
import MultilingualModal from "@/components/shared/MultilingualModal";
import { usePropertyTypeStore } from "@/store/usePropertyTypeStore";
import { Input, FileInput } from "@/components/shared/inputs";
import { toast } from "sonner";

const PropertyTypeModal = ({
  isOpen,
  onClose,
  mode = "add",
  propertyType = null,
  currentLanguage = "en",
  onSuccess,
}) => {
  const { addPropertyType, updatePropertyType } = usePropertyTypeStore();
  const [translations, setTranslations] = useState({});
  const [additionalData, setAdditionalData] = useState({
    icon: null,
    is_active: true,
    sort_order: 0,
  });
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (isOpen && mode === "edit" && propertyType?.id) {
      // Load existing translations - handle object format keyed by language code
      const loadedTranslations = {};
      if (
        propertyType.translations &&
        typeof propertyType.translations === "object"
      ) {
        Object.keys(propertyType.translations).forEach((langCode) => {
          loadedTranslations[langCode] = {
            name: propertyType.translations[langCode].name || "",
            description: propertyType.translations[langCode].description || "",
          };
        });
      }
      setTranslations(loadedTranslations);

      // Load additional data
      setAdditionalData({
        icon: propertyType.icon || null,
        is_active:
          propertyType.is_active !== undefined ? propertyType.is_active : true,
        sort_order: propertyType.sort_order || 0,
      });

      setKey((prev) => prev + 1);
    } else if (isOpen && mode === "add") {
      setTranslations({});
      setAdditionalData({
        icon: null,
        is_active: true,
        sort_order: 0,
      });
      setKey((prev) => prev + 1);
    }
  }, [isOpen, mode, propertyType]);

  const handleSuccess = async (formData) => {
    try {
      const propertyTypeFormData = new FormData();
      propertyTypeFormData.append(
        "is_active",
        additionalData.is_active ? "1" : "0"
      );
      propertyTypeFormData.append("sort_order", additionalData.sort_order || 0);

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
        propertyTypeFormData.append(
          `translations[${index}][language_code]`,
          translation.language_code
        );
        propertyTypeFormData.append(
          `translations[${index}][name]`,
          translation.name
        );
        propertyTypeFormData.append(
          `translations[${index}][description]`,
          translation.description || ""
        );
      });

      // Add icon if it's a file
      if (additionalData.icon && additionalData.icon instanceof File) {
        propertyTypeFormData.append("icon", additionalData.icon);
      }

      let result;
      if (mode === "add") {
        result = await addPropertyType(propertyTypeFormData);
      } else if (mode === "edit" && propertyType?.id) {
        propertyTypeFormData.append("_method", "PUT");
        result = await updatePropertyType(
          propertyType.id,
          propertyTypeFormData
        );
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
        `Failed to ${mode === "add" ? "add" : "update"} property type`;
      toast.error(errorMessage);
      throw error;
    }
  };

  const fields = [
    {
      name: "name",
      label: "Property Type Name",
      placeholder: "Enter property type name",
      required: true,
      type: "text",
    },
    {
      name: "description",
      label: "Description",
      placeholder: "Enter property type description",
      required: false,
      type: "textarea",
      rows: 3,
    },
  ];

  const additionalFields = (
    <>
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
          mode === "edit" &&
          propertyType?.icon &&
          typeof propertyType.icon === "string"
            ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${propertyType.icon}`
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
          id="is_active"
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
          htmlFor="is_active"
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
      title={mode === "add" ? "Add New Property Type" : "Edit Property Type"}
      fields={fields}
      initialTranslations={translations}
      additionalFields={additionalFields}
      onSuccess={handleSuccess}
      mode={mode}
      item={propertyType}
      currentLanguage={currentLanguage}
    />
  );
};

export default PropertyTypeModal;
