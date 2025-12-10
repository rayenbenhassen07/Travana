import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaChevronDown,
  FaCheckCircle,
  FaSearch,
} from "react-icons/fa";
import { MdLocationCity } from "react-icons/md";
import { Listbox } from "@headlessui/react";

const DestinationSelect = ({
  cities = [], // Provide default empty array
  value,
  onChange,
  placeholder = "ville... ?",
}) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState(cities);

  // Update filtered cities when cities prop changes
  useEffect(() => {
    setFilteredCities(cities);
  }, [cities]);

  // Set initial selected city
  useEffect(() => {
    if (value && cities.length > 0) {
      const initialCity = cities.find((city) => city.name === value) || null;
      setSelectedCity(initialCity);
    }
  }, [value, cities]);

  // Filter cities based on search query
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [searchQuery, cities]);

  const handleChange = (city) => {
    setSelectedCity(city);
    onChange(city);
  };

  return (
    <div className="relative items-center flex-1 w-full z-[70] ">
      <FaMapMarkerAlt className="absolute top-1/2 -translate-y-1/2 left-3 text-primary-500 pointer-events-none" />

      <Listbox value={selectedCity} onChange={handleChange}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button className="w-full border-2 border-neutral-200 rounded-xl p-3 pl-10 text-sm md:text-base appearance-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 flex justify-between items-center bg-white hover:bg-neutral-50 hover:border-primary-500 transition-all text-neutral-700 cursor-pointer">
              {selectedCity ? selectedCity.name : placeholder}
              <FaChevronDown
                className={`h-4 w-4 text-primary-500 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </Listbox.Button>

            {open && (
              <Listbox.Options
                static
                className="absolute mt-2 w-full max-h-60 overflow-auto bg-white border-2 border-neutral-200 rounded-xl shadow-2xl focus:outline-none z-[80]"
              >
                <div className="flex items-center px-4 py-3 border-b border-neutral-200 bg-neutral-50">
                  <FaSearch className="text-primary-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Rechercher une ville..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full outline-none text-sm text-neutral-700 bg-transparent"
                    autoFocus
                  />
                </div>

                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <Listbox.Option
                      key={city.id}
                      value={city}
                      className={({ active }) =>
                        `flex items-center gap-2 px-4 py-3 cursor-pointer transition-colors ${
                          active
                            ? "bg-primary-50 text-primary-700"
                            : "text-neutral-700 hover:bg-neutral-50"
                        }`
                      }
                    >
                      <MdLocationCity className="text-primary-500" />
                      <span className="font-medium">{city.name}</span>
                      {selectedCity?.id === city.id && (
                        <FaCheckCircle className="h-4 w-4 text-primary-500 ml-auto" />
                      )}
                    </Listbox.Option>
                  ))
                ) : (
                  <div className="px-4 py-3 text-neutral-500 text-sm">
                    Aucune ville trouvée
                  </div>
                )}
              </Listbox.Options>
            )}
          </div>
        )}
      </Listbox>
    </div>
  );
};

export default DestinationSelect;
