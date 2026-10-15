export interface ResponseModel<T> {
  message: string;
  success: boolean;
  data: T;
  errors: any;
}
