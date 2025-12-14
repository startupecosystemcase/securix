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

const bodyguardSchema = z.object({
  date: z.string().min(1, 'Выберите дату'),
  time: z.string().min(1, 'Выберите время'),
  duration: z.number().min(1, 'Минимальная длительность 1 час'),
  location: z.string().min(1, 'Укажите локацию'),
  purpose: z.string().optional(),
  withDriver: z.boolean().optional(),
  withCar: z.boolean().optional(),
});

type BodyguardForm = z.infer<typeof bodyguardSchema>;

const PRICE_PER_HOUR = 15000; // ₸

export default function BodyguardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { addOrder } = useOrdersStore();
  const [submitted, setSubmitted] = useState(false);

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

  const duration = watch('duration') || 1;
  const withDriver = watch('withDriver');
  const withCar = watch('withCar');

  const calculatePrice = () => {
    let price = PRICE_PER_HOUR * duration;
    if (withDriver) price += 5000 * duration;
    if (withCar) price += 3000 * duration;
    return price;
  };

  const onSubmit = (data: BodyguardForm) => {
    addOrder({
      type: 'bodyguard',
      price: calculatePrice(),
      scheduledAt: new Date(`${data.date}T${data.time}`),
      duration: data.duration,
      location: {
        address: data.location,
        lat: 43.2220,
        lng: 76.8512,
      },
      description: data.purpose,
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
          <p className="text-gray-400">Мы свяжемся с вами для подтверждения деталей.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gradient-yellow">
          Заказ охранника
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6 bg-gray-900 border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Основная информация</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">{t('common.date')}</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="time">{t('common.time')}</Label>
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

            <div className="mt-4">
              <Label htmlFor="location">Локация</Label>
              <Input
                id="location"
                type="text"
                placeholder="Адрес или место встречи"
                {...register('location')}
                className="mt-1 bg-gray-800 border-gray-700 text-white"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>

            <div className="mt-4">
              <Label htmlFor="purpose">Цель (необязательно)</Label>
              <Input
                id="purpose"
                type="text"
                placeholder="Например: деловая встреча"
                {...register('purpose')}
                className="mt-1 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Дополнительные услуги</h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('withDriver')}
                  className="w-5 h-5"
                />
                <div>
                  <p className="text-white font-medium">С водителем</p>
                  <p className="text-gray-400 text-sm">+5,000 ₸/час</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('withCar')}
                  className="w-5 h-5"
                />
                <div>
                  <p className="text-white font-medium">С автомобилем</p>
                  <p className="text-gray-400 text-sm">+3,000 ₸/час</p>
                </div>
              </label>
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 border-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Итого:</span>
              <span className="text-2xl font-bold text-yellow-500">
                {formatKZT(calculatePrice())}
              </span>
            </div>
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

