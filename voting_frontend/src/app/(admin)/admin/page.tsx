"use client";

import { useAuthStore } from "@/lib/authStore";
import { Zap } from "lucide-react";
import { usePathname, useRouter } from "next/dist/client/components/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const route = usePathname();
  const router = useRouter();
  const { isAdmin, isLoggedIn } = useAuthStore();
  useEffect(() => {
    if (!isAdmin || !isLoggedIn) {
      router.push("/admin/login");
    } else if (route === "/admin") {
      router.push("/admin/dashboard");
    }
  }, [isAdmin, isLoggedIn, route, router]);

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
          Loading
        </p>
      </div>
    </div>
  );
};

export default Page;
