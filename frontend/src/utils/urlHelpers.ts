import { ProductFilters } from "@/services/user/product.service";

export interface ExtendedProductFilters extends Omit<ProductFilters, "sortBy"> {
  specificationOptionIds?: number[] | null;
  tagIds?: number[] | null;
  sortBy?:
    | "name"
    | "price"
    | "createdAt"
    | "regularPrice"
    | "most-visited"
    | "most-sold"
    | "most-discount";
}

export const buildProductUrl = (
  filters: ExtendedProductFilters,
  basePath: string = "/products",
  categoryId?: number,
  categorySlug?: string,
  brandSlug?: string
): string => {
  const params = new URLSearchParams();

  if (filters.page && filters.page > 1)
    params.append("page", filters.page.toString());
  if (filters.limit && filters.limit !== 20)
    params.append("limit", filters.limit.toString());
  if (filters.sortBy && filters.sortBy !== "createdAt")
    params.append("sortBy", filters.sortBy);
  if (filters.sortOrder && filters.sortOrder !== "desc")
    params.append("sortOrder", filters.sortOrder);
  if (filters.name) params.append("name", filters.name);
  if (filters.categoryId && filters.categoryId !== null)
    params.append("categoryId", filters.categoryId.toString());
  if (
    filters.categoryIds &&
    Array.isArray(filters.categoryIds) &&
    filters.categoryIds.length
  ) {
    params.append("categoryIds", filters.categoryIds.join(","));
  }
  if (filters.tagId && filters.tagId !== null)
    params.append("tagId", filters.tagId.toString());
  if (
    filters.tagIds &&
    Array.isArray(filters.tagIds) &&
    filters.tagIds.length
  ) {
    params.append("tagIds", filters.tagIds.join(","));
  }
  if (
    filters.specificationOptionIds &&
    Array.isArray(filters.specificationOptionIds) &&
    filters.specificationOptionIds.length
  ) {
    params.append(
      "specificationOptionIds",
      filters.specificationOptionIds.join(",")
    );
  }
  if (filters.minPrice && filters.minPrice !== null)
    params.append("minPrice", filters.minPrice.toString());
  if (filters.maxPrice && filters.maxPrice !== null)
    params.append("maxPrice", filters.maxPrice.toString());
  if (filters.isFeatured !== undefined && filters.isFeatured !== null)
    params.append("isFeatured", filters.isFeatured.toString());
  if (filters.inStock !== undefined && filters.inStock !== null)
    params.append("inStock", filters.inStock.toString());

  const queryString = params.toString();
  // Use slug if provided, otherwise fall back to ID
  const finalPath = categorySlug
    ? `/products/category/${categorySlug}`
    : categoryId
    ? `${basePath}/category/${categoryId}`
    : brandSlug
    ? `${basePath}/brand/${brandSlug}`
    : basePath;
  return queryString ? `${finalPath}?${queryString}` : finalPath;
};

export const parseProductFilters = (query: any): ExtendedProductFilters => {
  return {
    page: parseInt(query?.page as string) || 1,
    limit: parseInt(query?.limit as string) || 20,
    sortBy:
      (query?.sortBy as
        | "name"
        | "price"
        | "createdAt"
        | "regularPrice"
        | "most-visited"
        | "most-sold"
        | "most-discount") || "createdAt",
    sortOrder: (query?.sortOrder as "asc" | "desc") || "desc",
    name: query?.name || null,
    categoryId: query?.categoryId
      ? parseInt(query?.categoryId as string)
      : null,
    categoryIds: query?.categoryIds
      ? (query?.categoryIds as string)
          .split(",")
          .map((id: string) => parseInt(id.trim()))
          .filter((id: number) => !isNaN(id))
      : null,
    tagId: query?.tagId ? parseInt(query?.tagId as string) : null,
    tagIds: query?.tagIds
      ? (query?.tagIds as string)
          .split(",")
          .map((id: string) => parseInt(id.trim()))
          .filter((id: number) => !isNaN(id))
      : null,
    specificationOptionIds: query?.specificationOptionIds
      ? (query?.specificationOptionIds as string)
          .split(",")
          .map((id: string) => parseInt(id.trim()))
          .filter((id: number) => !isNaN(id))
      : null,
    minPrice: query?.minPrice ? parseInt(query?.minPrice as string) : null,
    maxPrice: query?.maxPrice ? parseInt(query?.maxPrice as string) : null,
    isFeatured: query?.isFeatured ? query?.isFeatured === "true" : null,
    inStock: query?.inStock ? query?.inStock === "true" : null,
  };
};
