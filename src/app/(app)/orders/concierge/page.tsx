'use client';

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

const conciergeSchema = z.object({
  type: z.enum(['booking', 'transport', 'organization']),
  date: z.string().min(1, 'Выберите дату'),
  details: z.string().min(10, 'Опишите детали заказа (минимум 10 символов)'),
});

type ConciergeForm = z.infer<typeof conciergeSchema>;

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

  const type = watch('type');
  const basePrice = 20000; // базовая цена

  const onSubmit = async (data: ConciergeForm) => {
    try {
      await createOrder({
        type: 'concierge',
        price: basePrice,
        scheduledAt: new Date(`${data.date}T00:00`),
        description: `${t('orders.concierge.types.' + data.type)}: ${data.details}`,
      });
      
      router.push('/dashboard?tab=history');
    } catch (error) {
      console.error('Ошибка создания заказа:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">{t('orders.concierge.title')}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6 bg-gray-900 border-gray-800">
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">{t('orders.concierge.type')}</Label>
                <select
                  id="type"
                  {...register('type')}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                >
                  <option value="booking">{t('orders.concierge.types.booking')}</option>
                  <option value="transport">{t('orders.concierge.types.transport')}</option>
                  <option value="organization">{t('orders.concierge.types.organization')}</option>
                </select>
              </div>

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
                <Label htmlFor="details">{t('orders.concierge.details')}</Label>
                <textarea
                  id="details"
                  {...register('details')}
                  rows={6}
                  placeholder="Опишите детали вашего заказа..."
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                />
                {errors.details && (
                  <p className="text-red-500 text-sm mt-1">{errors.details.message}</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 border-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">{t('orders.price')}:</span>
              <span className="text-2xl font-bold text-yellow-500">{formatKZT(basePrice)}</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Окончательная стоимость может быть скорректирована после уточнения деталей
            </p>
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

