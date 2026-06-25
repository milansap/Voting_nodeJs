"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Metadata } from "next";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/authStore";

import {
  Bell,
  ClipboardList,
  CalendarDays,
  UserCog,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Home,
  Moon,
  Sun,
  ChevronRight,
  ShieldCheck,
  MoreVertical,
  ChevronsLeft,
  ChevronsRight,
  PlusCircle,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// export const metadata: Metadata = {
//   title: "Voting Application",
//   description: "Cast your vote and make your voice heard",
// };
interface NavItem {
  label: string;
  icon: React.ElementType;
  active: boolean;
  href: string;
}

function SidebarNavContent({
  collapsed,
  navItems,
}: {
  collapsed: boolean;
  navItems: NavItem[];
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, active, href }) =>
          collapsed ? (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  className={cn(
                    "w-full flex items-center justify-center p-2.5 rounded-xl transition-all group",
                    active
                      ? "bg-white/15 text-white shadow-inner"
                      : "text-[#A7F3D0] hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      active
                        ? "text-[#6EE7B7]"
                        : "text-[#A7F3D0] group-hover:text-white",
                    )}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {label}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={label}
              href={href}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group",
                active
                  ? "bg-white/15 text-white shadow-inner"
                  : "text-[#A7F3D0] hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  active
                    ? "text-[#6EE7B7]"
                    : "text-[#A7F3D0] group-hover:text-white",
                )}
              />
              <span className="truncate">{label}</span>
              {active && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#6EE7B7]" />
              )}
            </Link>
          ),
        )}
      </nav>
    </TooltipProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isAdmin, isLoggedIn, removeToken, setAdmin } = useAuthStore();

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: Home,
      active: pathname === "/admin/dashboard",
      href: "/admin/dashboard",
    },
    {
      label: "Events",
      icon: CalendarDays,
      active: pathname === "/admin/events",
      href: "/admin/events",
    },
    {
      label: "Candidates",
      icon: ClipboardList,
      active: pathname === "/admin/candidates",
      href: "/admin/candidates",
    },
    {
      label: "Users",
      icon: UserCog,
      active: pathname === "/admin/users",
      href: "/admin/users",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      active: pathname === "/admin/analytics",
      href: "/admin/analytics",
    },
    {
      label: "Settings",
      icon: Settings,
      active: pathname === "/admin/settings",
      href: "/admin/settings",
    },
  ];

  const logout = () => {
    removeToken();
    setAdmin(false);
  };

  useEffect(() => {
    if (!isAdmin || !isLoggedIn) {
      router.push("/admin/login");
    }
  }, [isAdmin, isLoggedIn, router]);
  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0d1f17] flex font-sans">
        {/* ── Desktop Sidebar ── */}
        <aside
          className={cn(
            "hidden md:flex flex-col sticky top-0 h-screen z-30",
            "bg-gradient-to-b from-[#065F46] to-[#022c22] text-white shadow-2xl",
            "transition-all duration-300 ease-in-out",
            collapsed ? "w-[68px]" : "w-64",
          )}
        >
          {/* Logo */}
          <div
            className={cn(
              "flex items-center gap-3 border-b border-white/10 overflow-hidden",
              collapsed ? "px-3 py-5 justify-center" : "px-6 py-6",
            )}
          >
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#6EE7B7]" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <span className="text-lg font-bold tracking-tight whitespace-nowrap">
                  VoteHub
                </span>
                <p className="text-[10px] text-[#A7F3D0] uppercase tracking-widest font-medium whitespace-nowrap">
                  Admin Portal
                </p>
              </div>
            )}
          </div>

          {/* Nav */}
          <SidebarNavContent collapsed={collapsed} navItems={navItems} />

          {/* Admin profile */}
          <div
            className={cn(
              "border-t border-white/10",
              collapsed ? "px-2 py-3" : "px-4 py-4",
            )}
          >
            {collapsed ? (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-center">
                      <Avatar className="w-9 h-9 cursor-pointer">
                        <AvatarFallback className="bg-[#059669] text-white text-xs font-bold">
                          AD
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">Admin User</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-[#059669] text-white text-xs font-bold">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">Admin User</p>
                  <p className="text-[11px] text-[#A7F3D0] truncate">
                    admin@votehub.com
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-[#A7F3D0] hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="text-red-500 focus:text-red-500"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem> 
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Collapse Toggle Button */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              "absolute -right-3 top-20",
              "w-6 h-6 rounded-full bg-[#059669] border-2 border-white/30",
              "flex items-center justify-center shadow-md",
              "hover:bg-[#047857] transition-colors text-white z-50",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronsRight className="w-3 h-3" />
            ) : (
              <ChevronsLeft className="w-3 h-3" />
            )}
          </button>
        </aside>

        {/* ── Mobile Sidebar (Sheet) ── */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden fixed top-4 left-4 z-40 w-9 h-9 rounded-xl bg-gradient-to-br from-[#065F46] to-[#022c22] flex items-center justify-center text-white shadow-lg">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 p-0 bg-gradient-to-b from-[#065F46] to-[#022c22] border-0"
          >
            {/* Mobile Logo */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#6EE7B7]" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white">
                  VoteHub
                </span>
                <p className="text-[10px] text-[#A7F3D0] uppercase tracking-widest font-medium">
                  Admin Portal
                </p>
              </div>
            </div>

            {/* Mobile Nav */}
            <div className="flex flex-col h-[calc(100%-80px)]">
              <SidebarNavContent collapsed={false} navItems={navItems} />

              {/* Mobile Admin profile */}
              <div className="px-4 py-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-[#059669] text-white text-xs font-bold">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-white">
                      Admin User
                    </p>
                    <p className="text-[11px] text-[#A7F3D0] truncate">
                      admin@votehub.com
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-[#A7F3D0] hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => logout()}
                        className="text-red-500 focus:text-red-500"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* ── Main ── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Topbar */}
          <header className="sticky top-0 z-10 bg-white/80 dark:bg-[#111827]/90 backdrop-blur border-b border-[#E5E7EB] dark:border-[#1F2937] px-4 md:px-8 h-16 flex items-center gap-4">
            {/* Spacer on mobile for hamburger */}
            <div className="w-10 md:hidden" />

            <div className="flex-1">
              <h1 className="text-lg font-bold text-[#111827] dark:text-white leading-none">
                Dashboard
              </h1>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                Welcome back, Admin 👋
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDark((d) => !d)}
                className="w-9 h-9 rounded-xl bg-[#F3F4F6] dark:bg-[#1F2937] flex items-center justify-center text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#E5E7EB] dark:hover:bg-[#374151] transition-colors"
              >
                {dark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              <button className="relative w-9 h-9 rounded-xl bg-[#F3F4F6] dark:bg-[#1F2937] flex items-center justify-center text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#E5E7EB] dark:hover:bg-[#374151] transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#059669]" />
              </button>

              <Button
                size="sm"
                className="hidden sm:flex bg-[#059669] hover:bg-[#047857] text-white rounded-xl gap-1.5 shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                New Event
              </Button>
            </div>
          </header>

          {/* Content */}
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
}
