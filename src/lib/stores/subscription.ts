/**
 * Store для управления подписками
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { formatKZT } from '../currency';

export type SubscriptionPlan = 'basic' | 'premium' | 'vip';

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  hoursRemaining: number;
  totalHours: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
}

export interface SubscriptionPlanDetails {
  id: SubscriptionPlan;
  name: string;
  price: number; // в тенге
  hours: number;
  features: string[];
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlanDetails[] = [
  {
    id: 'basic',
    name: 'Базовый',
    price: 50000, // ~$110
    hours: 10,
    features: [
      '10 часов охраны',
      'Доступ к SOS',
      'Чат с оператором',
      'Базовая поддержка',
    ],
  },
  {
    id: 'premium',
    name: 'Премиум',
    price: 108000, // ~$240
    hours: 25,
    features: [
      '25 часов охраны',
      'Доступ к SOS',
      'Чат с оператором',
      'Приоритетная поддержка',
      'Водитель (доп. оплата)',
    ],
    popular: true,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 180000, // ~$400
    hours: 50,
    features: [
      '50 часов охраны',
      'Доступ к SOS',
      'Чат с оператором',
      'VIP поддержка 24/7',
      'Водитель включен',
      'Консьерж-сервис',
    ],
  },
];

interface SubscriptionState {
  subscription: Subscription | null;
  isLoading: boolean;
  activateSubscription: (plan: SubscriptionPlan) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  updateHours: (hours: number) => void;
  getPlanDetails: (plan: SubscriptionPlan) => SubscriptionPlanDetails | undefined;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscription: null,
      isLoading: false,

      activateSubscription: async (plan: SubscriptionPlan) => {
        set({ isLoading: true });
        
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const planDetails = get().getPlanDetails(plan);
        if (!planDetails) {
          set({ isLoading: false });
          return;
        }

        const now = new Date();
        const endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + 1);

        const subscription: Subscription = {
          id: Date.now().toString(),
          plan,
          hoursRemaining: planDetails.hours,
          totalHours: planDetails.hours,
          startDate: now.toISOString(),
          endDate: endDate.toISOString(),
          isActive: true,
          autoRenew: true,
        };

        set({
          subscription,
          isLoading: false,
        });
      },

      cancelSubscription: async () => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        set((state) => ({
          subscription: state.subscription
            ? { ...state.subscription, isActive: false, autoRenew: false }
            : null,
          isLoading: false,
        }));
      },

      updateHours: (hours: number) => {
        set((state) => ({
          subscription: state.subscription
            ? {
                ...state.subscription,
                hoursRemaining: Math.max(0, state.subscription.hoursRemaining - hours),
              }
            : null,
        }));
      },

      getPlanDetails: (plan: SubscriptionPlan) => {
        return SUBSCRIPTION_PLANS.find((p) => p.id === plan);
      },
    }),
    {
      name: 'securix-subscription',
    }
  )
);

