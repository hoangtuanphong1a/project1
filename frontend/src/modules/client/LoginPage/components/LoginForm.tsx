"use client";

import Link from "next/link";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import {
  AuthService,
  KEYS,
  useGetMe,
  useLoginMutation,
} from "@/apis/client/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect } from "react";

import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { loginSchema, LoginSchemaType } from "@/lib/validations/auth-client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/ui/Form/TextField";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Check for session expired message
  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'session_expired') {
      toast.error('⏰ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
  }, [searchParams]);



  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setTokens } = useUserStore();

  const { mutate: login, isPending } = useLoginMutation({
    onSuccess: async (data) => {
      console.log("login response:", data);
      console.log("accessToken:", data.accessToken);
      console.log("refreshToken:", data.refreshToken);

      // Extract tokens from response
      const { accessToken, refreshToken } = data;
      console.log("Extracted accessToken:", accessToken);
      console.log("Extracted refreshToken:", refreshToken);

      setTokens({ accessToken, refreshToken });

      toast.success("🎉 Đăng nhập thành công! Chào mừng trở lại!");
      const redirect = searchParams.get("redirect");
      console.log("Redirect URL:", redirect);
      console.log("ROUTES.HOME:", ROUTES.HOME);
      console.log("Final redirect destination:", redirect || ROUTES.HOME);

      // Use Next.js router for client-side navigation
      const destination = redirect || ROUTES.HOME;
      console.log("Navigating to:", destination);
      router.push(destination);

      form.reset();
    },
    onError: (error: any) => {
      console.error('Login error:', error);

      // Handle specific error types
      if (error.response?.status === 401) {
        toast.error('❌ Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
        form.setFocus('email');
      } else if (error.response?.status === 400) {
        toast.error('❌ Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
      } else {
        toast.error('❌ Đăng nhập thất bại. Vui lòng thử lại sau.');
      }
    },
  });

  const handleSubmit: SubmitHandler<LoginSchemaType> = (data) => {
    
    login(data);
  };





  return (
    <div className={cn("flex flex-col gap-8", className)} {...props}>
      {/* Header */}
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
          Chào mừng trở lại
        </h1>
        <p className="text-sm text-gray-600">
          Nhập thông tin để đăng nhập vào tài khoản
        </p>
      </div>

      {/* Form */}
      <Form form={form} onSubmit={handleSubmit} className="grid gap-5">
        <TextField
          id="email"
          name="email"
          control={form.control}
          label="Email"
          placeholder="you@example.com"
          isRequired
          disabled={isPending}
          className="transition-all focus-within:ring-2 focus-within:ring-purple-500/20"
        />

        <TextField
          id="password"
          name="password"
          control={form.control}
          label="Mật khẩu"
          placeholder="••••••••"
          isRequired
          isPassword
          type="password"
          disabled={isPending}
          className="transition-all focus-within:ring-2 focus-within:ring-purple-500/20"
        />

        {/* Submit Button */}
        <Button
          id="login-button"
          type="submit"
          className={cn(
            "w-full h-12 text-base font-medium",
            "bg-purple-600 hover:bg-purple-700",
            "active:scale-95 transition-all duration-200",
            "shadow-lg hover:shadow-purple-600/25",
            "disabled:opacity-70 disabled:cursor-not-allowed",
            isPending && "opacity-80"
          )}
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Đang đăng nhập...
            </span>
          ) : (
            "Đăng Nhập Ngay"
          )}
        </Button>

        {/* Forgot Password */}
        <Link
          id="forget-password-link"
          href={"#"}
          className={cn(
            "text-center text-sm font-medium text-purple-600",
            "hover:text-purple-700 hover:underline underline-offset-4",
            "transition-all duration-200 hover:scale-105 inline-block"
          )}
        >
          Quên mật khẩu?
        </Link>
      </Form>

      {/* Divider */}
      <div className="relative text-center text-sm">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <span className="relative bg-white px-3 text-gray-500">
          Hoặc tiếp tục với
        </span>
      </div>

      {/* Register Link */}
      <div className="text-center text-sm text-gray-600">
        Chưa có tài khoản?{" "}
        <Link
          id="register-link"
          href={ROUTES.REGISTER}
          className={cn(
            "font-medium text-purple-600 underline underline-offset-4",
            "hover:text-purple-700 hover:no-underline",
            "transition-all duration-200 hover:scale-105 inline-block"
          )}
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
}
