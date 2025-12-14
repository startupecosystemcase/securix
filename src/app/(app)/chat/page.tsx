'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChatStore } from '@/lib/stores/chat';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
  const { t } = useTranslation();
  const { messages, isConnected, isTyping, sendMessage, connect, disconnect } = useChatStore();
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() && attachments.length === 0) return;

    await sendMessage(inputText, attachments.length > 0 ? attachments : undefined);
    setInputText('');
    setAttachments([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024); // 5MB limit
    
    if (validFiles.length !== files.length) {
      alert(t('chat.fileSizeLimit'));
    }
    
    setAttachments(validFiles);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="container mx-auto px-4 py-4 flex-1 flex flex-col max-w-4xl">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{t('chat.title')}</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-400">
              {isConnected ? t('chat.connected') : t('chat.disconnected')}
            </span>
          </div>
        </div>

        {/* Messages */}
        <Card className="flex-1 p-4 bg-gray-900 border-gray-800 overflow-y-auto mb-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-800 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((file) => (
                          <a
                            key={file.id}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs underline block"
                          >
                            {file.name} ({(file.size / 1024).toFixed(1)} KB)
                          </a>
                        ))}
                      </div>
                    )}
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex gap-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">{t('chat.typing')}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </Card>

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-2 flex gap-2 flex-wrap">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="bg-gray-800 px-3 py-1 rounded-md text-sm flex items-center gap-2"
              >
                <span>{file.name}</span>
                <button
                  onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-400"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="border-gray-800"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={t('chat.placeholder')}
            className="flex-1 bg-gray-900 border-gray-800 text-white"
          />
          <Button
            onClick={handleSend}
            disabled={!inputText.trim() && attachments.length === 0}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

