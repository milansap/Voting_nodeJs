/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  CalendarDays,
  Users,
  CheckCircle2,
  Clock,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/app/_apis/routes/events";
import { toast } from "sonner";
import { getCandidates } from "@/app/_apis/routes/candidates";

export type EventStatus = "ongoing" | "upcoming" | "completed" | "cancelled";

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

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  candidates: EventCandidate[];
}

export interface CreateEventPayload {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: EventStatus;
  candidates: string[];
}

/** A candidate that can be assigned to an event */
export interface Candidate {
  id: string;
  name: string;
}

// ─── Form Types ───────────────────────────────────────────────────────────────

/** Internal form state for the Add Event dialog */
interface EventForm {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: EventStatus;
  candidates: string[];
}

/** Validation error map keyed by EventForm field names */
type FormErrors = Partial<Record<keyof EventForm, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: EventStatus[] = [
  "ongoing",
  "upcoming",
  "completed",
  "cancelled",
];

const DEFAULT_FORM: EventForm = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  status: "ongoing",
  candidates: [],
};

// ─── Style Maps ───────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<EventStatus, string> = {
  ongoing:
    "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30",
  upcoming:
    "bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30",
  completed:
    "bg-gray-500/10 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-500/30",
  cancelled:
    "bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30",
};

const DOT_STYLES: Record<EventStatus, string> = {
  ongoing: "bg-emerald-600 dark:bg-emerald-400",
  upcoming: "bg-blue-600    dark:bg-blue-400",
  completed: "bg-gray-600    dark:bg-gray-400",
  cancelled: "bg-red-600     dark:bg-red-400",
};

// ─── Sub-component Prop Types ─────────────────────────────────────────────────

interface StatusBadgeProps {
  status: string;
}

interface CandidatePillsProps {
  ids: string[];
}

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

