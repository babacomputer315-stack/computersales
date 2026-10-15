import BlogCategory from "./blogCategory";
import BlogTag from "./blogTag";
import { FileItem } from "./fileManager";
import { User } from "./User";

export default interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
  author: User;
  category: BlogCategory;
  publishedAt: string;
  thumbnail: FileItem;
  tags: { id: number; tag: BlogTag }[];
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}
