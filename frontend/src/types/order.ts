import { Payment } from "@/services/user/payment.service";
import Address from "./address";
import { OrderItem } from "./orderItem";
import { OrderNote } from "./orderNote";
import { User } from "./User";

export enum orderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  RETURNED = "returned",
}

export interface Order {
  id: number;
  orderNumber: number;
  userId: number;
  user: User;
  status: orderStatus;
  paymentMethod: "gateway" | "bank_transfer";
  totalAmount: number;
  billingAddressId: number;
  shippingAddressId: number;
  customerNote: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  notes: OrderNote[];
  shippingAddress: Address;
  payment: Payment | null;
}
