"use client";

/**
 * Color Palette Preview Page
 * Visit this page to see all your brand colors in action
 */

export default function ColorPalettePage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-[family-name:var(--font-poppins)] font-bold text-secondary-950 mb-4">
            <span className="text-primary-500">Naseam</span> Design System
          </h1>
          <p className="text-xl text-neutral-600">
            Your complete brand identity for booking & rentals
          </p>
        </div>

        {/* Primary Orange Colors */}
        <section className="mb-12">
          <h2 className="text-3xl font-[family-name:var(--font-poppins)] font-bold text-secondary-950 mb-6">
            Primary Orange 🟠
          </h2>
          <p className="text-neutral-600 mb-6">
            Use for CTAs, highlights, prices, and active states
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <ColorSwatch color="primary-50" name="50" />
            <ColorSwatch color="primary-100" name="100" />
            <ColorSwatch color="primary-200" name="200" />
            <ColorSwatch color="primary-300" name="300" />
            <ColorSwatch color="primary-400" name="400" />
            <ColorSwatch color="primary-500" name="500 ⭐" highlight />
            <ColorSwatch color="primary-600" name="600" />
            <ColorSwatch color="primary-700" name="700" />
            <ColorSwatch color="primary-800" name="800" />
            <ColorSwatch color="primary-900" name="900" />
            <ColorSwatch color="primary-950" name="950" />
          </div>
        </section>

        {/* Secondary Blue Colors */}
        <section className="mb-12">
          <h2 className="text-3xl font-[family-name:var(--font-poppins)] font-bold text-secondary-950 mb-6">
            Secondary Dark Blue 🔵
          </h2>
          <p className="text-neutral-600 mb-6">
            Use for headers, navigation, text, and professional sections
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <ColorSwatch color="secondary-50" name="50" />
            <ColorSwatch color="secondary-100" name="100" />
            <ColorSwatch color="secondary-200" name="200" />
            <ColorSwatch color="secondary-300" name="300" />
            <ColorSwatch color="secondary-400" name="400" />
            <ColorSwatch color="secondary-500" name="500 ⭐" highlight />
            <ColorSwatch color="secondary-600" name="600" />
            <ColorSwatch color="secondary-700" name="700" />
            <ColorSwatch color="secondary-800" name="800 ⭐" highlight />
            <ColorSwatch color="secondary-900" name="900" />
            <ColorSwatch color="secondary-950" name="950" />
          </div>
        </section>

        {/* Accent Colors */}
        <section className="mb-12">
          <h2 className="text-3xl font-[family-name:var(--font-poppins)] font-bold text-secondary-950 mb-6">
            Accent Colors 🎨
          </h2>
          <p className="text-neutral-600 mb-6">
            Use for special states and highlights
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-full h-24 bg-[#ff6b6b] rounded-lg mb-3"></div>
              <p className="font-semibold text-secondary-950">Coral</p>
              <p className="text-sm text-neutral-600">Special offers</p>
              <code className="text-xs text-neutral-500">#ff6b6b</code>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-full h-24 bg-[#fbbf24] rounded-lg mb-3"></div>
              <p className="font-semibold text-secondary-950">Amber</p>
              <p className="text-sm text-neutral-600">Ratings ⭐</p>
              <code className="text-xs text-neutral-500">#fbbf24</code>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-full h-24 bg-[#14b8a6] rounded-lg mb-3"></div>
              <p className="font-semibold text-secondary-950">Teal</p>
              <p className="text-sm text-neutral-600">Available ✓</p>
              <code className="text-xs text-neutral-500">#14b8a6</code>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-full h-24 bg-[#38bdf8] rounded-lg mb-3"></div>
              <p className="font-semibold text-secondary-950">Sky</p>
              <p className="text-sm text-neutral-600">Links 🔗</p>
              <code className="text-xs text-neutral-500">#38bdf8</code>
            </div>
          </div>
        </section>

        {/* Typography Examples */}
        <section className="mb-12">
          <h2 className="text-3xl font-[family-name:var(--font-poppins)] font-bold text-secondary-950 mb-6">
            Typography 📝
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-sm text-neutral-600 mb-2">
                Poppins - Headings
              </p>
              <h1 className="text-4xl font-[family-name:var(--font-poppins)] font-bold text-secondary-950">
                Find Your Perfect Getaway
              </h1>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-sm text-neutral-600 mb-2">Inter - Body Text</p>
              <p className="text-base font-[family-name:var(--font-inter)] text-neutral-700">
                This is your body text font. It's highly readable and perfect
                for descriptions, paragraphs, and general content. Inter is
                clean and modern.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-sm text-neutral-600 mb-2">
                Montserrat - Prices
              </p>
              <p className="text-3xl font-[family-name:var(--font-montserrat)] font-bold text-primary-500">
                $299<span className="text-lg text-neutral-600">/night</span>
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-sm text-neutral-600 mb-2">
                Roboto Mono - Codes
              </p>
              <code className="text-base font-[family-name:var(--font-roboto-mono)] text-secondary-800">
                BOOKING-2025-XYZ123
              </code>
            </div>
          </div>
        </section>

        {/* Button Examples */}
        <section className="mb-12">
          <h2 className="text-3xl font-[family-name:var(--font-poppins)] font-bold text-secondary-950 mb-6">
            Buttons 🔘
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-sm text-neutral-600 mb-4">Primary (Orange)</p>
              <button className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                Book Now
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-sm text-neutral-600 mb-4">
                Secondary (Dark Blue)
              </p>
              <button className="bg-secondary-800 hover:bg-secondary-900 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-200">
                View Details
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-sm text-neutral-600 mb-4">Outline</p>
              <button className="border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-medium px-6 py-3 rounded-lg transition-all duration-200">
                Learn More
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-sm text-neutral-600 mb-4">Ghost</p>
              <button className="text-primary-500 hover:bg-primary-50 font-medium px-6 py-3 rounded-lg transition-all duration-200">
                Cancel
              </button>
            </div>
          </div>
        </section>

        {/* Card Example */}
        <section className="mb-12">
          <h2 className="text-3xl font-[family-name:var(--font-poppins)] font-bold text-secondary-950 mb-6">
            Example Card 🏠
          </h2>
          <div className="max-w-sm mx-auto">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <span className="text-white text-6xl">🏖️</span>
                <span className="absolute top-4 right-4 bg-[#fbbf24] text-secondary-950 px-3 py-1 rounded-full text-sm font-semibold">
                  ⭐ Featured
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-[family-name:var(--font-poppins)] font-semibold text-secondary-950 mb-2">
                  Luxury Beach Villa
                </h3>
                <p className="text-neutral-600 mb-4 text-sm">
                  Oceanfront property with stunning views and private beach
                  access
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-[family-name:var(--font-montserrat)] font-bold text-primary-500">
                    $299<span className="text-sm text-neutral-600">/night</span>
                  </span>
                  <button className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-lg font-medium transition-colors">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Badge Examples */}
        <section className="mb-12">
          <h2 className="text-3xl font-[family-name:var(--font-poppins)] font-bold text-secondary-950 mb-6">
            Badges 🏷️
          </h2>
          <div className="flex flex-wrap gap-3 bg-white rounded-lg p-6 shadow-md">
            <span className="bg-[#fbbf24] text-secondary-950 px-3 py-1 rounded-full text-sm font-semibold">
              ⭐ Featured
            </span>
            <span className="bg-[#14b8a6] text-white px-3 py-1 rounded-full text-sm font-semibold">
              ✓ Available
            </span>
            <span className="bg-[#ff6b6b] text-white px-3 py-1 rounded-full text-sm font-semibold">
              🔥 Limited
            </span>
            <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              ✨ New
            </span>
            <span className="bg-secondary-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
              💎 Premium
            </span>
          </div>
        </section>

        {/* Usage Tips */}
        <section className="mb-12 bg-gradient-to-br from-secondary-800 to-secondary-950 text-white rounded-xl p-8">
          <h2 className="text-3xl font-[family-name:var(--font-poppins)] font-bold mb-6">
            Quick Usage Tips 💡
          </h2>
          <div className="space-y-3 text-neutral-200">
            <p>
              ✅ Use{" "}
              <span className="text-primary-500 font-semibold">Orange</span> for
              CTAs and important actions
            </p>
            <p>
              ✅ Use{" "}
              <span className="text-primary-400 font-semibold">Dark Blue</span>{" "}
              for headers and navigation
            </p>
            <p>
              ✅ Use <span className="font-semibold">Poppins</span> for headings
            </p>
            <p>
              ✅ Use <span className="font-semibold">Inter</span> for body text
            </p>
            <p>
              ✅ Use <span className="font-semibold">Montserrat</span> for
              prices
            </p>
            <p>✅ White backgrounds with colored accents work best</p>
          </div>
        </section>
      </div>
    </div>
  );
}

// Helper component for color swatches
function ColorSwatch({ color, name, highlight = false }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div
        className={`w-full h-16 bg-${color} rounded-md mb-2 ${
          highlight ? "ring-2 ring-offset-2 ring-primary-500" : ""
        }`}
      ></div>
      <p className="text-xs font-semibold text-secondary-950">{name}</p>
      <code className="text-xs text-neutral-500">{color}</code>
    </div>
  );
}
