import axios from "axios";
import Cookies from "js-cookie";
const BASE_URL = import.meta.env.VITE_API_URL;

export const API_BASE_URL = BASE_URL + "/api/v1/";
export const MEDIA_BASE_URL = BASE_URL + "/";

export const baseService = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

baseService.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const detail = error.response?.data?.detail || error.message;
        return Promise.reject(detail);
    }
);

export const authService = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

authService.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

authService.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error.response?.status;
        const errorDetail = error.response?.data?.detail || error.message;
        if (status === 403 || status === 401) {
            // Optionally handle unauthorized access here
            // Cookies.remove("token");
            // window.location.reload();
        }
        return Promise.reject(errorDetail);
    }
);
