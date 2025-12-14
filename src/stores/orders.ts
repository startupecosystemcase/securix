import { create } from 'zustand';

export type OrderType = 'bodyguard' | 'driver' | 'concierge' | 'sos';
export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  type: OrderType;
  status: OrderStatus;
  createdAt: Date;
  scheduledAt?: Date;
  duration?: number; // в часах
  location?: {
    address: string;
    lat: number;
    lng: number;
  };
  description?: string;
  price: number; // в KZT
  assignedTo?: {
    id: string;
    name: string;
    phone: string;
  };
}

interface OrdersState {
  orders: Order[];
  activeSOS: Order | null;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  setActiveSOS: (order: Order | null) => void;
  getOrdersByType: (type: OrderType) => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  activeSOS: null,
  addOrder: (order) =>
    set((state) => ({
      orders: [
        ...state.orders,
        {
          ...order,
          id: Date.now().toString(),
          createdAt: new Date(),
          status: 'pending',
        },
      ],
    })),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    })),
  setActiveSOS: (order) => set({ activeSOS: order }),
  getOrdersByType: (type) => get().orders.filter((order) => order.type === type),
  getOrdersByStatus: (status) => get().orders.filter((order) => order.status === status),
}));