interface AddEventDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (payload: CreateEventPayload) => void;
  editingEvent?: Event | null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = STATUS_OPTIONS.includes(status as EventStatus)
    ? (status as EventStatus)
    : "upcoming";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[normalizedStatus]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${DOT_STYLES[normalizedStatus]}`}
      />
      {normalizedStatus}
    </span>
  );
}

function CandidatePills({ ids }: CandidatePillsProps) {
  const { data: candidates } = useQuery<Candidate[]>({
    queryKey: ["candidates"],
    queryFn: getCandidates,
  });
  return (
    <div className="flex flex-wrap gap-1">
      {ids.map((id) => {
        const candidate = candidates?.find((c) => c.id === id);
        return (
          <span
            key={id}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium
                       bg-emerald-100 dark:bg-emerald-900/40
                       border border-emerald-300 dark:border-emerald-700/30
                       text-emerald-900 dark:text-emerald-300"
          >
            {candidate ? candidate.name : String(id).slice(-6)}
          </span>
        );
      })}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/30 p-4 backdrop-blur">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400/70">
          {label}
        </p>
        <Icon size={15} className="text-emerald-600 dark:text-emerald-600" />
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

// ─── Add Event Dialog ─────────────────────────────────────────────────────────

function AddEventDialog({
  open,
  onClose,
  onAdd,
  editingEvent,
}: AddEventDialogProps) {
  const { data: candidates = [] } = useQuery<Candidate[]>({
    queryKey: ["candidates"],
    queryFn: getCandidates,
  });
  const initialForm: EventForm = editingEvent
    ? {
        title: editingEvent.title,
        description: editingEvent.description,
        startDate: editingEvent.startDate,
        endDate: editingEvent.endDate,
        status: STATUS_OPTIONS.includes(editingEvent.status as EventStatus)
          ? (editingEvent.status as EventStatus)
          : "upcoming",
        candidates: editingEvent.candidates.map((candidate) => candidate.id),
      }
    : DEFAULT_FORM;

  const [form, setForm] = useState<EventForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const set = <K extends keyof EventForm>(
    key: K,
    value: EventForm[K],
  ): void => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleCandidate = (id: string): void => {
    set(
      "candidates",
      form.candidates.includes(id)
        ? form.candidates.filter((c) => c !== id)
        : [...form.candidates, id],
    );
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.startDate) errs.startDate = "Required";
    if (!form.endDate) errs.endDate = "Required";
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      errs.endDate = "End date must be after start date";
    return errs;
  };

  const handleSubmit = (): void => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const payload: CreateEventPayload = {
      title: form.title,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status,
      candidates: form.candidates,
    };
    onAdd(payload);
    setForm(DEFAULT_FORM);
    onClose();
  };

  const handleClose = (): void => {
    setForm(DEFAULT_FORM);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-white dark:bg-slate-950 border border-gray-200 dark:border-emerald-700/30 text-gray-900 dark:text-emerald-50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-emerald-700 dark:text-emerald-300 text-lg font-bold tracking-tight">
            {editingEvent ? "Edit Event" : "Add New Event"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-emerald-700 dark:text-emerald-400/80 text-xs font-semibold uppercase tracking-wider">
              Event Title <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g. Annual Tech Summit"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="bg-gray-50 dark:bg-[#022c22]/70 border-gray-300 dark:border-emerald-700/30 text-gray-900 dark:text-emerald-100 placeholder:text-gray-400 dark:placeholder:text-emerald-700 focus:border-emerald-500 focus:ring-emerald-500/20"
            />
            {errors.title && (
              <p className="text-red-500 dark:text-red-400 text-xs">
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-emerald-700 dark:text-emerald-400/80 text-xs font-semibold uppercase tracking-wider">
              Description
            </Label>
            <Textarea
              placeholder="Event description..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className="bg-gray-50 dark:bg-[#022c22]/70 border-gray-300 dark:border-emerald-700/30 text-gray-900 dark:text-emerald-100 placeholder:text-gray-400 dark:placeholder:text-emerald-700 focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-emerald-700 dark:text-emerald-400/80 text-xs font-semibold uppercase tracking-wider">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className="bg-gray-50 dark:bg-[#022c22]/70 border-gray-300 dark:border-emerald-700/30 text-gray-900 dark:text-emerald-100 focus:border-emerald-500 [color-scheme:light] dark:[color-scheme:dark]"
              />
              {errors.startDate && (
                <p className="text-red-500 dark:text-red-400 text-xs">
                  {errors.startDate}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-emerald-700 dark:text-emerald-400/80 text-xs font-semibold uppercase tracking-wider">
                End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                className="bg-gray-50 dark:bg-[#022c22]/70 border-gray-300 dark:border-emerald-700/30 text-gray-900 dark:text-emerald-100 focus:border-emerald-500 [color-scheme:light] dark:[color-scheme:dark]"
              />
              {errors.endDate && (
                <p className="text-red-500 dark:text-red-400 text-xs">
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-emerald-700 dark:text-emerald-400/80 text-xs font-semibold uppercase tracking-wider">
              Status
            </Label>
            <Select
              value={form.status}
              onValueChange={(v) => set("status", v as EventStatus)}
            >
              <SelectTrigger className="bg-gray-50 dark:bg-[#022c22]/70 border-gray-300 dark:border-emerald-700/30 text-gray-900 dark:text-emerald-100 focus:ring-emerald-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#033d2b] border-gray-200 dark:border-emerald-700/40 text-gray-900 dark:text-emerald-100">
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                    className="capitalize focus:bg-emerald-100 dark:focus:bg-emerald-800/40 focus:text-gray-900 dark:focus:text-emerald-100"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${DOT_STYLES[s]}`}
                      />
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Candidates */}
          <div className="space-y-1.5">
            <Label className="text-emerald-700 dark:text-emerald-400/80 text-xs font-semibold uppercase tracking-wider">
              Candidates{" "}
              {form.candidates.length > 0 && (
                <span className="normal-case text-emerald-600 dark:text-emerald-500">
                  ({form.candidates.length} selected)
                </span>
              )}
            </Label>
            <ScrollArea className="h-[130px] rounded-lg border border-gray-300 dark:border-emerald-700/30 bg-gray-50 dark:bg-[#022c22]/70 p-2">
              <div className="flex flex-col gap-1">
                {candidates?.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-800/25 transition-colors"
                  >
                    <Checkbox
                      checked={form.candidates.includes(c.id)}
                      onCheckedChange={() => toggleCandidate(c.id)}
                      className="border-emerald-600 dark:border-emerald-600 data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-600 dark:data-[state=checked]:border-emerald-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900 dark:text-emerald-100 font-medium">
                        {c.name}
                      </span>
                      <span className="text-[10px] font-mono text-gray-600 dark:text-emerald-600">
                        {c.id}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-gray-300 dark:border-emerald-700/40 text-emerald-700 dark:text-emerald-300 bg-transparent hover:bg-emerald-100 dark:hover:bg-emerald-800/30 hover:text-emerald-900 dark:hover:text-emerald-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={false}
            className="bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingEvent ? "Update Event" : "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Stat computation helper ──────────────────────────────────────────────────

interface EventStats {
  total: number;
  ongoing: number;
  upcoming: number;
  completed: number;
}

function computeStats(events: Event[]): EventStats {
  return {
    total: events.length,
    ongoing: events.filter((e) => e.status === "ongoing").length,
    upcoming: events.filter((e) => e.status === "upcoming").length,
    completed: events.filter((e) => e.status === "completed").length,
  };
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminEventPage() {
  const queryClient = useQueryClient();
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  // Create Event Mutation
  const createMutation = useMutation({
    mutationFn: (payload: CreateEventPayload) =>
      createEvent({
        title: payload.title,
        description: payload.description,
        startDate: payload.startDate,
        endDate: payload.endDate,
        status: payload.status,
        candidates: payload.candidates as any,
      }),
    onSuccess: () => {
      toast.success("Event created successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create event");
    },
  });

  // Update Event Mutation
  const updateMutation = useMutation({
    mutationFn: ({
      eventId,
      payload,
    }: {
      eventId: string;
      payload: CreateEventPayload;
    }) =>
      updateEvent(eventId, {
        title: payload.title,
        description: payload.description,
        startDate: payload.startDate,
        endDate: payload.endDate,
        status: payload.status,
        candidates: payload.candidates as any,
      }),
    onSuccess: () => {
      toast.success("Event updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setDialogOpen(false);
      setEditingEvent(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update event");
    },
  });

  // Delete Event Mutation
  const deleteMutation = useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),
    onSuccess: () => {
      toast.success("Event deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete event");
    },
  });

  const handleAdd = async (payload: CreateEventPayload): Promise<void> => {
    if (editingEvent) {
      updateMutation.mutate({ eventId: editingEvent.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (eventId: string): void => {
    setEventToDelete(eventId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = (): void => {
    if (eventToDelete) {
      deleteMutation.mutate(eventToDelete);
      setDeleteConfirmOpen(false);
      setEventToDelete(null);
    }
  };

  const handleEdit = (event: Event): void => {
    setEditingEvent(event);
    setDialogOpen(true);
  };

  const stats = computeStats(events ?? []);

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-[#022c22] dark:via-[#065F46] dark:to-[#022c22] p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900 dark:text-emerald-300 tracking-tight">
            Event Management
          </h1>
          <p className="text-emerald-700 dark:text-emerald-600 text-sm mt-1">
            Manage and monitor all platform events
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingEvent(null);
            setDialogOpen(true);
          }}
          className="bg-emerald-600 cursor-pointer hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 shadow-lg shadow-emerald-900/50"
        >
          <Plus size={16} />
          Add Event
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Events"
          value={stats.total}
          icon={CalendarDays}
          color="text-emerald-900 dark:text-emerald-300"
        />
        <StatCard
          label="Ongoing"
          value={stats.ongoing}
          icon={Clock}
          color="text-emerald-900 dark:text-emerald-400"
        />
        <StatCard
          label="Upcoming"
          value={stats.upcoming}
          icon={Users}
          color="text-blue-900   dark:text-blue-400"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          color="text-gray-900   dark:text-gray-400"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/20 dark:backdrop-blur overflow-hidden">
        <div className="px-5 py-4 border-b border-emerald-200 dark:border-emerald-800/30 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-emerald-900 dark:text-emerald-300">
            All Events
          </h2>
          <span className="text-xs text-emerald-700 dark:text-emerald-600">
            {events?.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-emerald-200 dark:border-emerald-800/30 hover:bg-transparent">
                {(
                  [
                    "Title",
                    "Description",
                    "Start Date",
                    "End Date",
                    "Status",
                    "Candidates",
                    "Total Votes",
                    "Actions",
                  ] as const
                ).map((h) => (
                  <TableHead
                    key={h}
                    className="text-emerald-700 dark:text-emerald-500 text-[11px] font-semibold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/30 whitespace-nowrap"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-600">
                      <div className="w-4 h-4 border-2 border-emerald-300 dark:border-emerald-700 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin" />
                      <span className="text-sm">Loading events...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : events?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-emerald-600 dark:text-emerald-600 text-sm"
                  >
                    No events found. Click &quot;Add Event&quot; to get started.
                  </TableCell>
                </TableRow>
              ) : (
                events?.map((event: Event) => (
                  <TableRow
                    key={event.id}
                    className="border-emerald-200 dark:border-emerald-800/20 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    <TableCell className="font-semibold text-emerald-900 dark:text-emerald-200 whitespace-nowrap">
                      {event.title}
                    </TableCell>
                    <TableCell className="text-emerald-700 dark:text-emerald-500 text-sm max-w-[180px] truncate">
                      {event.description}
                    </TableCell>
                    <TableCell className="text-emerald-800 dark:text-emerald-300 text-sm whitespace-nowrap">
                      {event.startDate}
                    </TableCell>
                    <TableCell className="text-emerald-800 dark:text-emerald-300 text-sm whitespace-nowrap">
                      {event.endDate}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={event.status} />
                    </TableCell>
                    <TableCell>
                      <CandidatePills
                        ids={event.candidates.map((c) => c?.id)}
                      />
                    </TableCell>
                    <TableCell className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                      {event.candidates.reduce(
                        (sum, c) => sum + (c?.voteCount || 0),
                        0,
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(event)}
                          className="h-7 text-xs border-emerald-300 dark:border-emerald-700/40 text-emerald-700 dark:text-emerald-400 bg-transparent hover:bg-emerald-100 dark:hover:bg-emerald-800/30 hover:text-emerald-900 dark:hover:text-emerald-100"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(event.id)}
                          disabled={deleteMutation.isPending}
                          className="h-7 text-xs border-red-300 dark:border-red-700/40 text-red-700 dark:text-red-400 bg-transparent hover:bg-red-100 dark:hover:bg-red-800/30 hover:text-red-900 dark:hover:text-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog */}
      <AddEventDialog
        key={editingEvent?.id ?? "new"}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingEvent(null);
        }}
        onAdd={handleAdd}
        editingEvent={editingEvent}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-sm bg-white dark:bg-slate-950 border-gray-200 dark:border-red-700/30">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-red-400 text-lg">
              Delete Event
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete this event? This action cannot be
            undone.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
