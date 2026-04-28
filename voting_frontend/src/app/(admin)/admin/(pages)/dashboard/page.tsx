"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  
  Users,
  Vote,
  CalendarDays,
  TrendingUp,
  MoreVertical,
  
  ClipboardList,
  UserCog,
  BarChart3,
  ChevronRight,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Eye,
  Pencil,
  Trash2,

  
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatItem {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  color: string;
  bg: string;
}

interface EventItem {
  id: number;
  name: string;
  status: string;
  candidates: number;
  votes: number;
  totalVoters: number;
  endsAt: string;
}

interface CandidateItem {
  name: string;
  event: string;
  votes: number;
  percent: number;
}

interface ActivityItem {
  action: string;
  user: string;
  time: string;
  type: string;
}



interface StatusConfig {
  label: string;
  className: string;
}

interface QuickAction {
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const stats: StatItem[] = [
  {
    label: "Total Users",
    value: "2,847",
    change: "+12.5%",
    positive: true,
    icon: Users,
    color: "text-[#059669]",
    bg: "bg-[#059669]/10 dark:bg-[#059669]/20",
  },
  {
    label: "Active Events",
    value: "6",
    change: "+2 this week",
    positive: true,
    icon: CalendarDays,
    color: "text-blue-500",
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
  },
  {
    label: "Votes Cast",
    value: "18,392",
    change: "+34.2%",
    positive: true,
    icon: Vote,
    color: "text-violet-500",
    bg: "bg-violet-500/10 dark:bg-violet-500/20",
  },
  {
    label: "Candidates",
    value: "54",
    change: "-3 ended",
    positive: false,
    icon: ClipboardList,
    color: "text-amber-500",
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
  },
];

const events: EventItem[] = [
  {
    id: 1,
    name: "Student Council Election 2025",
    status: "ongoing",
    candidates: 8,
    votes: 1240,
    totalVoters: 1800,
    endsAt: "2025-05-10",
  },
  {
    id: 2,
    name: "Faculty Representative Vote",
    status: "ongoing",
    candidates: 4,
    votes: 430,
    totalVoters: 600,
    endsAt: "2025-05-08",
  },
  {
    id: 3,
    name: "Sports Committee Election",
    status: "upcoming",
    candidates: 6,
    votes: 0,
    totalVoters: 950,
    endsAt: "2025-05-15",
  },
  {
    id: 4,
    name: "Cultural Fest Head Selection",
    status: "completed",
    candidates: 5,
    votes: 2100,
    totalVoters: 2100,
    endsAt: "2025-04-20",
  },
  {
    id: 5,
    name: "Department Lead Poll",
    status: "completed",
    candidates: 3,
    votes: 780,
    totalVoters: 800,
    endsAt: "2025-04-15",
  },
];

const topCandidates: CandidateItem[] = [
  { name: "Aanya Sharma", event: "Student Council", votes: 420, percent: 34 },
  { name: "Rohan Mehta", event: "Student Council", votes: 390, percent: 31 },
  { name: "Priya Nair", event: "Faculty Rep", votes: 210, percent: 49 },
  { name: "Vikram Das", event: "Faculty Rep", votes: 195, percent: 45 },
  { name: "Neha Gupta", event: "Student Council", votes: 185, percent: 15 },
];

const recentActivity: ActivityItem[] = [
  {
    action: "New user registered",
    user: "user_3921",
    time: "2 min ago",
    type: "user",
  },
  {
    action: "Vote cast in Student Council",
    user: "user_1044",
    time: "5 min ago",
    type: "vote",
  },
  {
    action: "Event created: Sports Committee",
    user: "admin",
    time: "1 hr ago",
    type: "event",
  },
  {
    action: "Candidate approved",
    user: "admin",
    time: "2 hr ago",
    type: "candidate",
  },
  {
    action: "Event completed: Cultural Fest",
    user: "system",
    time: "3 hr ago",
    type: "system",
  },
];


const quickActions: QuickAction[] = [
  {
    label: "Create New Event",
    desc: "Set up a voting event",
    icon: PlusCircle,
    color: "text-[#059669]",
    bg: "bg-[#059669]/10 dark:bg-[#059669]/20 hover:bg-[#059669]/20",
  },
  {
    label: "Add Candidate",
    desc: "Register a new candidate",
    icon: UserCog,
    color: "text-blue-500",
    bg: "bg-blue-500/10 dark:bg-blue-500/20 hover:bg-blue-500/20",
  },
  {
    label: "Manage Users",
    desc: "Assign & restrict voters",
    icon: Users,
    color: "text-violet-500",
    bg: "bg-violet-500/10 dark:bg-violet-500/20 hover:bg-violet-500/20",
  },
  {
    label: "View Analytics",
    desc: "Detailed vote reports",
    icon: BarChart3,
    color: "text-amber-500",
    bg: "bg-amber-500/10 dark:bg-amber-500/20 hover:bg-amber-500/20",
  },
  {
    label: "System Alerts",
    desc: "Check warnings & logs",
    icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-500/10 dark:bg-red-500/20 hover:bg-red-500/20",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusConfig: Record<string, StatusConfig> = {
  ongoing: {
    label: "Ongoing",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/40",
  },
  upcoming: {
    label: "Upcoming",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-700/40",
  },
  completed: {
    label: "Completed",
    className:
      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  },
};

const activityIcon: Record<string, ReactNode> = {
  user: <Users className="w-3.5 h-3.5 text-[#059669]" />,
  vote: <Vote className="w-3.5 h-3.5 text-violet-500" />,
  event: <CalendarDays className="w-3.5 h-3.5 text-blue-500" />,
  candidate: <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />,
  system: <Activity className="w-3.5 h-3.5 text-gray-400" />,
};

function ProgressBar({
  value,
  gradient = false,
}: {
  value: number;
  gradient?: boolean;
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-full bg-[#E5E7EB] dark:bg-[#374151]"
      style={{ height: gradient ? 8 : 6 }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: gradient
            ? "linear-gradient(to right, #059669, #34d399)"
            : "#059669",
        }}
      />
    </div>
  );
}

// ─── Sidebar Nav Content (shared between desktop & mobile) ───────────────────



// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
 

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(
          ({ label, value, change, positive, icon: Icon, color, bg }) => (
            <Card
              key={label}
              className="border-0 shadow-sm bg-white dark:bg-[#1F2937] hover:shadow-md transition-shadow"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      positive
                        ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30"
                        : "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30"
                    }`}
                  >
                    {change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-[#111827] dark:text-white">
                  {value}
                </p>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                  {label}
                </p>
              </CardContent>
            </Card>
          ),
        )}
      </section>

      {/* Events Table + Activity */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border-0 shadow-sm bg-white dark:bg-[#1F2937]">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-[#111827] dark:text-white">
                Voting Events
              </CardTitle>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                All events across the platform
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs rounded-xl border-[#E5E7EB] dark:border-[#374151]"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-[#F3F4F6] dark:border-[#374151] hover:bg-transparent">
                  <TableHead className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] pl-6">
                    Event
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF]">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] hidden sm:table-cell">
                    Progress
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] pr-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => {
                  const pct =
                    event.totalVoters > 0
                      ? Math.round((event.votes / event.totalVoters) * 100)
                      : 0;
                  const cfg = statusConfig[event.status];
                  return (
                    <TableRow
                      key={event.id}
                      className="border-[#F3F4F6] dark:border-[#1F2937]/60 hover:bg-[#F9FAFB] dark:hover:bg-[#111827]/50"
                    >
                      <TableCell className="pl-6 py-4">
                        <p className="text-sm font-semibold text-[#111827] dark:text-white leading-tight max-w-[180px] truncate">
                          {event.name}
                        </p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">
                          {event.candidates} candidates · ends {event.endsAt}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${cfg.className}`}
                        >
                          {event.status === "ongoing" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5 inline-block" />
                          )}
                          {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="space-y-1 min-w-[100px]">
                          <div className="flex justify-between text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                            <span>{event.votes.toLocaleString()} votes</span>
                            <span>{pct}%</span>
                          </div>
                          <ProgressBar value={pct} />
                        </div>
                      </TableCell>
                      <TableCell className="pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#374151] transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem>
                              <Eye className="w-3.5 h-3.5 mr-2" />
                              View Results
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="w-3.5 h-3.5 mr-2" />
                              Edit Event
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500 focus:text-red-500">
                              <Trash2 className="w-3.5 h-3.5 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-sm bg-white dark:bg-[#1F2937]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-[#111827] dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#059669]" />
              Recent Activity
            </CardTitle>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              Live platform events
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#F3F4F6] dark:bg-[#374151] flex items-center justify-center flex-shrink-0 mt-0.5">
                  {activityIcon[item.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#111827] dark:text-white font-medium leading-tight">
                    {item.action}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] text-[#9CA3AF]">
                      {item.user}
                    </span>
                    <span className="text-[#D1D5DB] dark:text-[#4B5563]">
                      ·
                    </span>
                    <span className="text-[11px] text-[#9CA3AF] flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-[#059669] dark:text-[#6EE7B7] hover:bg-[#059669]/10 rounded-xl mt-2"
            >
              View all activity →
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Top Candidates + Quick Actions */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border-0 shadow-sm bg-white dark:bg-[#1F2937]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-[#111827] dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#059669]" />
              Top Candidates
            </CardTitle>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
              Leading candidates across active events
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCandidates.map((c, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                      i === 0
                        ? "bg-amber-400/20 text-amber-600 dark:text-amber-400"
                        : i === 1
                          ? "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300"
                          : "bg-[#F3F4F6] text-[#6B7280] dark:bg-[#374151] dark:text-[#9CA3AF]",
                    )}
                  >
                    #{i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#111827] dark:text-white truncate">
                      {c.name}
                    </p>
                    <p className="text-[11px] text-[#9CA3AF] truncate">
                      {c.event}
                    </p>
                  </div>
                </div>
                <div className="flex-1 hidden sm:block">
                  <ProgressBar value={c.percent} gradient />
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="text-sm font-bold text-[#111827] dark:text-white">
                    {c.votes.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-[#9CA3AF]">{c.percent}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm bg-white dark:bg-[#1F2937]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-[#111827] dark:text-white">
              Quick Actions
            </CardTitle>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              Common admin tasks
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map(({ label, desc, icon: Icon, color, bg }) => (
              <button
                key={label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${bg} transition-colors text-left`}
              >
                <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
                <div className="min-w-0">
                  <p className={`text-sm font-semibold ${color}`}>{label}</p>
                  <p className="text-[11px] text-[#9CA3AF] dark:text-[#6B7280]">
                    {desc}
                  </p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] ml-auto flex-shrink-0" />
              </button>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
