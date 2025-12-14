'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Car, MapPin, Calendar, Clock } from 'lucide-react';
import { useOrdersStore } from '@/lib/stores/orders';
import { formatKZT } from '@/lib/currency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const driverSchema = z.object({
  pickupAddress: z.string().min(1, 'Укажите адрес выезда'),
  date: z.string().min(1, 'Выберите дату'),
  time: z.string().min(1, 'Выберите время'),
  duration: z.number().min(1, 'Минимальная длительность: 1 час'),
});

type DriverForm = z.infer<typeof driverSchema>;

export default function DriverOrderPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { createOrder, isLoading } = useOrdersStore();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DriverForm>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      duration: 1,
    },
  });

  const duration = watch('duration');
  const basePrice = 8000; // за час
  const totalPrice = basePrice * duration;

  const onSubmit = async (data: DriverForm) => {
    try {
      createOrder({
        type: 'driver',
        price: totalPrice,
        scheduledAt: new Date(`${data.date}T${data.time}`),
        duration: data.duration,
        location: { 
          address: data.pickupAddress, 
          lat: 43.2220, 
          lng: 76.8512 
        },
        description: 'Услуга трезвого водителя',
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
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Car className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Трезвый водитель</h1>
              <p className="text-gray-400 mt-1">Безопасное вождение 24/7</p>
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
                <MapPin className="w-5 h-5 text-blue-400" />
                Информация о заказе
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div variants={itemVariants}>
                <Label htmlFor="pickupAddress" className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  Адрес выезда
                </Label>
                <Input
                  id="pickupAddress"
                  {...register('pickupAddress')}
                  placeholder="Адрес, откуда выедет водитель"
                  className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500"
                />
                {errors.pickupAddress && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.pickupAddress.message}
                  </motion.p>
                )}
              </motion.div>

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
                    className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500"
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
                    Время начала
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    {...register('time')}
                    className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500"
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
                  className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500"
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
                <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Услуга доступна 24/7, включая ночное время
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-sm">Итого к оплате</p>
                    <p className="text-3xl font-bold text-blue-400 mt-1">
                      {formatKZT(totalPrice)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {duration} ч × {formatKZT(basePrice)}/час
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Тариф</p>
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
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold py-6 rounded-xl shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

