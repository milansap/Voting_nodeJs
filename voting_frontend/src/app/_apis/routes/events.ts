import { authService } from "../interceptor";

export interface EventCandidate {
  id: string;
  name: string;
  party: string;
  age: number;
  image: string;
  position: string;
  voteCount: number;
  votesCount: number;
}

export interface EventRecord {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  candidates: EventCandidate[];
}

export async function getEvents(): Promise<EventRecord[]> {
  const response = await authService.get("events");
  return response.data;
}

export async function getEventById(eventId: string): Promise<EventRecord> {
  const response = await authService.get(`events/${eventId}`);
  return response.data;
}

export async function createEvent(data: {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  candidates: EventCandidate[];
}): Promise<EventRecord> {
  const response = await authService.post("events", data);
  return response.data;
}

export async function updateEvent(
  eventId: string,
  data: {
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    candidates?: EventCandidate[];
  },
): Promise<EventRecord> {
  const response = await authService.put(`events/${eventId}`, data);
  return response.data;
}

export async function deleteEvent(eventId: string): Promise<void> {
  await authService.delete(`events/${eventId}`);
}
