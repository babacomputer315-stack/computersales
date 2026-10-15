import { FileItem } from "./fileManager";

export interface Banner {
  id: number;
  name: string;
  image: FileItem;
  link: string;
}
