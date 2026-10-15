import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { parseProductFilters } from "@/utils/urlHelpers";

export type SortOption = {
  label: string;
  value:
    | "most-visited"
    | "newest"
    | "price-asc"
    | "price-desc"
    | "most-sold"
    | "most-discount"
    | "name-asc"
    | "name-desc"
    | "in-stock";
  sortBy: "name" | "salePrice" | "createdAt" | "regularPrice" | "stockQuantity";
  sortOrder: "asc" | "desc";
};

export const sortOptions: SortOption[] = [
  // {
  //   label: 'پربازدیدترین',
  //   value: 'most-visited',
  //   sortBy: 'createdAt',
  //   sortOrder: 'desc'
  // },
  {
    label: "جدیدترین",
    value: "newest",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  {
    label: "کمترین قیمت",
    value: "price-asc",
    sortBy: "regularPrice",
    sortOrder: "asc",
  },
  {
    label: "بیشترین قیمت",
    value: "price-desc",
    sortBy: "regularPrice",
    sortOrder: "desc",
  },
  // {
  //   label: 'بیشترین فروش',
  //   value: 'most-sold',
  //   sortBy: 'createdAt',
  //   sortOrder: 'desc'
  // },
  {
    label: "بیشترین تخفیف",
    value: "most-discount",
    sortBy: "salePrice",
    sortOrder: "asc",
  },
  {
    label: "موجودی",
    value: "in-stock",
    sortBy: "stockQuantity",
    sortOrder: "desc",
  },
  // {
  //   label: 'نام (الف-ی)',
  //   value: 'name-asc',
  //   sortBy: 'name',
  //   sortOrder: 'asc'
  // },
  // {
  //   label: 'نام (ی-الف)',
  //   value: 'name-desc',
  //   sortBy: 'name',
  //   sortOrder: 'desc'
  // },
];

export const useProductSort = () => {
  const router = useRouter();

  // Parse initial sort from URL
  const initialFilters = parseProductFilters(router.query);

  const [currentSort, setCurrentSort] = useState<SortOption>(() => {
    const foundSort = sortOptions.find(
      (option) =>
        option.sortBy === initialFilters.sortBy &&
        option.sortOrder === initialFilters.sortOrder
    );
    return foundSort || sortOptions[0]; // Default to most-visited
  });

  // Sync with router query changes
  useEffect(() => {
    const newFilters = parseProductFilters(router.query);
    const foundSort = sortOptions.find(
      (option) =>
        option.sortBy === newFilters.sortBy &&
        option.sortOrder === newFilters.sortOrder
    );

    if (foundSort) {
      setCurrentSort(foundSort);
    }
  }, [router.query]);

  // Apply sort
  const applySort = useCallback(
    (sortOption: SortOption) => {
      setCurrentSort(sortOption);

      // Update URL with new sort parameters
      const newQuery = {
        ...router.query,
        sortBy: sortOption.sortBy,
        sortOrder: sortOption.sortOrder,
        page: 1, // Reset to first page when sorting
      };

      router.push({
        pathname: router.pathname,
        query: newQuery,
      });
    },
    [router]
  );

  // Get sort option by value
  const getSortOption = useCallback((value: string) => {
    return sortOptions.find((option) => option.value === value);
  }, []);

  // Check if a sort option is currently active
  const isSortActive = useCallback(
    (value: string) => {
      return currentSort.value === value;
    },
    [currentSort.value]
  );

  return {
    currentSort,
    sortOptions,
    applySort,
    getSortOption,
    isSortActive,
  };
};
