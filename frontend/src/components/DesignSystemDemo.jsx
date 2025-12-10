/**
 * Design System Demo Components
 * Copy and adapt these components for your booking website
 */

import React from "react";

// ============================================
// BUTTON COMPONENTS
// ============================================

export const PrimaryButton = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${className}`}
  >
    {children}
  </button>
);

export const SecondaryButton = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`bg-secondary-800 hover:bg-secondary-900 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-200 ${className}`}
  >
    {children}
  </button>
);

export const OutlineButton = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-medium px-6 py-3 rounded-lg transition-all duration-200 ${className}`}
  >
    {children}
  </button>
);

// ============================================
// BADGE COMPONENTS
// ============================================

export const FeaturedBadge = () => (
  <span className="bg-accent-amber text-secondary-950 px-3 py-1 rounded-full text-sm font-[family-name:var(--font-montserrat)] font-semibold inline-flex items-center gap-1">
    ⭐ Featured
  </span>
);

export const AvailableBadge = () => (
  <span className="bg-accent-teal text-white px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1">
    ✓ Available
  </span>
);

export const LimitedBadge = () => (
  <span className="bg-accent-coral text-white px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1">
    🔥 Limited
  </span>
);

export const NewBadge = () => (
  <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1">
    ✨ New
  </span>
);

// ============================================
// CARD COMPONENTS
// ============================================

export const PropertyCard = ({
  image,
  title,
  description,
  price,
  featured = false,
  available = true,
}) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
    {/* Image Section */}
    <div className="relative h-64 bg-neutral-200 overflow-hidden">
      {image ? (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-neutral-400">
          No Image
        </div>
      )}

      {/* Badges */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {featured && <FeaturedBadge />}
        {available && <AvailableBadge />}
      </div>
    </div>

    {/* Content Section */}
    <div className="p-6">
      <h3 className="text-xl font-[family-name:var(--font-poppins)] font-semibold text-secondary-950 mb-2 line-clamp-1">
        {title}
      </h3>
      <p className="text-neutral-600 mb-4 line-clamp-2 text-sm">
        {description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-[family-name:var(--font-montserrat)] font-bold text-primary-500">
            ${price}
          </span>
          <span className="text-sm text-neutral-600">/night</span>
        </div>
        <button className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-lg font-medium transition-colors">
          View
        </button>
      </div>
    </div>
  </div>
);

export const ExcursionCard = ({
  image,
  title,
  duration,
  price,
  rating = 4.5,
}) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
    <div className="relative h-56 bg-neutral-200">
      {image && (
        <img src={image} alt={title} className="w-full h-full object-cover" />
      )}
    </div>

    <div className="p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-accent-amber text-lg">⭐</span>
        <span className="font-semibold text-secondary-950">{rating}</span>
        <span className="text-neutral-500 text-sm">
          ({Math.floor(Math.random() * 100)} reviews)
        </span>
      </div>

      <h3 className="text-lg font-[family-name:var(--font-poppins)] font-semibold text-secondary-950 mb-2">
        {title}
      </h3>

      <div className="flex items-center justify-between text-sm text-neutral-600 mb-4">
        <span>⏱️ {duration}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xl font-[family-name:var(--font-montserrat)] font-bold text-primary-500">
          ${price}
        </span>
        <button className="bg-secondary-800 hover:bg-secondary-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Book Now
        </button>
      </div>
    </div>
  </div>
);

// ============================================
// NAVIGATION COMPONENT
// ============================================

export const NavigationBar = () => (
  <nav className="bg-secondary-800 text-white shadow-lg sticky top-0 z-50">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-[family-name:var(--font-poppins)] font-bold">
          <span className="text-primary-500">Naseam</span>
          <span className="text-white">.travel</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8 items-center">
          <a
            href="#houses"
            className="hover:text-primary-400 transition-colors font-medium"
          >
            Houses
          </a>
          <a
            href="#excursions"
            className="hover:text-primary-400 transition-colors font-medium"
          >
            Excursions
          </a>
          <a
            href="#about"
            className="hover:text-primary-400 transition-colors font-medium"
          >
            About
          </a>
          <a
            href="#contact"
            className="hover:text-primary-400 transition-colors font-medium"
          >
            Contact
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 items-center">
          <button className="hover:text-primary-400 transition-colors font-medium">
            Sign In
          </button>
          <button className="bg-primary-500 hover:bg-primary-600 px-5 py-2 rounded-lg font-medium transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  </nav>
);

// ============================================
// HERO SECTION
// ============================================

