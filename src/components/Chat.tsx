'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/lib/stores/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send } from 'lucide-react';

export default function Chat() {
  const { t } = useTranslation();
  const { messages, isOpen, isOperatorOnline, addMessage, toggleChat } = useChatStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    addMessage({
      text: inputValue,
      sender: 'user',
    });

    // Мок ответа оператора
    setTimeout(() => {
      addMessage({
        text: 'Спасибо за ваше сообщение. Оператор ответит в ближайшее время.',
        sender: 'operator',
      });
    }, 1000);

    setInputValue('');
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-400 transition-colors z-50"
      >
        <MessageCircle size={24} className="text-black" />
        {messages.length > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
            {messages.length}
          </span>
        )}
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 right-6 w-96 h-[600px] bg-gray-900 border border-gray-800 rounded-lg shadow-2xl flex flex-col z-50"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-800">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isOperatorOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
            <h3 className="font-semibold text-white">{t('chat.title')}</h3>
          </div>
          <button
            onClick={toggleChat}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>Начните диалог с оператором</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chat.placeholder')}
              className="flex-1 bg-gray-800 border-gray-700 text-white"
            />
            <Button
              onClick={handleSend}
              className="bg-yellow-500 text-black hover:bg-yellow-400"
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

