import AttributeValue from "./attributeValue";
import { FileItem } from "./fileManager";
import { Order } from "./order";
import { Product } from "./product";

export interface OrderItem {
  id: number;
  orderId: number;
  order: Order;
  productId: number;
  product: Product;
  variationId: number;
  // variation: Product;
  variation: {
    attributeValues: {
      attributeValue: AttributeValue;
    }[];
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productName: string;
  image: FileItem;
  attributesText?: string;
  sku?: string;
}
