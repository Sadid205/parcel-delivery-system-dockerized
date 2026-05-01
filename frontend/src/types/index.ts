export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ILoginResponse {
  err: { statusCode: string };
  errorSources: [];
  message: string;
  stack: string;
  success: boolean;
}

export type IRole = "SUPER_ADMIN" | "ADMIN" | "USER" | "DELIVERY_MAN";

export interface IError {
  data?: {
    success: string;
    message: string;
    errorSources?: { path: string; message: string }[];
  };
}
