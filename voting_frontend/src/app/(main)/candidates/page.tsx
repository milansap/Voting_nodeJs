"use client";

import { getCandidates } from "@/app/_apis/routes/candidates";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

interface Candidate {
  id: string;
  name: string;
  party: string;
  image: string;
  position: string;
  voteCount: number;
  votes: Array<{ user: string; votedAt: string }>;
  votesCount: number;
}

interface CandidateCardProps {
  candidate: Candidate;
  isLeader: boolean;
  pct: number;
}

function CandidateCard({ candidate, isLeader, pct }: CandidateCardProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = "0%";
      setTimeout(() => {
        if (barRef.current) barRef.current.style.width = `${pct}%`;
      }, 150);
    }
  }, [pct]);

  return (
    <Card
      className={`relative overflow-hidden transition-transform hover:-translate-y-1 ${
        isLeader
          ? "border-2 border-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-900/40"
          : "border border-emerald-100 dark:border-zinc-800"
      } bg-white dark:bg-zinc-900`}
    >
      {isLeader && (
        <Badge className="absolute top-3 right-3 z-10 bg-emerald-500 text-white uppercase">
          Leading
        </Badge>
      )}

      {/* Image */}
      <div className="h-48 bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center overflow-hidden">
        <img
          src={candidate.image}
          alt={candidate.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
            const nextEl = (e.target as HTMLImageElement)
              .nextSibling as HTMLElement;
            if (nextEl) nextEl.style.display = "flex";
          }}
        />
        <div
          className="hidden w-20 h-20 rounded-full bg-emerald-200 dark:bg-emerald-900/60 items-center justify-center text-3xl font-serif text-emerald-800 dark:text-emerald-200"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {initials(candidate.name)}
        </div>
      </div>

      <CardContent className="p-5">
        {/* Name + Party */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-2xl text-gray-900 dark:text-white"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {candidate.name}
          </span>
          <Badge
            variant="outline"
            className="border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30"
          >
            {candidate.party}
          </Badge>
        </div>

        {/* Position */}
        <div className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-zinc-500 mb-4">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="#10b981" strokeWidth="1.5" />
            <circle cx="6" cy="6" r="2" fill="#10b981" />
          </svg>
          {candidate.position === "PM" ? "Prime Minister" : candidate.position}
        </div>

        <Separator className="mb-4 dark:bg-zinc-800" />

        {/* Votes */}
        <div className="mb-4">
          <p className="text-xs text-gray-400 dark:text-zinc-500 uppercase tracking-widest font-medium mb-1.5">
            Vote Count
          </p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-semibold text-emerald-800 dark:text-emerald-400 leading-none">
              {candidate.votesCount}
            </span>
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              {candidate.votesCount === 1 ? "vote" : "votes"} · {pct}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-emerald-100 dark:bg-emerald-950/50 overflow-hidden">
            <div
              ref={barRef}
              className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-700 ease-out"
              style={{ width: "0%" }}
            />
          </div>
        </div>

        {/* Voters */}
        <div className="border-t border-emerald-100 dark:border-zinc-800 pt-4">
          <p className="text-xs text-gray-400 dark:text-zinc-500 uppercase tracking-widest font-medium mb-2">
            Voters
          </p>
          {candidate.votes.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              {candidate.votes.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400"
                >
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {v.user.slice(-2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>Voter ···{v.user.slice(-4)}</span>
                  <span className="ml-auto text-xs text-gray-400 dark:text-zinc-500">
                    {formatTime(v.votedAt)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-zinc-500 italic">
              No votes cast yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CandidatePage() {
  const { data: candidates, isLoading } = useQuery({
    queryKey: ["candidates"],
    queryFn: getCandidates,
  });
  const total = candidates?.reduce(
    (s: number, c: Candidate) => s + c.votesCount,
    0,
  );
  const leader = candidates?.reduce((a: Candidate, b: Candidate) =>
    a.votesCount > b.votesCount ? a : b,
  );

  const pct = (c: Candidate) =>
    total === 0 ? 0 : Math.round((c.votesCount / total) * 100);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-emerald-200 dark:border-emerald-600/30 border-t-emerald-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <p className="text-zinc-600 dark:text-zinc-500 text-sm tracking-widest uppercase font-mono">
            Loading candidates
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
 
        .candidates-page { font-family: 'DM Sans', sans-serif; }
        .display-font { font-family: 'Syne', sans-serif; }
        .mono-font { font-family: 'DM Mono', monospace; }
 
        .card-glow {
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .card-glow:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 0 1px rgba(16,185,129,0.3), 0 20px 40px -12px rgba(5,150,105,0.25);
        }
 
        .header-line {
          background: linear-gradient(90deg, #10b981, #059669, transparent);
        }
 
        .grid-bg {
          background-image:
            linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
 
        .tag-number {
          font-variant-numeric: tabular-nums;
        }
 
        .divider-line {
          background: linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent);
        }
      `}</style>

      <div className="candidates-page min-h-screen bg-white dark:bg-zinc-950 grid-bg">
        {/* Ambient glow */}
        <div className="fixed top-0 right-0 w-150 h-100 bg-emerald-600/5 dark:bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-100 h-75 bg-emerald-800/8 dark:bg-emerald-800/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          {/* ── Header ── */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 header-line" />
              <span className="mono-font text-emerald-500 text-xs tracking-[0.2em] uppercase">
                Voting Platform
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="display-font text-5xl md:text-7xl font-800 text-gray-900 dark:text-white leading-[0.95] tracking-tight mb-4">
                  Candidates
                  <span className="text-emerald-500">.</span>
                </h1>
                <p className="text-gray-600 dark:text-zinc-400 text-lg max-w-md leading-relaxed">
                  Official candidate standings — results update in real time
                </p>
              </div>

              {candidates && candidates.length > 0 && (
                <div className="flex items-center gap-4 shrink-0">
                  <div className="border border-gray-200 dark:border-zinc-800 rounded-xl px-5 py-3 bg-gray-50 dark:bg-zinc-900/60">
                    <p className="mono-font text-xs text-gray-600 dark:text-zinc-500 uppercase tracking-widest mb-1">
                      Total
                    </p>
                    <p className="display-font text-3xl font-bold text-gray-900 dark:text-white tag-number">
                      {String(candidates.length).padStart(2, "0")}
                    </p>
                  </div>
                  <div className="border border-emerald-300 dark:border-emerald-800/50 rounded-xl px-5 py-3 bg-emerald-50 dark:bg-emerald-950/40">
                    <p className="mono-font text-xs text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-1">
                      Total Votes
                    </p>
                    <p className="display-font text-3xl font-bold text-emerald-600 dark:text-emerald-400 tag-number">
                      {String(total || 0).padStart(2, "0")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* divider */}
            <div className="mt-10 h-px divider-line" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { val: candidates?.length, key: "Candidates" },
              { val: total, key: "Total Votes" },
              { val: total && total > 0 ? leader?.name : "—", key: "Leading" },
            ].map((s) => (
              <div
                key={s.key}
                className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4 text-center"
              >
                <div className="text-2xl font-semibold text-emerald-800 dark:text-emerald-400">
                  {s.val}
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mt-1 font-medium">
                  {s.key}
                </div>
              </div>
            ))}
          </div>

          {/* Position Label */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Prime Minister Candidates
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {candidates?.map((c: Candidate) => (
              <CandidateCard
                key={c.id}
                candidate={c}
                isLeader={
                  total &&
                  total > 0 &&
                  c.votesCount === leader?.votesCount &&
                  c.votesCount > 0
                }
                pct={pct(c)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
