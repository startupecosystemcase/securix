'use client';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield, Smartphone, Users, TrendingUp } from 'lucide-react';
import { formatKZT, convertUSDToKZT } from '@/lib/utils/currency';

const Hero = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const stats = [
    { label: t('hero.stats.users'), value: '100+', icon: Users },
    { label: t('hero.stats.cases'), value: '50+', icon: Shield },
    { label: t('hero.stats.revenue'), value: formatKZT(convertUSDToKZT(54)), icon: TrendingUp },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                <span className="text-gradient-yellow">
                  {t('hero.slogan')}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed">
                {t('hero.mission')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-lg px-8 py-4 rounded-full shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
                  onClick={() => router.push('/auth/login')}
                >
                  {t('hero.register')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 font-bold text-lg px-8 py-4 rounded-full transition-all duration-300"
                  onClick={() => {
                    const element = document.getElementById('services');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t('hero.learnMore')}
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon className="w-6 h-6 text-yellow-500" />
                      </div>
                      <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-400">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right Column - Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Phone Mockup */}
                <div className="relative mx-auto w-64 h-[500px] bg-gray-900 rounded-[3rem] p-4 shadow-2xl border-4 border-gray-800">
                  <div className="w-full h-full bg-black rounded-[2rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="h-8 bg-gray-900 flex items-center justify-between px-4 text-white text-xs">
                      <span>9:41</span>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-white rounded-full" />
                        <div className="w-1 h-1 bg-white rounded-full" />
                        <div className="w-1 h-1 bg-white rounded-full" />
                      </div>
                    </div>
                    
                    {/* App Content */}
                    <div className="h-[calc(100%-2rem)] bg-gradient-to-b from-gray-900 to-black p-4">
                      <div className="mb-4">
                        <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-2">
                          <Shield className="w-8 h-8 text-black" />
                        </div>
                        <h3 className="text-white font-bold text-sm">Securix</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-red-600 rounded-xl p-3 text-center">
                          <Shield className="w-6 h-6 text-white mx-auto mb-1" />
                          <p className="text-white text-xs font-semibold">SOS</p>
                        </div>
                        <div className="bg-yellow-500 rounded-xl p-3 text-center">
                          <Shield className="w-6 h-6 text-black mx-auto mb-1" />
                          <p className="text-black text-xs font-semibold">Охранник</p>
                        </div>
                        <div className="bg-blue-600 rounded-xl p-3 text-center">
                          <Smartphone className="w-6 h-6 text-white mx-auto mb-1" />
                          <p className="text-white text-xs font-semibold">Водитель</p>
                        </div>
                        <div className="bg-purple-600 rounded-xl p-3 text-center">
                          <Users className="w-6 h-6 text-white mx-auto mb-1" />
                          <p className="text-white text-xs font-semibold">Консьерж</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-500/20 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="w-6 h-10 border-2 border-yellow-500 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-yellow-500 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
