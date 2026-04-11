import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ErrorResponse, ApiResponse } from "./types";
import { cookies } from "@/lib/cookies";


const BASE_URL = process.env.NEXT_PUBLIC_API_URL + "api/";

export const API_BASE_URL = BASE_URL;


export const baseService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

baseService.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    if (error.response) {
      const errorDetail =
        error?.response?.data?.error || error?.response?.data?.message;
      return Promise.reject(errorDetail);
    } else {
      return Promise.reject(error?.message || "An unknown error occurred");
    }
  },
);

export const authService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

authService.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = cookies.get("token");

    if (config.headers) {
      config.headers.Authorization = `Bearer ${token || "no_token"}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

authService.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    if (error.response?.status === 401) {
      cookies.remove("token");
      cookies.remove("admin");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error?.response?.data?.message ?? "Session expired.");
    }
    if (error.response) {
      const errorDetail =
        error?.response?.data?.error || error?.response?.data?.message;
      return Promise.reject(errorDetail);
    } else {
      return Promise.reject(error?.message || "An unknown error occurred");
    }
  },
);

