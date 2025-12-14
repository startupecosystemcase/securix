/**
 * Store для чата с оператором (моковый WebSocket)
 */

import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'operator';
  timestamp: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
  }>;
}

interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  isTyping: boolean;
  sendMessage: (text: string, attachments?: File[]) => Promise<void>;
  connect: () => void;
  disconnect: () => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isConnected: false,
  isTyping: false,

  connect: () => {
    set({ isConnected: true });
    
    // Моковое приветственное сообщение
    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        text: 'Здравствуйте! Я оператор Securix. Чем могу помочь?',
        sender: 'operator',
        timestamp: new Date().toISOString(),
      };
      
      set((state) => ({
        messages: [...state.messages, welcomeMessage],
      }));
    }, 500);
  },

  disconnect: () => {
    set({ isConnected: false });
  },

  sendMessage: async (text: string, attachments?: File[]) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
      attachments: attachments?.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
      })),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isTyping: true,
    }));

    // Моковая задержка ответа оператора
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

    const operatorMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: 'Спасибо за сообщение! Обрабатываю ваш запрос...',
      sender: 'operator',
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, operatorMessage],
      isTyping: false,
    }));
  },

  clearMessages: () => {
    set({ messages: [] });
  },
}));

