import React, { useState, useEffect } from "react";
import MultilingualModal from "@/components/shared/MultilingualModal";
import { useCityStore } from "@/store/useCityStore";
import { Input } from "@/components/shared/inputs";
import { toast } from "sonner";

const CityModal = ({
  isOpen,
  onClose,
  mode = "add",
  city = null,
  currentLanguage = "en",
  onSuccess,
}) => {
  const { addCity, updateCity } = useCityStore();
  const [translations, setTranslations] = useState({});
  const [additionalData, setAdditionalData] = useState({
    slug: "",
    latitude: "",
    longitude: "",
    is_active: true,
  });
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (isOpen && mode === "edit" && city?.id) {
      // Load existing translations
      const loadedTranslations = {};
      if (city.translations) {
        Object.keys(city.translations).forEach((langCode) => {
          loadedTranslations[langCode] = {
            name: city.translations[langCode],
          };
        });
      }
      setTranslations(loadedTranslations);

      // Load additional data
      setAdditionalData({
        slug: city.slug || "",
        latitude: city.latitude || "",
        longitude: city.longitude || "",
        is_active: city.is_active !== undefined ? city.is_active : true,
      });

      setKey((prev) => prev + 1);
    } else if (isOpen && mode === "add") {
      setTranslations({});
      setAdditionalData({
        slug: "",
        latitude: "",
        longitude: "",
        is_active: true,
      });
      setKey((prev) => prev + 1);
    }
  }, [isOpen, mode, city?.id, city]);

  const handleSuccess = async (formData) => {
    try {
      const cityData = {
        slug: additionalData.slug,
        latitude: additionalData.latitude || null,
        longitude: additionalData.longitude || null,
        is_active: additionalData.is_active,
        translations: formData.translations,
      };

      let result;
      if (mode === "add") {
        result = await addCity(cityData);
      } else if (mode === "edit" && city?.id) {
        result = await updateCity(city.id, cityData);
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
        `Failed to ${mode === "add" ? "add" : "update"} city`;
      toast.error(errorMessage);
      throw error;
    }
  };

  const fields = [
    {
      name: "name",
      label: "City Name",
      placeholder: "Enter city name",
      required: true,
      type: "text",
    },
  ];

  const headerElement = (
    <div className="space-y-4 pb-4 border-b border-neutral-200">
      <Input
        label="Slug"
        value={additionalData.slug}
        onChange={(e) =>
          setAdditionalData({ ...additionalData, slug: e.target.value })
        }
        placeholder="e.g., tunis, paris, london"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Latitude"
          type="number"
          step="any"
          value={additionalData.latitude}
          onChange={(e) =>
            setAdditionalData({ ...additionalData, latitude: e.target.value })
          }
          placeholder="e.g., 36.8065"
        />
        <Input
          label="Longitude"
          type="number"
          step="any"
          value={additionalData.longitude}
          onChange={(e) =>
            setAdditionalData({
              ...additionalData,
              longitude: e.target.value,
            })
          }
          placeholder="e.g., 10.1815"
        />
      </div>
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
          className="w-4 h-4 text-neutral-800 border-neutral-300 rounded focus:ring-neutral-800"
        />
        <label
          htmlFor="is_active"
          className="text-sm font-medium text-neutral-700"
        >
          Active
        </label>
      </div>
    </div>
  );

  return (
    <MultilingualModal
      key={key}
      isOpen={isOpen}
      onClose={onClose}
      mode={mode}
      title="City"
      item={city}
      currentLanguage={currentLanguage}
      onSuccess={handleSuccess}
      initialTranslations={translations}
      fields={fields}
      headerElement={headerElement}
      requiredMessage="Please provide city name translations for all languages"
    />
  );
};

export default CityModal;
