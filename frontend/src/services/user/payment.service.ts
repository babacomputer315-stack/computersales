import httpClient from "../httpClient";

export interface Payment {
  id: number;
  orderId: number;
  provider: string;
  status: "pending" | "paid" | "failed" | "cancelled";
  amount: number;
  trackingCode?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  order?: {
    id: number;
    orderNumber: number;
    status: string;
    totalAmount: number;
  };
}

export interface PaymentInitiateResponse {
  payment: Payment;
  paymentUrl: string;
  trackingCode: string;
}

export interface PaymentVerifyRequest {
  trackingCode: string;
  provider: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  payment: Payment;
  order?: {
    id: number;
    orderNumber: number;
    status: string;
    totalAmount: number;
    paymentMethod: string;
    customerNote?: string;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

export interface PaymentsListResponse {
  data: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class PaymentService {
  // Get user's payments with pagination
  async getUserPayments(
    page: number = 1,
    limit: number = 10
  ): Promise<PaymentsListResponse> {
    const response = await httpClient.get(
      `/user/payments?page=${page}&limit=${limit}`
    );
    return response.data.data;
  }

  // Get payment by order ID
  async getPaymentByOrderId(orderId: number): Promise<Payment> {
    const response = await httpClient.get(`/user/payments/order/${orderId}`);
    return response.data.data;
  }

  // Initiate payment for an order
  async initiatePayment(
    orderId: number,
    provider: string
  ): Promise<PaymentInitiateResponse> {
    const response = await httpClient.post(
      `/user/payments/order/${orderId}/initiate`,
      { provider: provider || "zibal" }
    );
    return response.data.data;
  }

  // Verify payment for an order
  async verifyPayment(
    orderId: number,
    verifyData: PaymentVerifyRequest
  ): Promise<PaymentVerifyResponse> {
    const response = await httpClient.post(
      `/user/payments/order/${orderId}/verify`,
      verifyData
    );
    return response.data.data;
  }

  async verfyPECPayment(callbackData: any): Promise<any> {
    const response = await httpClient.post(
      `/user/payments/callback/pec`,
      callbackData
    );
    return response.data.data;
  }

  // Get payment status
  async getPaymentStatus(orderId: number): Promise<{
    id: number;
    status: string;
    provider: string;
    trackingCode?: string;
    amount: number;
    paidAt?: string;
    order: {
      id: number;
      orderNumber: number;
      status: string;
    };
  }> {
    const response = await httpClient.get(
      `/user/payments/order/${orderId}/status`
    );
    return response.data.data;
  }

  // Request refund for a payment
  async refundPayment(orderId: number): Promise<{
    payment: Payment;
    order: {
      id: number;
      orderNumber: number;
      status: string;
      totalAmount: number;
      paymentMethod: string;
      customerNote?: string;
      createdAt: string;
      updatedAt: string;
    };
    message: string;
  }> {
    const response = await httpClient.post(
      `/user/payments/order/${orderId}/refund`
    );
    return response.data.data;
  }
}

export default new PaymentService();
