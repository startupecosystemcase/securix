'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/auth';
import { mockSendSMS, mockLogin } from '@/lib/mocks/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const loginSchema = z.object({
  phone: z.string().min(10, 'Номер телефона должен содержать минимум 10 цифр'),
  code: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onPhoneSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError(null);
    try {
      await mockSendSMS(data.phone);
      setPhoneNumber(data.phone);
      setStep('code');
    } catch (err) {
      setError('Ошибка отправки SMS');
    } finally {
      setLoading(false);
    }
  };

  const onCodeSubmit = async (data: LoginForm) => {
    if (!data.code) {
      setError('Введите код');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { token, user } = await mockLogin(phoneNumber, data.code);
      setToken(token);
      setUser(user);
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-gray-900 border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-gradient-yellow text-center">
          {t('auth.login')}
        </h1>

        {step === 'phone' ? (
          <form onSubmit={handleSubmit(onPhoneSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="phone">{t('auth.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (___) ___-__-__"
                {...register('phone')}
                className="mt-1 bg-gray-800 border-gray-700 text-white"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 text-black hover:bg-yellow-400"
            >
              {loading ? t('common.loading') : t('auth.sendCode')}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onCodeSubmit)} className="space-y-4">
            <p className="text-gray-400 text-sm mb-4">
              {t('auth.codeSent', { phone: phoneNumber })}
            </p>

            <div>
              <Label htmlFor="code">{t('auth.code')}</Label>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                maxLength={6}
                {...register('code')}
                className="mt-1 bg-gray-800 border-gray-700 text-white text-center text-2xl tracking-widest"
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 text-black hover:bg-yellow-400"
            >
              {loading ? t('common.loading') : t('auth.verifyCode')}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep('phone')}
              className="w-full text-gray-400 hover:text-white"
            >
              {t('auth.resendCode')}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

