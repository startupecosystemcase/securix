'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/lib/stores/auth';
import { useSubscriptionStore } from '@/lib/stores/subscription';
import { useOrdersStore } from '@/lib/stores/orders';
import { formatKZT } from '@/lib/currency';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, History, CreditCard, Bell, Settings } from 'lucide-react';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { subscription } = useSubscriptionStore();
  const { orders } = useOrdersStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'subscription' | 'notifications'>('profile');

  const tabs = [
    { id: 'profile' as const, label: t('dashboard.profile.title'), icon: User },
    { id: 'history' as const, label: t('dashboard.history.title'), icon: History },
    { id: 'subscription' as const, label: t('dashboard.subscription.title'), icon: CreditCard },
    { id: 'notifications' as const, label: t('dashboard.notifications.title'), icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{t('dashboard.title')}</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-yellow-500 text-yellow-500'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'profile' && (
            <Card className="p-6 bg-gray-900 border-gray-800">
              <h2 className="text-2xl font-bold mb-4">{t('dashboard.profile.title')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">{t('dashboard.profile.name')}</label>
                  <p className="text-white">{user?.name || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">{t('dashboard.profile.email')}</label>
                  <p className="text-white">{user?.email || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">{t('dashboard.profile.phone')}</label>
                  <p className="text-white">{user?.phone || '-'}</p>
                </div>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  {t('dashboard.profile.edit')}
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">{t('dashboard.history.title')}</h2>
              {orders.length === 0 ? (
                <Card className="p-8 text-center bg-gray-900 border-gray-800">
                  <p className="text-gray-400 mb-4">{t('dashboard.history.empty')}</p>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    {t('dashboard.history.createOrder')}
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 10).map((order) => (
                    <Card key={order.id} className="p-4 bg-gray-900 border-gray-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{t(`dashboard.history.type.${order.type}`)}</p>
                          <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</p>
                          <p className="text-sm text-gray-400">{t(`dashboard.history.status.${order.status}`)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatKZT(order.price)}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'subscription' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">{t('dashboard.subscription.title')}</h2>
              {subscription ? (
                <Card className="p-6 bg-gray-900 border-gray-800">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">{t('dashboard.subscription.plans.' + subscription.plan)}</p>
                      <p className={`text-lg font-semibold ${subscription.isActive ? 'text-green-500' : 'text-red-500'}`}>
                        {subscription.isActive ? t('dashboard.subscription.active') : t('dashboard.subscription.inactive')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{t('dashboard.subscription.hoursRemaining')}</p>
                      <p className="text-2xl font-bold">{subscription.hoursRemaining} / {subscription.totalHours}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{t('dashboard.subscription.renewalDate')}</p>
                      <p className="text-white">{new Date(subscription.endDate).toLocaleDateString('ru-RU')}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      {t('dashboard.subscription.cancel')}
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-8 text-center bg-gray-900 border-gray-800">
                  <p className="text-gray-400 mb-4">{t('dashboard.subscription.inactive')}</p>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    {t('dashboard.subscription.activate')}
                  </Button>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-6 bg-gray-900 border-gray-800">
              <h2 className="text-2xl font-bold mb-4">{t('dashboard.notifications.title')}</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{t('dashboard.notifications.push')}</p>
                    <p className="text-sm text-gray-400">{t('dashboard.notifications.enabled')}</p>
                  </div>
                  <Button variant="outline" size="sm">Переключить</Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{t('dashboard.notifications.email')}</p>
                    <p className="text-sm text-gray-400">{t('dashboard.notifications.enabled')}</p>
                  </div>
                  <Button variant="outline" size="sm">Переключить</Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

