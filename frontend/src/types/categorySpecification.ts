import { ProductCategory } from "./productCategory";
import Specification from "./specification";

export default interface CategorySpecification {
  id: number;
  categoryId: number;
  specificationId: number;
  isRequired: boolean;
  order: number;
  specification: Specification;
  value: string;
  category: ProductCategory;
}
