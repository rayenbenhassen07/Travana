# Admin Dashboard - Naseam

Modern, responsive admin dashboard built with Next.js 15 and Tailwind CSS.

## 📁 Structure

```
/src/app/(newadmin)/newadmin/
├── layout.js          # Admin layout with sidebar & navbar
└── page.js            # Main dashboard page

/src/components/(newadmin)/
├── AdminSidebar.js    # Collapsible sidebar navigation
├── AdminNavbar.js     # Top navigation bar
└── AdminAuthGuard.js  # Admin authentication protection

/src/lib/
└── adminAuth.js       # Authentication utilities
```

## 🎨 Design System

**Colors:**

- Primary: Orange (#f97316) - Main brand color
- Secondary: Neutral Gray - UI elements
- Accent: Success (Green), Warning (Yellow), Error (Red)

**Features:**

- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Collapsible sidebar
- ✅ Mobile-friendly drawer navigation
- ✅ Admin role authentication
- ✅ Notification system
- ✅ User profile dropdown
- ✅ Clean, modern UI with smooth transitions

## 🔐 Authentication

### Setting Up Admin User

To test the admin panel, set a user in localStorage:

```javascript
// In browser console or login component:
const adminUser = {
  id: 1,
  name: "Admin User",
  email: "admin@naseam.com",
  role: "admin",
};

localStorage.setItem("user", JSON.stringify(adminUser));
localStorage.setItem("token", "your-auth-token");
```

### Auth Guard

All admin routes are protected by `AdminAuthGuard`:

- Checks if user is logged in
- Verifies user has "admin" role
- Redirects to login if unauthorized

### Auth Utilities

Located in `/src/lib/adminAuth.js`:

```javascript
import { isAdmin, getAdminUser, logoutAdmin } from "@/lib/adminAuth";

// Check if current user is admin
if (isAdmin()) {
  // User is admin
}

// Get admin user data
const user = getAdminUser();

// Logout
logoutAdmin();
```

## 🧭 Navigation

**Sidebar Menu Items:**

- Dashboard
- Analytics
- Listings (Hotels)
- Reservations
- Users
- Cities
- Categories
- Facilities
- Flights
- Alerts
- Settings

## 🚀 Usage

### Accessing the Admin Panel

```
http://localhost:3000/newadmin
```

### Creating New Admin Pages

1. Create page in `/src/app/(newadmin)/newadmin/[your-page]/page.js`
2. Page will automatically use the admin layout
3. Authentication is handled by the layout

Example:

```javascript
// /src/app/(newadmin)/newadmin/users/page.js
export default function UsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-800">Users Management</h1>
      {/* Your content */}
    </div>
  );
}
```

### Customizing Sidebar

Edit `/src/components/(newadmin)/AdminSidebar.js`:

```javascript
const menuItems = [
  {
    title: "Your Page",
    icon: <YourIcon />,
    href: "/newadmin/your-page",
    badge: "5", // Optional badge
  },
  // ... more items
];
```

## 📱 Responsive Behavior

- **Mobile (< 1024px):**

  - Sidebar hidden by default
  - Hamburger menu in navbar
  - Drawer-style sidebar overlay

- **Desktop (≥ 1024px):**
  - Sidebar always visible
  - Can collapse to icon-only view
  - Content adjusts automatically

## 🎯 Features

### Dashboard Stats

- Total Bookings
- Total Revenue
- Active Users
- Total Listings

### Recent Bookings Table

- Customer information
- Hotel details
- Booking date
- Amount
- Status badges

### Quick Actions

- Add New Listing
- Manage Bookings
- User Management

### Notifications

- Real-time notification dropdown
- Unread count badge
- Mark as read functionality

### User Profile

- User info display
- Settings access
- Logout functionality

## 🔧 Customization

### Colors

Update in `/src/app/globals.css`:

```css
--color-primary-500: #f97316; /* Orange */
```

### Logo

Replace in `AdminSidebar.js`:

```javascript
<div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
  {/* Add your logo image here */}
</div>
```

## 📝 TODO Integration

To integrate with your backend:

1. **Update AdminAuthGuard.js:**

   - Replace localStorage checks with API calls
   - Add token validation
   - Implement proper session management

2. **Update AdminNavbar.js:**

   - Fetch real notifications from API
   - Update user data from backend
   - Implement real-time updates

3. **Update Dashboard Page:**
   - Fetch stats from API
   - Load real booking data
   - Add data refresh functionality

## 🛡️ Security Notes

- Always validate admin role on backend
- Use secure HTTP-only cookies for tokens
- Implement CSRF protection
- Add rate limiting
- Log admin actions

## 📦 Dependencies Used

- Next.js 15
- React 19
- Tailwind CSS 4
- React Icons
- Framer Motion (optional for animations)

## 🎨 Design Principles

- Clean & minimal interface
- Consistent spacing (4px grid)
- Orange primary color for actions
- Neutral colors for content
- Smooth transitions (300ms)
- Card-based layouts
- Clear visual hierarchy
