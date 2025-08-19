import { authService } from "./Intercepter";

export async function login(data) {
  const response = await authService.post("login", data, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
}
    