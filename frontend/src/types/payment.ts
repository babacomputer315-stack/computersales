import { Order } from "./order";
import { User } from "./User";

export enum paymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  status: paymentStatus;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
  order: Order;
  user: User;
  trackingCode: string;
}
