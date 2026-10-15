export default interface Specification {
  id: number;
  name: string;
  description: string;
  type: "text" | "number" | "boolean" | "select" | "multi_select";
  unit?: string;
  isSearchable: boolean;
  isComparable: boolean;
  createdAt: string;
  updatedAt: string;
  options: {
    id: number;
    specificationId: number;
    value: string;
    label: string;
    description?: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
}
