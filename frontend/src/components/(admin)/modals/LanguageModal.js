import React, { useState, useEffect } from "react";
import Modal from "@/components/shared/Modal";
import { useLanguageStore } from "@/store/useLanguageStore";
import { Input } from "@/components/shared/inputs";
import { Button } from "@/components/shared/inputs";
import { toast } from "sonner";

const LanguageModal = ({ isOpen, onClose, mode = "add", language = null }) => {
  const { addLanguage, updateLanguage } = useLanguageStore();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    is_default: false,
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && mode === "edit" && language) {
      setFormData({
        name: language.name || "",
        code: language.code || "",
        is_default: language.is_default || false,
        is_active: language.is_active !== undefined ? language.is_active : true,
      });
      setFormErrors({});
    } else if (isOpen && mode === "add") {
      setFormData({
        name: "",
        code: "",
        is_default: false,
        is_active: true,
      });
      setFormErrors({});
    }
  }, [isOpen, mode, language]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Language name is required";
    }
    if (!formData.code.trim()) {
      errors.code = "Language code is required";
    } else if (formData.code.length !== 2) {
      errors.code = "Language code must be 2 characters (e.g., en, fr, ar)";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const languageData = {
        name: formData.name,
        code: formData.code.toLowerCase(),
        is_default: formData.is_default,
        is_active: formData.is_active,
      };

      if (mode === "add") {
        await addLanguage(languageData);
        toast.success("Language added successfully!");
      } else if (mode === "edit" && language?.id) {
        await updateLanguage(language.id, languageData);
        toast.success("Language updated successfully!");
      }

      onClose();
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        const apiErrors = {};
        Object.keys(errorData.errors).forEach((key) => {
          apiErrors[key] = errorData.errors[key][0];
        });
        setFormErrors(apiErrors);
      } else {
        toast.error(errorData?.error || `Failed to ${mode} language`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add New Language" : "Edit Language"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Language Name"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., English, Français, العربية"
          error={formErrors.name}
          required
        />

        <Input
          label="Language Code"
          name="code"
          value={formData.code}
          onChange={(e) =>
            setFormData({ ...formData, code: e.target.value.toLowerCase() })
          }
          placeholder="e.g., en, fr, ar"
          error={formErrors.code}
          required
          maxLength={2}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_default"
            checked={formData.is_default}
            onChange={(e) =>
              setFormData({ ...formData, is_default: e.target.checked })
            }
            className="w-4 h-4 text-neutral-800 border-neutral-300 rounded focus:ring-neutral-800"
          />
          <label
            htmlFor="is_default"
            className="text-sm font-medium text-neutral-700"
          >
            Set as Default Language
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) =>
              setFormData({ ...formData, is_active: e.target.checked })
            }
            className="w-4 h-4 text-neutral-800 border-neutral-300 rounded focus:ring-neutral-800"
          />
          <label
            htmlFor="is_active"
            className="text-sm font-medium text-neutral-700"
          >
            Active
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
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
            {mode === "add" ? "Add Language" : "Update Language"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LanguageModal;
