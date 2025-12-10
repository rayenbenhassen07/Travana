# 🎨 Naseam Design System - Quick Start

## Your Website Identity

Your booking and rental website now has a complete design system featuring:

### 🎯 Brand Colors

- **Primary:** Orange (#f97316) - Warmth, hospitality, adventure
- **Secondary:** Dark Blue (#1e3a8a, #0f172a) - Trust, professionalism, reliability

### 📝 Typography

- **Inter** - Body text (paragraphs, descriptions)
- **Poppins** - Headings (hero titles, section headers)
- **Montserrat** - Prices and special elements
- **Roboto Mono** - Technical text (dates, codes)

---

## 🚀 Quick Start

### 1. Use the Pre-built Components

Import and use components from `DesignSystemDemo.jsx`:

```jsx
import {
  PrimaryButton,
  SecondaryButton,
  PropertyCard,
  NavigationBar,
  Footer
} from '@/components/DesignSystemDemo';

// Use them in your pages
<PrimaryButton>Book Now</PrimaryButton>
<PropertyCard title="Beach House" price={299} />
```

### 2. Use Tailwind Classes Directly

```jsx
// Primary Button
<button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg">
  Book Now
</button>

// Card with Dark Blue Header
<div className="bg-white rounded-xl shadow-md">
  <div className="bg-secondary-800 text-white p-4">
    <h3>Property Name</h3>
  </div>
  <div className="p-6">Content here</div>
</div>

// Orange Price Tag
<span className="text-2xl font-[family-name:var(--font-montserrat)] font-bold text-primary-500">
  $299
</span>
```

---

## 📚 Available Resources

### Files Created:

1. **`globals.css`** - Updated with complete color palette and typography
2. **`layout.js`** - Updated with Google Fonts (Inter, Poppins, Montserrat, Roboto Mono)
3. **`DESIGN_SYSTEM.md`** - Complete design guide with examples
4. **`DesignSystemDemo.jsx`** - Ready-to-use React components
5. **`colors.js`** - Color constants for JavaScript use

---

## 🎨 Most Common Patterns

### Navigation Bar

```jsx
<nav className="bg-secondary-800 text-white shadow-lg">
  {/* Logo in orange */}
  <span className="text-primary-500">Naseam</span>
  {/* Orange CTA button */}
  <button className="bg-primary-500 hover:bg-primary-600 px-5 py-2 rounded-lg">
    Sign In
  </button>
</nav>
```

### Hero Section

```jsx
<section className="bg-gradient-to-br from-secondary-800 to-secondary-950 text-white py-24">
  <h1 className="text-5xl font-[family-name:var(--font-poppins)] font-bold">
    Find Your Perfect <span className="text-primary-500">Getaway</span>
  </h1>
  <button className="bg-primary-500 hover:bg-primary-600 px-8 py-4 rounded-lg">
    Explore Houses
  </button>
</section>
```

### Property Card

```jsx
<div className="bg-white rounded-xl shadow-md hover:shadow-xl">
  <img src="/image.jpg" className="rounded-t-xl" />
  <div className="p-6">
    <h3 className="text-xl font-[family-name:var(--font-poppins)] font-semibold text-secondary-950">
      Property Title
    </h3>
    <div className="flex justify-between items-center">
      <span className="text-2xl font-[family-name:var(--font-montserrat)] font-bold text-primary-500">
        $299<span className="text-sm">/night</span>
      </span>
      <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg">
        View
      </button>
    </div>
  </div>
</div>
```

### Form Input

```jsx
<input
  type="text"
  className="w-full px-4 py-3 border-2 border-neutral-200 focus:border-primary-500 focus:outline-none rounded-lg"
  placeholder="Search..."
/>
```

---

## 🎯 Color Usage Guide

### When to use Orange (Primary):

✅ Call-to-action buttons ("Book Now", "Reserve")
✅ Active/selected states
✅ Price tags and special offers
✅ Hover effects
✅ Important highlights

### When to use Dark Blue (Secondary):

✅ Navigation headers
✅ Footers
✅ Headings and titles
✅ Professional sections
✅ Trust indicators

### Color Combinations:

- White bg + Orange buttons + Dark blue headers ✨
- Dark blue bg + White text + Orange accents ✨
- Light gray bg + Orange highlights ✨

---

## 🔧 Customization

### Change Primary Orange Shade:

Use different shades for variation:

- `bg-primary-400` - Lighter orange
- `bg-primary-500` - Main orange (default)
- `bg-primary-600` - Darker orange

### Change Secondary Blue Shade:

- `bg-secondary-500` - Bright blue
- `bg-secondary-800` - Deep navy (recommended)
- `bg-secondary-950` - Darkest blue

---

## 📱 Responsive Design

All components are mobile-friendly. Use Tailwind responsive prefixes:

```jsx
// Stack on mobile, grid on desktop
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <PropertyCard />
  <PropertyCard />
  <PropertyCard />
</div>

// Smaller text on mobile
<h1 className="text-3xl md:text-5xl font-bold">
  Hero Title
</h1>
```

---

## 🎭 Brand Voice

Your design conveys:

- **Warm & Welcoming** (Orange = hospitality)
- **Trustworthy** (Dark Blue = security)
- **Professional** (Clean typography)
- **Adventurous** (Vibrant colors)

---

## 📞 Need Help?

Check the full documentation in `DESIGN_SYSTEM.md` for:

- Complete component library
- All color variations
- Typography examples
- Spacing guidelines
- Shadow utilities
- And much more!

---

**Happy Building! 🏠✈️**
