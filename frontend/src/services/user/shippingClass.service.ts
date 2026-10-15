import httpClient from "@/services/httpClient";
import { ShippingClass } from "@/types/shippingClass";

export interface ShippingClassesListResponse {
  data: ShippingClass[];
  message: string;
  success: boolean;
}

class ShippingClassService {
  // Get all user shipping classes
  async getShippingClasses(): Promise<ShippingClassesListResponse> {
    const response = await httpClient.get(`/user/shipping-classes`);
    return response.data;
  }
}

export default new ShippingClassService();