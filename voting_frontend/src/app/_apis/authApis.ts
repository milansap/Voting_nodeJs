/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseService } from "./interceptor";
import { LoginData, signupData } from "./types";


export async function login(data: LoginData): Promise<any> {
  const response = await baseService.post("login", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function signup(data: signupData): Promise<any> {
  const response = await baseService.post("signup", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}