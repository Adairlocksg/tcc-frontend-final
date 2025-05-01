import { api, ApiResponse } from "./api";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
}

export interface UserDto {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
}

export interface LoginDto {
  userName: string;
  password: string;
}

export async function login(dto: LoginDto): Promise<string> {
  const { data } = await api.post<ApiResponse<string>>("users/login", dto);
  return data.content;
}

export async function register(dto: UserDto): Promise<User> {
  const { data } = await api.post<ApiResponse<User>>("users/register", dto);
  return data.content;
}
