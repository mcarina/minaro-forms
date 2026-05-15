import { api } from "@/app/services/api/Api";

interface LoginRequest {
  email: string;
  password: string;
}

export async function login(data: LoginRequest) {
  const response = await api.post("/auth/login", data);

  return response.data;
}