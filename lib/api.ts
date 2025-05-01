import axios from "axios";

export interface ApiResponse<T> {
  success: boolean;
  content: T;
  message: string;
  statusCode: string;
}

const baseUrl = "https://api-sharethebill-production.up.railway.app/api";

export const api = axios.create({
    baseURL: baseUrl
});