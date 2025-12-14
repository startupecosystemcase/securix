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
      await createOrder({
        type: 'bodyguard',
        price: totalPrice,
        scheduledAt: new Date(`${data.date}T${data.time}`),
        duration: data.duration,
        location: { address: data.location, lat: 43.2220, lng: 76.8512 },
        description: data.purpose,
      });
      
      router.push('/dashboard?tab=history');
    } catch (error) {
      console.error('Ошибка создания заказа:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">{t('orders.bodyguard.title')}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6 bg-gray-900 border-gray-800">
            <div className="space-y-4">
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
                  <Label htmlFor="time">{t('orders.time')}</Label>
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
              </div>

              <div>
                <Label htmlFor="location">{t('orders.location')}</Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="Адрес или место встречи"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="purpose">{t('orders.bodyguard.purpose')}</Label>
                <Input
                  id="purpose"
                  {...register('purpose')}
                  placeholder="Цель сопровождения (необязательно)"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="withDriver"
                    {...register('withDriver')}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="withDriver" className="cursor-pointer">
                    {t('orders.bodyguard.withDriver')} (+{formatKZT(5000)}/час)
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="withCar"
                    {...register('withCar')}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="withCar" className="cursor-pointer">
                    {t('orders.bodyguard.withCar')} (+{formatKZT(10000)}/час)
                  </Label>
                </div>
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

