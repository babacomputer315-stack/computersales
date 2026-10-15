import { FileItem } from "./fileManager";
import { SpecificationOption } from "./specificationOption";

export interface Product {
  id: number;
  sku: string;
  name: string;
  nameEn: string;
  isPublished: boolean;
  shortDescription: string;
  longDescription: string;
  regularPrice: number;
  salePrice: number | null;
  saleStartDate: string | null;
  saleEndDate: string | null;
  stockQuantity: number;
  stockStatus: "instock" | "outofstock";
  showStock: boolean;
  isFeatured: boolean;
  shippingClassId: number | null;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;

  isSinglePurchase: boolean;
  purchaseLimit: number;

  htmlDescription: string;

  brand: {
    id: number;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    image: FileItem;
  } | null;

  specifications: {
    id: number;
    productId: number;
    value: string;
    createdAt: string;
    updatedAt: string;
    option: SpecificationOption | null;
    specification: {
      id: number;
      name: string;
      createdAt: string;
      type: string;
    };
    selectedOptions: {
      id: number;
      productSpecificationId: number;
      optionId: number;
      createdAt: string;
      option: {
        id: number;
        specificationId: number;
        value: string;
        label: string;
        description: string;
        order: number;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
      };
      // id: number;
      // specificationId: number;
      // value: string;
      // label: string;
      // createdAt: string;
      // updatedAt: string;
    }[];
  }[];

  shippingClass: {
    id: number;
    name: string;
    description: string;
    cost: number;
    createdAt: string;
    updatedAt: string;
  } | null;

  tags: {
    productId: number;
    tagId: number;
    tag: {
      id: number;
      name: string;
      slug: string;
      createdAt: string;
      updatedAt: string;
    };
  }[];

  categories: {
    productId: number;
    categoryId: number;
    isPrimary: boolean;
    category: {
      id: number;
      name: string;
      slug: string;
      parentId: number | null;
      createdAt: string;
      updatedAt: string;
    };
  }[];

  images: {
    id: number;
    productId: number;
    fileId: number;
    isThumbnail: boolean;
    order: number;
    alt: string;
    createdAt: string;
    file: FileItem;
  }[];

  variations: {
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
  }[];
}
