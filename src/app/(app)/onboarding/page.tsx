'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, MapPin, Mic, Bell, Users } from 'lucide-react';

const STEPS = [
  {
    id: 'sos',
    icon: Shield,
    title: 'Кнопка SOS',
    description: 'В экстренной ситуации нажмите кнопку SOS. Мы немедленно отправим ваше местоположение и аудиозапись в службы безопасности и вашим контактам.',
  },
  {
    id: 'location',
    icon: MapPin,
    title: 'Геолокация',
    description: 'Для работы SOS необходимо разрешение на доступ к вашей геолокации. Это позволит нам быстро найти вас в случае экстренной ситуации.',
  },
  {
    id: 'audio',
    icon: Mic,
    title: 'Аудиозапись',
    description: 'При активации SOS автоматически начинается запись аудио продолжительностью 1 минута. Это поможет службам безопасности понять ситуацию.',
  },
  {
    id: 'contacts',
    icon: Users,
    title: 'Контакты для экстренных случаев',
    description: 'Добавьте минимум 3 контакта, которые будут уведомлены при активации SOS. Это могут быть близкие родственники или доверенные лица.',
  },
  {
    id: 'notifications',
    icon: Bell,
    title: 'Уведомления',
    description: 'Разрешите отправку уведомлений, чтобы получать важные обновления о статусе ваших заказов и экстренных ситуациях.',
  },
];

export default function OnboardingPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { completeOnboarding } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [permissions, setPermissions] = useState({
    location: false,
    microphone: false,
    notifications: false,
    contacts: false,
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Завершение онбординга
      completeOnboarding();
      router.push('/home');
    }
  };

  const handlePermission = (permission: keyof typeof permissions) => {
    setPermissions((prev) => ({ ...prev, [permission]: true }));
  };

  const currentStepData = STEPS[currentStep];
  const Icon = currentStepData.icon;
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-gray-900 border-gray-800">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Шаг {currentStep + 1} из {STEPS.length}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(((currentStep + 1) / STEPS.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <motion.div
              className="bg-yellow-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Icon size={40} className="text-yellow-500" />
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4">{currentStepData.title}</h2>
            <p className="text-gray-400 text-lg mb-8">{currentStepData.description}</p>

            {currentStepData.id === 'location' && (
              <Button
                onClick={() => handlePermission('location')}
                className="bg-yellow-500 text-black hover:bg-yellow-400 mb-4"
              >
                Разрешить геолокацию
              </Button>
            )}

            {currentStepData.id === 'audio' && (
              <Button
                onClick={() => handlePermission('microphone')}
                className="bg-yellow-500 text-black hover:bg-yellow-400 mb-4"
              >
                Разрешить микрофон
              </Button>
            )}

            {currentStepData.id === 'notifications' && (
              <Button
                onClick={() => handlePermission('notifications')}
                className="bg-yellow-500 text-black hover:bg-yellow-400 mb-4"
              >
                Разрешить уведомления
              </Button>
            )}

            {currentStepData.id === 'contacts' && (
              <div className="mb-4">
                <p className="text-gray-400 mb-4">
                  Добавьте минимум 3 контакта для экстренных случаев
                </p>
                <Button
                  onClick={() => handlePermission('contacts')}
                  className="bg-yellow-500 text-black hover:bg-yellow-400"
                >
                  Добавить контакты
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          {currentStep > 0 && (
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              {t('common.previous')}
            </Button>
          )}
          <div className="flex-1" />
          <Button
            onClick={handleNext}
            className="bg-yellow-500 text-black hover:bg-yellow-400"
          >
            {isLastStep ? 'Завершить' : t('common.next')}
          </Button>
        </div>
      </Card>
    </div>
  );
}

