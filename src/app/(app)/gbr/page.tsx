'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSOSStore } from '@/lib/stores/sos';
import { useOrdersStore } from '@/lib/stores/orders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, User, AlertTriangle, Shield, CheckCircle, XCircle } from 'lucide-react';
import { formatKZT } from '@/lib/currency';
import { motion } from 'framer-motion';

export default function GBRDashboardPage() {
  const { t } = useTranslation();
  const { currentActivation, status, resolve } = useSOSStore();
  const { orders, updateOrderStatus, isLoading } = useOrdersStore();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    // Автоматическое обновление заказов каждые 30 секунд (мок)
    const interval = setInterval(() => {
      // В реальности здесь будет запрос к API
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'confirmed':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Ожидает',
      confirmed: 'Подтвержден',
      in_progress: 'В процессе',
      completed: 'Завершен',
      cancelled: 'Отменен',
    };
    return statusMap[status] || status;
  };

  const getTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      bodyguard: 'Охранник',
      driver: 'Водитель',
      concierge: 'Консьерж',
      sos: 'SOS',
    };
    return typeMap[type] || type;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Дашборд ГБР</h1>
              <p className="text-gray-400 mt-1">Управление заказами и активациями SOS</p>
            </div>
          </div>
        </div>

        {/* SOS Activations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            Активации SOS
          </h2>
          {currentActivation && status === 'active' ? (
            <Card className="bg-gradient-to-br from-red-900/50 to-red-950/50 border-red-500/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-red-400 text-xl">АКТИВНАЯ АКТИВАЦИЯ SOS</CardTitle>
                      <p className="text-gray-400 text-sm mt-1">
                        Активирована {new Date(currentActivation.activatedAt || Date.now()).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => resolve()}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Разрешить
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Пользователь</p>
                      <p className="font-semibold">Пользователь #1</p>
                    </div>
                  </div>
                  {currentActivation.location && (
                    <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Местоположение</p>
                        <p className="font-semibold">{currentActivation.location.address}</p>
                      </div>
                    </div>
                  )}
                  {currentActivation.activatedAt && (
                    <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Время активации</p>
                        <p className="font-semibold">
                          {new Date(currentActivation.activatedAt || Date.now()).toLocaleString('ru-RU')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {currentActivation.contactsNotified && currentActivation.contactsNotified.length > 0 && (
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <p className="text-sm text-gray-400 mb-2">Контакты уведомлены:</p>
                    <ul className="space-y-1">
                      {currentActivation.contactsNotified.map((contact, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          {contact}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border-gray-800">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Нет активных активаций SOS</p>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Orders Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-yellow-400" />
              Управление заказами
            </h2>
            <div className="flex gap-2">
              {(['all', 'pending', 'confirmed', 'in_progress', 'completed'] as const).map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className={
                    filterStatus === status
                      ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                      : 'border-gray-700 text-white hover:bg-gray-800'
                  }
                >
                  {status === 'all' ? 'Все' : getStatusText(status)}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border-gray-800">
              <CardContent className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Загрузка заказов...</p>
              </CardContent>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border-gray-800">
              <CardContent className="p-12 text-center">
                <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  {filterStatus === 'all' ? 'Нет заказов' : `Нет заказов со статусом "${getStatusText(filterStatus)}"`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border-gray-800 hover:border-yellow-500/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{getTypeText(order.type)}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">
                            Создан: {new Date(order.createdAt).toLocaleString('ru-RU')}
                          </p>
                          {order.scheduledAt && (
                            <p className="text-sm text-gray-400 mt-1">
                              Запланирован: {new Date(order.scheduledAt).toLocaleString('ru-RU')}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-yellow-400">{formatKZT(order.price)}</p>
                          {order.duration && (
                            <p className="text-sm text-gray-400">Длительность: {order.duration} ч</p>
                          )}
                        </div>
                      </div>

                      {order.location && (
                        <div className="flex items-center gap-2 mb-4 p-3 bg-gray-800/50 rounded-lg">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{order.location.address}</span>
                        </div>
                      )}

                      {order.description && (
                        <p className="text-gray-300 mb-4 p-3 bg-gray-800/30 rounded-lg">{order.description}</p>
                      )}

                      {order.assignedTo && (
                        <div className="flex items-center gap-2 mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <User className="w-4 h-4 text-blue-400" />
                          <div>
                            <p className="text-sm text-gray-400">Назначен:</p>
                            <p className="font-semibold">{order.assignedTo.name}</p>
                            <p className="text-xs text-gray-500">{order.assignedTo.phone}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Подтвердить
                          </Button>
                        )}
                        {order.status === 'confirmed' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'in_progress')}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            Начать выполнение
                          </Button>
                        )}
                        {order.status === 'in_progress' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="bg-purple-500 hover:bg-purple-600 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Завершить
                          </Button>
                        )}
                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="border-red-500 text-red-400 hover:bg-red-500/10"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Отменить
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

