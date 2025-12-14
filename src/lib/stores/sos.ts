/**
 * Store для управления SOS активациями
 */

import { create } from 'zustand';

export type SOSStatus = 'idle' | 'activating' | 'active' | 'resolved';

export interface SOSActivation {
  id: string;
  status: SOSStatus;
  activatedAt?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  audioRecording?: {
    url: string;
    duration: number;
  };
  contactsNotified: string[];
  gbrNotified: boolean;
}

interface SOSState {
  currentActivation: SOSActivation | null;
  status: SOSStatus;
  activate: () => Promise<void>;
  resolve: () => Promise<void>;
  cancel: () => Promise<void>;
}

export const useSOSStore = create<SOSState>((set) => ({
  currentActivation: null,
  status: 'idle',

  activate: async () => {
    set({ status: 'activating' });

    // Моковая задержка активации
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Моковая геолокация (Алматы)
    const mockLocation = {
      lat: 43.2220,
      lng: 76.8512,
      address: 'Алматы, проспект Абая, 150',
    };

    const activation: SOSActivation = {
      id: Date.now().toString(),
      status: 'active',
      activatedAt: new Date().toISOString(),
      location: mockLocation,
      contactsNotified: ['+7 777 123 4567', '+7 777 765 4321'],
      gbrNotified: true,
    };

    set({
      currentActivation: activation,
      status: 'active',
    });
  },

  resolve: async () => {
    set({ status: 'resolved' });
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    set({
      currentActivation: null,
      status: 'idle',
    });
  },

  cancel: () => {
    set({
      currentActivation: null,
      status: 'idle',
    });
  },
}));

