/**
 * Store для управления заказами услуг
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ServiceType = 'bodyguard' | 'driver' | 'concierge' | 'sos';

export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  type: ServiceType;
  status: OrderStatus;
  createdAt: string;
  scheduledAt?: string;
  completedAt?: string;
  location?: string;
  duration?: number; // в часах
  price: number; // в тенге
  description?: string;
  assignedTo?: string;
}

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  createOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByType: (type: ServiceType) => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,

      createOrder: async (orderData) => {
        set({ isLoading: true });
        
        await new Promise((resolve) => setTimeout(resolve, 800));

        const newOrder: Order = {
          ...orderData,
          id: Date.now().toString(),
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          isLoading: false,
        }));

        return newOrder;
      },

      updateOrderStatus: async (id: string, status: OrderStatus) => {
        set({ isLoading: true });
        
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id
              ? {
                  ...order,
                  status,
                  completedAt: status === 'completed' ? new Date().toISOString() : order.completedAt,
                }
              : order
          ),
          isLoading: false,
        }));
      },

      getOrderById: (id: string) => {
        return get().orders.find((order) => order.id === id);
      },

      getOrdersByType: (type: ServiceType) => {
        return get().orders.filter((order) => order.type === type);
      },

      getOrdersByStatus: (status: OrderStatus) => {
        return get().orders.filter((order) => order.status === status);
      },
    }),
    {
      name: 'securix-orders',
    }
  )
);

