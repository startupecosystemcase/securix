'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOrdersStore } from '@/lib/stores/orders';
import { formatKZT } from '@/lib/currency';
import { Card } from '@/components/ui/card';
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
      await createOrder({
        type: 'driver',
        price: totalPrice,
        scheduledAt: new Date(`${data.date}T${data.time}`),
        duration: data.duration,
        location: { address: data.pickupAddress, lat: 43.2220, lng: 76.8512 },
      });
      
      router.push('/dashboard?tab=history');
    } catch (error) {
      console.error('Ошибка создания заказа:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">{t('orders.driver.title')}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6 bg-gray-900 border-gray-800">
            <div className="space-y-4">
              <div>
                <Label htmlFor="pickupAddress">{t('orders.driver.pickupAddress')}</Label>
                <Input
                  id="pickupAddress"
                  {...register('pickupAddress')}
                  placeholder="Адрес выезда водителя"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                {errors.pickupAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.pickupAddress.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">{t('orders.date')}</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register('date')}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="time">{t('orders.driver.startTime')}</Label>
                  <Input
                    id="time"
                    type="time"
                    {...register('time')}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  {errors.time && (
                    <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="duration">{t('orders.duration')} (часы)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  {...register('duration', { valueAsNumber: true })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
                )}
                <p className="text-sm text-gray-400 mt-1">{t('orders.minDuration')}</p>
                <p className="text-sm text-yellow-500 mt-1">{t('services.driver.available24h')}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 border-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">{t('orders.price')}:</span>
              <span className="text-2xl font-bold text-yellow-500">{formatKZT(totalPrice)}</span>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 border-gray-800"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              {isLoading ? t('common.loading') : t('orders.submit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

