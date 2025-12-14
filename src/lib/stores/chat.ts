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
  read?: boolean;
}

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isOperatorOnline: boolean;
  isConnected: boolean;
  isTyping: boolean;
  isLoading: boolean;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  toggleChat: () => void;
  setOperatorOnline: (online: boolean) => void;
  clearMessages: () => void;
  sendMessage: (text: string, attachments?: File[]) => Promise<void>;
  connect: () => void;
  disconnect: () => void;
  markAsRead: (messageId: string) => void;
}

// Моковые ответы оператора
const operatorResponses = [
  'Спасибо за сообщение! Обрабатываю ваш запрос...',
  'Понял, проверяю информацию...',
  'Хорошо, передаю ваш запрос специалисту...',
  'Принято! Скоро свяжемся с вами.',
  'Ваш запрос в обработке. Ожидайте ответа.',
];

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isOpen: false,
  isOperatorOnline: true,
  isConnected: false,
  isTyping: false,
  isLoading: false,

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: Date.now().toString() + Math.random(),
          timestamp: new Date(),
          read: message.sender === 'user',
        },
      ],
    })),

  toggleChat: () => {
    const isOpen = !get().isOpen;
    set({ isOpen });
    if (isOpen && !get().isConnected) {
      get().connect();
    }
  },

  setOperatorOnline: (online) => set({ isOperatorOnline: online }),

  clearMessages: () => set({ messages: [] }),

  sendMessage: async (text: string, attachments?: File[]) => {
    if (!text.trim() && (!attachments || attachments.length === 0)) return;

    set({ isLoading: true });

    // Добавляем сообщение пользователя
    const userMessage: ChatMessage = {
      id: Date.now().toString() + Math.random(),
      text,
      sender: 'user',
      timestamp: new Date(),
      read: true,
      attachments: attachments?.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
      })),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: false,
    }));

    // Моковый ответ оператора через 1-2 секунды
    setTimeout(() => {
      set({ isTyping: true });
      
      setTimeout(() => {
        const randomResponse = operatorResponses[Math.floor(Math.random() * operatorResponses.length)];
        const operatorMessage: ChatMessage = {
          id: Date.now().toString() + Math.random(),
          text: randomResponse,
          sender: 'operator',
          timestamp: new Date(),
          read: false,
        };

        set((state) => ({
          messages: [...state.messages, operatorMessage],
          isTyping: false,
        }));
      }, 1500);
    }, 1000);
  },

  connect: () => {
    set({ isConnected: true, isOperatorOnline: true });
    
    // Приветственное сообщение при подключении
    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        text: 'Здравствуйте! Чем могу помочь?',
        sender: 'operator',
        timestamp: new Date(),
        read: false,
      };
      
      set((state) => ({
        messages: state.messages.length === 0 ? [welcomeMessage] : [...state.messages, welcomeMessage],
      }));
    }, 500);
  },

  disconnect: () => set({ isConnected: false }),

  markAsRead: (messageId: string) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, read: true } : msg
      ),
    })),
}));

