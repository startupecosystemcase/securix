/**
 * Store для аутентификации (Zustand)
 * Моковая реализация
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, phone: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        // Моковая задержка
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Моковый пользователь
        const mockUser: User = {
          id: '1',
          email,
          phone: '+7 777 123 4567',
          name: 'Тестовый Пользователь',
          createdAt: new Date().toISOString(),
        };

        set({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      register: async (email: string, phone: string, name: string) => {
        set({ isLoading: true });
        
        // Моковая задержка
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        const mockUser: User = {
          id: Date.now().toString(),
          email,
          phone,
          name,
          createdAt: new Date().toISOString(),
        };

        set({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true });
        
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
          isLoading: false,
        }));
      },
    }),
    {
      name: 'securix-auth',
    }
  )
);

