import React, { useState, useEffect } from "react";
import MultilingualModal from "@/components/shared/MultilingualModal";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { Input } from "@/components/shared/inputs";
import { toast } from "sonner";

const CurrencyModal = ({
  isOpen,
  onClose,
  mode = "add",
  currency = null,
  currentLanguage = "en",
  onSuccess,
}) => {
  const { addCurrency, updateCurrency } = useCurrencyStore();
  const [translations, setTranslations] = useState({});
  const [additionalData, setAdditionalData] = useState({
    code: "",
    symbol: "",
    exchange_rate: "",
    is_default: false,
    is_active: true,
  });
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (isOpen && mode === "edit" && currency?.id) {
      // Load existing translations
      const loadedTranslations = {};
      if (currency.translations) {
        Object.keys(currency.translations).forEach((langCode) => {
          loadedTranslations[langCode] = {
            name: currency.translations[langCode],
          };
        });
      }
      setTranslations(loadedTranslations);

      // Load additional data
      setAdditionalData({
        code: currency.code || "",
        symbol: currency.symbol || "",
        exchange_rate: currency.exchange_rate || "",
        is_default: currency.is_default || false,
        is_active: currency.is_active !== undefined ? currency.is_active : true,
      });

      setKey((prev) => prev + 1);
    } else if (isOpen && mode === "add") {
      setTranslations({});
      setAdditionalData({
        code: "",
        symbol: "",
        exchange_rate: "",
        is_default: false,
        is_active: true,
      });
      setKey((prev) => prev + 1);
    }
  }, [isOpen, mode, currency?.id, currency]);

  const handleSuccess = async (formData) => {
    try {
      const currencyData = {
        code: additionalData.code.toUpperCase(),
        symbol: additionalData.symbol,
        exchange_rate: parseFloat(additionalData.exchange_rate),
        is_default: additionalData.is_default,
        is_active: additionalData.is_active,
        translations: formData.translations,
      };

      let result;
      if (mode === "add") {
        result = await addCurrency(currencyData);
      } else if (mode === "edit" && currency?.id) {
        result = await updateCurrency(currency.id, currencyData);
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
        `Failed to ${mode === "add" ? "add" : "update"} currency`;
      toast.error(errorMessage);
      throw error;
    }
  };

  const fields = [
    {
      name: "name",
      label: "Currency Name",
      placeholder: "Enter currency name",
      required: true,
      type: "text",
    },
  ];

  const headerElement = (
    <div className="space-y-4 pb-4 border-b border-neutral-200">
      <Input
        label="Currency Code"
        value={additionalData.code}
        onChange={(e) =>
          setAdditionalData({
            ...additionalData,
            code: e.target.value.toUpperCase(),
          })
        }
        placeholder="e.g., USD, EUR, TND"
        required
        maxLength={3}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Symbol"
          value={additionalData.symbol}
          onChange={(e) =>
            setAdditionalData({ ...additionalData, symbol: e.target.value })
          }
          placeholder="e.g., $, €, د.ت"
          required
        />
        <Input
          label="Exchange Rate"
          type="number"
          step="0.0001"
          value={additionalData.exchange_rate}
          onChange={(e) =>
            setAdditionalData({
              ...additionalData,
              exchange_rate: e.target.value,
            })
          }
          placeholder="e.g., 1.0000"
          required
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_default"
          checked={additionalData.is_default}
          onChange={(e) =>
            setAdditionalData({
              ...additionalData,
              is_default: e.target.checked,
            })
          }
          className="w-4 h-4 text-neutral-800 border-neutral-300 rounded focus:ring-neutral-800"
        />
        <label
          htmlFor="is_default"
          className="text-sm font-medium text-neutral-700"
        >
          Set as Default Currency
        </label>
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
      title="Currency"
      item={currency}
      currentLanguage={currentLanguage}
      onSuccess={handleSuccess}
      initialTranslations={translations}
      fields={fields}
      headerElement={headerElement}
      requiredMessage="Please provide currency name translations for all languages"
    />
  );
};

export default CurrencyModal;
