import { Product } from "./product";
import { User } from "./User";

export interface ProductComment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  productId: number;
  product: Product;
  author: User;
  answer: string;
  isApproved: boolean;
  rating: number;
}
