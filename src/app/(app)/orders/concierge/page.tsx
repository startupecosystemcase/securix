'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ConciergeBell, Calendar, FileText, BookOpen, Truck, Users } from 'lucide-react';
import { useOrdersStore } from '@/lib/stores/orders';
import { formatKZT } from '@/lib/currency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const conciergeSchema = z.object({
  type: z.enum(['booking', 'transport', 'organization']),
  date: z.string().min(1, 'Выберите дату'),
  details: z.string().min(10, 'Опишите детали заказа (минимум 10 символов)'),
});

type ConciergeForm = z.infer<typeof conciergeSchema>;

const conciergeTypes = {
  booking: {
    label: 'Бронирование',
    icon: BookOpen,
    description: 'Бронирование столиков, билетов, отелей',
  },
  transport: {
    label: 'Транспорт',
    icon: Truck,
    description: 'Организация перевозок и логистики',
  },
  organization: {
    label: 'Организация',
    icon: Users,
    description: 'Организация мероприятий и встреч',
  },
};

export default function ConciergeOrderPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { createOrder, isLoading } = useOrdersStore();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ConciergeForm>({
    resolver: zodResolver(conciergeSchema),
    defaultValues: {
      type: 'booking',
    },
  });

  const selectedType = watch('type');
  const basePrice = 20000; // базовая цена

  const onSubmit = async (data: ConciergeForm) => {
    try {
      createOrder({
        type: 'concierge',
        price: basePrice,
        scheduledAt: new Date(`${data.date}T00:00`),
        description: `${conciergeTypes[data.type].label}: ${data.details}`,
      });
      
      router.push('/dashboard?tab=history');
    } catch (error) {
      console.error('Ошибка создания заказа:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <ConciergeBell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Консьерж-сервис</h1>
              <p className="text-gray-400 mt-1">Персональный помощник для решения ваших задач</p>
            </div>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ConciergeBell className="w-5 h-5 text-purple-400" />
                Тип услуги
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(conciergeTypes).map(([key, typeInfo]) => {
                  const IconComponent = typeInfo.icon;
                  const isSelected = selectedType === key;
                  
                  return (
                    <motion.label
                      key={key}
                      variants={itemVariants}
                      className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 bg-gray-800/30 hover:border-purple-500/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="radio"
                        value={key}
                        {...register('type')}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                          isSelected ? 'bg-purple-500' : 'bg-gray-700'
                        }`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <p className="font-semibold mb-1">{typeInfo.label}</p>
                        <p className="text-xs text-gray-400">{typeInfo.description}</p>
                      </div>
                    </motion.label>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Детали заказа
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div variants={itemVariants}>
                <Label htmlFor="date" className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  Дата выполнения
                </Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                  className="bg-gray-800/50 border-gray-700 text-white focus:border-purple-500"
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                />
                {errors.date && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.date.message}
                  </motion.p>
                )}
                <p className="text-sm text-gray-400 mt-1">
                  Максимальный срок бронирования: 30 дней
                </p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="details" className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4" />
                  Детальное описание
                </Label>
                <textarea
                  id="details"
                  {...register('details')}
                  rows={6}
                  placeholder="Опишите детали вашего заказа. Чем подробнее, тем быстрее мы сможем помочь..."
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-md px-3 py-2 focus:border-purple-500 focus:outline-none resize-none"
                />
                {errors.details && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.details.message}
                  </motion.p>
                )}
                <p className="text-sm text-gray-400 mt-1">
                  Минимум 10 символов. Укажите все важные детали для лучшего результата.
                </p>
              </motion.div>
            </CardContent>
          </Card>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-sm">Базовая стоимость</p>
                    <p className="text-3xl font-bold text-purple-400 mt-1">
                      {formatKZT(basePrice)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Окончательная стоимость может быть скорректирована после уточнения деталей
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Тип услуги</p>
                    <p className="text-lg font-semibold">
                      {conciergeTypes[selectedType].label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 border-gray-700 text-white hover:bg-gray-800"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-bold py-6 rounded-xl shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Обработка...
                </span>
              ) : (
                'Отправить заявку'
              )}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}

