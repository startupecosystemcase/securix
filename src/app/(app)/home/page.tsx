'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useSubscriptionStore } from '@/lib/stores/subscription';
import { useSOSStore } from '@/lib/stores/sos';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Car, ConciergeBell, AlertTriangle, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Onboarding from '@/components/Onboarding';

export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { subscription } = useSubscriptionStore();
  const { status: sosStatus, activate: activateSOS } = useSOSStore();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Показать онбординг при первой активации подписки
    if (subscription?.isActive) {
      const hasSeenOnboarding = localStorage.getItem('securix-onboarding-seen');
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [subscription]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('securix-onboarding-seen', 'true');
    setShowOnboarding(false);
  };

  const services = [
    {
      id: 'sos',
      title: t('services.sos.title'),
      description: t('services.sos.description'),
      icon: AlertTriangle,
      color: 'bg-red-500',
      onClick: () => {
        if (!subscription?.isActive) {
          alert('Для использования SOS необходима активная подписка');
          return;
        }
        if (confirm(t('services.sos.confirmMessage'))) {
          activateSOS();
        }
      },
      disabled: !subscription?.isActive,
    },
    {
      id: 'bodyguard',
      title: t('services.bodyguard.title'),
      description: t('services.bodyguard.description'),
      icon: Shield,
      color: 'bg-yellow-500',
      onClick: () => router.push('/orders/bodyguard'),
    },
    {
      id: 'driver',
      title: t('services.driver.title'),
      description: t('services.driver.description'),
      icon: Car,
      color: 'bg-blue-500',
      onClick: () => router.push('/orders/driver'),
    },
    {
      id: 'concierge',
      title: t('services.concierge.title'),
      description: t('services.concierge.description'),
      icon: ConciergeBell,
      color: 'bg-purple-500',
      onClick: () => router.push('/orders/concierge'),
    },
  ];

  return (
    <>
      {showOnboarding && (
        <Onboarding
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingComplete}
        />
      )}
      <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Securix</h1>
          <p className="text-gray-400">Ваша безопасность в один клик</p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`p-6 bg-gray-900 border-gray-800 cursor-pointer hover:border-yellow-500 transition-all ${
                    service.disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={service.onClick}
                >
                  <div className="flex items-start gap-4">
                    <div className={`${service.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">{service.description}</p>
                      {service.id === 'sos' && sosStatus === 'active' && (
                        <div className="flex items-center gap-2 text-red-500">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-sm font-semibold">АКТИВЕН</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="border-gray-800 hover:border-yellow-500"
            onClick={() => router.push('/dashboard')}
          >
            Личный кабинет
          </Button>
          <Button
            variant="outline"
            className="border-gray-800 hover:border-yellow-500"
            onClick={() => router.push('/chat')}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Чат с оператором
          </Button>
          <Button
            variant="outline"
            className="border-gray-800 hover:border-yellow-500"
            onClick={() => router.push('/dashboard?tab=subscription')}
          >
            Подписка
          </Button>
        </div>

        {/* Feed Placeholder */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Советы по безопасности</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 bg-gray-900 border-gray-800">
                <h3 className="font-semibold mb-2">Совет по безопасности #{i}</h3>
                <p className="text-sm text-gray-400">
                  Полезная информация о безопасности и рекомендации от экспертов Securix.
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

