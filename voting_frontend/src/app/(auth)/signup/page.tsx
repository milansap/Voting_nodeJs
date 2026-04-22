"use client";

import { Card } from "@/components/ui/card";
import { SignupForm } from "@/components/auth/SignupForm";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { signup } from "@/app/_apis/authApis";
import { useRouter } from "next/navigation";
import {
  type SignupSchema,
  type SignupSchemaInput,
  signupSchema,
} from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignupPage() {
  const router = useRouter();
  const form = useForm<SignupSchemaInput, unknown, SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      age: undefined,
      email: "",
      mobile_number: "",
      address: "",
      citizenship_no: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const signupMutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: signup,
    onSuccess: (data) => {
      toast.success(data.message || "Signup successful!");
      router.push("/login");
      form.reset();
    },
    onError: (error) => {
      console.error("Signup failed:", error);
    },
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#D1FAE5] dark:from-[#111827] dark:to-[#065F46] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Section - Welcome Message */}
          <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-[#059669] to-[#065F46] dark:from-[#065F46] dark:to-[#0d3a2e] rounded-3xl p-12 text-white shadow-2xl">
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold">Join Us!</h1>
              <p className="text-lg text-[#D1FAE5]">
                Create an account and start casting your votes. Make your voice
                heard in our voting platform.
              </p>
              <div className="pt-4">
                <p className="text-sm text-[#D1FAE5]">
                  Already have an account?
                </p>
                <Link
                  href="/login"
                  className="text-white font-semibold hover:text-[#D1FAE5] transition-colors inline-block mt-2"
                >
                  Sign In →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Section - Signup Form */}
          <Card className="w-full shadow-xl border-0 bg-white dark:bg-[#1F2937]">
            <div className="p-8 md:p-10">
              <h2 className="text-3xl font-bold text-[#111827] dark:text-white mb-2">
                Create Account
              </h2>
              <p className="text-[#6B7280] dark:text-[#D1D5DB] text-sm mb-8">
                Fill in your details to get started
              </p>

              <SignupForm signupMutation={signupMutation} form={form} />

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-[#E5E7EB] dark:border-[#4B5563]"></div>
                <span className="px-3 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                  or
                </span>
                <div className="flex-1 border-t border-[#E5E7EB] dark:border-[#4B5563]"></div>
              </div>

              {/* Sign In Link */}
              <p className="text-center text-[#6B7280] dark:text-[#D1D5DB] text-sm mt-8">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#059669] hover:text-[#047857] dark:text-[#6EE7B7] dark:hover:text-[#A7F3D0] font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
