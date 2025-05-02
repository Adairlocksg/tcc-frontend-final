import axios from "axios";
import { toast } from "sonner";

export interface ApiResponse<T> {
  success: boolean;
  content: T;
  message: string;
  statusCode: string;
}

export interface Id {
  id: string;
}

const baseUrl = "https://api-sharethebill-production.up.railway.app/api";

export const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use((config) => {
  const token =
    typeof document !== "undefined" ? getCookie("token_share_the_bill") : null;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}