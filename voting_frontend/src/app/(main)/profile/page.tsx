"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShieldCheck,
  Vote,
  CheckCircle2,
  Clock,
  Lock,
  Star,
  TrendingUp,
  Calendar,
  ChevronRight,
  Award,
  Eye,
  Users,
  Globe,
  Fingerprint,
  Settings,
} from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────

const USER = {
  name: "Arjun Mehta",
  handle: "@arjun.mehta",
  role: "Verified Voter",
  joined: "March 2023",
  avatar: "AM",
  country: "India",
  verified: true,
  trustScore: 98,
  badges: ["Early adopter", "Power voter", "Civic champion"],
};

const STATS = [
  {
    icon: Vote,
    label: "Total votes cast",
    value: "47",
    accent: "text-[#059669] dark:text-emerald-400",
  },
  {
    icon: CheckCircle2,
    label: "Elections won",
    value: "31",
    accent: "text-[#059669] dark:text-emerald-400",
  },
  {
    icon: Eye,
    label: "Elections observed",
    value: "12",
    accent: "text-[#059669] dark:text-emerald-400",
  },
  {
    icon: TrendingUp,
    label: "Participation streak",
    value: "9 mo",
    accent: "text-[#059669] dark:text-emerald-400",
  },
];

const VOTE_HISTORY = [
  {
    id: 1,
    title: "National Student Union — President",
    org: "Delhi University",
    date: "Apr 10, 2026",
    voted: true,
    result: "Won",
  },
  {
    id: 2,
    title: "Board of Directors — 3 Seats",
    org: "TechCorp India",
    date: "Mar 28, 2026",
    voted: true,
    result: "Won",
  },
  {
    id: 3,
    title: "City Council Referendum",
    org: "Mumbai Civic Body",
    date: "Feb 14, 2026",
    voted: true,
    result: "Lost",
  },
  {
    id: 4,
    title: "Community Budget Allocation",
    org: "Koramangala DAO",
    date: "Jan  5, 2026",
    voted: false,
    result: "Missed",
  },
  {
    id: 5,
    title: "Annual Faculty Senate Vote",
    org: "IIT Bombay",
    date: "Dec 12, 2025",
    voted: true,
    result: "Won",
  },
];

const ACTIVE_ELECTIONS = [
  {
    id: 1,
    title: "Municipal Water Board — Chairman",
    org: "Pune Municipal Corporation",
    deadline: "Apr 18, 2026",
    daysLeft: 5,
    voted: false,
  },
  {
    id: 2,
    title: "Open Source Foundation — Steering Committee",
    org: "FOSS India",
    deadline: "Apr 22, 2026",
    daysLeft: 9,
    voted: true,
  },
];

const ACTIVITY = [
  {
    text: "Voted in National Student Union election",
    time: "2 days ago",
    icon: Vote,
  },
  {
    text: "Identity re-verified via Aadhaar",
    time: "1 week ago",
    icon: Fingerprint,
  },
  { text: "Earned Civic Champion badge", time: "2 weeks ago", icon: Award },
  {
    text: "Joined Board of Directors election",
    time: "3 weeks ago",
    icon: Users,
  },
  {
    text: "Profile verified by VoteFlow",
    time: "1 month ago",
    icon: ShieldCheck,
  },
];

// ─── Trust Score card ─────────────────────────────────────────────────────────

