import { z } from "zod";

// Email validation schema
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
});

// OTP validation schema
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP phải có 6 số")
    .regex(/^\d+$/, "OTP chỉ chứa số"),
});

// Password validation schema
export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
      .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
      .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 số"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

// Complete registration schema
export const registrationSchema = z
  .object({
    email: z.string().email(),
    otp: z.string().length(6),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// Type exports
export type EmailFormData = z.infer<typeof emailSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;
