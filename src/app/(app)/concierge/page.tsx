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

const conciergeSchema = z.object({
  type: z.enum(['booking', 'transport', 'organization', 'other']),
  date: z.string().min(1, 'Выберите дату'),
  description: z.string().min(10, 'Опишите задачу подробнее'),
});

type ConciergeForm = z.infer<typeof conciergeSchema>;

const BASE_PRICE = 5000; // ₸

export default function ConciergePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { addOrder } = useOrdersStore();
  const [submitted, setSubmitted] = useState(false);

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

  const type = watch('type');

  const onSubmit = (data: ConciergeForm) => {
    addOrder({
      type: 'concierge',
      price: BASE_PRICE,
      scheduledAt: new Date(data.date),
      description: `${data.type}: ${data.description}`,
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
          <p className="text-gray-400">Оператор свяжется с вами для уточнения деталей.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gradient-yellow">
          Консьерж-сервис
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6 bg-gray-900 border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Тип услуги</h2>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 border border-gray-700 rounded-lg cursor-pointer hover:border-yellow-500 transition-colors">
                <input
                  type="radio"
                  value="booking"
                  {...register('type')}
                  className="w-5 h-5"
                />
                <span className="text-white">Бронирование</span>
              </label>

              <label className="flex items-center gap-3 p-4 border border-gray-700 rounded-lg cursor-pointer hover:border-yellow-500 transition-colors">
                <input
                  type="radio"
                  value="transport"
                  {...register('type')}
                  className="w-5 h-5"
                />
                <span className="text-white">Транспорт</span>
              </label>

              <label className="flex items-center gap-3 p-4 border border-gray-700 rounded-lg cursor-pointer hover:border-yellow-500 transition-colors">
                <input
                  type="radio"
                  value="organization"
                  {...register('type')}
                  className="w-5 h-5"
                />
                <span className="text-white">Организация</span>
              </label>

              <label className="flex items-center gap-3 p-4 border border-gray-700 rounded-lg cursor-pointer hover:border-yellow-500 transition-colors">
                <input
                  type="radio"
                  value="other"
                  {...register('type')}
                  className="w-5 h-5"
                />
                <span className="text-white">Другое</span>
              </label>
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Детали заказа</h2>

            <div className="mt-4">
              <Label htmlFor="date">{t('common.date')}</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
                className="mt-1 bg-gray-800 border-gray-700 text-white"
                min={new Date().toISOString().split('T')[0]}
                max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            <div className="mt-4">
              <Label htmlFor="description">Описание задачи</Label>
              <textarea
                id="description"
                rows={5}
                placeholder="Опишите подробно, что вам нужно..."
                {...register('description')}
                className="mt-1 w-full bg-gray-800 border border-gray-700 text-white rounded-md p-3"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 border-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Итого:</span>
              <span className="text-2xl font-bold text-yellow-500">
                {formatKZT(BASE_PRICE)}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Окончательная стоимость может быть скорректирована после уточнения деталей.
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

