import { authService } from "../interceptor";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface VotePayload {
  candidateId: string;
  eventId: string;
}

export async function castVote(payload: VotePayload): Promise<any> {
  const { candidateId, eventId } = payload;
  const response = await authService.post(`/candidates/vote/${candidateId}`, {
    eventId,
  });
  return response.data;
}

export async function checkUserVoteStatus(): Promise<any> {
  const response = await authService.get(`/vote/status`);
  return response.data;
}

export async function checkEventVoteStatus(eventId: string): Promise<any> {
  const response = await authService.get(`/vote/status/${eventId}`);
  return response.data;
}
