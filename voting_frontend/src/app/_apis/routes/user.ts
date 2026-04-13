import { authService } from "../interceptor";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getProfile(): Promise<any> {
  const response = await authService.get("profile");
  return response.data;
}
