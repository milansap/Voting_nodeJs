"use client";

import { useState } from "react";
import { getEventById, type EventRecord } from "@/app/_apis/routes/events";
import { castVote, checkEventVoteStatus } from "@/app/_apis/routes/vote";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Users,
  Vote,
  ShieldCheck,
  Zap,
  UserRound,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { VoteDialog } from "./components/VoteDialog";
import { toast } from "sonner";
import { getProfile } from "@/app/_apis/routes/user";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "TBD";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const getStatusConfig = (status: string) => {
  const normalized = status?.toLowerCase();

  if (normalized === "ongoing" || normalized === "active") {
    return {
      label: "Live",
      className:
        "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30",
    };
  }

  if (normalized === "upcoming") {
    return {
      label: "Upcoming",
      className:
        "bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30",
    };
  }

  if (normalized === "completed") {
    return {
      label: "Ended",
      className:
        "bg-gray-100 dark:bg-zinc-500/20 text-gray-700 dark:text-zinc-400 border border-gray-300 dark:border-zinc-500/30",
    };
  }

  return {
    label: status,
    className:
      "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-500/30",
  };
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<
    EventRecord["candidates"][0] | null
  >(null);
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const {
    data: event,
    isLoading,
    isError,
    error,
  } = useQuery<EventRecord, unknown>({
    queryKey: ["eventbyid", id],
    queryFn: () => getEventById(id),
    enabled: Boolean(id),
  });

  // Check if user has voted for THIS specific event
  const { data: voteStatusData, isLoading: isCheckingVoteStatus } = useQuery({
    queryKey: ["eventVoteStatus", id],
    queryFn: () => checkEventVoteStatus(id),
    enabled: Boolean(id),
  });

  const userVoteStatus = voteStatusData?.hasVoted;

  const castVoteMutation = useMutation({
    mutationFn: castVote,
    onSuccess: () => {
      toast.success("Your vote has been cast successfully!");
      setVoteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error);
      setVoteDialogOpen(false);
    },
  });

  const handleVoteNowClick = (candidate: EventRecord["candidates"][0]) => {
    setSelectedCandidate(candidate);
    setVoteDialogOpen(true);
  };

  const handleVoteSubmit = async (candidateId: string) => {
    try {
      await castVoteMutation.mutateAsync({ candidateId, eventId: id });
    } catch (error) {
      throw error;
    }
  };

  const errorMessage =
    typeof error === "string" ? error : "Unable to load event details.";

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-emerald-200 dark:border-emerald-600/30 border-t-emerald-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <p className="text-zinc-500 text-xs tracking-widest uppercase font-mono">
            Loading event details
          </p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (isError || !event) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:opacity-80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to events
          </Link>
          <Card className="border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-300 text-xl">
                Event not available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-600 dark:text-red-200">
                {errorMessage}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(event.status);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-linear-to-br from-white via-emerald-50/40 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* ── Top nav ── */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-2 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
            >
              <Link href="/events">
                <ArrowLeft className="h-4 w-4" />
                Back to events
              </Link>
            </Button>
            <Badge className={statusConfig.className}>
              {statusConfig.label}
            </Badge>
          </div>

          {/* ── Hero card ── */}
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/80 shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white leading-tight">
                {event.title}
              </h1>
              <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-3xl leading-relaxed">
                {event.description}
              </p>

              <Separator className="my-6 dark:bg-zinc-800" />

              {/* ── Stats row ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: "Starts",
                    value: formatDate(event.startDate),
                    icon: <CalendarDays className="h-4 w-4 text-emerald-500" />,
                  },
                  {
                    label: "Ends",
                    value: formatDate(event.endDate),
                    icon: <Clock3 className="h-4 w-4 text-emerald-500" />,
                  },
                  {
                    label: "Candidates",
                    value: `${event.candidates.length} registered`,
                    icon: <Users className="h-4 w-4 text-emerald-500" />,
                  },
                ].map(({ label, value, icon }) => (
                  <Card
                    key={label}
                    className="border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded-xl"
                  >
                    <CardContent className="p-4">
                      <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                        {icon}
                        {value}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ── Candidate list ── */}
          <section>
            <div className="mb-5 flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <h2 className="text-xl font-semibold">Candidate List</h2>
            </div>

            {event.candidates.length === 0 ? (
              <Card className="border-dashed border-zinc-300 dark:border-zinc-700 bg-transparent rounded-2xl">
                <CardContent className="p-10 text-center text-sm text-zinc-500">
                  No candidates are assigned to this event yet.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {event.candidates.map((candidate, idx) => {
                  const accentColors = [
                    {
                      bg: "from-emerald-400 to-teal-500",
                      text: "text-emerald-600 dark:text-emerald-400",
                      badge:
                        "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
                      glow: "group-hover:shadow-emerald-200/60 dark:group-hover:shadow-emerald-900/60",
                    },
                    {
                      bg: "from-sky-400 to-blue-500",
                      text: "text-sky-600 dark:text-sky-400",
                      badge:
                        "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800",
                      glow: "group-hover:shadow-sky-200/60 dark:group-hover:shadow-sky-900/60",
                    },
                    {
                      bg: "from-violet-400 to-purple-500",
                      text: "text-violet-600 dark:text-violet-400",
                      badge:
                        "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800",
                      glow: "group-hover:shadow-violet-200/60 dark:group-hover:shadow-violet-900/60",
                    },
                  ];
                  const accent = accentColors[idx % accentColors.length];

                  return (
                    <div
                      key={candidate.id}
                      className={`group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${accent.glow}`}
                    >
                      {/* Top accent bar */}
                      <div
                        className={`h-1 w-full bg-linear-to-r ${accent.bg}`}
                      />

                      {/* Background image wash on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-cover bg-center pointer-events-none"
                        style={{ backgroundImage: `url(${candidate.image})` }}
                      />

                      <div className="relative p-5">
                        {/* ── Photo + name row ── */}
                        <div className="flex gap-4 items-start">
                          {/* Large portrait */}
                          <div className="relative shrink-0">
                            <div
                              className={`absolute inset-0 rounded-xl bg-linear-to-br ${accent.bg} opacity-20 group-hover:opacity-40 transition-opacity duration-300 scale-110`}
                            />
                            <Avatar className="h-16 w-16 rounded-xl ring-2 ring-white dark:ring-zinc-800 relative z-10">
                              <AvatarImage
                                src={candidate.image}
                                alt={candidate.name}
                                className="object-cover rounded-xl"
                              />
                              <AvatarFallback
                                className={`rounded-xl bg-linear-to-br ${accent.bg} text-white font-bold text-lg`}
                              >
                                {getInitials(candidate.name)}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="flex-1 min-w-0 pt-0.5">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-tight truncate">
                              {candidate.name}
                            </h3>
                            <p
                              className={`text-xs font-semibold uppercase tracking-widest mt-0.5 ${accent.text}`}
                            >
                              {candidate.party}
                            </p>

                            {/* Position pill */}
                            <Badge
                              variant="outline"
                              className={`mt-2 text-[11px] px-2 py-0.5 font-medium ${accent.badge}`}
                            >
                              <Briefcase className="h-3 w-3 mr-1" />
                              {candidate.position}
                            </Badge>
                          </div>
                        </div>

                        {/* ── Divider with age chip ── */}
                        <div className="mt-4 flex items-center gap-3">
                          <Separator className="flex-1 dark:bg-zinc-800" />
                          <span className="flex items-center gap-1 text-[11px] text-zinc-400 shrink-0">
                            <UserRound className="h-3 w-3" />
                            Age {candidate.age}
                          </span>
                          <Separator className="flex-1 dark:bg-zinc-800" />
                        </div>

                        {/* ── Vote count block ── */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="mt-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/40 p-3 flex items-center justify-between cursor-default group-hover:border-solid transition-all duration-300">
                              <span className="flex items-center gap-2 text-xs text-zinc-500 font-medium uppercase tracking-wider">
                                <Vote className="h-3.5 w-3.5" />
                                Total Votes
                              </span>
                              <span
                                className={`text-xl font-black tabular-nums ${accent.text}`}
                              >
                                {candidate.votesCount.toLocaleString()}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Votes cast for {candidate.name}</p>
                          </TooltipContent>
                        </Tooltip>
                        <div className="mt-4 flex  gap-3">
                          <Button
                            variant="link"
                            className="mt-5 w-1/2 cursor-pointer text-emerald-600 hover:text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
                          >
                            View Details
                          </Button>
                          <Button
                            onClick={() => handleVoteNowClick(candidate)}
                            disabled={userVoteStatus}
                            className="mt-5 w-1/2 cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
                          >
                            {userVoteStatus
                              ? "Already Voted"
                              : event?.status === "upcoming"
                                ? "Voting not started"
                                : event?.status === "completed"
                                  ? "Voting ended"
                                  : "Vote Now"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── Footer CTA ── */}
          <div>
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Link href="/events">
                <ArrowLeft className="h-4 w-4" />
                Browse more events
              </Link>
            </Button>
          </div>
        </div>

        {/* Vote Dialog */}
        <VoteDialog
          isOpen={voteDialogOpen}
          onClose={() => setVoteDialogOpen(false)}
          candidate={selectedCandidate}
          hasVoted={userVoteStatus}
          onVoteSubmit={handleVoteSubmit}
        />
      </div>
    </TooltipProvider>
  );
}
