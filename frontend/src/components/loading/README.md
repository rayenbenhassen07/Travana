# Loading Components Library

A comprehensive collection of loading components for your React application.

## Components Overview

### 🔄 LoadingSpinner

Versatile spinner component with multiple variants, sizes, and colors.

**Usage:**

```jsx
import { LoadingSpinner } from "@/components/loading";

// Basic usage
<LoadingSpinner />

// Different sizes: xs, sm, md, lg, xl, 2xl
<LoadingSpinner size="lg" />

// Different colors: blue, white, gray, green, red, orange, current
<LoadingSpinner color="blue" />

// Different variants: spin, dots, pulse
<LoadingSpinner variant="dots" />
```

### 🔘 LoadingButton

Button component with built-in loading states and spinner.

**Usage:**

```jsx
import { LoadingButton } from "@/components/loading";

<LoadingButton
  loading={isLoading}
  onClick={handleClick}
  variant="primary"
  size="md"
  loadingText="Saving..."
>
  Save Changes
</LoadingButton>;

// Variants: primary, secondary, outline, danger, ghost, success
// Sizes: sm, md, lg, xl
```

### 📄 PageLoader

Full-page loading component with optional overlay.

**Usage:**

```jsx
import { PageLoader } from "@/components/loading";

// Full page overlay
<PageLoader message="Loading your dashboard..." />

// Without overlay
<PageLoader overlay={false} />

// Different backdrops: light, dark, blur
<PageLoader backdrop="blur" />
```

### 💀 SkeletonLoader

Content placeholder component for various layouts.

**Usage:**

```jsx
import { SkeletonLoader } from "@/components/loading";

// Text skeleton
<SkeletonLoader variant="text" lines={3} />

// Variants: text, avatar, card, profile, button, table, listing
<SkeletonLoader variant="listing" />
```

### ↔️ InlineLoader

Small inline loading component for text and buttons.

**Usage:**

```jsx
import { InlineLoader } from "@/components/loading";

<InlineLoader text="Loading..." size="sm" />

// Just spinner
<InlineLoader showText={false} />
```

### 🃏 CardLoader

Specialized component for loading card layouts.

**Usage:**

```jsx
import { CardLoader } from "@/components/loading";

// Grid of loading cards
<CardLoader
  variant="listing"
  count={6}
  grid
  gridCols={3}
/>

// Variants: listing, profile, simple
<CardLoader variant="profile" count={3} />
```

### 🔄 ButtonLoading (Legacy)

Simple button spinner component (kept for backward compatibility).

## Real-world Examples

### Login Form with Loading Button

```jsx
const [isLoading, setIsLoading] = useState(false);

const handleLogin = async () => {
  setIsLoading(true);
  try {
    await login(credentials);
  } finally {
    setIsLoading(false);
  }
};

return (
  <LoadingButton
    loading={isLoading}
    loadingText="Signing in..."
    onClick={handleLogin}
    variant="primary"
    className="w-full"
  >
    Sign In
  </LoadingButton>
);
```

### Listings Page with Card Skeletons

```jsx
const [listings, setListings] = useState([]);
const [isLoading, setIsLoading] = useState(true);

if (isLoading) {
  return <CardLoader variant="listing" count={6} grid gridCols={3} />;
}

return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {listings.map((listing) => (
      <ListingCard key={listing.id} listing={listing} />
    ))}
  </div>
);
```

### Load More with Inline Loader

```jsx
const [loadingMore, setLoadingMore] = useState(false);

return (
  <div>
    {items.map((item) => (
      <Item key={item.id} item={item} />
    ))}

    {loadingMore && (
      <div className="text-center py-4">
        <InlineLoader text="Loading more items..." />
      </div>
    )}

    <LoadingButton loading={loadingMore} onClick={loadMore} variant="outline">
      Load More
    </LoadingButton>
  </div>
);
```

## Import Options

```jsx
// Named imports
import { LoadingButton, LoadingSpinner } from "@/components/loading";

// Individual imports
import LoadingButton from "@/components/loading/LoadingButton";

// Main Loading component
import Loading from "@/components/Loading";
```

## Customization

All components accept standard props like `className` for custom styling and follow your app's design system with blue color scheme matching your navbar branding.
