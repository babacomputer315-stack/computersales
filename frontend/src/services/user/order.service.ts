import httpClient from "../httpClient";
import { Order } from "@/types/order";
import { ResponseModel } from "../response-model";

export interface CreateOrderRequest {
  items: Array<{
    productId: number;
    variationId?: number;
    quantity: number;
  }>;
  shippingAddressId: number;
  shippingClassId: number;
  paymentMethod?: "gateway" | "bank_transfer";
  customerNote?: string;
  isAssembly?: boolean;
}

export interface OrderResponse {
  order: Order;
  items: Array<{
    id: number;
    orderId: number;
    productId: number;
    variationId?: number;
    quantity: number;
    price: number;
    total: number;
  }>;
  payment: {
    id: number;
    orderId: number;
    provider: string;
    status: string;
    amount: number;
    trackingCode?: string;
    paidAt?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface OrdersListResponse {
  data: {
    orders: Order[];
    statusCounts: Record<string, number>;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class OrderService {
  // Create a new order
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    const response = await httpClient.post("/user/orders", orderData);
    return response.data.data;
  }

  // Get user's orders with pagination
  async getUserOrders(
    page: number = 1,
    limit: number = 10,
    status: "pending" | "processing" | "completed" | "cancelled" | "failed" | "returned" = "pending"
  ): Promise<OrdersListResponse> {
    const response = await httpClient.get(
      `/user/orders?page=${page}&limit=${limit}&status=${status}`
    );
    return response.data;
  }

  // Get order by ID
  async getOrderById(orderId: number): Promise<ResponseModel<Order>> {
    const response = await httpClient.get(`/user/orders/${orderId}`);
    return response.data;
  }

  // Cancel order
  async cancelOrder(orderId: number): Promise<Order> {
    const response = await httpClient.put(`/user/orders/${orderId}/cancel`);
    return response.data.data;
  }

  // Get order status
  async getOrderStatus(orderId: number): Promise<{
    id: number;
    orderNumber: number;
    status: string;
    payment: {
      status: string;
      trackingCode?: string;
    };
  }> {
    const response = await httpClient.get(`/user/orders/${orderId}/status`);
    return response.data.data;
  }
}

export default new OrderService();
