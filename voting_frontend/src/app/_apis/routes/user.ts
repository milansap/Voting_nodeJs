import { authService } from "../interceptor";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getProfile(): Promise<any> {
  const response = await authService.get("profile");
  return response.data;
}

export async function updateProfilePicture(data: any): Promise<any> {
  const id = data.get("id");
  const response = await authService.put(`profile/picture/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
