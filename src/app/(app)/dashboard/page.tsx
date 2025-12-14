'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/auth';
import { useOrdersStore } from '@/stores/orders';
import { formatKZT } from '@/lib/utils/currency';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, History, Bell, CreditCard } from 'lucide-react';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { orders } = useOrdersStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'subscription' | 'notifications'>('profile');

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gradient-yellow">
          {t('dashboard.title')}
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'border-b-2 border-yellow-500 text-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="inline-block mr-2" size={16} />
            {t('dashboard.profile')}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'history'
                ? 'border-b-2 border-yellow-500 text-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <History className="inline-block mr-2" size={16} />
            {t('dashboard.history')}
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'subscription'
                ? 'border-b-2 border-yellow-500 text-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <CreditCard className="inline-block mr-2" size={16} />
            {t('dashboard.subscription')}
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'border-b-2 border-yellow-500 text-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Bell className="inline-block mr-2" size={16} />
            {t('dashboard.notifications')}
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'profile' && (
            <Card className="p-6 bg-gray-900 border-gray-800">
              <h2 className="text-2xl font-semibold mb-4">{t('dashboard.profile')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">{t('auth.name')}</label>
                  <p className="text-white text-lg">{user?.name || '-'}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">{t('auth.email')}</label>
                  <p className="text-white text-lg">{user?.email || '-'}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">{t('auth.phone')}</label>
                  <p className="text-white text-lg">{user?.phone || '-'}</p>
                </div>
                <Button className="bg-yellow-500 text-black hover:bg-yellow-400">
                  {t('dashboard.editProfile')}
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'history' && (
            <Card className="p-6 bg-gray-900 border-gray-800">
              <h2 className="text-2xl font-semibold mb-4">{t('dashboard.history')}</h2>
              {recentOrders.length === 0 ? (
                <p className="text-gray-400">{t('dashboard.noHistory')}</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-white capitalize">{order.type}</h3>
                          <p className="text-gray-400 text-sm">
                            {order.createdAt.toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-500 font-semibold">{formatKZT(order.price)}</p>
                          <p className="text-gray-400 text-sm capitalize">{order.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {activeTab === 'subscription' && (
            <Card className="p-6 bg-gray-900 border-gray-800">
              <h2 className="text-2xl font-semibold mb-4">{t('dashboard.subscription')}</h2>
              {user?.subscription ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">{t('subscription.current')}</label>
                    <p className="text-white text-lg">{user.subscription.planName}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">{t('dashboard.hoursRemaining')}</label>
                    <p className="text-white text-lg">{user.subscription.hoursRemaining} {t('subscription.hours')}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">{t('dashboard.expiresAt')}</label>
                    <p className="text-white text-lg">
                      {new Date(user.subscription.expiresAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <Button className="bg-yellow-500 text-black hover:bg-yellow-400">
                    {t('subscription.change')}
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-400 mb-4">{t('dashboard.noSubscription')}</p>
                  <Button className="bg-yellow-500 text-black hover:bg-yellow-400">
                    {t('dashboard.activateSubscription')}
                  </Button>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-6 bg-gray-900 border-gray-800">
              <h2 className="text-2xl font-semibold mb-4">{t('dashboard.notifications')}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Push-уведомления</p>
                    <p className="text-gray-400 text-sm">Получать уведомления в браузере</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Email-уведомления</p>
                    <p className="text-gray-400 text-sm">Получать уведомления на email</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" defaultChecked />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

