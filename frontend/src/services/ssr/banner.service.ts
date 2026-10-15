import { Banner } from "@/types/banner";
import { ssrHttpHelpers, SSRResponse } from "../ssrHttpClient";

// Banner response type
export interface SSRBannerResponse extends SSRResponse<Banner[]> {}

class SSRBannerService {
  // Get all banners
  async getBanners(): Promise<SSRBannerResponse> {
    try {
      const url = ssrHttpHelpers.createUrl("/user/banners");
      return await ssrHttpHelpers.get<SSRBannerResponse>(url);
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch banners",
        data: [],
      });
    }
  }
}

export const ssrBannerService = new SSRBannerService();
