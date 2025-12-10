import React from "react";
import { FaTag } from "react-icons/fa";

const PopularTagsSection = ({
  tags = [],
  selectedTag,
  onTagChange,
  isLoading = false,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-neutral-100">
      <h3 className="text-lg font-[family-name:var(--font-poppins)] font-bold text-secondary-950 mb-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-secondary-500/10 rounded-lg flex items-center justify-center">
          <FaTag className="text-secondary-500 text-sm" />
        </div>
        Tags populaires
      </h3>

      {isLoading ? (
        <div className="flex flex-wrap gap-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="px-4 py-2 bg-neutral-200 rounded-lg animate-pulse h-8 w-20"
            ></div>
          ))}
        </div>
      ) : tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => {
                // Toggle tag: if already selected, deselect it (pass empty string)
                onTagChange(selectedTag === tag.slug ? "" : tag.slug);
              }}
              className={`px-3 py-1.5 rounded-lg cursor-pointer text-xs font-semibold transition-all duration-200 font-[family-name:var(--font-inter)] ${
                selectedTag === tag.slug
                  ? "bg-primary-500 text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200"
              }`}
            >
              #{tag.name}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-500 text-center py-4">
          Aucun tag disponible
        </p>
      )}
    </div>
  );
};

export default PopularTagsSection;
