/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { login } from "@/app/_apis/authApis";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAdmin, isLoggedIn } = useAuthStore();

  const loginMutation = useMutation({
    mutationKey: ["admin-login"],
    mutationFn: login,
    onSuccess: (data) => {
      // Store the token and mark as admin
      const { setToken } = useAuthStore.getState();
      setToken(data?.token);
      setAdmin(true);
      toast.success("Welcome back, Admin!");
      router.push("/admin/dashboard");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Invalid admin credentials");
      console.error("Admin login failed:", error);
    },
  });

  useEffect(() => {
    if (isLoggedIn) router.push("/admin/dashboard");
  }, [isLoggedIn, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#D1FAE5] dark:from-[#111827] dark:to-[#065F46] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          {/* Left Section - Admin Branding */}
          <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-[#065F46] to-[#022c22] dark:from-[#022c22] dark:to-[#011a15] rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Decorative background circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none" />

            <div className="relative text-center space-y-6 z-10">
              {/* Shield icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-xl backdrop-blur-sm">
                  <ShieldCheck className="w-10 h-10 text-[#6EE7B7]" strokeWidth={1.5} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-[#A7F3D0] backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6EE7B7] animate-pulse" />
                  Admin Portal
                </div>
              </div>

              <h1 className="text-4xl font-bold leading-tight">
                Control <br />
                <span className="text-[#6EE7B7]">Center</span>
              </h1>

              <p className="text-[#A7F3D0] text-sm leading-relaxed max-w-[220px] mx-auto">
                Manage events, candidates, and oversee the entire voting system from here.
              </p>

              <div className="pt-2 border-t border-white/10 space-y-3">
                {[
                  "Manage voting events",
                  "Monitor live results",
                  "Control user access",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-[#D1FAE5]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6EE7B7] flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <p className="text-sm text-[#A7F3D0]">Not an admin?</p>
                <Link
                  href="/login"
                  className="text-white font-semibold hover:text-[#D1FAE5] transition-colors inline-block mt-1"
                >
                  Go to User Login →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <Card className="w-full shadow-xl border-0 bg-white dark:bg-[#1F2937]">
            <div className="p-8 md:p-10">
              {/* Header */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#059669]/10 dark:bg-[#059669]/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#059669] dark:text-[#6EE7B7]" strokeWidth={1.8} />
                </div>
                <h2 className="text-3xl font-bold text-[#111827] dark:text-white">
                  Admin Sign In
                </h2>
              </div>
              <p className="text-[#6B7280] dark:text-[#D1D5DB] text-sm mb-8">
                Restricted access — authorized administrators only
              </p>

              {/* Security Notice */}
              <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl px-4 py-3 mb-7">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                  This portal is for administrators only. Unauthorized access attempts are logged and monitored.
                </p>
              </div>

              <LoginForm loginMutation={loginMutation} />

              {/* Forgot Password */}
              <div className="flex justify-center mt-5">
                <Link
                  href="/admin/forgot-password"
                  className="text-sm text-[#059669] hover:text-[#047857] dark:text-[#6EE7B7] dark:hover:text-[#A7F3D0] font-medium transition-colors"
                >
                  Forgot admin password?
                </Link>
              </div>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-[#E5E7EB] dark:border-[#4B5563]" />
                <span className="px-3 text-sm text-[#6B7280] dark:text-[#9CA3AF]">or</span>
                <div className="flex-1 border-t border-[#E5E7EB] dark:border-[#4B5563]" />
              </div>

              {/* Back to user login */}
              <p className="text-center text-[#6B7280] dark:text-[#D1D5DB] text-sm">
                Not an admin?{" "}
                <Link
                  href="/login"
                  className="text-[#059669] hover:text-[#047857] dark:text-[#6EE7B7] dark:hover:text-[#A7F3D0] font-semibold transition-colors"
                >
                  User Login
                </Link>
              </p>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}