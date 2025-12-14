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
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  toggleChat: () => void;
  setOperatorOnline: (online: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isOpen: false,
  isOperatorOnline: true, // Мок: оператор всегда онлайн
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
}));

