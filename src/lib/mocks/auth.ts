/**
 * Моковые функции для аутентификации
 */

import { User } from '@/lib/stores/auth';
export const mockSendSMS = async (phone: string): Promise<string> => {
  // Симуляция отправки SMS с задержкой 5 секунд
  return new Promise((resolve) => {
    setTimeout(() => {
      // Генерируем случайный 6-значный код
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      // Сохраняем в localStorage для демо
      localStorage.setItem(`sms_code_${phone}`, code);
      resolve(code);
    }, 5000);
  });
};

export const mockVerifySMSCode = async (phone: string, code: string): Promise<boolean> => {
  const storedCode = localStorage.getItem(`sms_code_${phone}`);
  return storedCode === code;
};

export const mockRegister = async (data: {
  email: string;
  phone: string;
  name: string;
}): Promise<{ token: string; user: User }> => {
  // Симуляция регистрации
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = `mock_token_${Date.now()}`;
      const user = {
        id: `user_${Date.now()}`,
        ...data,
        subscription: undefined,
        onboardingCompleted: false,
      };
      resolve({ token, user });
    }, 1000);
  });
};

export const mockLogin = async (phone: string, code: string): Promise<{ token: string; user: User }> => {
  const isValid = await mockVerifySMSCode(phone, code);
  if (!isValid) {
    throw new Error('Неверный код подтверждения');
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const token = `mock_token_${Date.now()}`;
      const user = {
        id: `user_${Date.now()}`,
        email: `user@example.com`,
        phone,
        name: 'Пользователь',
        subscription: undefined,
        onboardingCompleted: false,
      };
      resolve({ token, user });
    }, 1000);
  });
};

