'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Минимум 6 символов'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Неверный формат email'),
  phone: z.string().min(10, 'Неверный формат телефона'),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const router = useRouter();
  const { login, register, isLoading } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [smsCode, setSmsCode] = useState('');
  const [showSmsCode, setShowSmsCode] = useState(false);
  const [step, setStep] = useState<'form' | 'sms'>('form');

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const handleLogin = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      router.push('/app/home');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    try {
      // Моковая отправка SMS
      setShowSmsCode(true);
      setStep('sms');
      // В реальности здесь будет запрос на отправку SMS
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  const handleSmsCode = async () => {
    // Моковая проверка кода (всегда 123456)
    if (smsCode === '123456' || smsCode === '000000') {
      const data = registerForm.getValues();
      try {
        await register(data.email, data.phone, data.name);
        router.push('/app/onboarding');
      } catch (error) {
        console.error('Registration error:', error);
      }
    } else {
      alert('Неверный код. Попробуйте 123456 или 000000');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.1),transparent_50%)]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-sm border-gray-800 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-black" />
            </div>
            <CardTitle className="text-3xl font-bold text-white">
              {isLogin ? 'Вход' : 'Регистрация'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {isLogin 
                ? 'Войдите в свой аккаунт Securix'
                : 'Создайте аккаунт и получите месяц премиум-подписки бесплатно'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 'form' ? (
              <>
                {isLogin ? (
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...loginForm.register('email')}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        placeholder="your@email.com"
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-red-400 text-sm">{loginForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Пароль
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        {...loginForm.register('password')}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        placeholder="••••••••"
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-red-400 text-sm">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-6 rounded-xl"
                    >
                      {isLoading ? 'Вход...' : 'Войти'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">
                        Имя
                      </Label>
                      <Input
                        id="name"
                        {...registerForm.register('name')}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        placeholder="Ваше имя"
                      />
                      {registerForm.formState.errors.name && (
                        <p className="text-red-400 text-sm">{registerForm.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...registerForm.register('email')}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        placeholder="your@email.com"
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-red-400 text-sm">{registerForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Телефон
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...registerForm.register('phone')}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        placeholder="+7 (XXX) XXX-XX-XX"
                      />
                      {registerForm.formState.errors.phone && (
                        <p className="text-red-400 text-sm">{registerForm.formState.errors.phone.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-6 rounded-xl"
                    >
                      {isLoading ? 'Отправка...' : 'Продолжить'}
                    </Button>
                  </form>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-700"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-900 px-2 text-gray-400">или</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full border-gray-700 text-white hover:bg-gray-800"
                >
                  {isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт?'}
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-white mb-2">Код отправлен на ваш телефон</p>
                  <p className="text-gray-400 text-sm">Введите код из SMS (для демо: 123456 или 000000)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smsCode" className="text-white">
                    Код подтверждения
                  </Label>
                  <Input
                    id="smsCode"
                    type="text"
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                    className="bg-gray-900/50 border-gray-700 text-white text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
                <Button
                  onClick={handleSmsCode}
                  disabled={smsCode.length !== 6}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-6 rounded-xl"
                >
                  Подтвердить
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStep('form');
                    setShowSmsCode(false);
                    setSmsCode('');
                  }}
                  className="w-full text-gray-400 hover:text-white"
                >
                  Назад
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

