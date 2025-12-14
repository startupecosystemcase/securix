'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function SOSPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [audioRecorded, setAudioRecorded] = useState(false);
  const [contactsNotified, setContactsNotified] = useState(false);
  const [gbrNotified, setGbrNotified] = useState(false);

  useEffect(() => {
    checkAuth();
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    // Проверка подписки
    if (!user?.subscription?.isActive) {
      alert('SOS доступен только при активной подписке');
      router.push('/app/dashboard');
      return;
    }
  }, [isAuthenticated, user, router, checkAuth]);

  useEffect(() => {
    if (isActive && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isActive && countdown === 0) {
      setAudioRecorded(true);
      setContactsNotified(true);
      setGbrNotified(true);
    }
  }, [isActive, countdown]);

  const handleActivate = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setIsActive(true);
    setCountdown(60);
    
    // Моковая активация SOS
    // В реальности здесь будет:
    // - Получение геолокации
    // - Запись аудио (1 минута)
    // - Уведомление контактов через WhatsApp
    // - Уведомление ГБР
  };

  const handleCancel = () => {
    setIsActive(false);
    setCountdown(60);
    setAudioRecorded(false);
    setContactsNotified(false);
    setGbrNotified(false);
  };

  if (!user?.subscription?.isActive) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-red-950/20"></div>

      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence>
          {!isActive && !showConfirm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-sm border-gray-800">
                <CardContent className="p-8">
                  <motion.div
                    className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <AlertTriangle className="w-12 h-12 text-white" />
                  </motion.div>
                  <h1 className="text-3xl font-bold text-white mb-4">Экстренная кнопка SOS</h1>
                  <p className="text-gray-400 mb-8">
                    Используйте только в случае реальной чрезвычайной ситуации
                  </p>
                  <Button
                    onClick={handleActivate}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold py-6 rounded-xl text-lg"
                  >
                    Активировать SOS
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {showConfirm && !isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-sm border-red-500/50">
                <CardContent className="p-8">
                  <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">
                    Подтверждение активации
                  </h2>
                  <p className="text-gray-300 mb-8 text-center">
                    Вы уверены, что это настоящая чрезвычайная ситуация?
                  </p>
                  <div className="space-y-4">
                    <Button
                      onClick={handleConfirm}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold py-6 rounded-xl"
                    >
                      Да, активировать
                    </Button>
                    <Button
                      onClick={() => setShowConfirm(false)}
                      variant="outline"
                      className="w-full border-gray-700 text-white hover:bg-gray-800 py-6 rounded-xl"
                    >
                      Отмена
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Card className="bg-gradient-to-br from-red-900/50 to-red-950/50 backdrop-blur-sm border-red-500/50">
                <CardContent className="p-8">
                  <motion.div
                    className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Shield className="w-16 h-16 text-white" />
                  </motion.div>
                  <h1 className="text-3xl font-bold text-white mb-2">Помощь в пути</h1>
                  <p className="text-gray-300 mb-8">Ваш сигнал получен, помощь уже направляется</p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-yellow-400" />
                        <span className="text-white">Геолокация</span>
                      </div>
                      <span className="text-green-400">✓ Отправлена</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-yellow-400" />
                        <span className="text-white">Аудио запись</span>
                      </div>
                      {audioRecorded ? (
                        <span className="text-green-400">✓ Записано</span>
                      ) : (
                        <span className="text-yellow-400">{countdown}с</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        <span className="text-white">Контакты</span>
                      </div>
                      {contactsNotified ? (
                        <span className="text-green-400">✓ Уведомлены</span>
                      ) : (
                        <span className="text-yellow-400">Отправка...</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-yellow-400" />
                        <span className="text-white">ГБР</span>
                      </div>
                      {gbrNotified ? (
                        <span className="text-green-400">✓ Уведомлен</span>
                      ) : (
                        <span className="text-yellow-400">Отправка...</span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="w-full border-gray-700 text-white hover:bg-gray-800 py-6 rounded-xl"
                  >
                    Отменить SOS
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

