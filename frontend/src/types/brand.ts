import { FileItem } from "./fileManager";

export interface Brand {
  id: number;
  name: string;
  slug: string;
  image: FileItem;
}
