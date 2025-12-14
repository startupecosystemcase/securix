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

const registerSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Неверный email'),
  phone: z.string().min(10, 'Неверный номер телефона'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  const [step, setStep] = useState<'form' | 'verification'>('form');
  const [verificationCode, setVerificationCode] = useState('');
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    // Моковая отправка SMS
    setStep('verification');
  };

  const handleVerification = async () => {
    // Моковая проверка кода (любой код принимается)
    if (verificationCode.length === 6) {
      const data = getValues();
      try {
        await registerUser(data.email, data.phone, data.name);
        router.push('/home');
      } catch (error) {
        console.error('Ошибка регистрации:', error);
      }
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
          {step === 'form' ? (
            <>
              <h1 className="text-3xl font-bold mb-2">{t('auth.register')}</h1>
              <p className="text-gray-400 mb-6">Создайте аккаунт Securix</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('auth.name')}</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                    placeholder="Иван Иванов"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

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
                  <Label htmlFor="phone">{t('auth.phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                    placeholder="+7 777 123 4567"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  {t('auth.registerButton')}
                </Button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">{t('auth.phoneVerification')}</h1>
              <p className="text-gray-400 mb-6">
                {t('auth.codeSent')} {getValues('phone')}
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="code">{t('auth.enterCode')}</Label>
                  <Input
                    id="code"
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="bg-gray-800 border-gray-700 text-white mt-1 text-center text-2xl tracking-widest"
                    placeholder="000000"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Для демо используйте любой 6-значный код
                  </p>
                </div>

                <Button
                  onClick={handleVerification}
                  disabled={verificationCode.length !== 6 || isLoading}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  {t('auth.verify')}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('form')}
                  className="w-full border-gray-800"
                >
                  {t('common.back')}
                </Button>
              </div>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link href="/login" className="text-yellow-500 hover:text-yellow-400">
                {t('auth.login')}
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

