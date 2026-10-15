import httpClient from "@/services/httpClient";
import { ResponseModel } from "@/services/response-model";
import Address from "@/types/address";

export interface CreateAddressRequest {
  fullName: string;
  phone: string;
  province: string;
  provinceCode: string;
  city: string;
  cityCode: string;
  addressLine: string;
  postalCode?: string;
  plaque?: string;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {}

export interface AddressesListResponse {
  data: Address[];
  message: string;
  success: boolean;
}

class AddressService {
  // Get all user addresses
  async getUserAddresses(): Promise<AddressesListResponse> {
    const response = await httpClient.get("/user/addresses");
    return response.data;
  }

  // Get address by ID
  async getAddressById(id: number): Promise<ResponseModel<Address>> {
    const response = await httpClient.get(`/user/addresses/${id}`);
    return response.data;
  }

  // Create new address
  async createAddress(addressData: CreateAddressRequest): Promise<ResponseModel<Address>> {
    const response = await httpClient.post("/user/addresses", addressData);
    return response.data;
  }

  // Update address
  async updateAddress(id: number, addressData: UpdateAddressRequest): Promise<ResponseModel<Address>> {
    const response = await httpClient.put(`/user/addresses/${id}`, addressData);
    return response.data;
  }

  // Delete address
  async deleteAddress(id: number): Promise<ResponseModel<null>> {
    const response = await httpClient.delete(`/user/addresses/${id}`);
    return response.data;
  }

  // Get address count
  async getAddressCount(): Promise<ResponseModel<{ count: number }>> {
    const response = await httpClient.get("/user/addresses/count");
    return response.data;
  }
}

export default new AddressService();
