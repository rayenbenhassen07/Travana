# 🎨 Naseam Design System

## Brand Identity for Booking & Rental Platform

### 🎯 Design Philosophy

A warm, inviting, and trustworthy design that combines the energy of **orange** (adventure, warmth, hospitality) with the reliability of **dark blue** (trust, professionalism, security).

---

## 🎨 Color Palette

### Primary Orange

**Use for:** Primary CTAs, active states, highlights, featured listings

```css
primary-50   #fff7ed  /* Lightest - backgrounds */
primary-100  #ffedd5  /* Light accents */
primary-200  #fed7aa  /* Hover backgrounds */
primary-300  #fdba74  /* Borders */
primary-400  #fb923c  /* Secondary buttons */
primary-500  #f97316  /* 🌟 MAIN BRAND COLOR */
primary-600  #ea580c  /* Hover states */
primary-700  #c2410c  /* Pressed states */
primary-800  #9a3412  /* Dark accents */
primary-900  #7c2d12  /* Darkest */
```

### Secondary Dark Blue

**Use for:** Headers, navigation, text, footer, trust elements

```css
secondary-50   #eff6ff  /* Light backgrounds */
secondary-100  #dbeafe  /* Subtle accents */
secondary-500  #1e3a8a  /* 🌟 MAIN DARK BLUE */
secondary-800  #0f172a  /* 🌟 DEEP NAVY - headers/footer */
secondary-950  #020617  /* Darkest text */
```

### Accent Colors

**Use for:** Special states and highlights

```css
accent-coral  #ff6b6b  /* Special offers, limited deals */
accent-amber  #fbbf24  /* ⭐ Ratings, featured badges */
accent-teal   #14b8a6  /* ✓ Success, available */
accent-sky    #38bdf8  /* 🔗 Links, info */
```

### Neutral Grays

**Use for:** Backgrounds, borders, text hierarchy

```css
neutral-50   #fafaf9  /* Page backgrounds */
neutral-100  #f5f5f4  /* Card backgrounds */
neutral-200  #e7e5e4  /* Borders */
neutral-300  #d4d4d4  /* Dividers */
neutral-600  #525252  /* Secondary text */
neutral-900  #171717  /* Primary text */
```

### Semantic Colors

```css
success  #10b981  /* Booking confirmed */
warning  #f59e0b  /* Low availability */
error    #ef4444  /* Unavailable */
info     #3b82f6  /* Information */
```

---

## 📝 Typography

### Font Families

#### **Inter** - Body Text

- **Use:** Paragraphs, descriptions, forms, general UI
- **Class:** `font-[family-name:var(--font-inter)]`
- Clean, highly readable for extended reading

#### **Poppins** - Display & Headings

- **Use:** Hero titles, section headings, property names
- **Class:** `font-[family-name:var(--font-poppins)]`
- Modern, friendly, attention-grabbing

#### **Montserrat** - Accent Text

- **Use:** Prices, badges, CTAs, special highlights
- **Class:** `font-[family-name:var(--font-montserrat)]`
- Professional, elegant for pricing

#### **Roboto Mono** - Technical Text

- **Use:** Booking codes, dates, IDs
- **Class:** `font-[family-name:var(--font-roboto-mono)]`
- Clear, technical information

### Type Scale

```
text-xs    0.75rem   (12px)  - Small labels
text-sm    0.875rem  (14px)  - Secondary text
text-base  1rem      (16px)  - Body text
text-lg    1.125rem  (18px)  - Subheadings
text-xl    1.25rem   (20px)  - Card titles
text-2xl   1.5rem    (24px)  - Section headings
text-3xl   1.875rem  (30px)  - Page titles
text-4xl   2.25rem   (36px)  - Hero text
text-5xl   3rem      (48px)  - Large hero
text-6xl   3.75rem   (60px)  - Extra large hero
```

---

## 🔘 Component Examples

### Buttons

#### Primary Button (Orange)

```jsx
<button className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
  Book Now
</button>
```

#### Secondary Button (Dark Blue)

```jsx
<button className="bg-secondary-800 hover:bg-secondary-900 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-200">
  View Details
</button>
```

#### Outline Button

```jsx
<button className="border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-medium px-6 py-3 rounded-lg transition-all duration-200">
  Learn More
</button>
```

### Cards

#### Property Card

```jsx
<div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
  {/* Image */}
  <div className="relative h-64 bg-neutral-200">
    <span className="absolute top-4 right-4 bg-accent-amber text-secondary-950 px-3 py-1 rounded-full text-sm font-[family-name:var(--font-montserrat)] font-semibold">
      ⭐ Featured
    </span>
  </div>

  {/* Content */}
  <div className="p-6">
    <h3 className="text-xl font-[family-name:var(--font-poppins)] font-semibold text-secondary-950 mb-2">
      Luxury Beach Villa
    </h3>
    <p className="text-neutral-600 mb-4">
      Oceanfront property with stunning views
    </p>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-[family-name:var(--font-montserrat)] font-bold text-primary-500">
        $299<span className="text-sm text-neutral-600">/night</span>
      </span>
      <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg">
        View
      </button>
    </div>
  </div>
</div>
```

