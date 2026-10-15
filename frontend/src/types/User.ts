import Address from "./address";

export type User = {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  mobile: string;
  code: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
  addresses: Address[];
  status: "active" | "blocked";
  nationalCode: string;
};
