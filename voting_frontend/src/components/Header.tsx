"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, CheckSquare, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/authStore";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/candidates", label: "Candidates" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="p-2 rounded-lg hover:bg-[#047857]/20 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-[#D1FAE5]" />
          ) : (
            <Moon className="w-5 h-5 text-[#D1FAE5]" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {isDark ? "Light mode" : "Dark mode"}
      </TooltipContent>
    </Tooltip>
  );
}

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isAdmin, removeToken } = useAuthStore();

  const handleLogout = () => {
    removeToken();
    setMobileOpen(false);
    router.push("/login");
  };

  return (
    <TooltipProvider delayDuration={300}>
      <header className="sticky top-0 z-50 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Main Navigation Pill */}
          <div className="bg-[#059669] dark:bg-[#047857] rounded-full px-8 py-4 shadow-xl flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <CheckSquare
                  className="w-6 h-6 text-[#059669]"
                  strokeWidth={2}
                />
              </div>
              <span className="hidden sm:block text-white dark:text-[#D1FAE5] font-bold text-lg">
                VoteHub
              </span>
            </Link>

            {/* Desktop Nav Links - Center */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-white dark:text-[#D1FAE5]"
                      : "text-white/70 dark:text-[#A7F3D0]/70 hover:text-white dark:hover:text-[#D1FAE5]",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <ThemeToggle />

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center gap-3">
                {isLoggedIn ? (
                  <>
                    {isAdmin && (
                      <span className="px-3 py-1 bg-white/20 text-white dark:text-[#D1FAE5] text-xs font-semibold rounded-full">
                        Admin
                      </span>
                    )}
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-white dark:text-[#D1FAE5] text-sm font-medium hover:bg-white/20 rounded-full transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-2 text-white dark:text-[#D1FAE5] text-sm font-medium hover:bg-white/20 rounded-full transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      className="px-6 py-2 bg-white dark:bg-[#D1FAE5] text-[#059669] dark:text-[#047857] text-sm font-semibold rounded-full hover:bg-gray-100 dark:hover:bg-[#A7F3D0] transition-colors"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-white dark:text-[#D1FAE5] hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="md:hidden mt-4 bg-[#059669] dark:bg-[#047857] rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-top-2">
              {/* Mobile Nav Links */}
              <nav className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-white/20 text-white dark:text-[#D1FAE5]"
                        : "text-white/70 dark:text-[#A7F3D0]/70 hover:bg-white/20 hover:text-white dark:hover:text-[#D1FAE5]",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="h-px bg-white/20" />

              {/* Mobile Auth */}
              <div className="space-y-3">
                {isLoggedIn ? (
                  <>
                    {isAdmin && (
                      <div className="px-4 py-2 bg-white/20 text-white dark:text-[#D1FAE5] text-xs font-semibold rounded-lg">
                        Admin user
                      </div>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-white dark:text-[#D1FAE5] text-sm font-medium hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2 text-white dark:text-[#D1FAE5] text-sm font-medium hover:bg-white/20 rounded-lg transition-colors text-center"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2 bg-white dark:bg-[#D1FAE5] text-[#059669] dark:text-[#047857] text-sm font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-[#A7F3D0] transition-colors text-center"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </TooltipProvider>
  );
};

export default Header;
