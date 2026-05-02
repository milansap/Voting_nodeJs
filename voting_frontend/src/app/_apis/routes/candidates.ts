/* eslint-disable @typescript-eslint/no-explicit-any */
import { authService } from "../interceptor";

interface Candidate {
  id: string;
  name: string;
  party: string;
  age: number;
  image: string;
  position: string;
  voteCount: number;
}

export async function getCandidates(): Promise<any> {
  const response = await authService.get("candidates");
  return response.data;
}

export async function createCandidate(payload: any): Promise<any> {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("party", payload.party);
  formData.append("age", payload.age);
  formData.append("position", payload.position);

  // Convert base64 image to File if it's a new image
  if (payload.image && payload.image.startsWith("data:")) {
    const blob = await fetch(payload.image).then((res) => res.blob());
    formData.append("image", blob, "candidate-image.png");
  }

  const response = await authService.post("candidates", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function updateCandidate(
  candidateId: string,
  payload: any,
): Promise<any> {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("party", payload.party);
  formData.append("age", payload.age);
  formData.append("position", payload.position);

  // Only append image if it's a new base64 image (not an existing URL)
  if (payload.image && payload.image.startsWith("data:")) {
    const blob = await fetch(payload.image).then((res) => res.blob());
    formData.append("image", blob, "candidate-image.png");
  }

  const response = await authService.put(`candidates/${candidateId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function deleteCandidate(candidateId: string): Promise<any> {
  const response = await authService.delete(`candidates/${candidateId}`);
  return response.data;
}
