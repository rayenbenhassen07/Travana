import React from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { FaChevronDown } from "react-icons/fa";

const LanguageSelector = ({
  selectedLanguage = "en",
  onLanguageChange,
  className = "",
  size = "md",
}) => {
  const { languages } = useLanguageStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLanguageSelect = (languageCode) => {
    onLanguageChange(languageCode);
    setIsOpen(false);
  };

  const selectedLang = languages.find((lang) => lang.code === selectedLanguage);

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  if (languages.length === 0) {
    return (
      <div
        className={`animate-pulse bg-neutral-200 rounded-md ${sizeClasses[size]} ${className}`}
      >
        <div className="w-16 h-4 bg-neutral-300 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        className={`inline-flex items-center justify-between w-full rounded-lg border border-neutral-300 bg-white ${sizeClasses[size]} font-medium text-neutral-700 hover:bg-orange-50 hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 min-w-[120px] cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {selectedLang?.name || selectedLanguage.toUpperCase()}
        </span>
        <FaChevronDown
          className={`w-3 h-3 text-neutral-400 ml-2 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-xl bg-white  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1" role="menu">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`${
                    selectedLanguage === language.code
                      ? "bg-orange-50 text-orange-700"
                      : "text-neutral-700 hover:bg-orange-50 hover:text-orange-600"
                  } flex items-center w-full px-4 py-2 text-sm transition-colors duration-200 cursor-pointer rounded-xl`}
                  role="menuitem"
                >
                  <div className="flex-1 text-left">
                    <div className="font-medium">{language.name}</div>
                    <div className="text-xs text-neutral-500">
                      {language.code.toUpperCase()}
                    </div>
                  </div>
                  {selectedLanguage === language.code && (
                    <div className="ml-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
