'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Advantages from '@/components/Advantages';
import Partners from '@/components/Partners';
import About from '@/components/About';
import Contacts from '@/components/Contacts';
import Registration from '@/components/Registration';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/lib/stores/auth';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Splash screen
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Redirect authenticated users to app
    if (isAuthenticated && !showSplash) {
      router.push('/home');
    }
  }, [isAuthenticated, showSplash, router]);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-2xl">
            <span className="text-black font-bold text-3xl">S</span>
          </div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Securix
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400"
          >
            Защищаем Ваш Мир
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <Hero />
      <Services />
      <Advantages />
      <Partners />
      <About />
      <Contacts />
      <Registration />
      <Footer />
    </div>
  );
}
