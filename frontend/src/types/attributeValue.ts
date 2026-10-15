import { FileItem } from "./fileManager";

export default interface AttributeValue {
  id: number;
  value: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  colorCode: string;
  file: FileItem;

  attribute?: {
    id: number;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  };
}
