'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthService, KEYS, useRegisterMutation } from '@/apis/client/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/stores/userStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { registerSchema, RegisterSchemaType } from '@/lib/validations/auth-client';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { TextField } from '@/components/ui/Form/TextField';

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    mode: 'all',
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate: register, isPending } = useRegisterMutation({
    onSuccess: async (registerData) => {
      try {
        // Auto-login after successful registration
        const loginResponse = await AuthService.login({
          email: form.getValues('email'),
          password: form.getValues('password'),
        });

        // Set tokens and user data
        useUserStore.getState().setTokens({
          accessToken: loginResponse.accessToken,
          refreshToken: loginResponse.refreshToken,
        });

        // Fetch and set user data
        const userData = await queryClient.fetchQuery({
          queryKey: [KEYS.AUTH_ME],
          queryFn: AuthService.me,
        });

        toast.success(`🎉 Chào mừng ${userData.full_name || userData.userName}! Tài khoản đã được tạo thành công.`);
        const redirect = searchParams.get('redirect');
        router.push(redirect || ROUTES.HOME);
      } catch (loginError) {
        console.error('Auto-login failed:', loginError);
        // If auto-login fails, show success but redirect to login
        toast.success('✅ Tài khoản đã được tạo! Vui lòng đăng nhập để tiếp tục.');
        router.push(ROUTES.LOGIN);
      }
      form.reset();
    },
    onError: (error: any) => {
      console.error('Registration error:', error);

      // Handle specific error types
      if (error.response?.status === 409) {
        toast.error('❌ Email này đã được sử dụng. Vui lòng chọn email khác.');
        form.setFocus('email');
      } else if (error.response?.status === 400) {
        toast.error('❌ Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
      } else {
        toast.error('❌ Đăng ký thất bại. Vui lòng thử lại sau.');
      }
    },
  });

  const handleSubmit: SubmitHandler<RegisterSchemaType> = (data) => {
    register(data);
  };

  return (
    <div className={cn('flex flex-col gap-8', className)} {...props}>
      {/* Header */}
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
          Tạo tài khoản mới
        </h1>
        <p className="text-sm text-gray-600">Điền thông tin để bắt đầu hành trình học tập</p>
      </div>

      {/* Form */}
      <Form form={form} onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            name="firstName"
            control={form.control}
            label="Tên"
            placeholder="VD: Minh"
            isRequired
            disabled={isPending}
            className="transition-all focus-within:ring-2 focus-within:ring-purple-500/20"
          />
          <TextField
            name="lastName"
            control={form.control}
            label="Họ"
            placeholder="VD: Nguyễn"
            isRequired
            disabled={isPending}
            className="transition-all focus-within:ring-2 focus-within:ring-purple-500/20"
          />
        </div>

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

        <TextField
          id="confirmPassword"
          name="confirmPassword"
          control={form.control}
          label="Xác nhận mật khẩu"
          placeholder="••••••••"
          isRequired
          isPassword
          disabled={isPending}
          className="transition-all focus-within:ring-2 focus-within:ring-purple-500/20"
        />

        {/* Submit Button */}
        <Button
          id="register-button"
          type="submit"
          className={cn(
            'w-full h-12 text-base font-medium',
            'bg-purple-600 hover:bg-purple-700',
            'active:scale-95 transition-all duration-200',
            'shadow-lg hover:shadow-purple-600/25',
            'disabled:opacity-70 disabled:cursor-not-allowed',
            isPending && 'opacity-80'
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
              Đang xử lý...
            </span>
          ) : (
            'Đăng Ký Ngay'
          )}
        </Button>
      </Form>

      {/* Login Link */}
      <div className="text-center text-sm text-gray-600">
        Đã có tài khoản?{' '}
        <Link
          id="login-link"
          href={ROUTES.LOGIN}
          className={cn(
            'font-medium text-purple-600 underline underline-offset-4',
            'hover:text-purple-700 hover:no-underline',
            'transition-all duration-200 hover:scale-105 inline-block'
          )}
        >
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}
