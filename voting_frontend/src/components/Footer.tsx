import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart2, Icon, ShieldCheck} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type NavLink = { label: string; href: string };
type NavCol = { heading: string; links: NavLink[] };

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_COLS: NavCol[] = [
  {
    heading: "Voting",
    links: [
      { label: "Active elections", href: "/elections" },
      { label: "Cast your vote", href: "/vote" },
      { label: "Live results", href: "/results" },
      { label: "Vote history", href: "/history" },
      { label: "Upcoming polls", href: "/upcoming" },
    ],
  },
  {
    heading: "Admin",
    links: [
      { label: "Create election", href: "/admin/create" },
      { label: "Manage candidates", href: "/admin/candidates" },
      { label: "Voter registry", href: "/admin/registry" },
      { label: "Audit logs", href: "/admin/logs" },
      { label: "Settings", href: "/admin/settings" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Contact us", href: "/contact" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "API docs", href: "/docs" },
      { label: "Status", href: "https://status.voteflow.io" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "Twitter", href: "https://twitter.com",  },
  { label: "LinkedIn", href: "https://linkedin.com", },
  { label: "Facebook", href: "https://facebook.com",  },
];

const LEGAL_LINKS: NavLink[] = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
  { label: "Cookie preferences", href: "/cookies" },
];

// ─── Footer Component ─────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* ── Top grid ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex w-fit items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600">
                <BarChart2 className="h-4 w-4 text-white" strokeWidth={2} />
              </span>
              <span className="text-base font-semibold tracking-tight text-foreground">
                VoteFlow
              </span>
            </Link>

            <p className="max-w-[220px] text-sm leading-relaxed text-muted-foreground">
              Secure, transparent, and accessible voting for every election that
              matters.
            </p>

            <div className="flex gap-2">
              {/* {SOCIAL_LINKS.map(({ label, href }) => (
                <Button
                  key={label}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  asChild
                >
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                     <Icon className="h-3.5 w-3.5" />
                  </a>
                </Button>
              ))} */}
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Trust banner ──────────────────────────────────────────────────── */}
        <div className="mt-10 flex flex-wrap items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
            <ShieldCheck className="h-3.5 w-3.5 text-green-700 dark:text-green-400" />
          </span>

          <p className="flex-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              Secure &amp; certified.
            </span>{" "}
            All votes are end-to-end encrypted and verified by independent
            auditors. Election integrity guaranteed.
          </p>

          <div className="flex shrink-0 gap-2">
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/40 dark:text-green-300"
            >
              ISO 27001
            </Badge>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300"
            >
              SOC 2
            </Badge>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────────────── */}
        <Separator className="my-6" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} VoteFlow Inc. All rights reserved.
          </p>

          <nav className="flex flex-wrap gap-5">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
