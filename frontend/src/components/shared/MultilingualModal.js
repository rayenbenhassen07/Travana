import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import LanguageSelector from "./LanguageSelector";
import { useLanguageStore } from "@/store/useLanguageStore";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

const MultilingualModal = ({
  isOpen,
  onClose,
  mode = "add",
  title,
  item = null,
  currentLanguage = "en",
  onSuccess,
  initialTranslations = {},
  fields = [],
  children,
  headerElement,
  requiredMessage = "Please add at least one valid translation",
}) => {
  const { languages, fetchLanguages } = useLanguageStore();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);

  const lastInitialTranslations = useRef(null);

  // Fetch languages on mount
  useEffect(() => {
    if (languages.length === 0) {
      fetchLanguages();
    }
  }, [fetchLanguages, languages.length]);

  // Initialize modal state
  useEffect(() => {
    if (!isOpen) {
      setTranslations({});

      setSelectedLanguage(null);
      lastInitialTranslations.current = null;
      return;
    }

    if (languages.length > 0) {
      const defaultLang =
        languages.find((lang) => lang.code === currentLanguage) ||
        languages.find((lang) => lang.is_default) ||
        languages[0];
      setSelectedLanguage(defaultLang);

      const translationsChanged =
        JSON.stringify(initialTranslations) !==
        JSON.stringify(lastInitialTranslations.current);

      if (translationsChanged) {
        if (
          mode === "edit" &&
          item?.id &&
          Object.keys(initialTranslations).length > 0
        ) {
          setTranslations(initialTranslations);
        } else {
          setTranslations({});
        }
        lastInitialTranslations.current = initialTranslations;
      }
    }
  }, [isOpen, languages, currentLanguage, mode, item?.id, initialTranslations]);

  const handleLanguageChange = (langCode) => {
    const newLanguage = languages.find((lang) => lang.code === langCode);
    setSelectedLanguage(newLanguage);
  };

  const handleFieldChange = (fieldName, value) => {
    if (!selectedLanguage) return;
    setTranslations((prev) => ({
      ...prev,
      [selectedLanguage.code]: {
        ...prev[selectedLanguage.code],
        [fieldName]: value,
      },
    }));
  };

  const hasValidTranslations = () => {
    // Check if ALL languages have valid translations
    return languages.every((lang) =>
      fields.every(
        (field) =>
          !field.required || translations[lang.code]?.[field.name]?.trim()
      )
    );
  };

  const handleSubmit = async () => {
    if (!hasValidTranslations()) {
      const errorMsg = "Please fill in all required fields for ALL languages";

      toast.error(errorMsg);
      return;
    }

    setLoading(true);

    try {
      const formattedTranslations = Object.entries(translations)
        .filter(([langCode, trans]) =>
          fields.some((field) => trans[field.name]?.trim())
        )
        .map(([language_code, trans]) => ({
          language_code,
          ...trans,
        }));

      // Ensure we have translations for ALL languages
      if (formattedTranslations.length !== languages.length) {
        const errorMsg = "Please provide translations for all languages";

        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      await onSuccess({ translations: formattedTranslations, id: item?.id });
      handleClose();
    } catch (error) {
      const errorMsg = error.message || "An error occurred";

      // Don't show toast here as it's already shown in the child component
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTranslations({});

    setSelectedLanguage(null);
    lastInitialTranslations.current = null;
    onClose();
  };

  const renderField = (field) => {
    const value =
      selectedLanguage && translations[selectedLanguage.code]
        ? translations[selectedLanguage.code][field.name] || ""
        : "";

    const baseClasses =
      "w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-800 transition-all duration-200";

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            className={baseClasses}
            disabled={!selectedLanguage || loading || field.disabled}
          />
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={baseClasses}
            disabled={!selectedLanguage || loading || field.disabled}
          >
            {field.placeholder && (
              <option value="" disabled>
                {field.placeholder}
              </option>
            )}
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            step={field.step || "any"}
            className={baseClasses}
            disabled={!selectedLanguage || loading || field.disabled}
          />
        );

      default:
        return (
          <input
            type={field.type || "text"}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={baseClasses}
            disabled={!selectedLanguage || loading || field.disabled}
          />
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "add" ? `Add ${title}` : `Edit ${title}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Language Selector */}
        <div className="flex justify-end">
          <LanguageSelector
            selectedLanguage={selectedLanguage?.code || "en"}
            onLanguageChange={handleLanguageChange}
            size="md"
            className="w-48"
          />
        </div>

        {/* Header Element */}
        {headerElement && <div>{headerElement}</div>}

        {/* Fields */}
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {field.label}
                {selectedLanguage && (
                  <span className="ml-2 text-xs text-neutral-500">
                    ({selectedLanguage.name})
                  </span>
                )}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>

        {/* Translation Status */}
        <div className="p-4 bg-neutral-50 rounded-xl">
          <h4 className="text-sm font-semibold text-neutral-700 mb-3">
            Translation Status
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {languages.map((lang) => {
              const isComplete = fields.every(
                (field) =>
                  !field.required ||
                  translations[lang.code]?.[field.name]?.trim()
              );
              return (
                <div
                  key={lang.code}
                  className={`px-3 py-2 rounded-lg text-xs font-medium ${
                    isComplete
                      ? "bg-green-100 text-green-800"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {lang.code.toUpperCase()}
                  {isComplete && <span className="ml-1">✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Children */}
        {children}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all duration-200 font-medium cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <div className="inline-flex items-center justify-center">
                <FaSpinner className="animate-spin w-4 h-4 mr-2" />
                Saving...
              </div>
            ) : mode === "add" ? (
              "Create"
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MultilingualModal;
