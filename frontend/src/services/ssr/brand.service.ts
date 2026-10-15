import { Brand } from "@/types/brand";
import { ssrHttpHelpers, SSRResponse } from "../ssrHttpClient";

// Brand response type
export interface SSRBrandResponse extends SSRResponse<Brand[]> {}

class SSRBrandService {
  // Get all brands
  async getBrands(
    page: number = 1,
    limit: number = 20
  ): Promise<SSRBrandResponse> {
    try {
      const url = ssrHttpHelpers.createUrl(
        `/user/brands?page=${page}&limit=${limit}`
      );
      return await ssrHttpHelpers.get<SSRBrandResponse>(url);
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch brands",
        data: [],
      });
    }
  }

  async getBrandBySlug(slug: string): Promise<SSRResponse<Brand>> {
    try {
      const url = ssrHttpHelpers.createUrl(`/user/brands/slug/${slug}`);
      return await ssrHttpHelpers.get<SSRResponse<Brand>>(url);
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch brand",
        data: null,
      });
    }
  }
}

export const ssrBrandService = new SSRBrandService();
