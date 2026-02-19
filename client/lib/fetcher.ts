import axios, { AxiosRequestConfig } from "axios";
import { env } from "@/utils/env";
import { API } from "./api";
import { ApiResponse } from "@/utils/apiResponse";

export const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

// Supported methods
export type MutationMethod = "POST" | "PUT" | "DELETE";

export interface MutationOptions<TData = unknown, TParams = unknown> {
  headers?: Record<string, string>;
  data?: TData; // request body
  params?: TParams; // optional query params
}

const baseURL =
  env.NODE_ENV === "production"
    ? "/api"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
// Centralized axios instance (optional)
const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, // send cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Axios helper for POST, PUT, DELETE requests
 */
export const request = async <TResponse, TData = unknown, TParams = unknown>(
  endpoint: keyof typeof API | string,
  method: MutationMethod = "POST",
  options: MutationOptions<TData, TParams> = {},
  fallbackMessage = "Something went wrong, please try again.",
): Promise<ApiResponse<TResponse>> => {
  try {
    // Resolve full URL
    let url: string;
    const apiEntry =
      endpoint in API ? API[endpoint as keyof typeof API] : endpoint;

    if (typeof apiEntry === "function") {
      // Ensure options.params is an object
      if (
        !options.params ||
        typeof options.params !== "object" ||
        !("id" in options.params)
      ) {
        throw new Error("Missing 'id' in params for dynamic endpoint");
      }

      // Cast params to object with id
      const paramsWithId = options.params as { id: string };
      url = apiEntry(paramsWithId.id);
    } else {
      url = apiEntry;
    }

    const config: AxiosRequestConfig = {
      method,
      url,
      data: options.data,
      params: options.params,
      headers: options.headers,
    };

    const response = await axiosInstance(config);
    return response.data;
  } catch (error: any) {
    // merged extractErrorMessage logic
    let message = fallbackMessage;

    if (axios.isAxiosError(error) && error.response?.data?.errMsg) {
      message = error.response.data.errMsg;
    }

    return {
      success: false,
      errMsg: message,
    };
  }
};
