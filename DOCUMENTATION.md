# La Menu - Documentation

A mobile-first menu application built with Next.js 14 and Supabase, featuring a clean, modern interface for displaying restaurant menus.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Key Files Explained](#key-files-explained)
4. [Database Schema](#database-schema)
5. [Component Architecture](#component-architecture)
6. [Styling System](#styling-system)
7. [Environment Setup](#environment-setup)
8. [Common Modifications](#common-modifications)

---

## Project Overview

This is a Next.js 14 application that displays a restaurant menu by fetching data from a Supabase database. The app features:

- **Mobile-first design** - Optimized for small screens, scales to desktop
- **Real-time data** - Fetches categories and items from Supabase
- **Interactive navigation** - Category-based filtering
- **Modern UI** - Dark theme with smooth animations

---

## Project Structure

```
lamenu/
├── app/                    # Next.js App Router directory
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx            # Main menu page (homepage)
│   └── globals.css         # Global styles and CSS variables
├── components/             # React components
│   ├── MenuHeader.tsx      # Restaurant header component
│   ├── CategoryList.tsx    # Category navigation component
│   └── MenuItems.tsx       # Menu items display component
├── lib/                    # Utility libraries
│   └── supabase.ts         # Supabase client configuration
├── types/                  # TypeScript type definitions
│   └── database.ts          # Database schema types
├── data/                   # Static data (legacy, not used)
│   └── menuData.ts         # Old static menu data
├── .env.local              # Environment variables (not in git)
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── next.config.js          # Next.js configuration
```

---

## Key Files Explained

### `app/page.tsx` - Main Menu Page

**Purpose**: The main page component that orchestrates data fetching and renders the menu interface.

**Key Features**:
- Manages application state (categories, items, selected category, loading)
- Fetches data from Supabase on component mount
- Handles category selection and item filtering
- Renders loading state while fetching data

**State Variables**:
- `categories`: Array of all menu categories
- `items`: Array of items for the currently selected category
- `selectedCategory`: ID of the currently selected category
- `loading`: Boolean indicating if data is being fetched
- `restaurantName`: Name of the restaurant (currently hardcoded)

**Key Functions**:
- `fetchData()`: Fetches all categories from the `category` table
- `fetchAllItems()`: Fetches all items (for debugging/logging)
- `fetchItems(categoryId)`: Fetches items for a specific category

**How to Modify**:
- Change `restaurantName` state to fetch from database or make it configurable
- Modify the loading UI in the `if (loading)` block
- Add error handling UI for failed data fetches
- Customize the empty state when no categories/items exist

---

### `components/MenuHeader.tsx` - Header Component

**Purpose**: Displays the restaurant name and tagline at the top of the page.

**Props**:
- `restaurantName`: string - The name of the restaurant

**How to Modify**:
- Change the tagline text ("Fresh • Local • Delicious")
- Add restaurant logo/image
- Add additional header information (address, phone, etc.)
- Make tagline dynamic (fetch from database)

---

### `components/CategoryList.tsx` - Category Navigation

**Purpose**: Displays horizontal scrollable list of category buttons.

**Props**:
- `categories`: Category[] - Array of category objects
- `selectedCategory`: string - ID of currently selected category
- `onSelectCategory`: function - Callback when category is clicked

**Features**:
- Horizontal scrolling on mobile
- Active state styling for selected category
- Smooth transitions and hover effects

**How to Modify**:
- Change button styling in `app/globals.css` (`.category-button`)
- Add icons to category buttons
- Change the layout (vertical list, grid, etc.)
- Add category descriptions or images

---

### `components/MenuItems.tsx` - Menu Items Display

**Purpose**: Displays menu items for the selected category.

**Props**:
- `items`: Item[] - Array of menu item objects
- `categoryName`: string - Name of the current category

**Features**:
- Card-based layout for each item
- Displays item name, price, and description
- Responsive grid layout (1 column mobile, 2 columns desktop)

**How to Modify**:
- Add item images
- Add dietary tags (spicy, vegetarian, vegan) - update `types/database.ts` first
- Change price formatting
- Add item customization options
- Add "Add to Cart" functionality
- Change card layout or styling

---

### `lib/supabase.ts` - Supabase Client

**Purpose**: Creates and exports the Supabase client instance.

**Environment Variables Required**:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key

**How to Modify**:
- Add authentication if needed
- Add real-time subscriptions
- Add custom query helpers
- Configure storage buckets

---

### `types/database.ts` - TypeScript Types

**Purpose**: Defines TypeScript interfaces matching your Supabase database schema.

**Current Types**:
```typescript
Category {
  id: string
  name: string
  desc: string
}

Item {
  id: string
  name: string
  desc: string
  price: number
  cat_id: string
}
```

**How to Modify**:
- Add new fields to match your database schema
- Add optional fields (e.g., `image_url`, `popular`, `spicy`, etc.)
- Add computed types or utility types
- Add validation types

**Important**: When you modify this file, you may need to update:
- Components that use these types
- Database queries in `app/page.tsx`
- Component props and rendering logic

---

### `app/globals.css` - Global Styles

**Purpose**: Contains all CSS styles, including CSS variables and responsive design.

**CSS Variables** (defined in `:root`):
- `--primary`: #1a1a1a (dark gray)
- `--secondary`: #2d2d2d (lighter gray)
- `--accent`: #ff6b35 (orange accent color)
- `--text-primary`: #ffffff (white text)
- `--text-secondary`: #b0b0b0 (gray text)
- `--border`: #3a3a3a (border color)
- `--background`: #0f0f0f (page background)
- `--card-bg`: #1a1a1a (card background)
- `--hover-bg`: #252525 (hover background)

**Responsive Breakpoints**:
- Mobile: Default (no media query)
- Tablet: `@media (min-width: 768px)`
- Desktop: `@media (min-width: 1024px)`

**How to Modify**:
- Change color scheme by updating CSS variables
- Modify component styles by finding the corresponding class
- Add new animations or transitions
- Change spacing, fonts, or layout
- Add dark/light theme toggle

---

## Database Schema

### Table: `category`

| Column | Type | Description |
|--------|------|-------------|
| `id` | string (UUID) | Primary key |
| `name` | string | Category name (e.g., "Appetizers") |
| `desc` | string | Category description |

### Table: `items`

| Column | Type | Description |
|--------|------|-------------|
| `id` | string (UUID) | Primary key |
| `name` | string | Item name |
| `desc` | string | Item description |
| `price` | number | Item price |
| `cat_id` | string (UUID) | Foreign key to `category.id` |

**Important Notes**:
- Table names are lowercase: `category` and `items`
- The `cat_id` column in `items` references `category.id`
- Make sure Row Level Security (RLS) policies allow public read access if needed

---

## Component Architecture

```
app/page.tsx (Main Page)
├── MenuHeader
│   └── Displays restaurant name
├── CategoryList
│   └── Renders category buttons
└── MenuItems
    └── Displays items for selected category
```

**Data Flow**:
1. `page.tsx` fetches categories from Supabase
2. User selects a category → `setSelectedCategory` is called
3. `useEffect` detects category change → calls `fetchItems(categoryId)`
4. Items are filtered by `cat_id` and displayed in `MenuItems`
5. Components re-render with new data

---

## Styling System

### CSS Class Naming Convention

All classes use kebab-case and follow a component-based naming pattern:
- `.menu-app` - Main container
- `.menu-header` - Header component
- `.category-nav` - Category navigation
- `.menu-item-card` - Individual item card

### Styling Approach

1. **CSS Variables**: Centralized color and spacing values
2. **Mobile-First**: Base styles for mobile, then media queries for larger screens
3. **Utility Classes**: Reusable classes for common patterns
4. **Component Scoping**: Classes are scoped to avoid conflicts

### Key Style Classes

- `.menu-header` - Sticky header with gradient background
- `.category-button` - Category navigation buttons
- `.category-button.active` - Active category button
- `.menu-item-card` - Individual menu item card
- `.menu-item-header` - Item name and price container
- `.menu-item-description` - Item description text

---

## Environment Setup

### Required Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Note**: The `NEXT_PUBLIC_` prefix is required for Next.js to expose these variables to the browser.

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Common Modifications

### 1. Change Restaurant Name

**Option A**: Hardcode in `app/page.tsx`:
```typescript
const [restaurantName, setRestaurantName] = useState('Your Restaurant Name')
```

**Option B**: Fetch from database (add `restaurant` table):
```typescript
const { data } = await supabase.from('restaurant').select('name').single()
setRestaurantName(data?.name || 'La Menu')
```

### 2. Add Item Images

1. Add `image_url` to `types/database.ts`:
```typescript
export interface Item {
  // ... existing fields
  image_url?: string
}
```

2. Update `components/MenuItems.tsx`:
```tsx
{item.image_url && (
  <img src={item.image_url} alt={item.name} className="menu-item-image" />
)}
```

3. Add CSS for images in `app/globals.css`

### 3. Add Dietary Tags

1. Add fields to `types/database.ts`:
```typescript
export interface Item {
  // ... existing fields
  spicy?: boolean
  vegetarian?: boolean
  vegan?: boolean
}
```

2. Update `components/MenuItems.tsx` to display tags (similar to old code)

### 4. Change Color Scheme

Edit CSS variables in `app/globals.css`:
```css
:root {
  --accent: #your-color-here;
  --primary: #your-color-here;
  /* etc. */
}
```

### 5. Add Search Functionality

1. Add search input to `app/page.tsx`
2. Filter items based on search query
3. Update `fetchItems` to accept search parameter

### 6. Change Table Names

If your Supabase tables have different names:

1. Update queries in `app/page.tsx`:
```typescript
.from('your_table_name')  // Change from 'category' or 'items'
```

2. Make sure table names match exactly (case-sensitive)

### 7. Add Loading Skeletons

Replace the simple loading text with skeleton loaders:
```tsx
// Create skeleton components
<div className="skeleton-card">...</div>
```

### 8. Add Error Handling UI

Add error state in `app/page.tsx`:
```typescript
const [error, setError] = useState<string | null>(null)

// In catch blocks:
setError('Failed to load menu. Please try again.')

// In JSX:
{error && <div className="error-message">{error}</div>}
```

### 9. Change Price Format

Modify price display in `components/MenuItems.tsx`:
```tsx
// Current: ${item.price.toFixed(2)}
// Custom: formatCurrency(item.price) or item.price.toLocaleString()
```

### 10. Add Category Descriptions

1. Category already has `desc` field in database
2. Display it in `components/CategoryList.tsx` or create a tooltip

---

## Troubleshooting

### Data Not Loading

1. Check browser console for errors
2. Verify `.env.local` file exists and has correct values
3. Check Supabase RLS policies allow public read access
4. Verify table names match exactly: `category` and `items`
5. Check column names match: `id`, `name`, `desc`, `price`, `cat_id`

### Styling Issues

1. Check CSS class names match between components and CSS
2. Verify CSS variables are defined in `:root`
3. Check for CSS specificity conflicts
4. Clear browser cache and restart dev server

### TypeScript Errors

1. Run `npm install` to ensure all types are installed
2. Check `types/database.ts` matches your actual database schema
3. Restart TypeScript server in your IDE

---

## Next Steps / Future Enhancements

- [ ] Add item images
- [ ] Add search/filter functionality
- [ ] Add cart/ordering functionality
- [ ] Add authentication for admin features
- [ ] Add item customization options
- [ ] Add favorites/wishlist
- [ ] Add reviews/ratings
- [ ] Add multi-language support
- [ ] Add dark/light theme toggle
- [ ] Add animations and transitions
- [ ] Add PWA support for mobile app-like experience

---

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Supabase connection and data
3. Review this documentation
4. Check Next.js and Supabase documentation

---

**Last Updated**: 2024
**Version**: 1.0.0

