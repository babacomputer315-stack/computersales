import httpClient from "../httpClient";
import { CategoryResponse } from "./product.service";

class CategoryService {
  // Get all categories
  async getCategories(): Promise<CategoryResponse> {
    try {
      const url = "/user/categories/tree";
      const res = await httpClient.get<CategoryResponse>(url);
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch categories",
        data: [],
      };
    }
  }
}

export const categoryService = new CategoryService();
