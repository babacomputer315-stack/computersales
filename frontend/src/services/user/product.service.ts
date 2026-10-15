import { FileItem } from "@/types/fileManager";
import httpClient from "../httpClient";

export interface Product {
  id: number;
  sku: string;
  name: string;
  isPublished: boolean;
  shortDescription?: string;
  longDescription?: string;
  regularPrice: number;
  salePrice?: number;
  saleStartDate?: string;
  saleEndDate?: string;
  stockQuantity: number;
  stockStatus: "instock" | "outofstock" | "preorder";
  showStock: boolean;
  isFeatured: boolean;
  isSinglePurchase: boolean;
  purchaseLimit: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  seoTitle?: string;
  seoDescription?: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  shippingClass?: {
    id: number;
    name: string;
    cost: number;
  };
  tags: Array<{
    tagId: number;
    tag: {
      id: number;
      name: string;
      slug: string;
    };
  }>;
  images: Array<{
    id: number;
    productId: number;
    fileId: number;
    isThumbnail: boolean;
    order: number;
    alt?: string;
    file: FileItem;
  }>;
  categories: Array<{
    categoryId: number;
    isPrimary: boolean;
    category: {
      id: number;
      name: string;
      slug: string;
      description?: string;
    };
  }>;
  variations?: Array<{
    id: number;
    productId: number;
    sku: string;
    regularPrice: number;
    price: number;
    salePrice?: number;
    stockQuantity: number;
    stockStatus: "instock" | "outofstock" | "preorder";
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    attributeValues: Array<{
      attributeValueId: number;
      attributeValue: {
        id: number;
        value: string;
        attribute: {
          id: number;
          name: string;
          slug: string;
          type: string;
        };
      };
    }>;
    imageFile?: {
      id: number;
      filename: string;
      path: string;
    };
  }>;
  specifications?: Array<{
    id: number;
    productId: number;
    specificationId: number;
    value: string;
    selectedOptions?: Array<{
      id: number;
      productSpecificationId: number;
      optionId: number;
      createdAt: string;
      option: {
        id: number;
        specificationId: number;
        value: string;
        label: string;
        description: string;
        order: number;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
      };
    }>;
    specification: {
      id: number;
      name: string;
      type: string;
    };
    option?: {
      id: number;
      value: string;
    };
  }>;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  sortBy?: "name" | "price" | "createdAt" | "regularPrice" | "salePrice";
  sortOrder?: "asc" | "desc";
  name?: string | null;
  categoryId?: number | null;
  categoryIds?: number[] | null;
  tagId?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  isFeatured?: boolean | null;
  inStock?: boolean | null;
  withSpecifications?: boolean | null;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
export interface CompareResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
  image?: FileItem;
  children?: Category[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  productCount?: number;
}

export interface TagResponse {
  success: boolean;
  message: string;
  data: Tag[];
}

class UserProductService {
  // Get all products with filters
  async getProducts(
    filters: ProductFilters & { specificationOptionIds?: number[] } = {}
  ): Promise<{ data: ProductResponse }> {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
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
    if (filters.minPrice && filters.minPrice !== null)
      params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice && filters.maxPrice !== null)
      params.append("maxPrice", filters.maxPrice.toString());
    if (filters.isFeatured !== undefined && filters.isFeatured !== null)
      params.append("isFeatured", filters.isFeatured.toString());
    if (filters.inStock !== undefined && filters.inStock !== null)
      params.append("inStock", filters.inStock.toString());
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
    if (
      filters.withSpecifications !== undefined &&
      filters.withSpecifications !== null
    )
      params.append(
        "withSpecifications",
        filters.withSpecifications.toString()
      );
    const response = await httpClient.get(
      `/user/products?${params.toString()}`
    );
    return response.data;
  }

  // Get featured products
  async getFeaturedProducts(limit: number = 10): Promise<ProductResponse> {
    const response = await httpClient.get(
      `/user/products/featured?limit=${limit}`
    );
    return response.data;
  }

  // Search products
  async searchProducts(
    query: string,
    limit: number = 20
  ): Promise<ProductResponse> {
    const response = await httpClient.get(
      `/user/products/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    return response.data;
  }

  // Get product by ID
  async getProductById(id: number): Promise<ProductResponse> {
    const response = await httpClient.get(`/user/products/${id}`);
    return response.data;
  }

  // Get product by slug
  async getProductBySlug(slug: string): Promise<CompareResponse> {
    const response = await httpClient.get(`/user/products/slug/${slug}`);
    return response.data;
  }

  // Get related products
  async getRelatedProducts(
    productId: number,
    limit: number = 8
  ): Promise<ProductResponse> {
    const response = await httpClient.get(
      `/user/products/${productId}/related?limit=${limit}`
    );
    return response.data;
  }

  // Get all categories
  async getCategories(): Promise<CategoryResponse> {
    const response = await httpClient.get("/user/categories");
    return response.data;
  }

  // Get categories with product count
  async getCategoriesWithCount(): Promise<CategoryResponse> {
    const response = await httpClient.get("/user/categories/with-count");
    return response.data;
  }

  // Get popular categories
  async getPopularCategories(limit: number = 10): Promise<CategoryResponse> {
    const response = await httpClient.get(
      `/user/categories/popular?limit=${limit}`
    );
    return response.data;
  }

  // Get all tags
  async getTags(): Promise<TagResponse> {
    const response = await httpClient.get("/user/tags");
    return response.data;
  }

  // Get tags with product count
  async getTagsWithCount(): Promise<TagResponse> {
    const response = await httpClient.get("/user/tags/with-count");
    return response.data;
  }

  // Get popular tags
  async getPopularTags(limit: number = 10): Promise<TagResponse> {
    const response = await httpClient.get(`/user/tags/popular?limit=${limit}`);
    return response.data;
  }
}

export const userProductService = new UserProductService();
