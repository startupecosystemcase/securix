'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/lib/stores/auth';
import { Home, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppNav() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40 md:hidden">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => router.push('/home')}
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            pathname === '/home' ? 'text-yellow-500' : 'text-gray-400'
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Главная</span>
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            pathname === '/dashboard' ? 'text-yellow-500' : 'text-gray-400'
          }`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Профиль</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center flex-1 h-full text-gray-400"
        >
          <LogOut size={24} />
          <span className="text-xs mt-1">Выход</span>
        </button>
      </div>
    </nav>
  );
}

