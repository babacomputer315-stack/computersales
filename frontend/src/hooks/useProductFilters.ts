import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { SSRProductFilters } from "@/services/ssr/product.service";
import { buildProductUrl, parseProductFilters } from "@/utils/urlHelpers";

export interface FilterState {
  categoryIds: number[];
  specificationOptionIds: number[];
  minPrice: number | null;
  maxPrice: number | null;
  inStock: boolean | null;
  isFeatured: boolean | null;
  tagIds: number[];
  searchQuery: string | null;
}

export interface SortState {
  sortBy:
    | "name"
    | "price"
    | "createdAt"
    | "regularPrice"
    | "most-visited"
    | "most-sold"
    | "most-discount";
  sortOrder: "asc" | "desc";
}

export const useProductFilters = (
  categoryId?: number,
  categorySlug?: string,
  brandSlug?: string
) => {
  const router = useRouter();

  // Parse initial filters from URL
  const initialFilters = parseProductFilters(router.query);

  const [filters, setFilters] = useState<FilterState>({
    categoryIds: initialFilters.categoryIds || [],
    specificationOptionIds: initialFilters.specificationOptionIds || [],
    minPrice: initialFilters.minPrice || null,
    maxPrice: initialFilters.maxPrice || null,
    inStock: initialFilters.inStock || null,
    isFeatured: initialFilters.isFeatured || null,
    tagIds: initialFilters.tagIds || [],
    searchQuery: initialFilters.name || null,
  });

  const [sort, setSort] = useState<SortState>({
    sortBy: initialFilters.sortBy || "createdAt",
    sortOrder: initialFilters.sortOrder || "desc",
  });

  const [currentPage, setCurrentPage] = useState(initialFilters.page || 1);

  // Sync with router query changes
  useEffect(() => {
    const newFilters = parseProductFilters(router.query);
    setFilters({
      categoryIds: newFilters.categoryIds || [],
      specificationOptionIds: newFilters.specificationOptionIds || [],
      minPrice: newFilters.minPrice || null,
      maxPrice: newFilters.maxPrice || null,
      inStock: newFilters.inStock || null,
      isFeatured: newFilters.isFeatured || null,
      tagIds: newFilters.tagIds || [],
      searchQuery: newFilters.name || null,
    });
    setSort({
      sortBy: newFilters.sortBy || "createdAt",
      sortOrder: newFilters.sortOrder || "desc",
    });
    setCurrentPage(newFilters.page || 1);
  }, [router.query]);

  // Build filter object for API calls
  const buildFilterObject = useCallback((): SSRProductFilters => {
    // Map custom sort values to API sort values
    const mapSortBy = (sortBy: string) => {
      switch (sortBy) {
        case "most-visited":
        case "most-sold":
        case "most-discount":
          return "createdAt"; // Default to createdAt for these custom sorts
        default:
          return sortBy as "name" | "price" | "createdAt" | "regularPrice";
      }
    };

    return {
      page: currentPage,
      limit: 20,
      sortBy: mapSortBy(sort.sortBy),
      sortOrder: sort.sortOrder,
      name: filters.searchQuery,
      categoryIds: filters.categoryIds.length > 0 ? filters.categoryIds : null,
      specificationOptionIds:
        filters.specificationOptionIds.length > 0
          ? filters.specificationOptionIds
          : null,
      tagIds: filters.tagIds.length > 0 ? filters.tagIds : null,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      inStock: filters.inStock,
      isFeatured: filters.isFeatured,
    };
  }, [filters, sort, currentPage]);

  // Apply filters and navigate
  const applyFilters = useCallback(
    (newFilters: Partial<FilterState>, resetPage: boolean = true) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);

      if (resetPage) {
        setCurrentPage(1);
      }

      const filterObject = buildFilterObject();
      const url = buildProductUrl(
        {
          ...filterObject,
          ...updatedFilters,
          page: resetPage ? 1 : currentPage,
        },
        "/products",
        categoryId,
        categorySlug,
        brandSlug
      );

      router.push(url);
    },
    [
      filters,
      buildFilterObject,
      currentPage,
      router,
      categoryId,
      categorySlug,
      brandSlug,
    ]
  );

  // Apply sort and navigate
  const applySort = useCallback(
    (newSort: Partial<SortState>) => {
      const updatedSort = { ...sort, ...newSort };
      setSort(updatedSort);
      setCurrentPage(1);

      const filterObject = buildFilterObject();
      const url = buildProductUrl(
        {
          ...filterObject,
          ...updatedSort,
          page: 1,
        },
        "/products",
        categoryId,
        categorySlug,
        brandSlug
      );

      router.push(url);
    },
    [sort, buildFilterObject, router, categoryId, categorySlug, brandSlug]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const clearedFilters: FilterState = {
      categoryIds: [],
      specificationOptionIds: [],
      minPrice: null,
      maxPrice: null,
      inStock: null,
      isFeatured: null,
      tagIds: [],
      searchQuery: null,
    };

    setFilters(clearedFilters);
    setCurrentPage(1);

    const url = buildProductUrl(
      {
        page: 1,
        limit: 20,
        sortBy: sort.sortBy as "name" | "price" | "createdAt" | "regularPrice",
        sortOrder: sort.sortOrder,
      },
      "/products",
      categoryId,
      categorySlug,
      brandSlug
    );

    router.push(url);
  }, [sort, router, categoryId, categorySlug, brandSlug]);

  // Toggle category filter
  const toggleCategory = useCallback(
    (categoryId: number) => {
      const newCategoryIds = filters.categoryIds.includes(categoryId)
        ? filters.categoryIds.filter((id) => id !== categoryId)
        : [...filters.categoryIds, categoryId];

      applyFilters({ categoryIds: newCategoryIds });
    },
    [filters.categoryIds, applyFilters]
  );

  // Toggle specification option filter
  const toggleSpecificationOption = useCallback(
    (optionId: number) => {
      const newSpecificationOptionIds = filters.specificationOptionIds.includes(
        optionId
      )
        ? filters.specificationOptionIds.filter((id) => id !== optionId)
        : [...filters.specificationOptionIds, optionId];

      applyFilters({ specificationOptionIds: newSpecificationOptionIds });
    },
    [filters.specificationOptionIds, applyFilters]
  );

  // Clear all options for a specific specification
  const clearSpecificationFilter = useCallback(
    (specificationId: number, allOptionIds: number[]) => {
      const newSpecificationOptionIds = filters.specificationOptionIds.filter(
        (id) => !allOptionIds.includes(id)
      );
      applyFilters({ specificationOptionIds: newSpecificationOptionIds });
    },
    [filters.specificationOptionIds, applyFilters]
  );

  // Set price range
  const setPriceRange = useCallback(
    (min: number | null, max: number | null) => {
      applyFilters({ minPrice: min, maxPrice: max });
    },
    [applyFilters]
  );

  // Toggle stock filter
  const toggleStockFilter = useCallback(
    (inStock: boolean | null) => {
      applyFilters({ inStock });
    },
    [applyFilters]
  );

  // Toggle featured filter
  const toggleFeaturedFilter = useCallback(
    (isFeatured: boolean | null) => {
      applyFilters({ isFeatured });
    },
    [applyFilters]
  );

  // Set search query
  const setSearchQuery = useCallback(
    (query: string | null) => {
      applyFilters({ searchQuery: query });
    },
    [applyFilters]
  );

  // Change page
  const changePage = useCallback(
    (page: number) => {
      setCurrentPage(page);
      const filterObject = buildFilterObject();
      const url = buildProductUrl(
        {
          ...filterObject,
          page,
        },
        "/products",
        categoryId,
        categorySlug,
        brandSlug
      );
      router.push(url);
    },
    [buildFilterObject, router, categoryId, categorySlug, brandSlug]
  );

  // Get active filter count
  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    if (filters.categoryIds.length > 0) count++;
    if (filters.specificationOptionIds.length > 0) count++;
    if (filters.minPrice !== null || filters.maxPrice !== null) count++;
    if (filters.inStock !== null) count++;
    if (filters.isFeatured !== null) count++;
    if (filters.searchQuery) count++;
    return count;
  }, [filters]);

  return {
    filters,
    sort,
    currentPage,
    buildFilterObject,
    applyFilters,
    applySort,
    clearAllFilters,
    toggleCategory,
    toggleSpecificationOption,
    clearSpecificationFilter,
    setPriceRange,
    toggleStockFilter,
    toggleFeaturedFilter,
    setSearchQuery,
    changePage,
    getActiveFilterCount,
  };
};
