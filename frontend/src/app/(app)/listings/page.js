"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useListingStore } from "@/store/useListingStore";
import { useCityStore } from "@/store/useCityStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import {
  ListingGrid,
  ListingsHero,
  ListingsSearchBanner,
  ListingsFiltersBar,
} from "@/components/(app)/listings";
import Pagination from "@/components/shared/Pagination";
import ListingsFilterModal from "@/components/(app)/modals/ListingsFilterModal";

const ListingsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    listings,
    total,
    currentPage,
    totalPages,
    itemsPerPage,
    isLoading,
    error,
    fetchListings,
  } = useListingStore();

  const { cities, fetchCities } = useCityStore();
  const { categories, fetchCategories } = useCategoryStore();

  // Parse URL search params
  const urlCity = searchParams.get("city");
  const urlCheckIn = searchParams.get("check_in");
  const urlCheckOut = searchParams.get("check_out");
  const urlGuests = searchParams.get("guests");

  const [filters, setLocalFilters] = useState({
    search: "",
    city: urlCity || "",
    category_id: null,
    min_price: null,
    max_price: null,
    guests: urlGuests ? parseInt(urlGuests) : null,
    check_in: urlCheckIn || null,
    check_out: urlCheckOut || null,
    sort_by: null,
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch cities and categories on mount
  useEffect(() => {
    fetchCities();
    fetchCategories();
  }, [fetchCities, fetchCategories]);

  // Initial fetch with URL params
  useEffect(() => {
    if (!isInitialized) {
      const initialFilters = {
        ...filters,
        city: urlCity || "",
        guests: urlGuests ? parseInt(urlGuests) : null,
        check_in: urlCheckIn || null,
        check_out: urlCheckOut || null,
      };
      setLocalFilters(initialFilters);
      fetchListings(1, 12, initialFilters);
      setIsInitialized(true);
    }
  }, [urlCity, urlCheckIn, urlCheckOut, urlGuests, isInitialized]);

  // Update URL params helper
  const updateUrlParams = useCallback(
    (updatedFilters) => {
      const params = new URLSearchParams();
      if (updatedFilters.city) params.set("city", updatedFilters.city);
      if (updatedFilters.check_in)
        params.set("check_in", updatedFilters.check_in);
      if (updatedFilters.check_out)
        params.set("check_out", updatedFilters.check_out);
      if (updatedFilters.guests)
        params.set("guests", updatedFilters.guests.toString());

      const queryString = params.toString();
      router.replace(queryString ? `/listings?${queryString}` : "/listings", {
        scroll: false,
      });
    },
    [router]
  );

  // Handle search from SearchListing component
  const handleSearch = useCallback(
    (searchParams) => {
      const updatedFilters = {
        ...filters,
        city: searchParams.city,
        check_in: searchParams.check_in,
        check_out: searchParams.check_out,
        guests: searchParams.guests,
      };
      setLocalFilters(updatedFilters);
      fetchListings(1, itemsPerPage, updatedFilters);
      updateUrlParams(updatedFilters);
    },
    [filters, itemsPerPage, fetchListings, updateUrlParams]
  );

  // Filter handlers
  const handleFilterChange = useCallback(
    (newFilters) => {
      const updatedFilters = { ...filters, ...newFilters };
      setLocalFilters(updatedFilters);
      fetchListings(1, itemsPerPage, updatedFilters);
      updateUrlParams(updatedFilters);
    },
    [filters, itemsPerPage, fetchListings, updateUrlParams]
  );

  const handlePageChange = useCallback(
    (page) => {
      fetchListings(page, itemsPerPage, filters);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [fetchListings, itemsPerPage, filters]
  );

  const clearAllFilters = useCallback(() => {
    const clearedFilters = {
      search: "",
      city: "",
      category_id: null,
      min_price: null,
      max_price: null,
      guests: null,
      check_in: null,
      check_out: null,
      sort_by: null,
    };
    setLocalFilters(clearedFilters);
    fetchListings(1, itemsPerPage, clearedFilters);
    router.replace("/listings", { scroll: false });
  }, [fetchListings, itemsPerPage, router]);

  const hasActiveFilters =
    filters.city ||
    filters.category_id ||
    filters.min_price ||
    filters.max_price ||
    filters.guests ||
    filters.sort_by;

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.title,
  }));

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section with Search */}
      <ListingsHero filters={filters} onSearch={handleSearch} />

      {/* Search Info Banner */}
      {/* <ListingsSearchBanner
        filters={filters}
        onFilterChange={handleFilterChange}
      /> */}

      {/* Filters Bar */}
      <ListingsFiltersBar
        filters={filters}
        categories={categories}
        total={total}
        onFilterChange={handleFilterChange}
        onClearAll={clearAllFilters}
        onOpenMobileFilters={() => setShowMobileFilters(true)}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header - Mobile */}
        <div className="lg:hidden mb-6 flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            <span className="font-semibold text-secondary-800">{total}</span>{" "}
            {total === 1 ? "propriété" : "propriétés"} trouvée
            {total !== 1 && "s"}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm cursor-pointer"
            >
              Effacer filtres
            </button>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-3">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Listings Grid */}
        <ListingGrid listings={listings} isLoading={isLoading} />

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="mt-12 flex justify-center">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </main>

      {/* Mobile Filter Modal */}
      <ListingsFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAll={clearAllFilters}
        categoryOptions={categoryOptions}
        total={total}
      />
    </div>
  );
};

export default ListingsPage;
