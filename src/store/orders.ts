/**
 * Store для управления заказами
 */

import { create } from 'zustand';
import type { Order, OrderStatus } from '@/types';

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  isLoading: false,

  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      // Моковые данные
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const mockOrders: Order[] = [
        {
          id: '1',
          userId: '1',
          serviceType: 'bodyguard',
          status: 'completed',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          time: '10:00',
          duration: 4,
          location: {
            address: 'Алматы, пр. Абая, 150',
          },
          description: 'Сопровождение на деловую встречу',
          price: 120000,
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          userId: '1',
          serviceType: 'driver',
          status: 'in_progress',
          date: new Date().toISOString(),
          time: '18:00',
          duration: 2,
          location: {
            address: 'Алматы, ул. Сатпаева, 30',
          },
          price: 15000,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      set({ orders: mockOrders, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createOrder: async (orderData) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const newOrder: Order = {
        ...orderData,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        orders: [newOrder, ...state.orders],
        isLoading: false,
      }));

      return newOrder;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      ),
    }));
  },

  getOrderById: (orderId: string) => {
    return get().orders.find((order) => order.id === orderId);
  },
}));

