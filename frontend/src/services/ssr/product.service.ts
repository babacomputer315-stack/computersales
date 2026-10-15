import {
  ssrHttpHelpers,
  SSRProductResponse,
  SSRCategoryResponse,
  SSRProductDetailResponse,
} from "../ssrHttpClient";

export interface SSRProductFilters {
  categorySlug?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "price" | "createdAt" | "regularPrice";
  sortOrder?: "asc" | "desc";
  name?: string | null;
  categoryId?: number | null;
  categoryIds?: number[] | null;
  tagId?: number | null;
  tagIds?: number[] | null;
  specificationOptionIds?: number[] | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  isFeatured?: boolean | null;
  inStock?: boolean | null;
  brandId?: number | null;
}

class SSRProductService {
  // Get all products with filters
  async getProducts(
    filters: SSRProductFilters = {}
  ): Promise<SSRProductResponse> {
    try {
      const params = this.buildFilterParams(filters);
      const url = ssrHttpHelpers.createUrl("/user/products", params);
      return await ssrHttpHelpers.get<SSRProductResponse>(url);
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch products",
        data: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      });
    }
  }

  // Get featured products
  async getFeaturedProducts(limit: number = 10): Promise<SSRProductResponse> {
    try {
      const url = ssrHttpHelpers.createUrl("/user/products/featured", {
        limit,
      });
      return await ssrHttpHelpers.get<SSRProductResponse>(url);
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch featured products",
        data: [],
        pagination: { page: 1, limit, total: 0, pages: 0 },
      });
    }
  }

  // Search products
  async searchProducts(
    query: string,
    limit: number = 20
  ): Promise<SSRProductResponse> {
    try {
      const url = ssrHttpHelpers.createUrl("/user/products/search", {
        q: query,
        limit,
      });
      return await ssrHttpHelpers.get<SSRProductResponse>(url);
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to search products",
        data: [],
        pagination: { page: 1, limit, total: 0, pages: 0 },
      });
    }
  }

  // Get product by ID
  async getProductById(id: number): Promise<SSRProductDetailResponse> {
    try {
      return await ssrHttpHelpers.get<SSRProductDetailResponse>(
        `/user/products/${id}`
      );
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch product",
        data: null,
      });
    }
  }

  // Get product by slug
  async getProductBySlug(slug: string): Promise<SSRProductDetailResponse> {
    try {
      return await ssrHttpHelpers.get<SSRProductDetailResponse>(
        `/user/products/slug/${slug}`
      );
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch product",
        data: null,
      });
    }
  }

  // Get related products
  async getRelatedProducts(
    productId: number,
    limit: number = 8
  ): Promise<SSRProductResponse> {
    try {
      const url = ssrHttpHelpers.createUrl(
        `/user/products/${productId}/related`,
        { limit }
      );
      return await ssrHttpHelpers.get<SSRProductResponse>(url);
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch related products",
        data: [],
        pagination: { page: 1, limit, total: 0, pages: 0 },
      });
    }
  }

  // Get all categories
  async getCategories(): Promise<SSRCategoryResponse> {
    try {
      return await ssrHttpHelpers.get<SSRCategoryResponse>("/user/categories");
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch categories",
        data: [],
      });
    }
  }

  async getCategoryById(id: number): Promise<SSRCategoryResponse> {
    try {
      return await ssrHttpHelpers.get<SSRCategoryResponse>(
        `/user/categories/${id}`
      );
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch category",
        data: [],
      });
    }
  }

  async getCategoryBySlug(slug: string): Promise<SSRCategoryResponse> {
    try {
      return await ssrHttpHelpers.get<SSRCategoryResponse>(
        `/user/categories/slug/${slug}`
      );
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch category",
        data: null,
      });
    }
  }

  // Get categories with product count
  async getCategoriesWithCount(): Promise<SSRCategoryResponse> {
    try {
      return await ssrHttpHelpers.get<SSRCategoryResponse>(
        "/user/categories/with-count"
      );
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch categories with count",
        data: [],
      });
    }
  }

  // Get popular categories
  async getPopularCategories(limit: number = 10): Promise<SSRCategoryResponse> {
    try {
      const url = ssrHttpHelpers.createUrl("/user/categories/popular", {
        limit,
      });
      return await ssrHttpHelpers.get<SSRCategoryResponse>(url);
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch popular categories",
        data: [],
      });
    }
  }

  // Get all tags
  async getTags(): Promise<SSRCategoryResponse> {
    try {
      return await ssrHttpHelpers.get<SSRCategoryResponse>("/user/tags");
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch tags",
        data: [],
      });
    }
  }

  // Get tags with product count
  async getTagsWithCount(): Promise<SSRCategoryResponse> {
    try {
      return await ssrHttpHelpers.get<SSRCategoryResponse>(
        "/user/tags/with-count"
      );
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch tags with count",
        data: [],
      });
    }
  }

  // Get popular tags
  async getPopularTags(limit: number = 10): Promise<SSRCategoryResponse> {
    try {
      const url = ssrHttpHelpers.createUrl("/user/tags/popular", { limit });
      return await ssrHttpHelpers.get<SSRCategoryResponse>(url);
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch popular tags",
        data: [],
      });
    }
  }

  // Helper method to build filter parameters
  private buildFilterParams(filters: SSRProductFilters): Record<string, any> {
    const params: Record<string, any> = {};

    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    if (filters.name) params.name = filters.name;
    if (filters.categoryId && filters.categoryId !== null)
      params.categoryId = filters.categoryId;
    if (
      filters.categoryIds &&
      Array.isArray(filters.categoryIds) &&
      filters.categoryIds.length
    ) {
      params.categoryIds = filters.categoryIds.join(",");
    }
    if (filters.tagId && filters.tagId !== null) params.tagId = filters.tagId;
    if (
      filters.tagIds &&
      Array.isArray(filters.tagIds) &&
      filters.tagIds.length
    ) {
      params.tagIds = filters.tagIds.join(",");
    }
    if (
      filters.specificationOptionIds &&
      Array.isArray(filters.specificationOptionIds) &&
      filters.specificationOptionIds.length
    ) {
      params.specificationOptionIds = filters.specificationOptionIds.join(",");
    }

    // When inStock is true, ensure minPrice is greater than 1
    if (filters.inStock === true) {
      const minPriceFromFilter =
        filters.minPrice && filters.minPrice !== null ? filters.minPrice : 0;
      params.minPrice = Math.max(minPriceFromFilter, 1.01);
    } else {
      if (filters.minPrice && filters.minPrice !== null)
        params.minPrice = filters.minPrice;
    }

    if (filters.maxPrice && filters.maxPrice !== null)
      params.maxPrice = filters.maxPrice;
    if (filters.isFeatured !== undefined && filters.isFeatured !== null)
      params.isFeatured = filters.isFeatured;
    if (filters.inStock !== undefined && filters.inStock !== null)
      params.inStock = filters.inStock;
    if (filters.brandId && filters.brandId !== null)
      params.brandId = filters.brandId;

    return params;
  }

  // Batch fetch multiple resources
  async batchFetch(filters: SSRProductFilters = {}) {
    try {
      const productsResponse = await this.getProducts(filters);

      return {
        products: productsResponse,
      };
    } catch (error) {
      console.error("SSR Batch fetch error:", error);
      return {
        products: {
          success: false,
          message: "Failed to fetch products",
          data: { data: [], productsMinPrice: 0, productsMaxPrice: 0 },
          meta: { page: 1, limit: 20, total: 0, pages: 0 },
        },
      };
    }
  }
}

export const ssrProductService = new SSRProductService();