export const HeroSection = () => (
  <section className="bg-gradient-to-br from-secondary-800 via-secondary-900 to-secondary-950 text-white py-24 relative overflow-hidden">
    {/* Optional decorative elements */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
    </div>

    <div className="container mx-auto px-4 text-center relative z-10">
      <h1 className="text-5xl md:text-6xl font-[family-name:var(--font-poppins)] font-bold mb-6">
        Find Your Perfect
        <span className="text-primary-500"> Getaway</span>
      </h1>

      <p className="text-xl text-neutral-200 mb-8 max-w-2xl mx-auto">
        Book amazing houses and unforgettable excursions for your next adventure
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-xl transition-all hover:scale-105">
          Explore Houses
        </button>
        <button className="border-2 border-white hover:bg-white/10 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all">
          View Excursions
        </button>
      </div>
    </div>
  </section>
);

// ============================================
// SEARCH BAR
// ============================================

export const SearchBar = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 -mt-12 relative z-20 max-w-5xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Location
        </label>
        <input
          type="text"
          placeholder="Where are you going?"
          className="w-full px-4 py-3 border-2 border-neutral-200 focus:border-primary-500 focus:outline-none rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Check-in
        </label>
        <input
          type="date"
          className="w-full px-4 py-3 border-2 border-neutral-200 focus:border-primary-500 focus:outline-none rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Check-out
        </label>
        <input
          type="date"
          className="w-full px-4 py-3 border-2 border-neutral-200 focus:border-primary-500 focus:outline-none rounded-lg"
        />
      </div>

      <div className="flex items-end">
        <button className="w-full bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
          Search
        </button>
      </div>
    </div>
  </div>
);

// ============================================
// FOOTER
// ============================================

export const Footer = () => (
  <footer className="bg-secondary-800 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div>
          <div className="text-2xl font-[family-name:var(--font-poppins)] font-bold mb-4">
            <span className="text-primary-500">Naseam</span>
          </div>
          <p className="text-neutral-300 text-sm">
            Your trusted platform for booking amazing houses and excursions.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-neutral-300 text-sm">
            <li>
              <a href="#" className="hover:text-primary-400 transition-colors">
                Houses
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary-400 transition-colors">
                Excursions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary-400 transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary-400 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-neutral-300 text-sm">
            <li>
              <a href="#" className="hover:text-primary-400 transition-colors">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary-400 transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary-400 transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary-400 transition-colors">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold mb-4">Stay Updated</h4>
          <p className="text-neutral-300 text-sm mb-3">
            Subscribe to get special offers and updates.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-3 py-2 rounded-lg text-neutral-900 text-sm"
            />
            <button className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg text-sm font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-700 pt-6 text-center text-neutral-400 text-sm">
        <p>&copy; 2025 Naseam. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// ============================================
// DEMO PAGE COMPONENT
// ============================================

export default function DesignSystemDemo() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <NavigationBar />
      <HeroSection />

      <div className="container mx-auto px-4">
        <SearchBar />

        {/* Featured Properties Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-[family-name:var(--font-poppins)] font-bold text-secondary-950 mb-4">
              Featured <span className="text-primary-500">Properties</span>
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Discover handpicked houses perfect for your next vacation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PropertyCard
              image="/images/property1.jpg"
              title="Luxury Beach Villa"
              description="Oceanfront property with stunning views and private beach access"
              price={299}
              featured={true}
              available={true}
            />
            <PropertyCard
              image="/images/property2.jpg"
              title="Mountain Cabin Retreat"
              description="Cozy cabin surrounded by nature, perfect for a peaceful getaway"
              price={189}
              available={true}
            />
            <PropertyCard
              image="/images/property3.jpg"
              title="Urban Loft Downtown"
              description="Modern loft in the heart of the city with all amenities"
              price={249}
              available={false}
            />
          </div>
        </section>

        {/* Excursions Section */}
        <section className="py-16 bg-neutral-100 -mx-4 px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-[family-name:var(--font-poppins)] font-bold text-secondary-950 mb-4">
              Popular <span className="text-primary-500">Excursions</span>
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Explore amazing activities and adventures
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <ExcursionCard
              image="/images/excursion1.jpg"
              title="Sunset Boat Tour"
              duration="3 hours"
              price={89}
              rating={4.8}
            />
            <ExcursionCard
              image="/images/excursion2.jpg"
              title="Mountain Hiking Adventure"
              duration="5 hours"
              price={120}
              rating={4.6}
            />
            <ExcursionCard
              image="/images/excursion3.jpg"
              title="City Food Tour"
              duration="4 hours"
              price={75}
              rating={4.9}
            />
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
