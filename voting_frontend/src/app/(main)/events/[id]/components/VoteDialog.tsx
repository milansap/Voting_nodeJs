"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  UserRound,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface CandidateDetails {
  id: string;
  name: string;
  party: string;
  position: string;
  age: number;
  image: string;
  votesCount: number;
}

interface VoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateDetails | null;
  hasVoted: boolean;
  onVoteSubmit: (candidateId: string) => Promise<void>;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export function VoteDialog({
  isOpen,
  onClose,
  candidate,
  hasVoted,
  onVoteSubmit,
}: VoteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!candidate) return null;

  const handleVote = async () => {
    setIsSubmitting(true);
    try {
      await onVoteSubmit(candidate?.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md gap-0 overflow-hidden rounded-2xl border-zinc-200 dark:border-zinc-800">
        {/* Header with accent color */}
        <div className="bg-linear-to-r from-emerald-400 to-teal-500 h-1 w-full" />

        <DialogHeader className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              {/* Candidate avatar */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 opacity-20 scale-110" />
                <Avatar className="h-20 w-20 rounded-xl ring-2 ring-white dark:ring-zinc-800 relative z-10">
                  <AvatarImage
                    src={candidate.image}
                    alt={candidate.name}
                    className="object-cover rounded-xl"
                  />
                  <AvatarFallback className="rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 text-white font-bold text-lg">
                    {getInitials(candidate.name)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Candidate info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white truncate">
                  {candidate.name}
                </h2>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mt-1">
                  {candidate.party}
                </p>
              </div>
            </div>

            <DialogTitle className="sr-only">
              Vote for {candidate.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Confirm your vote for this candidate
            </DialogDescription>
          </div>
        </DialogHeader>

        <Separator className="my-2 dark:bg-zinc-800" />

        {/* Candidate Details */}
        <div className="px-6 py-4 space-y-3">
          {/* Position */}
          <div className="flex items-center gap-3">
            <Briefcase className="h-4 w-4 text-zinc-400" />
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Position
              </p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                {candidate.position}
              </p>
            </div>
          </div>

          {/* Age */}
          <div className="flex items-center gap-3">
            <UserRound className="h-4 w-4 text-zinc-400" />
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Age
              </p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                {candidate.age} years
              </p>
            </div>
          </div>

          {/* Current votes */}
          <div className="flex items-center gap-3">
            <AlertCircle className="h-4 w-4 text-zinc-400" />
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Current Votes
              </p>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {candidate.votesCount.toLocaleString()} votes
              </p>
            </div>
          </div>
        </div>

        <Separator className="dark:bg-zinc-800" />

        {/* Status/Warning for already voted */}
        {hasVoted && (
          <div className="px-6 py-4 bg-amber-50 dark:bg-amber-500/10 border-t border-amber-200 dark:border-amber-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                  Already Voted
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                  You have already cast your vote in this event. Each voter can
                  only vote once.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <DialogFooter className="gap-3 px-6 py-4 flex-row">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          {hasVoted ? (
            <Button disabled className="flex-1 bg-emerald-600 text-white">
              <Check className="h-4 w-4 mr-2" />
              Vote Cast
            </Button>
          ) : (
            <Button
              onClick={handleVote}
              disabled={isSubmitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Voting...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Confirm Vote
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
