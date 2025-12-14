import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  subscription?: {
    planId: string;
    planName: string;
    hoursRemaining: number;
    expiresAt: string;
    isActive: boolean;
  };
  onboardingCompleted: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  updateSubscription: (subscription: User['subscription']) => void;
  completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, isAuthenticated: false, token: null }),
      updateSubscription: (subscription) =>
        set((state) => ({
          user: state.user ? { ...state.user, subscription } : null,
        })),
      completeOnboarding: () =>
        set((state) => ({
          user: state.user ? { ...state.user, onboardingCompleted: true } : null,
        })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

