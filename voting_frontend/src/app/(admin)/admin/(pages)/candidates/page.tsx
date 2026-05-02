/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Users,
  CheckCircle2,
  Trash2,
  UserCircle2,
  ImagePlus,
  type LucideIcon,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from "@/app/_apis/routes/candidates";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Candidate {
  id: string;
  name: string;
  party: string;
  age: number;
  image: string;
  position: string;
  voteCount: number;
  votesCount: number;
}

export interface CreateCandidatePayload {
  name: string;
  party: string;
  age: number;
  image: string;
  position: string;
}

interface CandidateForm {
  name: string;
  party: string;
  age: string;
  image: string;
  position: string;
}

type FormErrors = Partial<Record<keyof CandidateForm, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_FORM: CandidateForm = {
  name: "",
  party: "",
  age: "",
  image: "",
  position: "",
};

// ─── Sub-component Prop Types ─────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

interface AddCandidateDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (payload: CreateCandidatePayload) => void;
  editingCandidate?: Candidate | null;
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

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

// ─── Avatar ───────────────────────────────────────────────────────────────────

function CandidateAvatar({ image, name }: { image: string; name: string }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-8 h-8 rounded-full object-cover border border-emerald-300 dark:border-emerald-700/40"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700/40 flex items-center justify-center">
      <UserCircle2 size={16} className="text-emerald-600 dark:text-emerald-500" />
    </div>
  );
}

// ─── Add / Edit Candidate Dialog ──────────────────────────────────────────────

