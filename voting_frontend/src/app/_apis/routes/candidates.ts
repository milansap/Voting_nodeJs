/* eslint-disable @typescript-eslint/no-explicit-any */
import { authService } from "../interceptor";

export async function getCandidates(): Promise<any> {
  const response = await authService.get("candidates");
  return response.data;
}