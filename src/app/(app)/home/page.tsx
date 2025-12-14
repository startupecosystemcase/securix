'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Car, ConciergeBell } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuthStore();

  const hasActiveSubscription = user?.subscription?.isActive;

  const tiles = [
    {
      id: 'sos',
      title: t('home.sos'),
      icon: AlertTriangle,
      color: 'bg-red-600',
      size: 'large' as const,
      onClick: () => router.push('/sos'),
      disabled: !hasActiveSubscription,
    },
    {
      id: 'bodyguard',
      title: t('home.bodyguard'),
      icon: Shield,
      color: 'bg-yellow-500',
      size: 'medium' as const,
      onClick: () => router.push('/bodyguard'),
    },
    {
      id: 'driver',
      title: t('home.driver'),
      icon: Car,
      color: 'bg-blue-600',
      size: 'medium' as const,
      onClick: () => router.push('/driver'),
    },
    {
      id: 'concierge',
      title: t('home.concierge'),
      icon: ConciergeBell,
      color: 'bg-purple-600',
      size: 'medium' as const,
      onClick: () => router.push('/concierge'),
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gradient-yellow">
          {t('home.title')}
        </h1>

        {/* Service Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {tiles.map((tile, index) => {
            const Icon = tile.icon;
            const isLarge = tile.size === 'large';
            
            return (
              <motion.div
                key={tile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={isLarge ? 'md:col-span-2 lg:col-span-1' : ''}
              >
                <Card
                  className={`${tile.color} p-6 cursor-pointer transition-transform hover:scale-105 ${
                    tile.disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={tile.disabled ? undefined : tile.onClick}
                >
                  <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                    <Icon size={isLarge ? 64 : 48} className="mb-4 text-white" />
                    <h2 className="text-2xl font-bold text-white">{tile.title}</h2>
                    {tile.disabled && (
                      <p className="text-white/80 text-sm mt-2">
                        Требуется активная подписка
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Feed Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-gray-900 border-gray-800">
            <h2 className="text-xl font-semibold mb-4">{t('home.safetyTips')}</h2>
            <div className="space-y-3">
              <div className="p-3 bg-gray-800 rounded-lg">
                <h3 className="font-medium text-white mb-1">Безопасность в общественных местах</h3>
                <p className="text-gray-400 text-sm">
                  Всегда сообщайте близким о вашем местоположении при посещении новых мест.
                </p>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg">
                <h3 className="font-medium text-white mb-1">Экстренные ситуации</h3>
                <p className="text-gray-400 text-sm">
                  Используйте кнопку SOS только в случае реальной угрозы вашей безопасности.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 border-gray-800">
            <h2 className="text-xl font-semibold mb-4">{t('home.updates')}</h2>
            <div className="space-y-3">
              <div className="p-3 bg-gray-800 rounded-lg">
                <h3 className="font-medium text-white mb-1">Новая функция: Консьерж-сервис</h3>
                <p className="text-gray-400 text-sm">
                  Теперь вы можете заказать персонального консьержа для решения бытовых задач.
                </p>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg">
                <h3 className="font-medium text-white mb-1">Обновление приложения</h3>
                <p className="text-gray-400 text-sm">
                  Улучшена стабильность и скорость работы приложения.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

