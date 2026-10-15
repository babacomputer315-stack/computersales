export default interface Address {
  id: number;
  fullName: string;
  phone: string;
  province: string;
  provinceCode: string;
  city: string;
  cityCode: string;
  addressLine: string;
  postalCode?: string;
  plaque?: string;
  userId: number;
  createdAt: string;
}
