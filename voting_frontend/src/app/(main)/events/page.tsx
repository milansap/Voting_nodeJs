"use client";

import { getEvents } from "@/app/_apis/routes/events";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, ClockIcon, ArrowUpRight, Zap } from "lucide-react";
import Link from "next/link";
import { type EventRecord } from "@/app/_apis/routes/events";

const EventsPage = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getDuration = (start: string, end: string) => {
    if (!start || !end) return null;
    return Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) /
        (1000 * 60 * 60 * 24),
    );
  };

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "ongoing":
        return {
          label: "Live",
          className:
            "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30",
          dot: "bg-emerald-500 dark:bg-emerald-400 animate-pulse",
        };
      case "upcoming":
        return {
          label: "Upcoming",
          className:
            "bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30",
          dot: "bg-sky-500 dark:bg-sky-400",
        };
      case "completed":
        return {
          label: "Ended",
          className:
            "bg-gray-100 dark:bg-zinc-500/20 text-gray-700 dark:text-zinc-400 border border-gray-300 dark:border-zinc-500/30",
          dot: "bg-gray-500 dark:bg-zinc-400",
        };
      default:
        return {
          label: status,
          className:
            "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-500/30",
          dot: "bg-violet-500 dark:bg-violet-400",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-emerald-200 dark:border-emerald-600/30 border-t-emerald-500 dark:border-t-emerald-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <p className="text-zinc-600 dark:text-zinc-500 text-sm tracking-widest uppercase font-mono">
            Loading events
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
 
        .events-page { font-family: 'DM Sans', sans-serif; }
        .display-font { font-family: 'Syne', sans-serif; }
        .mono-font { font-family: 'DM Mono', monospace; }
 
        .card-glow {
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .card-glow:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 0 1px rgba(16,185,129,0.3), 0 20px 40px -12px rgba(5,150,105,0.25);
        }
 
        .dark .card-glow:hover {
          box-shadow: 0 0 0 1px rgba(16,185,129,0.3), 0 20px 40px -12px rgba(5,150,105,0.25);
        }

        .light .card-glow:hover {
          box-shadow: 0 0 0 1px rgba(16,185,129,0.4), 0 20px 40px -12px rgba(5,150,105,0.15);
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

        .light .grid-bg {
          background-image:
            linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
 
        .emerald-shimmer {
          background: linear-gradient(135deg, #064e3b 0%, #065f46 30%, #047857 60%, #064e3b 100%);
        }
 
        .card-enter {
          animation: cardEnter 0.5s cubic-bezier(0.23,1,0.32,1) both;
        }
        @keyframes cardEnter {
          from { opacity:0; transform: translateY(24px); }
          to   { opacity:1; transform: translateY(0); }
        }
 
        .tag-number {
          font-variant-numeric: tabular-nums;
        }
 
        .active-ring { box-shadow: 0 0 0 1px rgba(16,185,129,0.5); }
 
        .divider-line {
          background: linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent);
        }
      `}</style>

      <div className="events-page min-h-screen bg-white dark:bg-zinc-950 grid-bg">
        {/* Ambient glow top-right */}
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
                  Events
                  <span className="text-emerald-500">.</span>
                </h1>
                <p className="text-gray-600 dark:text-zinc-400 text-lg max-w-md leading-relaxed">
                  Participate in active voting rounds and shape outcomes that
                  matter.
                </p>
              </div>

              {events && events.length > 0 && (
                <div className="flex items-center gap-4 shrink-0">
                  <div className="border border-gray-200 dark:border-zinc-800 rounded-xl px-5 py-3 bg-gray-50 dark:bg-zinc-900/60">
                    <p className="mono-font text-xs text-gray-600 dark:text-zinc-500 uppercase tracking-widest mb-1">
                      Total
                    </p>
                    <p className="display-font text-3xl font-bold text-gray-900 dark:text-white tag-number">
                      {String(events.length).padStart(2, "0")}
                    </p>
                  </div>
                  <div className="border border-emerald-300 dark:border-emerald-800/50 rounded-xl px-5 py-3 bg-emerald-50 dark:bg-emerald-950/40">
                    <p className="mono-font text-xs text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-1">
                      Active
                    </p>
                    <p className="display-font text-3xl font-bold text-emerald-600 dark:text-emerald-400 tag-number">
                      {String(
                        events.filter(
                          (e: EventRecord) =>
                            e.status?.toLowerCase() === "ongoing",
                        ).length,
                      ).padStart(2, "0")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* divider */}
            <div className="mt-10 h-px divider-line" />
          </div>

          {/* ── Empty ── */}
          {!events || events.length === 0 ? (
            <div className="flex items-center justify-center min-h-100">
              <div className="text-center border border-gray-200 dark:border-zinc-800 rounded-2xl p-16 bg-gray-50 dark:bg-zinc-900/40">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">
                  <CalendarIcon className="w-7 h-7 text-gray-500 dark:text-zinc-600" />
                </div>
                <h3 className="display-font text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No Events Yet
                </h3>
                <p className="text-gray-600 dark:text-zinc-500 text-sm">
                  Check back soon for upcoming events.
                </p>
              </div>
            </div>
          ) : (
            /* ── Grid ── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((event: EventRecord, index: number) => {
                const statusCfg = getStatusConfig(event.status);
                const duration = getDuration(event.startDate, event.endDate);
                const isActive = event.status?.toLowerCase() === "ongoing";

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    aria-label={`Open ${event.title}`}
                    className={`card-glow card-enter group relative bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden cursor-pointer ${
                      isActive
                        ? "border-emerald-300 dark:border-emerald-800/60 active-ring"
                        : "border-gray-200 dark:border-zinc-800/80"
                    }`}
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    {/* Top accent strip */}
                    {isActive && (
                      <div className="h-0.5 w-full emerald-shimmer" />
                    )}

                    {/* Card inner */}
                    <div className="p-6">
                      {/* Status + index */}
                      <div className="flex items-center justify-between mb-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs mono-font font-medium ${statusCfg.className}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                          />
                          {statusCfg.label}
                        </span>
                        <span className="mono-font text-gray-500 dark:text-zinc-600 text-xs tag-number">
                          #{String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="display-font text-xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors duration-300">
                        {event.title}
                      </h2>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-zinc-500 text-sm leading-relaxed line-clamp-2 mb-6">
                        {event.description}
                      </p>

                      {/* Dates */}
                      <div className="space-y-3 mb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                            <CalendarIcon className="w-3.5 h-3.5 text-emerald-500" />
                          </div>
                          <div>
                            <p className="mono-font text-[10px] text-gray-600 dark:text-zinc-600 uppercase tracking-widest">
                              Start
                            </p>
                            <p className="text-sm text-gray-900 dark:text-zinc-300 font-medium">
                              {formatDate(event.startDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                            <ClockIcon className="w-3.5 h-3.5 text-emerald-500" />
                          </div>
                          <div>
                            <p className="mono-font text-[10px] text-gray-600 dark:text-zinc-600 uppercase tracking-widest">
                              End
                            </p>
                            <p className="text-sm text-gray-900 dark:text-zinc-300 font-medium">
                              {formatDate(event.endDate)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-zinc-800">
                        {duration !== null ? (
                          <div className="flex items-center gap-2">
                            <span className="mono-font text-xs text-gray-600 dark:text-zinc-500">
                              Duration
                            </span>
                            <span className="mono-font text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/50 px-2 py-0.5 rounded-full tag-number">
                              {duration}d
                            </span>
                          </div>
                        ) : (
                          <span />
                        )}

                        <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-emerald-500 dark:group-hover:bg-emerald-600 transition-colors duration-300">
                          <ArrowUpRight className="w-3.5 h-3.5 text-gray-600 dark:text-zinc-400 group-hover:text-white transition-colors duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventsPage;
