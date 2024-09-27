import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "react-toastify";

// Create an Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL, // Base URL for requests
  timeout: 10000, // Timeout for requests
  headers: {
    "Content-Type": "application/json", // Default content type
  },
  withCredentials: true, // Send cookies with requests
});

// Request interceptor to include token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error) // Handle request error
);

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response, // Return response as is
  (error) => {
    console.error(
      "Global error handler:",
      error.response?.data || error.message
    );
    return Promise.reject(error); // Pass error to the catch block
  }
);

interface ApiCallOptions {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: any;
  headers?: Record<string, string>;
}

// Function to handle API errors
const handleApiError = (error: any) => {
  if (error.response) {
    console.error("API Error:", error.response.data);
    if (error.response.data.message) {
      toast.error(error.response.data.message);
    }
    switch (error.response.status) {
      case 401:
        console.error("Unauthorized access. Please log in again.");
        localStorage.removeItem("user");
        // window.location.href = "/login";
        break;
      case 404:
        console.error("Requested resource not found.");
        break;
      case 500:
        console.error("Server error. Please try again later.");
        break;
      default:
        console.error("An unexpected error occurred.");
    }
  } else if (error.request) {
    console.error("No response received from the server.");
  } else {
    console.error("Error setting up the request:", error.message);
  }
};

// API call function
export const apiCall = async <T>({
  url,
  method,
  data,
  headers = {},
}: ApiCallOptions): Promise<T | null> => {
  try {
    const config: AxiosRequestConfig = {
      url,
      method,
      headers: {
        ...headers,
        // Default headers if necessary
      },
      data,
    };

    const response: AxiosResponse<T> = await axiosInstance(config);
    return response.data ?? null; // Handle null or undefined data
  } catch (error) {
    handleApiError(error); // Handle errors using the internal error handler
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      return null;
    }
  }
};
