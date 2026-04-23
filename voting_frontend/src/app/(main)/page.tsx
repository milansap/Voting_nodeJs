

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart2,
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  Users,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Star,
  TrendingUp,
  Vote,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "End-to-end encrypted",
    desc: "Every ballot is cryptographically sealed. Zero-knowledge proofs ensure votes remain private yet verifiable.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Zap,
    title: "Real-time results",
    desc: "Watch votes roll in live. Animated dashboards update every second with zero page refresh needed.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Globe,
    title: "Accessible anywhere",
    desc: "Mobile-first. Screen-reader ready. Available in 40+ languages so no voter gets left behind.",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    icon: Lock,
    title: "Tamper-proof audit trail",
    desc: "Immutable logs on every action. Independent auditors can verify results without exposing voter identity.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Users,
    title: "Multi-role management",
    desc: "Admins, scrutineers, and observers each get tailored dashboards with fine-grained permissions.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: TrendingUp,
    title: "Deep analytics",
    desc: "Turnout heatmaps, demographic breakdowns, and exportable reports for every election you run.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
];

const STATS = [
  { value: "12M+", label: "Votes cast" },
  { value: "98.9%", label: "Uptime SLA" },
  { value: "140+", label: "Countries" },
  { value: "4 sec", label: "Avg. vote time" },
];

const TESTIMONIALS = [
  {
    name: "Amara Osei",
    role: "Electoral Commissioner, Ghana",
    avatar: "AO",
    quote:
      "VoteFlow transformed our national election. Results were certified in hours, not weeks. The transparency built public trust overnight.",
  },
  {
    name: "Priya Nair",
    role: "CTO, TechCorp India",
    avatar: "PN",
    quote:
      "We use VoteFlow for all board elections. The audit trail alone is worth every penny — our legal team loves it.",
  },
  {
    name: "Marcus Lindqvist",
    role: "Student Union President, Stockholm",
    avatar: "ML",
    quote:
      "Set up our entire student election in under an hour. Turnout jumped 60% because voting was finally dead simple.",
  },
];




// ─── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans antialiased">

     

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-20 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full bg-[#059669]/20 dark:bg-[#047857]/20 blur-[120px]" />
        </div>

        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto">
          <Badge
            variant="outline"
            className="border-[#059669]/40 dark:border-[#047857]/40 bg-[#059669]/10 dark:bg-[#047857]/10 text-[#059669] dark:text-[#10B981] px-4 py-1 text-xs tracking-wide"
          >
            <Vote className="mr-1.5 h-3 w-3" />
            Now with real-time results — no refresh needed
          </Badge>

          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            Elections that{" "}
            <span className="bg-gradient-to-r from-[#059669] via-[#10B981] to-[#34D399] dark:from-[#047857] dark:via-[#059669] dark:to-[#10B981] bg-clip-text text-transparent">
              people trust.
            </span>
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-xl">
            VoteFlow powers secure, transparent digital elections for governments,
            universities, and organizations worldwide. From setup to certified
            results — in minutes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              className="gap-2 bg-[#059669] hover:bg-[#047857] dark:bg-[#059669] dark:hover:bg-[#047857] text-white px-8"
              asChild
            >
              <Link href="/signup">
                Start for free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-zinc-300 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-white/10"
              asChild
            >
              <Link href="/demo">Watch demo</Link>
            </Button>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-500 pt-1">
            No credit card required · Set up in under 5 minutes
          </p>
        </div>

        {/* Floating stat pills */}
        <div className="relative z-10 mt-16 flex flex-wrap justify-center gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center rounded-2xl border-2 border-[#059669] dark:border-[#047857] bg-[#059669]/5 dark:bg-[#047857]/5 px-8 py-4 backdrop-blur-sm"
            >
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">{s.value}</span>
              <span className="text-xs text-zinc-600 dark:text-zinc-500 mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section id="features" className="px-6 py-24 bg-zinc-50 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <Badge
              variant="outline"
              className="mb-4 border-[#059669] dark:border-[#047857] text-[#059669] dark:text-[#10B981] text-xs tracking-wide"
            >
              Everything you need
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Built for trust at every scale
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
              From a 10-person team vote to a national referendum — VoteFlow
              handles it with the same rigour.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Card
                key={f.title}
                className="group border-zinc-300 dark:border-white/6 bg-zinc-100 dark:bg-white/3 hover:bg-zinc-200 dark:hover:bg-white/6 transition-colors duration-200"
              >
                <CardContent className="p-6">
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.bg} mb-4`}>
                    <f.icon className={`h-5 w-5 ${f.color}`} />
                  </span>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="px-6 py-24 bg-white dark:bg-white/[0.02]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <Badge
              variant="outline"
              className="mb-4 border-[#059669] dark:border-[#047857] text-[#059669] dark:text-[#10B981] text-xs tracking-wide"
            >
              Simple process
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Up and running in three steps
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create your election",
                desc: "Define candidates, set voting windows, configure eligibility rules, and customise your ballot in minutes.",
                icon: Vote,
              },
              {
                step: "02",
                title: "Invite your voters",
                desc: "Send secure, personalised voting links via email or embed the ballot directly on your website.",
                icon: Users,
              },
              {
                step: "03",
                title: "Certify results",
                desc: "Watch live tallies, download signed audit reports, and share verified results with a single click.",
                icon: CheckCircle2,
              },
            ].map((item, i) => (
              <div key={item.step} className="relative flex flex-col gap-4">
                {i < 2 && (
                  <div className="absolute top-5 left-[calc(100%_-_16px)] hidden h-px w-8 bg-[#059669] dark:bg-[#047857] md:block" />
                )}
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#059669]/40 dark:border-[#047857]/40 bg-[#059669]/10 dark:bg-[#047857]/10 text-sm font-bold text-[#059669] dark:text-[#10B981]">
                    {item.step}
                  </span>
                  <item.icon className="h-5 w-5 text-zinc-600 dark:text-zinc-500" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 bg-zinc-50 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <Badge
              variant="outline"
              className="mb-4 border-[#059669] dark:border-[#047857] text-[#059669] dark:text-[#10B981] text-xs tracking-wide"
            >
              Trusted worldwide
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Real elections. Real results.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card
                key={t.name}
                className="border-zinc-300 dark:border-white/6 bg-zinc-100 dark:bg-white/3 flex flex-col justify-between"
              >
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-violet-700 text-xs text-white font-semibold">
                        {t.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">{t.name}</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-500">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

     

      {/* ── CTA Banner ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 bg-white dark:bg-white/[0.02]">
        <div className="mx-auto max-w-3xl text-center">
          <div className="relative overflow-hidden rounded-3xl border border-[#059669]/20 dark:border-[#047857]/20 bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] dark:from-[#047857]/10 dark:to-[#059669]/10 px-8 py-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="h-full w-full rounded-3xl bg-gradient-to-br dark:from-[#047857]/20 dark:via-transparent dark:to-[#059669]/10" />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-5">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#059669] dark:bg-[#047857]">
                <Vote className="h-7 w-7 text-white" />
              </span>
              <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Ready to run your first election?
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-md">
                Join 8,000+ organizations already using VoteFlow to run fair,
                fast, and verifiable elections.
              </p>
              <Button
                size="lg"
                className="mt-2 gap-2 bg-white text-zinc-900 hover:bg-zinc-100 font-semibold px-8"
                asChild
              >
                <Link href="/signup">
                  Create your first election <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <p className="text-xs text-zinc-700 dark:text-zinc-600">Free forever · No credit card needed</p>
            </div>
          </div>
        </div>
      </section>

    
    </div>
  );
}