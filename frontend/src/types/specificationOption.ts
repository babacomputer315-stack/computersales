export interface SpecificationOption {
  id: number;
  specificationId: number;
  value: string;
  label: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  specification: {
    name: string;
  };
}
