'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Неверный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const isLoading = false;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      // Моковая авторизация
      const mockUser = {
        id: '1',
        email: data.email,
        phone: '+77001234567',
        name: 'Пользователь',
        subscription: null,
        onboardingCompleted: false,
      };
      setUser(mockUser);
      setToken('mock-token');
      router.push('/home');
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-gray-900 border-gray-800">
          <h1 className="text-3xl font-bold mb-2">{t('auth.login')}</h1>
          <p className="text-gray-400 mb-6">Войдите в свой аккаунт Securix</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className="bg-gray-800 border-gray-700 text-white mt-1"
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className="bg-gray-800 border-gray-700 text-white mt-1"
                placeholder="••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              {isLoading ? t('common.loading') : t('auth.loginButton')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {t('auth.dontHaveAccount')}{' '}
              <Link href="/register" className="text-yellow-500 hover:text-yellow-400">
                {t('auth.register')}
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-gray-400 hover:text-white text-sm">
              ← Вернуться на главную
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

