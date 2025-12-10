"use client";

import SearchListing from "./SearchListing";

const ListingsHero = ({ filters, onSearch }) => {
  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search Component */}
        <SearchListing
          destination={filters.city}
          startDate={filters.check_in}
          endDate={filters.check_out}
          pax={filters.guests?.toString()}
          onSearch={onSearch}
        />
      </div>
    </div>
  );
};

export default ListingsHero;
