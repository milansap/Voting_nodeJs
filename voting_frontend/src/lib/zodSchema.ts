// schemas/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  citizenship_no: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    age: z.number().int().min(1, "Age must be a valid number"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .optional()
      .or(z.literal("")),
    mobile_number: z
      .string()
      .regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
    address: z.string().optional().or(z.literal("")),
    citizenship_no: z.number().int().min(1, "Citizenship number is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
