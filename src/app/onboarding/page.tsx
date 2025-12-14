'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, MapPin, Mic, Bell, Users, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const onboardingSteps = [
  {
    id: 'sos',
    title: 'Кнопка SOS',
    description: 'В экстренной ситуации нажмите кнопку SOS. Мы автоматически отправим вашу геолокацию, запишем аудио и уведомим ваших близких и службы безопасности.',
    icon: Shield,
    color: 'from-red-500 to-red-600',
  },
  {
    id: 'location',
    title: 'Разрешения',
    description: 'Для работы SOS необходимо разрешить доступ к геолокации, микрофону и уведомлениям.',
    icon: MapPin,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'contacts',
    title: 'Экстренные контакты',
    description: 'Добавьте минимум 3 контакта для экстренных уведомлений. Они будут получать информацию при активации SOS.',
    icon: Users,
    color: 'from-yellow-500 to-yellow-600',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [permissionsGranted, setPermissionsGranted] = useState({
    location: false,
    microphone: false,
    notifications: false,
  });

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Завершение онбординга
      router.push('/app/home');
    }
  };

  const handleGrantPermission = (permission: keyof typeof permissionsGranted) => {
    // Моковое предоставление разрешения
    setPermissionsGranted((prev) => ({
      ...prev,
      [permission]: true,
    }));
  };

  const currentStepData = onboardingSteps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {onboardingSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex-1 h-1 rounded-full mx-1 ${
                  index <= currentStep ? 'bg-yellow-500' : 'bg-gray-800'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm text-center">
            Шаг {currentStep + 1} из {onboardingSteps.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-sm border-gray-800">
              <CardContent className="p-8 text-center">
                <motion.div
                  className={`w-24 h-24 bg-gradient-to-br ${currentStepData.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <IconComponent className="w-12 h-12 text-white" />
                </motion.div>

                <h1 className="text-3xl font-bold text-white mb-4">
                  {currentStepData.title}
                </h1>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  {currentStepData.description}
                </p>

                {currentStep === 1 && (
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-yellow-400" />
                        <span className="text-white">Геолокация</span>
                      </div>
                      {permissionsGranted.location ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleGrantPermission('location')}
                          className="bg-yellow-500 text-black hover:bg-yellow-400"
                        >
                          Разрешить
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Mic className="w-5 h-5 text-yellow-400" />
                        <span className="text-white">Микрофон</span>
                      </div>
                      {permissionsGranted.microphone ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleGrantPermission('microphone')}
                          className="bg-yellow-500 text-black hover:bg-yellow-400"
                        >
                          Разрешить
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-yellow-400" />
                        <span className="text-white">Уведомления</span>
                      </div>
                      {permissionsGranted.notifications ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleGrantPermission('notifications')}
                          className="bg-yellow-500 text-black hover:bg-yellow-400"
                        >
                          Разрешить
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="mb-8">
                    <p className="text-gray-400 mb-4">
                      Добавьте минимум 3 контакта для экстренных уведомлений
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-gray-700 text-white hover:bg-gray-800"
                      onClick={() => router.push('/app/dashboard')}
                    >
                      Добавить контакты (в разработке)
                    </Button>
                  </div>
                )}

                <div className="flex gap-4">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                    >
                      Назад
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    className={`flex-1 bg-gradient-to-r ${currentStepData.color} hover:opacity-90 text-white font-bold py-6 rounded-xl`}
                  >
                    {currentStep === onboardingSteps.length - 1 ? (
                      'Завершить'
                    ) : (
                      <>
                        Далее
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

