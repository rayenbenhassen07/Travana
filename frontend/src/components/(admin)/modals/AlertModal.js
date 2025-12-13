import React, { useState, useEffect } from "react";
import MultilingualModal from "@/components/shared/MultilingualModal";
import { useAlertStore } from "@/store/useAlertStore";
import { Select, FileInput } from "@/components/shared/inputs";
import { toast } from "sonner";

const AlertModal = ({
  isOpen,
  onClose,
  mode = "add",
  alert = null,
  currentLanguage = "en",
  onSuccess,
}) => {
  const { addAlert, updateAlert } = useAlertStore();
  const [initialTranslations, setInitialTranslations] = useState([]);
  const [additionalData, setAdditionalData] = useState({
    icon: null,
    is_active: true,
    sort_order: 0,
  });
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (isOpen && mode === "edit" && alert?.id) {
      // Load existing translations - convert array to object keyed by language_code
      const translationsObj = {};
      if (alert.translations && Array.isArray(alert.translations)) {
        alert.translations.forEach((translation) => {
          translationsObj[translation.language_code] = {
            name: translation.name || "",
            description: translation.description || "",
          };
        });
      }
      setInitialTranslations(translationsObj);

      // Load additional data
      setAdditionalData({
        icon: alert.icon || null,
        is_active: alert.is_active !== undefined ? alert.is_active : true,
        sort_order: alert.sort_order || 0,
      });

      setKey((prev) => prev + 1);
    } else if (isOpen && mode === "add") {
      setInitialTranslations([]);
      setAdditionalData({
        icon: null,
        is_active: true,
        sort_order: 0,
      });
      setKey((prev) => prev + 1);
    }
  }, [isOpen, mode, alert?.id, alert]);

  const handleSuccess = async (formData) => {
    try {
      const alertFormData = new FormData();

      // Add icon first if it's a file
      if (additionalData.icon && additionalData.icon instanceof File) {
        alertFormData.append("icon", additionalData.icon);
      }

      // Add other fields
      alertFormData.append("is_active", additionalData.is_active ? "1" : "0");
      alertFormData.append("sort_order", additionalData.sort_order || 0);

      // Add translations - handle both array and object formats
      const translationsArray = Array.isArray(formData.translations)
        ? formData.translations
        : Object.values(formData.translations);

      translationsArray.forEach((translation, index) => {
        alertFormData.append(
          `translations[${index}][language_code]`,
          translation.language_code
        );
        alertFormData.append(`translations[${index}][name]`, translation.name);
        alertFormData.append(
          `translations[${index}][description]`,
          translation.description || ""
        );
      });

      let result;
      if (mode === "add") {
        result = await addAlert(alertFormData);
      } else if (mode === "edit" && alert?.id) {
        alertFormData.append("_method", "PUT");
        result = await updateAlert(alert.id, alertFormData);
      }

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.translations?.[0] ||
        error.message ||
        `Failed to ${mode === "add" ? "add" : "update"} alert`;
      toast.error(errorMessage);
      throw error;
    }
  };

  const fields = [
    {
      name: "name",
      label: "Alert Name",
      placeholder: "Enter alert name",
      required: true,
      type: "text",
    },
    {
      name: "description",
      label: "Description",
      placeholder: "Enter alert description",
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
          mode === "edit" && alert?.icon && typeof alert.icon === "string"
            ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${alert.icon}`
            : null
        }
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active_alert"
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
          htmlFor="is_active_alert"
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
      title={mode === "add" ? "Add New Alert" : "Edit Alert"}
      fields={fields}
      initialTranslations={initialTranslations}
      additionalFields={additionalFields}
      onSuccess={handleSuccess}
      mode={mode}
      item={alert}
      currentLanguage={currentLanguage}
    />
  );
};

export default AlertModal;
