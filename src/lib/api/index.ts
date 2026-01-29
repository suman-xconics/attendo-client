import { env } from "@/env";
import axios, { type AxiosInstance } from "axios";
import { toast } from "sonner";

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.VITE_PUBLIC_SERVER_API_URL,
  withCredentials: false,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 ALWAYS attach the latest token right before request is sent
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("bearer_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    if (import.meta.env.DEV) {
      console.log(`${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  ({ response }) => {
    if (response?.status === 401) {
      toast.error("Unauthorized access. Please log in again.");
    }

    return Promise.reject(
      response?.data || { message: "Request failed" }
    );
  },
);
