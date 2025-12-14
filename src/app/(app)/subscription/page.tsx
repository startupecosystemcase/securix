'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/lib/stores/auth';
import { formatKZT, convertUSDToKZT } from '@/lib/utils/currency';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';

const PLANS = [
  {
    id: 'basic',
    name: 'Базовый',
    price: convertUSDToKZT(50), // ~22,500 ₸
    hours: 10,
    features: ['10 часов охраны', 'Доступ к SOS', 'Чат с оператором'],
  },
  {
    id: 'premium',
    name: 'Премиум',
    price: convertUSDToKZT(120), // ~54,000 ₸
    hours: 30,
    features: ['30 часов охраны', 'Доступ к SOS', 'Чат с оператором', 'Приоритетная поддержка'],
    popular: true,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: convertUSDToKZT(240), // ~108,000 ₸
    hours: 80,
    features: ['80 часов охраны', 'Доступ к SOS', 'Чат с оператором', 'Приоритетная поддержка', 'Персональный менеджер'],
  },
];

export default function SubscriptionPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, updateSubscription } = useAuthStore();
  const [promoCode, setPromoCode] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    const plan = PLANS.find((p) => p.id === planId);
    if (plan) {
      updateSubscription({
        planId: plan.id,
        planName: plan.name,
        hoursRemaining: plan.hours,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
      });
      
      // Перенаправление на онбординг
      router.push('/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gradient-yellow text-center">
          {t('subscription.title')}
        </h1>

        {user?.subscription && (
          <Card className="p-6 bg-gray-900 border-gray-800 mb-8">
            <h2 className="text-xl font-semibold mb-4">{t('subscription.current')}</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white text-lg">{user.subscription.planName}</p>
                <p className="text-gray-400">
                  {user.subscription.hoursRemaining} {t('subscription.hours')} осталось
                </p>
              </div>
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-yellow-500 text-black hover:bg-yellow-400"
              >
                {t('subscription.change')}
              </Button>
            </div>
          </Card>
        )}

        <div className="mb-6">
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              type="text"
              placeholder={t('subscription.promoCode')}
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Button className="bg-yellow-500 text-black hover:bg-yellow-400">
              {t('subscription.apply')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`p-6 bg-gray-900 border-gray-800 relative ${
                plan.popular ? 'border-yellow-500 border-2' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
                    Популярный
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-yellow-500">
                  {formatKZT(plan.price)}
                </span>
                <span className="text-gray-400"> / {t('subscription.monthly')}</span>
              </div>

              <div className="mb-6">
                <p className="text-white text-lg mb-4">
                  {plan.hours} {t('subscription.hours')}
                </p>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-300">
                      <Check size={16} className="text-yellow-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full ${
                  plan.popular
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {t('subscription.select')}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

