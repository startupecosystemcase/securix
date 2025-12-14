'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSOSStore } from '@/lib/stores/sos';
import { useOrdersStore } from '@/lib/stores/orders';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, User, AlertTriangle } from 'lucide-react';
import { formatKZT } from '@/lib/currency';

export default function GBRDashboardPage() {
  const { t } = useTranslation();
  const { currentActivation, status, resolve } = useSOSStore();
  const { orders, updateOrderStatus } = useOrdersStore();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{t('gbr.title')}</h1>

        {/* SOS Activations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('gbr.sosActivations')}</h2>
          {currentActivation && status === 'active' ? (
            <Card className="p-6 bg-red-900/20 border-red-500">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <h3 className="text-xl font-bold text-red-500">АКТИВНАЯ АКТИВАЦИЯ SOS</h3>
                </div>
                <Button
                  onClick={() => resolve()}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Разрешить
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">{t('gbr.user')}:</span>
                  <span className="font-semibold">Пользователь #1</span>
                </div>
                {currentActivation.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">{t('gbr.location')}:</span>
                    <span>{currentActivation.location.address}</span>
                  </div>
                )}
                {currentActivation.activatedAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">{t('gbr.time')}:</span>
                    <span>{new Date(currentActivation.activatedAt).toLocaleString('ru-RU')}</span>
                  </div>
                )}
                <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Контакты уведомлены:</p>
                  <ul className="space-y-1">
                    {currentActivation.contactsNotified.map((contact, i) => (
                      <li key={i} className="text-sm">{contact}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 bg-gray-900 border-gray-800">
              <p className="text-gray-400">Нет активных активаций SOS</p>
            </Card>
          )}
        </div>

        {/* Orders */}
        <div>
          <h2 className="text-2xl font-bold mb-4">{t('gbr.orders')}</h2>
          {orders.length === 0 ? (
            <Card className="p-6 bg-gray-900 border-gray-800">
              <p className="text-gray-400">Нет заказов</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-4 bg-gray-900 border-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{t(`dashboard.history.type.${order.type}`)}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-500' :
                        order.status === 'in_progress' ? 'bg-purple-500/20 text-purple-500' :
                        order.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {t(`dashboard.history.status.${order.status}`)}
                      </span>
                    </div>
                  </div>
                  {order.location && (
                    <p className="text-sm text-gray-400 mb-2">{order.location}</p>
                  )}
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-semibold">{formatKZT(order.price)}</span>
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          {t('gbr.assign')}
                        </Button>
                      )}
                      {order.status === 'confirmed' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'in_progress')}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          {t('gbr.update')}
                        </Button>
                      )}
                      {order.status === 'in_progress' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="bg-purple-500 hover:bg-purple-600"
                        >
                          Завершить
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

