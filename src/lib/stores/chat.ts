import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'operator';
  timestamp: Date;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
  }>;
}

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isOperatorOnline: boolean;
  isConnected: boolean;
  isTyping: boolean;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  toggleChat: () => void;
  setOperatorOnline: (online: boolean) => void;
  clearMessages: () => void;
  sendMessage: (text: string, attachments?: File[]) => void;
  connect: () => void;
  disconnect: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isOpen: false,
  isOperatorOnline: true,
  isConnected: true,
  isTyping: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date(),
        },
      ],
    })),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  setOperatorOnline: (online) => set({ isOperatorOnline: online }),
  clearMessages: () => set({ messages: [] }),
  sendMessage: (text, attachments) => {
    set((state) => ({
      messages: [
        ...state.messages,
        {
          text,
          sender: 'user',
          id: Date.now().toString(),
          timestamp: new Date(),
        },
      ],
    }));
  },
  connect: () => set({ isConnected: true }),
  disconnect: () => set({ isConnected: false }),
}));
