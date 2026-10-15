# Product Filter and Sort System

This directory contains custom hooks for managing product filters and sorting functionality.

## Hooks

### `useProductFilters`

A comprehensive hook for managing all product filters including categories, specifications, price range, stock status, and more.

#### Features:
- **Category Filtering**: Toggle multiple categories
- **Specification Option Filtering**: Filter by specific specification options
- **Price Range**: Set minimum and maximum price filters
- **Stock Status**: Filter by in-stock/out-of-stock products
- **Featured Products**: Filter by featured products
- **Search Query**: Filter by product name/search term
- **URL Synchronization**: Automatically syncs with URL parameters
- **Filter Count**: Get count of active filters

#### Usage:
```typescript
import { useProductFilters } from '@/hooks/useProductFilters';

const MyComponent = () => {
  const {
    filters,
    currentPage,
    toggleCategory,
    toggleSpecificationOption,
    setPriceRange,
    toggleStockFilter,
    clearAllFilters,
    getActiveFilterCount,
    changePage,
  } = useProductFilters();

  return (
    <div>
      <button onClick={() => toggleCategory(1)}>
        Toggle Category 1
      </button>
      <button onClick={() => toggleSpecificationOption(1)}>
        Toggle Specification Option 1
      </button>
      <button onClick={() => setPriceRange(100, 500)}>
        Set Price Range
      </button>
      <span>Active Filters: {getActiveFilterCount()}</span>
    </div>
  );
};
```

### `useProductSort`

A hook for managing product sorting functionality with predefined sort options.

#### Features:
- **Multiple Sort Options**: Most visited, newest, price (asc/desc), most sold, most discount, name (asc/desc)
- **URL Synchronization**: Automatically syncs with URL parameters
- **Active Sort Detection**: Check which sort option is currently active

#### Usage:
```typescript
import { useProductSort } from '@/hooks/useProductSort';

const MyComponent = () => {
  const { currentSort, sortOptions, applySort, isSortActive } = useProductSort();

  return (
    <div>
      {sortOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => applySort(option)}
          className={isSortActive(option.value) ? 'active' : ''}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
```

## Components

### `ProductsFilterItem`

Enhanced filter item component that supports:
- **Interactive Selection**: Click to select/deselect filter options
- **Visual Feedback**: Shows selected state and count
- **Clear Functionality**: Individual filter clearing
- **Expandable Interface**: Collapsible filter sections

### `ProductSortModal`

Mobile-friendly sort modal with:
- **Touch-Friendly Interface**: Large touch targets
- **Visual Selection**: Clear active state indication
- **Easy Navigation**: Simple close/open functionality

## URL Integration

The system automatically integrates with URL parameters:
- All filter states are reflected in the URL
- Browser back/forward navigation works correctly
- Shareable URLs with applied filters
- SEO-friendly parameter structure

## Example Integration

```typescript
// In your products page component
const ProductsPage = () => {
  const {
    filters,
    toggleCategory,
    setPriceRange,
    clearAllFilters,
    getActiveFilterCount,
  } = useProductFilters();

  const { currentSort, applySort, isSortActive } = useProductSort();

  return (
    <div>
      {/* Filter Section */}
      <div className="filters">
      <button onClick={() => toggleCategory(1)}>
        Category 1
      </button>
      <button onClick={() => toggleSpecificationOption(1)}>
        Specification Option 1
      </button>
      <button onClick={() => setPriceRange(100, 500)}>
        Price Range
      </button>
        {getActiveFilterCount() > 0 && (
          <button onClick={clearAllFilters}>
            Clear All Filters
          </button>
        )}
      </div>

      {/* Sort Section */}
      <div className="sort">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => applySort(option)}
            className={isSortActive(option.value) ? 'active' : ''}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
```

## Benefits

1. **Centralized State Management**: All filter logic in one place
2. **URL Synchronization**: Automatic URL parameter handling
3. **Type Safety**: Full TypeScript support
4. **Reusable**: Can be used across different components
5. **Performance**: Optimized with useCallback and proper dependency arrays
6. **User Experience**: Smooth transitions and visual feedback
7. **Mobile Friendly**: Responsive design with mobile modals
