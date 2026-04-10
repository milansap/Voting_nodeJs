"use client";

import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#D1FAE5] dark:from-[#111827] dark:to-[#065F46] flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Section - Welcome Message */}
          <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-[#059669] to-[#065F46] dark:from-[#065F46] dark:to-[#0d3a2e] rounded-3xl p-12 text-white shadow-2xl">
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold">Welcome Back!</h1>
              <p className="text-lg text-[#D1FAE5]">
                Sign in to your account to cast your vote and have your voice
                heard
              </p>
              <div className="pt-4">
                <p className="text-sm text-[#D1FAE5]">Don&apos;t have an account?</p>
                <Link
                  href="/signup"
                  className="text-white font-semibold hover:text-[#D1FAE5] transition-colors inline-block mt-2"
                >
                  Create Account →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <Card className="w-full shadow-xl border-0 bg-white dark:bg-[#1F2937]">
            <div className="p-8 md:p-10">
              <h2 className="text-3xl font-bold text-[#111827] dark:text-white mb-2">Sign In</h2>
              <p className="text-[#6B7280] dark:text-[#D1D5DB] text-sm mb-8">
                Enter your details to access your account
              </p>

              <LoginForm />

              {/* Forgot Password Link */}
              <div className="flex justify-center mt-4">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#059669] hover:text-[#047857] dark:text-[#6EE7B7] dark:hover:text-[#A7F3D0] font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-[#E5E7EB] dark:border-[#4B5563]"></div>
                <span className="px-3 text-sm text-[#6B7280] dark:text-[#9CA3AF]">or</span>
                <div className="flex-1 border-t border-[#E5E7EB] dark:border-[#4B5563]"></div>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-[#6B7280] dark:text-[#D1D5DB] text-sm mt-8">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-[#059669] hover:text-[#047857] dark:text-[#6EE7B7] dark:hover:text-[#A7F3D0] font-semibold transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
