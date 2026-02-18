import axios, { AxiosRequestConfig } from "axios";
import { env } from "@/utils/env";
import { API } from "./api";
import { ApiResponse, ApiSuccess } from "@/utils/apiResponse";
export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestOptions<TData = unknown, TParams = unknown> {
  headers?: Record<string, string>;
  data?: TData;
  params?: TParams;
}

const axiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  withCredentials: true, // send cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

export const request = async <TResponse, TData = unknown, TParams = unknown>(
  endpoint: keyof typeof API | string,
  method: RequestMethod = "GET",
  options: RequestOptions<TData, TParams> = {},
  fallbackMessage = "Something went wrong.",
): Promise<ApiResponse<TResponse>> => {
  try {
    const url= endpoint in API ? API[endpoint as keyof typeof API] : endpoint;

    const config: AxiosRequestConfig = {
      method,
      url,
      params: options.params,
      headers: options.headers,
      ...(method !== "GET" && { data: options.data }), // only send body for non-GET
    };

    const response = await axiosInstance(config);
    return response.data;
  } catch (error: any) {
    let message = fallbackMessage;
    if (axios.isAxiosError(error) && error.response?.data?.errMsg) {
      message = error.response.data.errMsg;
    }
    return { success: false, errMsg: message };
  }
};
