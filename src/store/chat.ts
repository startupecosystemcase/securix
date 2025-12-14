/**
 * Store для чата с оператором
 * Моковая реализация WebSocket через Zustand
 */

import { create } from 'zustand';
import type { ChatMessage } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  sendFile: (file: File) => Promise<void>;
  connect: () => void;
  disconnect: () => void;
  markAsRead: (messageId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isConnected: false,
  isLoading: false,

  connect: () => {
    set({ isConnected: true });
    
    // Моковое сообщение от оператора
    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: 'operator',
        message: 'Здравствуйте! Чем могу помочь?',
        timestamp: new Date().toISOString(),
        type: 'system',
        read: false,
      };
      
      set((state) => ({
        messages: [welcomeMessage, ...state.messages],
      }));
    }, 1000);
  },

  disconnect: () => {
    set({ isConnected: false });
  },

  sendMessage: async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: '1', // Текущий пользователь
      message,
      timestamp: new Date().toISOString(),
      type: 'text',
      read: true,
    };

    set((state) => ({
      messages: [userMessage, ...state.messages],
      isLoading: true,
    }));

    // Моковый ответ оператора
    setTimeout(() => {
      const operatorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: 'operator',
        message: 'Спасибо за сообщение! Обрабатываю ваш запрос...',
        timestamp: new Date().toISOString(),
        type: 'text',
        read: false,
      };

      set((state) => ({
        messages: [operatorMessage, ...state.messages],
        isLoading: false,
      }));
    }, 1500);
  },

  sendFile: async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Файл слишком большой. Максимальный размер: 5MB');
    }

    const fileMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: '1',
      message: `Файл: ${file.name}`,
      timestamp: new Date().toISOString(),
      type: 'file',
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      read: true,
    };

    set((state) => ({
      messages: [fileMessage, ...state.messages],
    }));
  },

  markAsRead: (messageId: string) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, read: true } : msg
      ),
    }));
  },
}));

