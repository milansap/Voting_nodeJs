import { authService } from "./Intercepter";

export interface LoginFormValues {
  citizanship_no: string;
  password: string;
}

export async function login(data: LoginFormValues) {
  const response = await authService.post("login", data, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
}
    