function AddCandidateDialog({
  open,
  onClose,
  onAdd,
  editingCandidate,
}: AddCandidateDialogProps) {
  const initialForm: CandidateForm = editingCandidate
    ? {
        name: editingCandidate.name,
        party: editingCandidate.party,
        age: String(editingCandidate.age),
        image: editingCandidate.image,
        position: editingCandidate.position,
      }
    : DEFAULT_FORM;

  const [form, setForm] = useState<CandidateForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      set("image", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const set = <K extends keyof CandidateForm>(
    key: K,
    value: CandidateForm[K],
  ): void => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.party.trim()) errs.party = "Party is required";
    if (!form.position.trim()) errs.position = "Position is required";
    if (!form.age) {
      errs.age = "Age is required";
    } else if (isNaN(Number(form.age)) || Number(form.age) < 18) {
      errs.age = "Age must be 18 or older";
    }
    // Image is required only for new candidates (create), not for updates
    if (!editingCandidate && !form.image) {
      errs.image = "Photo is required";
    }
    return errs;
  };

  const handleSubmit = (): void => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onAdd({
      name: form.name,
      party: form.party,
      age: Number(form.age),
      image: form.image,
      position: form.position,
    });
    setForm(DEFAULT_FORM);
    onClose();
  };

  const handleClose = (): void => {
    setForm(DEFAULT_FORM);
    setErrors({});
    onClose();
  };

  const inputClass =
    "bg-gray-50 dark:bg-[#022c22]/70 border-gray-300 dark:border-emerald-700/30 text-gray-900 dark:text-emerald-100 placeholder:text-gray-400 dark:placeholder:text-emerald-700 focus:border-emerald-500 focus:ring-emerald-500/20";

  const labelClass =
    "text-emerald-700 dark:text-emerald-400/80 text-xs font-semibold uppercase tracking-wider";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-white dark:bg-slate-950 border border-gray-200 dark:border-emerald-700/30 text-gray-900 dark:text-emerald-50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-emerald-700 dark:text-emerald-300 text-lg font-bold tracking-tight">
            {editingCandidate ? "Edit Candidate" : "Add New Candidate"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label className={labelClass}>
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g. Jane Doe"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputClass}
            />
            {errors.name && (
              <p className="text-red-500 dark:text-red-400 text-xs">{errors.name}</p>
            )}
          </div>

          {/* Party */}
          <div className="space-y-1.5">
            <Label className={labelClass}>
              Party <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g. Democratic Party"
              value={form.party}
              onChange={(e) => set("party", e.target.value)}
              className={inputClass}
            />
            {errors.party && (
              <p className="text-red-500 dark:text-red-400 text-xs">{errors.party}</p>
            )}
          </div>

          {/* Position & Age in a row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className={labelClass}>
                Position <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. President"
                value={form.position}
                onChange={(e) => set("position", e.target.value)}
                className={inputClass}
              />
              {errors.position && (
                <p className="text-red-500 dark:text-red-400 text-xs">{errors.position}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className={labelClass}>
                Age <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="e.g. 45"
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
                className={inputClass}
                min={18}
              />
              {errors.age && (
                <p className="text-red-500 dark:text-red-400 text-xs">{errors.age}</p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <Label className={labelClass}>
              <span className="flex items-center gap-1.5">
                <ImagePlus size={12} />
                Profile Photo {!editingCandidate && <span className="text-red-500">*</span>}
              </span>
            </Label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            {form.image ? (
              /* Preview state */
              <div className="flex items-center gap-4 p-3 rounded-lg border border-emerald-300 dark:border-emerald-700/30 bg-gray-50 dark:bg-[#022c22]/70">
                <img
                  src={form.image}
                  alt="preview"
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 dark:border-emerald-600 shadow-md"
                />
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 truncate">
                    Photo uploaded
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 underline underline-offset-2 transition-colors"
                    >
                      Change
                    </button>
                    <span className="text-[11px] text-emerald-700/40 dark:text-emerald-600">·</span>
                    <button
                      type="button"
                      onClick={() => {
                        set("image", "");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-[11px] text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline underline-offset-2 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Drop zone state */
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (!file) return;
                  if (!file.type.startsWith("image/")) {
                    toast.error("Please drop a valid image file");
                    return;
                  }
                  if (file.size > 5 * 1024 * 1024) {
                    toast.error("Image must be smaller than 5MB");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () => set("image", reader.result as string);
                  reader.readAsDataURL(file);
                }}
                className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-lg border-2 border-dashed border-emerald-300 dark:border-emerald-700/40 bg-gray-50 dark:bg-[#022c22]/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors">
                  <ImagePlus size={18} className="text-emerald-600 dark:text-emerald-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    Click to upload
                    <span className="text-emerald-500 dark:text-emerald-600"> or drag & drop</span>
                  </p>
                  <p className="text-[11px] text-emerald-600/60 dark:text-emerald-700 mt-0.5">
                    PNG, JPG, WEBP — max 5 MB
                  </p>
                </div>
              </button>
            )}
            {errors.image && (
              <p className="text-red-500 dark:text-red-400 text-xs">{errors.image}</p>
            )}
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
            className="bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white font-semibold"
          >
            {editingCandidate ? "Update Candidate" : "Create Candidate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Stats helper ─────────────────────────────────────────────────────────────

interface CandidateStats {
  total: number;
  totalVotes: number;
  parties: number;
  topVotes: number;
}

function computeStats(candidates: Candidate[]): CandidateStats {
  const totalVotes = candidates.reduce(
    (sum, c) => sum + (c.voteCount ?? c.votesCount ?? 0),
    0,
  );
  const parties = new Set(candidates.map((c) => c.party)).size;
  const topVotes = candidates.reduce(
    (max, c) => Math.max(max, c.voteCount ?? c.votesCount ?? 0),
    0,
  );
  return { total: candidates.length, totalVotes, parties, topVotes };
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminCandidatePage() {
  const queryClient = useQueryClient();

  const { data: candidates, isLoading } = useQuery<Candidate[]>({
    queryKey: ["candidates"],
    queryFn: getCandidates,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<string | null>(null);

  // Create
  const createMutation = useMutation({
    mutationFn: (payload: CreateCandidatePayload) => createCandidate(payload),
    onSuccess: () => {
      toast.success("Candidate created successfully!");
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create candidate");
    },
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CreateCandidatePayload;
    }) => updateCandidate(id, payload),
    onSuccess: () => {
      toast.success("Candidate updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      setDialogOpen(false);
      setEditingCandidate(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update candidate");
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCandidate(id),
    onSuccess: () => {
      toast.success("Candidate deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete candidate");
    },
  });

  const handleAdd = (payload: CreateCandidatePayload): void => {
    if (editingCandidate) {
      updateMutation.mutate({ id: editingCandidate.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (candidate: Candidate): void => {
    setEditingCandidate(candidate);
    setDialogOpen(true);
  };

  const handleDelete = (id: string): void => {
    setCandidateToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = (): void => {
    if (candidateToDelete) {
      deleteMutation.mutate(candidateToDelete);
      setDeleteConfirmOpen(false);
      setCandidateToDelete(null);
    }
  };

  const stats = computeStats(candidates ?? []);

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-[#022c22] dark:via-[#065F46] dark:to-[#022c22] p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900 dark:text-emerald-300 tracking-tight">
            Candidate Management
          </h1>
          <p className="text-emerald-700 dark:text-emerald-600 text-sm mt-1">
            Manage and monitor all registered candidates
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCandidate(null);
            setDialogOpen(true);
          }}
          className="bg-emerald-600 cursor-pointer hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 shadow-lg shadow-emerald-900/50"
        >
          <Plus size={16} />
          Add Candidate
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Candidates"
          value={stats.total}
          icon={Users}
          color="text-emerald-900 dark:text-emerald-300"
        />
        <StatCard
          label="Total Votes"
          value={stats.totalVotes}
          icon={CheckCircle2}
          color="text-emerald-900 dark:text-emerald-400"
        />
        <StatCard
          label="Parties"
          value={stats.parties}
          icon={UserCircle2}
          color="text-blue-900 dark:text-blue-400"
        />
        <StatCard
          label="Top Votes"
          value={stats.topVotes}
          icon={CheckCircle2}
          color="text-gray-900 dark:text-gray-400"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/20 dark:backdrop-blur overflow-hidden">
        <div className="px-5 py-4 border-b border-emerald-200 dark:border-emerald-800/30 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-emerald-900 dark:text-emerald-300">
            All Candidates
          </h2>
          <span className="text-xs text-emerald-700 dark:text-emerald-600">
            {candidates?.length ?? 0} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-emerald-200 dark:border-emerald-800/30 hover:bg-transparent">
                {(
                  [
                    "Avatar",
                    "Name",
                    "Party",
                    "Position",
                    "Age",
                    "Votes",
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
                      <span className="text-sm">Loading candidates...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : candidates?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-emerald-600 dark:text-emerald-600 text-sm"
                  >
                    No candidates found. Click &quot;Add Candidate&quot; to get started.
                  </TableCell>
                </TableRow>
              ) : (
                candidates?.map((candidate) => (
                  <TableRow
                    key={candidate.id}
                    className="border-emerald-200 dark:border-emerald-800/20 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    {/* Avatar */}
                    <TableCell>
                      <CandidateAvatar image={candidate.image} name={candidate.name} />
                    </TableCell>

                    {/* Name */}
                    <TableCell className="font-semibold text-emerald-900 dark:text-emerald-200 whitespace-nowrap">
                      {candidate.name}
                    </TableCell>

                    {/* Party */}
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700/30 text-emerald-900 dark:text-emerald-300">
                        {candidate.party}
                      </span>
                    </TableCell>

                    {/* Position */}
                    <TableCell className="text-emerald-700 dark:text-emerald-400 text-sm">
                      {candidate.position}
                    </TableCell>

                    {/* Age */}
                    <TableCell className="text-emerald-800 dark:text-emerald-300 text-sm">
                      {candidate.age}
                    </TableCell>

                    {/* Votes */}
                    <TableCell className="text-emerald-800 dark:text-emerald-300 text-sm font-mono">
                      {(candidate.voteCount ?? candidate.votesCount ?? 0).toLocaleString()}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(candidate)}
                          className="h-7 text-xs border-emerald-300 dark:border-emerald-700/40 text-emerald-700 dark:text-emerald-400 bg-transparent hover:bg-emerald-100 dark:hover:bg-emerald-800/30 hover:text-emerald-900 dark:hover:text-emerald-100"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(candidate.id)}
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

      {/* Add / Edit Dialog */}
      <AddCandidateDialog
        key={editingCandidate?.id ?? "new"}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingCandidate(null);
        }}
        onAdd={handleAdd}
        editingCandidate={editingCandidate}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-sm bg-white dark:bg-slate-950 border-gray-200 dark:border-red-700/30">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-red-400 text-lg">
              Delete Candidate
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete this candidate? This action cannot be undone.
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