import { ssrHttpHelpers, SSRResponse } from "../ssrHttpClient";
import { Category } from "../user/product.service";

// Category response type
export interface SSRCategoryResponse extends SSRResponse<Category[]> {}

export interface CategorySpecificationWithOptions {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: "text" | "select" | "multi_select";
  unit: string | null;
  isSearchable: boolean;
  isFilterable: boolean;
  isComparable: boolean;
  isRequired: boolean;
  order: number;
  options?: Array<{
    id: number;
    value: string;
    label: string;
    description: string | null;
    order: number;
    isActive: boolean;
  }>;
}

export interface SSRCategorySpecificationsResponse
  extends SSRResponse<CategorySpecificationWithOptions[]> {}

class SSRCategoryService {
  // Get all categories
  async getCategories(): Promise<SSRCategoryResponse> {
    try {
      const url = ssrHttpHelpers.createUrl("/user/categories/tree");
      return await ssrHttpHelpers.get<SSRCategoryResponse>(url);
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch categories",
        data: [],
      });
    }
  }

  async getCategorySpecifications(
    categoryId: number
  ): Promise<SSRCategorySpecificationsResponse> {
    try {
      const url = ssrHttpHelpers.createUrl(
        `/user/category-specifications/category/${categoryId}`
      );
      return await ssrHttpHelpers.get<SSRCategorySpecificationsResponse>(url);
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch category specifications",
        data: [],
      });
    }
  }
}

export const ssrCategoryService = new SSRCategoryService();
