'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOrdersStore } from '@/stores/orders';
import { formatKZT } from '@/lib/utils/currency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const driverSchema = z.object({
  address: z.string().min(1, 'Укажите адрес выезда'),
  time: z.string().min(1, 'Выберите время'),
  duration: z.number().min(1, 'Минимальная длительность 1 час'),
});

type DriverForm = z.infer<typeof driverSchema>;

const PRICE_PER_HOUR = 8000; // ₸

export default function DriverPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { addOrder } = useOrdersStore();
  const [submitted, setSubmitted] = useState(false);

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

  const duration = watch('duration') || 1;
  const price = PRICE_PER_HOUR * duration;

  const onSubmit = (data: DriverForm) => {
    addOrder({
      type: 'driver',
      price,
      scheduledAt: new Date(`2024-01-01T${data.time}`),
      duration: data.duration,
      location: {
        address: data.address,
        lat: 43.2220,
        lng: 76.8512,
      },
    });

    setSubmitted(true);
    setTimeout(() => {
      router.push('/home');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="p-8 bg-gray-900 border-gray-800 text-center">
          <h2 className="text-2xl font-bold mb-4 text-yellow-500">Заказ принят!</h2>
          <p className="text-gray-400">Водитель будет назначен в ближайшее время.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gradient-yellow">
          Заказ трезвого водителя
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6 bg-gray-900 border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Информация о заказе</h2>

            <div className="mt-4">
              <Label htmlFor="address">Адрес выезда</Label>
              <Input
                id="address"
                type="text"
                placeholder="Введите адрес"
                {...register('address')}
                className="mt-1 bg-gray-800 border-gray-700 text-white"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            <div className="mt-4">
              <Label htmlFor="time">Время начала</Label>
              <Input
                id="time"
                type="time"
                {...register('time')}
                className="mt-1 bg-gray-800 border-gray-700 text-white"
              />
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
              )}
            </div>

            <div className="mt-4">
              <Label htmlFor="duration">{t('common.duration')} (часы)</Label>
              <Input
                id="duration"
                type="number"
                min={1}
                {...register('duration', { valueAsNumber: true })}
                className="mt-1 bg-gray-800 border-gray-700 text-white"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 border-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Итого:</span>
              <span className="text-2xl font-bold text-yellow-500">
                {formatKZT(price)}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Услуга доступна 24/7. Минимальная длительность 1 час.
            </p>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 border-gray-700 text-white hover:bg-gray-800"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-yellow-500 text-black hover:bg-yellow-400"
            >
              {t('common.submit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

