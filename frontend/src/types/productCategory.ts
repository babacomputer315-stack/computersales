export type ProductCategory = {
  id: number;
  name: string;
  slug: string;
  parentId?: number;
  parent?: ProductCategory;
  createdAt: string;
  updatedAt: string;
  children?: ProductCategory[];
  productCount?: number;
};
