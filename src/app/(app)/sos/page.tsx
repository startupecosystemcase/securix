'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/auth';
import { useOrdersStore } from '@/stores/orders';
import { AlertTriangle, MapPin, Phone, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function SOSPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuthStore();
  const { addOrder, setActiveSOS } = useOrdersStore();
  const [step, setStep] = useState<'confirm' | 'active'>('confirm');
  const [audioRecording, setAudioRecording] = useState(false);
  const [audioTime, setAudioTime] = useState(0);

  const hasActiveSubscription = user?.subscription?.isActive;

  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="p-8 bg-gray-900 border-gray-800 text-center">
          <AlertTriangle size={64} className="mx-auto mb-4 text-yellow-500" />
          <h2 className="text-2xl font-bold mb-4">Требуется активная подписка</h2>
          <p className="text-gray-400 mb-6">
            Для использования функции SOS необходимо активировать подписку
          </p>
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-yellow-500 text-black hover:bg-yellow-400"
          >
            Перейти к подписке
          </Button>
        </Card>
      </div>
    );
  }

  const handleActivateSOS = () => {
    // Мок активации SOS
    const sosOrder = {
      type: 'sos' as const,
      price: 0,
      location: {
        address: 'Текущее местоположение',
        lat: 43.2220,
        lng: 76.8512,
      },
    };

    addOrder(sosOrder);
    setActiveSOS({
      id: Date.now().toString(),
      ...sosOrder,
      status: 'in_progress',
      createdAt: new Date(),
    });

    setStep('active');
    setAudioRecording(true);

    // Симуляция записи аудио (1 минута)
    const interval = setInterval(() => {
      setAudioTime((prev) => {
        if (prev >= 60) {
          clearInterval(interval);
          setAudioRecording(false);
          return 60;
        }
        return prev + 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'confirm' ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-center min-h-[60vh]"
            >
              <Card className="p-8 bg-gray-900 border-gray-800 text-center max-w-md">
                <AlertTriangle size={80} className="mx-auto mb-6 text-red-500" />
                <h2 className="text-3xl font-bold mb-4 text-red-500">
                  {t('sos.title')}
                </h2>
                <p className="text-xl mb-8 text-gray-300">
                  {t('sos.confirmQuestion')}
                </p>
                <div className="flex gap-4">
                  <Button
                    onClick={() => router.back()}
                    variant="outline"
                    className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                  >
                    {t('sos.cancel')}
                  </Button>
                  <Button
                    onClick={handleActivateSOS}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {t('sos.confirm')}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <Card className="p-8 bg-red-600 border-red-700 text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <AlertTriangle size={80} className="mx-auto mb-4 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2 text-white">
                  {t('sos.active')}
                </h2>
                <p className="text-white/90">
                  Помощь уже в пути. Оставайтесь на связи.
                </p>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6 bg-gray-900 border-gray-800">
                  <div className="flex items-center gap-4 mb-4">
                    <MapPin className="text-yellow-500" size={24} />
                    <h3 className="font-semibold">{t('sos.location')}</h3>
                  </div>
                  <p className="text-gray-400">43.2220° N, 76.8512° E</p>
                  <p className="text-gray-400 text-sm mt-2">Алматы, Казахстан</p>
                </Card>

                <Card className="p-6 bg-gray-900 border-gray-800">
                  <div className="flex items-center gap-4 mb-4">
                    <Phone className="text-yellow-500" size={24} />
                    <h3 className="font-semibold">{t('sos.audio')}</h3>
                  </div>
                  {audioRecording ? (
                    <div>
                      <p className="text-white font-mono text-2xl mb-2">
                        {Math.floor(audioTime / 60)}:{(audioTime % 60).toString().padStart(2, '0')}
                      </p>
                      <p className="text-gray-400 text-sm">Запись в процессе...</p>
                    </div>
                  ) : (
                    <p className="text-gray-400">Запись завершена</p>
                  )}
                </Card>

                <Card className="p-6 bg-gray-900 border-gray-800">
                  <div className="flex items-center gap-4 mb-4">
                    <Users className="text-yellow-500" size={24} />
                    <h3 className="font-semibold">{t('sos.contactsNotified')}</h3>
                  </div>
                  <p className="text-gray-400">3 контакта уведомлены</p>
                </Card>

                <Card className="p-6 bg-gray-900 border-gray-800">
                  <div className="flex items-center gap-4 mb-4">
                    <AlertTriangle className="text-yellow-500" size={24} />
                    <h3 className="font-semibold">{t('sos.gbrNotified')}</h3>
                  </div>
                  <p className="text-gray-400">ГБР уведомлен</p>
                </Card>
              </div>

              <Button
                onClick={() => {
                  setActiveSOS(null);
                  router.push('/home');
                }}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white"
              >
                Закрыть
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

