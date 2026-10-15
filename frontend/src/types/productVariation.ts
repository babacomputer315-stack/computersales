import { FileItem } from "./fileManager";

export interface ProductVariation {
  id: number;
  productId: number;
  sku: string | null;
  price: number;
  salePrice: number | null;
  stockQuantity: number;
  stockStatus: "instock" | "outofstock";
  createdAt: string;
  updatedAt: string;
  imageFile: FileItem;
  attributeValues: {
    id: number;
    variationId: number;
    attributeValueId: number;
    createdAt: string;
    attributeValue: {
      colorCode: string;
      fileId: number;
      file: FileItem;
      slug: string;
      id: number;
      attributeId: number;
      value: string;
      createdAt: string;
      updatedAt: string;
      attribute: {
        id: number;
        name: string;
        slug: string;
        createdAt: string;
        updatedAt: string;
      };
    };
  }[];
}
