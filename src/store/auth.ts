/**
 * Store для аутентификации пользователя
 * Использует Zustand для управления состоянием
 */

import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, phone: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// Простая персистентность через localStorage
const STORAGE_KEY = 'securix-auth';

const loadFromStorage = (): { user: User | null; isAuthenticated: boolean } => {
  if (typeof window === 'undefined') {
    return { user: null, isAuthenticated: false };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return { user: data.user, isAuthenticated: !!data.user };
    }
  } catch {
    // Игнорируем ошибки парсинга
  }
  
  return { user: null, isAuthenticated: false };
};

const saveToStorage = (user: User | null) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
  } catch {
    // Игнорируем ошибки сохранения
  }
};

export const useAuthStore = create<AuthState>((set) => {
  const initialState = loadFromStorage();
  
  return {
    user: initialState.user,
    isAuthenticated: initialState.isAuthenticated,
    isLoading: false,

    setUser: (user) => {
      set({ user, isAuthenticated: !!user });
      saveToStorage(user);
    },

    register: async (email: string, phone: string, name: string) => {
      set({ isLoading: true });
      try {
        // Моковая регистрация
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const mockUser: User = {
          id: Date.now().toString(),
          email,
          phone,
          name,
          role: 'client',
          createdAt: new Date().toISOString(),
        };

        set({ 
          user: mockUser, 
          isAuthenticated: true, 
          isLoading: false 
        });
        saveToStorage(mockUser);
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    login: async (email: string, password: string) => {
      set({ isLoading: true });
      try {
        // Моковая аутентификация
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const mockUser: User = {
          id: '1',
          email,
          phone: '+77001234567',
          name: 'Тестовый Пользователь',
          role: 'client',
          subscription: {
            planId: 'premium',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            hoursRemaining: 40,
            isActive: true,
          },
          createdAt: new Date().toISOString(),
        };

        set({ 
          user: mockUser, 
          isAuthenticated: true, 
          isLoading: false 
        });
        saveToStorage(mockUser);
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    logout: () => {
      set({ 
        user: null, 
        isAuthenticated: false 
      });
      saveToStorage(null);
    },

    checkAuth: async () => {
      const stored = loadFromStorage();
      set({ 
        user: stored.user, 
        isAuthenticated: stored.isAuthenticated 
      });
    },
  };
});