### Navigation Bar

```jsx
<nav className="bg-secondary-800 text-white shadow-lg">
  <div className="container mx-auto px-4 py-4 flex items-center justify-between">
    <div className="text-2xl font-[family-name:var(--font-poppins)] font-bold">
      <span className="text-primary-500">Naseam</span>
    </div>
    <div className="flex gap-6 items-center">
      <a href="#" className="hover:text-primary-400 transition-colors">
        Houses
      </a>
      <a href="#" className="hover:text-primary-400 transition-colors">
        Excursions
      </a>
      <a href="#" className="hover:text-primary-400 transition-colors">
        About
      </a>
      <button className="bg-primary-500 hover:bg-primary-600 px-5 py-2 rounded-lg font-medium">
        Sign In
      </button>
    </div>
  </div>
</nav>
```

### Hero Section

```jsx
<section className="bg-gradient-to-br from-secondary-800 via-secondary-900 to-secondary-950 text-white py-24">
  <div className="container mx-auto px-4 text-center">
    <h1 className="text-5xl md:text-6xl font-[family-name:var(--font-poppins)] font-bold mb-6">
      Find Your Perfect
      <span className="text-primary-500"> Getaway</span>
    </h1>
    <p className="text-xl text-neutral-200 mb-8 max-w-2xl mx-auto">
      Book amazing houses and unforgettable excursions for your next adventure
    </p>
    <div className="flex gap-4 justify-center">
      <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-xl">
        Explore Houses
      </button>
      <button className="border-2 border-white hover:bg-white/10 text-white px-8 py-4 rounded-lg font-semibold text-lg">
        View Excursions
      </button>
    </div>
  </div>
</section>
```

### Badge Components

```jsx
{
  /* Featured Badge */
}
<span className="bg-accent-amber text-secondary-950 px-3 py-1 rounded-full text-sm font-semibold">
  ⭐ Featured
</span>;

{
  /* Available Badge */
}
<span className="bg-accent-teal text-white px-3 py-1 rounded-full text-sm font-semibold">
  ✓ Available
</span>;

{
  /* Limited Badge */
}
<span className="bg-accent-coral text-white px-3 py-1 rounded-full text-sm font-semibold">
  🔥 Limited
</span>;

{
  /* New Badge */
}
<span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
  ✨ New
</span>;
```

### Form Elements

```jsx
{
  /* Input Field */
}
<input
  type="text"
  placeholder="Search destinations..."
  className="w-full px-4 py-3 border-2 border-neutral-200 focus:border-primary-500 focus:outline-none rounded-lg"
/>;

{
  /* Select Dropdown */
}
<select className="w-full px-4 py-3 border-2 border-neutral-200 focus:border-primary-500 focus:outline-none rounded-lg bg-white">
  <option>Select category</option>
  <option>Houses</option>
  <option>Excursions</option>
</select>;
```

---

## 🎭 Usage Guidelines

### When to Use Orange (Primary)

✅ Primary CTAs (Book Now, Reserve, Add to Cart)
✅ Important buttons and actions
✅ Active/selected states
✅ Hover effects on interactive elements
✅ Featured or highlighted content
✅ Prices and special offers

### When to Use Dark Blue (Secondary)

✅ Navigation bars and headers
✅ Footer backgrounds
✅ Headings and titles
✅ Professional/trust elements
✅ Icons and UI elements
✅ Text on light backgrounds

### Color Combinations That Work

✨ **White bg + Orange CTA + Dark Blue text** - Clean, modern
✨ **Dark Blue bg + White text + Orange accents** - Professional, trustworthy
✨ **Light gray bg + Orange highlights + Dark Blue headers** - Subtle, elegant
✨ **Orange gradient + White text** - Energetic, attention-grabbing

---

## 📏 Spacing & Layout

### Border Radius

```
rounded-sm    0.375rem  (6px)   - Small elements
rounded-md    0.5rem    (8px)   - Buttons, inputs
rounded-lg    0.75rem   (12px)  - Cards, modals
rounded-xl    1rem      (16px)  - Large cards
rounded-2xl   1.5rem    (24px)  - Hero sections
rounded-full  9999px           - Pills, avatars
```

### Shadows

```
shadow-sm   - Subtle borders
shadow-md   - Cards
shadow-lg   - Hover states
shadow-xl   - Modals, popovers
shadow-2xl  - Hero elements
```

---

## 🚀 Quick Start Classes

### Most Used Combinations

**Primary Button:**
`bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg shadow-md`

**Card:**
`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6`

**Heading:**
`text-3xl font-[family-name:var(--font-poppins)] font-bold text-secondary-950`

**Body Text:**
`text-base font-[family-name:var(--font-inter)] text-neutral-600`

**Price:**
`text-2xl font-[family-name:var(--font-montserrat)] font-bold text-primary-500`

---

## 🎨 Brand Voice

- **Warm & Welcoming** - Like a friendly host
- **Trustworthy & Professional** - Secure booking experience
- **Adventurous & Exciting** - Inspiring exploration
- **Clear & Simple** - Easy to understand and use

---

**Last Updated:** November 2025
