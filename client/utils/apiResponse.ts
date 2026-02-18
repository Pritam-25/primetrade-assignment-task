export type ApiSuccess<T> = {
  success: true;
  message: string;
  data?: T;
};

export type ApiError = {
  success: false;
  errMsg: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
