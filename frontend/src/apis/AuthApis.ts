import { authService } from "./Intercepter";

export interface LoginFormValues {
  citizanship_no: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  age: number;
  email: string;
  mobile_number: string;
  address: string;
  citizenship_no: string;
  password: string;
  confirmPassword: string;
}

console.log(authService);

export async function login(data: LoginFormValues) {
  const response = await authService.post("login", data, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
}

export async function register(data: RegisterFormValues) {
  const response = await authService.post("signup", data, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
}
    