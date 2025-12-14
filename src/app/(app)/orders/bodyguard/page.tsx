'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Shield, Calendar, Clock, MapPin, FileText, Car, User } from 'lucide-react';
import { useOrdersStore } from '@/lib/stores/orders';
import { formatKZT } from '@/lib/currency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const bodyguardSchema = z.object({
  date: z.string().min(1, 'Выберите дату'),
  time: z.string().min(1, 'Выберите время'),
  duration: z.number().min(1, 'Минимальная длительность: 1 час'),
  location: z.string().min(1, 'Укажите местоположение'),
  purpose: z.string().optional(),
  withDriver: z.boolean(),
  withCar: z.boolean(),
});

type BodyguardForm = z.infer<typeof bodyguardSchema>;

export default function BodyguardOrderPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { createOrder, isLoading } = useOrdersStore();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BodyguardForm>({
    resolver: zodResolver(bodyguardSchema),
    defaultValues: {
      duration: 1,
      withDriver: false,
      withCar: false,
    },
  });

  const duration = watch('duration');
  const withDriver = watch('withDriver');
  const withCar = watch('withCar');

  // Моковая цена: базовая ставка + доплаты
  const basePrice = 15000; // за час
  const driverPrice = withDriver ? 5000 : 0;
  const carPrice = withCar ? 10000 : 0;
  const totalPrice = (basePrice + driverPrice + carPrice) * duration;

  const onSubmit = async (data: BodyguardForm) => {
    try {
      createOrder({
        type: 'bodyguard',
        price: totalPrice,
        scheduledAt: new Date(`${data.date}T${data.time}`),
        duration: data.duration,
        location: { 
          address: data.location, 
          lat: 43.2220, 
          lng: 76.8512 
        },
        description: data.purpose || `Сопровождение${withDriver ? ' с водителем' : ''}${withCar ? ' на авто' : ''}`,
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
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Заказ охранника</h1>
              <p className="text-gray-400 mt-1">Профессиональное сопровождение и защита</p>
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
                <Calendar className="w-5 h-5 text-yellow-400" />
                Основная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    Дата
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    {...register('date')}
                    className="bg-gray-800/50 border-gray-700 text-white focus:border-yellow-500"
                    min={new Date().toISOString().split('T')[0]}
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
                </div>
                <div>
                  <Label htmlFor="time" className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4" />
                    Время
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    {...register('time')}
                    className="bg-gray-800/50 border-gray-700 text-white focus:border-yellow-500"
                  />
                  {errors.time && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm mt-1"
                    >
                      {errors.time.message}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="duration" className="mb-2">
                  Длительность (часы)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  {...register('duration', { valueAsNumber: true })}
                  className="bg-gray-800/50 border-gray-700 text-white focus:border-yellow-500"
                />
                {errors.duration && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.duration.message}
                  </motion.p>
                )}
                <p className="text-sm text-gray-400 mt-1">Минимальная длительность: 1 час</p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="location" className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  Местоположение
                </Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="Адрес или место встречи"
                  className="bg-gray-800/50 border-gray-700 text-white focus:border-yellow-500"
                />
                {errors.location && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.location.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="purpose" className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4" />
                  Цель сопровождения (необязательно)
                </Label>
                <Input
                  id="purpose"
                  {...register('purpose')}
                  placeholder="Например: деловая встреча, мероприятие"
                  className="bg-gray-800/50 border-gray-700 text-white focus:border-yellow-500"
                />
              </motion.div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-yellow-400" />
                Дополнительные услуги
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                variants={itemVariants}
                className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-yellow-500/50 transition-colors"
              >
                <input
                  type="checkbox"
                  id="withDriver"
                  {...register('withDriver')}
                  className="w-5 h-5 mt-0.5 accent-yellow-500 cursor-pointer"
                />
                <div className="flex-1">
                  <Label htmlFor="withDriver" className="cursor-pointer flex items-center gap-2">
                    <User className="w-4 h-4 text-yellow-400" />
                    <span className="font-semibold">С водителем</span>
                  </Label>
                  <p className="text-sm text-gray-400 mt-1">
                    Профессиональный водитель для безопасного перемещения
                  </p>
                  <p className="text-sm text-yellow-400 mt-1">
                    +{formatKZT(5000)}/час
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-yellow-500/50 transition-colors"
              >
                <input
                  type="checkbox"
                  id="withCar"
                  {...register('withCar')}
                  className="w-5 h-5 mt-0.5 accent-yellow-500 cursor-pointer"
                />
                <div className="flex-1">
                  <Label htmlFor="withCar" className="cursor-pointer flex items-center gap-2">
                    <Car className="w-4 h-4 text-yellow-400" />
                    <span className="font-semibold">С автомобилем</span>
                  </Label>
                  <p className="text-sm text-gray-400 mt-1">
                    Премиум автомобиль для комфортного перемещения
                  </p>
                  <p className="text-sm text-yellow-400 mt-1">
                    +{formatKZT(10000)}/час
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-sm">Итого к оплате</p>
                    <p className="text-3xl font-bold text-yellow-400 mt-1">
                      {formatKZT(totalPrice)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {duration} ч × {formatKZT(basePrice + driverPrice + carPrice)}/час
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Базовая ставка</p>
                    <p className="text-lg font-semibold">{formatKZT(basePrice)}/ч</p>
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
              className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-6 rounded-xl shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Обработка...
                </span>
              ) : (
                'Оформить заказ'
              )}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}