function TrustScore({ score }: { score: number }) {
  return (
    <Card className="border-zinc-200 dark:border-white/6 bg-white dark:bg-white/3">
      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <ShieldCheck className="h-4 w-4 text-[#059669] dark:text-emerald-400" />
            Trust score
          </div>
          <span className="text-xl font-extrabold text-zinc-900 dark:text-white">
            {score}
            <span className="text-zinc-400 dark:text-zinc-600 text-sm font-normal">
              /100
            </span>
          </span>
        </div>
        <Progress
          value={score}
          className="h-2 bg-zinc-100 dark:bg-white/10
                     [&>div]:bg-[#059669] dark:[&>div]:bg-[#047857]"
        />
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Verified identity · Consistent participation · No disputes
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [tab, setTab] = useState("overview");

  return (
    <div
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950
                    text-zinc-900 dark:text-zinc-100
                    font-sans antialiased"
    >
      {/* ── Hero banner ────────────────────────────────────────────────────── */}
      <div className="relative h-52 overflow-hidden">
        {/* Solid emerald base — light vs dark */}
        <div className="absolute inset-0 bg-[#059669] dark:bg-[#047857]" />

        {/* Subtle diagonal texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Lighter glow spot top-left */}
        <div className="pointer-events-none absolute -top-10 -left-10 h-64 w-64 rounded-full bg-white/20 blur-[80px]" />
        {/* Darker shadow bottom-right */}
        <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-80 rounded-full bg-black/20 blur-[60px]" />

        {/* Floating stat pills */}
        <div className="absolute bottom-5 right-6 hidden sm:flex gap-3">
          {["47 votes cast", "9 mo streak", "98 trust score"].map((pill) => (
            <span
              key={pill}
              className="rounded-full bg-white/15 backdrop-blur-sm border border-white/25
                         px-3 py-1 text-xs font-medium text-white"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      {/* ── Profile header row ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative -mt-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          {/* Avatar + identity */}
          <div className="flex items-end gap-5">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-zinc-50 dark:border-zinc-950 shadow-xl">
                <AvatarImage src="" />
                <AvatarFallback className="bg-[#059669] dark:bg-[#047857] text-2xl font-extrabold text-white">
                  {USER.avatar}
                </AvatarFallback>
              </Avatar>
              {USER.verified && (
                <span
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center
                                 rounded-full border-2 border-zinc-50 dark:border-zinc-950
                                 bg-[#059669] dark:bg-[#047857]"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-white" />
                </span>
              )}
            </div>

            <div className="mb-1 flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                  {USER.name}
                </h1>
                <Badge
                  className="bg-[#059669]/10 dark:bg-[#047857]/30 text-[#047857] dark:text-emerald-300
                                   border border-[#059669]/30 dark:border-emerald-700/40 text-xs"
                >
                  {USER.role}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-500">
                <span>{USER.handle}</span>
                <span>·</span>
                <Globe className="h-3.5 w-3.5" />
                <span>{USER.country}</span>
                <span>·</span>
                <Calendar className="h-3.5 w-3.5" />
                <span>Joined {USER.joined}</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-0.5">
                {USER.badges.map((b) => (
                  <Badge
                    key={b}
                    variant="outline"
                    className="border-amber-400/40 bg-amber-50 dark:bg-amber-500/10
                               text-amber-700 dark:text-amber-300 text-xs"
                  >
                    <Star className="h-2.5 w-2.5 mr-1 fill-amber-500 text-amber-500" />
                    {b}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pb-1">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-200 dark:border-white/10
                         bg-white dark:bg-white/5
                         text-zinc-700 dark:text-zinc-200
                         hover:bg-zinc-50 dark:hover:bg-white/10"
            >
              <Settings className="h-3.5 w-3.5 mr-1.5" /> Edit profile
            </Button>
            <Button
              size="sm"
              className="bg-[#059669] hover:bg-[#047857] dark:bg-[#047857] dark:hover:bg-[#059669] text-white"
            >
              <Vote className="h-3.5 w-3.5 mr-1.5" /> Vote now
            </Button>
          </div>
        </div>

        {/* ── Stat cards ───────────────────────────────────────────────────── */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <Card
              key={s.label}
              className="border-zinc-200 dark:border-white/6
                         bg-white dark:bg-white/3
                         hover:border-[#059669]/40 dark:hover:border-[#047857]/60
                         transition-colors group"
            >
              <CardContent className="p-4 flex flex-col gap-2">
                <s.icon className={`h-4 w-4 ${s.accent}`} />
                <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                  {s.value}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-500 leading-tight">
                  {s.label}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="mt-8 bg-zinc-200 dark:bg-white/6" />

        {/* ── Tabs ─────────────────────────────────────────────────────────── */}
        <Tabs value={tab} onValueChange={setTab} className="mt-6">
          <TabsList
            className="bg-zinc-100 dark:bg-white/5
                       border border-zinc-200 dark:border-white/8
                       rounded-xl p-1 gap-1"
          >
            {["overview", "history", "activity"].map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="rounded-lg px-5 py-2 text-sm capitalize
                           text-zinc-500 dark:text-zinc-400
                           data-[state=active]:bg-[#059669] dark:data-[state=active]:bg-[#047857]
                           data-[state=active]:text-white
                           data-[state=active]:shadow-none"
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── Overview ──────────────────────────────────────────────────── */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              {/* Active elections */}
              <div className="flex flex-col gap-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Active elections
                </h2>
                {ACTIVE_ELECTIONS.map((el) => (
                  <Card
                    key={el.id}
                    className="border-zinc-200 dark:border-white/6
                               bg-white dark:bg-white/3
                               hover:border-[#059669]/40 dark:hover:border-[#047857]/50
                               transition-colors"
                  >
                    <CardContent className="flex items-center justify-between gap-4 p-5">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                          {el.title}
                        </p>
                        <p className="text-xs text-zinc-500">{el.org}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-zinc-400 dark:text-zinc-600" />
                          <span className="text-xs text-zinc-500">
                            {el.deadline}
                          </span>
                          {el.daysLeft <= 5 && !el.voted && (
                            <Badge
                              className="bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400
                                              border border-red-200 dark:border-red-500/20 text-[10px] px-2"
                            >
                              {el.daysLeft}d left
                            </Badge>
                          )}
                          {el.voted && (
                            <Badge
                              className="bg-[#059669]/10 dark:bg-emerald-500/15
                                              text-[#047857] dark:text-emerald-400
                                              border border-[#059669]/20 dark:border-emerald-500/20
                                              text-[10px] px-2"
                            >
                              <CheckCircle2 className="h-2.5 w-2.5 mr-1" />{" "}
                              Voted
                            </Badge>
                          )}
                        </div>
                      </div>
                      {!el.voted && (
                        <Button
                          size="sm"
                          className="shrink-0 bg-[#059669] hover:bg-[#047857]
                                     dark:bg-[#047857] dark:hover:bg-[#059669]
                                     text-white text-xs"
                        >
                          Vote <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Trust & Security sidebar */}
              <div className="flex flex-col gap-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Trust &amp; security
                </h2>
                <TrustScore score={USER.trustScore} />

                <Card className="border-zinc-200 dark:border-white/6 bg-white dark:bg-white/3">
                  <CardContent className="p-5 flex flex-col gap-4">
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Verification status
                    </p>
                    {[
                      { label: "Government ID", icon: Fingerprint, ok: true },
                      { label: "Phone number", icon: ShieldCheck, ok: true },
                      { label: "Email address", icon: CheckCircle2, ok: true },
                      { label: "2FA enabled", icon: Lock, ok: true },
                    ].map((v) => (
                      <div
                        key={v.label}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                          <v.icon className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-600" />
                          {v.label}
                        </div>
                        <Badge
                          className={
                            v.ok
                              ? "bg-[#059669]/10 dark:bg-emerald-500/15 text-[#047857] dark:text-emerald-400 border border-[#059669]/20 dark:border-emerald-500/20 text-[10px] px-2"
                              : "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 text-[10px] px-2"
                          }
                        >
                          {v.ok ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ── History ──────────────────────────────────────────────────── */}
          <TabsContent value="history" className="mt-6">
            <div className="flex flex-col gap-3">
              {VOTE_HISTORY.map((v) => (
                <Card
                  key={v.id}
                  className="border-zinc-200 dark:border-white/6
                             bg-white dark:bg-white/3
                             hover:border-[#059669]/40 dark:hover:border-[#047857]/50
                             transition-colors"
                >
                  <CardContent className="flex items-center justify-between gap-4 p-5">
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          v.voted
                            ? "bg-[#059669]/10 dark:bg-[#047857]/30"
                            : "bg-zinc-100 dark:bg-zinc-800"
                        }`}
                      >
                        <Vote
                          className={`h-4 w-4 ${
                            v.voted
                              ? "text-[#059669] dark:text-emerald-400"
                              : "text-zinc-400 dark:text-zinc-600"
                          }`}
                        />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                          {v.title}
                        </p>
                        <p className="text-xs text-zinc-500">{v.org}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge
                        className={
                          v.result === "Won"
                            ? "bg-[#059669]/10 dark:bg-emerald-500/15 text-[#047857] dark:text-emerald-400 border border-[#059669]/20 dark:border-emerald-500/20 text-[10px] px-2"
                            : v.result === "Lost"
                              ? "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 text-[10px] px-2"
                              : "bg-zinc-100 dark:bg-zinc-700/40 text-zinc-500 border border-zinc-200 dark:border-zinc-700 text-[10px] px-2"
                        }
                      >
                        {v.result}
                      </Badge>
                      <span className="text-xs text-zinc-400 dark:text-zinc-600">
                        {v.date}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── Activity ─────────────────────────────────────────────────── */}
          <TabsContent value="activity" className="mt-6">
            <div className="flex flex-col">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                                     bg-[#059669]/10 dark:bg-[#047857]/30
                                     border border-[#059669]/20 dark:border-[#047857]/40"
                    >
                      <a.icon className="h-3.5 w-3.5 text-[#059669] dark:text-emerald-400" />
                    </span>
                    {i < ACTIVITY.length - 1 && (
                      <div className="w-px flex-1 bg-zinc-200 dark:bg-white/6 my-1" />
                    )}
                  </div>
                  <div className="pb-6 pt-1 flex flex-col gap-0.5">
                    <p className="text-sm text-zinc-800 dark:text-zinc-200">
                      {a.text}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-600">
                      {a.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="h-16" />
      </div>
    </div>
  );
}
