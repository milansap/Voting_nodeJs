/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginSchema,
  type LoginSchemaInput,
} from "@/lib/zodSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormProvider,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export function LoginForm({ loginMutation }: { loginMutation: any }) {
  const [showPassword, setShowPassword] = useState(false);
  const isLoading = loginMutation?.isPending ?? false;

  const form = useForm<LoginSchemaInput, unknown, LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { citizenship_no: undefined, password: "" },
  });

  const onSubmit = async (values: LoginSchema) => {
    loginMutation.mutate(values);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Citizenship No. Field */}
        <FormField
          control={form.control}
          name="citizenship_no"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>CitizenShip No.</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter your Citizenship No."
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? undefined : Number(e.target.value),
                      )
                    }
                    className={`pl-10 ${
                      fieldState?.error ? "border-red-500 bg-red-50" : ""
                    }`}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pl-10 pr-12 ${
                      fieldState?.error ? "border-red-500 bg-red-50" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#059669] hover:bg-[#047857] dark:bg-[#10B981] dark:hover:bg-[#059669] text-white font-semibold py-2.5 rounded-lg transition-all duration-200"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </FormProvider>
  );
}
