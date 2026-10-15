import Specification from "@/types/specification";
import httpClient from "../httpClient";
import { ResponseModel } from "../response-model";

class CategorySpecificationService {
  // Get category specifications
  async getCategorySpecifications(
    categoryId: number
  ): Promise<ResponseModel<Specification[]>> {
    try {
      const url = `/user/category-specifications/category/${categoryId}`;
      const res = await httpClient.get<ResponseModel<Specification[]>>(url);
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch category specifications",
        data: [],
        errors: null,
      };
    }
  }
}

export const categorySpecificationService = new CategorySpecificationService();
