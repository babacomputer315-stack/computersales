export interface ShippingClass {
  id: number;
  name: string;
  description: string;
  type: "post" | "collect";
  createdAt: string;
  updatedAt: string;
}
