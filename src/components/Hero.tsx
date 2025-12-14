'use client';

import type { Variants } from "framer-motion";

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Shield, Smartphone, Users, TrendingUp, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Hero = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { icon: Users, value: '50+', label: 'Успешных кейсов' },
    { icon: TrendingUp, value: '₸54M', label: 'Выручка 2024-2025' },
    { icon: Clock, value: '3+', label: 'Года опыта' },
    { icon: Star, value: '4.9', label: 'Рейтинг клиентов' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
      ref={ref}
    >
      {/* Premium Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-yellow-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.1),transparent_50%)]"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
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
        <motion.div
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Column - Text */}
            <motion.div variants={itemVariants}>
              <motion.div
                className="inline-block mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 }}
              >
                <span className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-sm font-medium">
                  Первая цифровая экосистема безопасности в КЗ
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  Ваша безопасность
                </span>
                <br />
                <span className="text-white">в один клик</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                Революционная экосистема защиты для предпринимателей и VIP-клиентов в Центральной Азии
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    const element = document.getElementById('registration');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Начать бесплатно
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 font-bold text-lg px-8 py-6 rounded-xl"
                  onClick={() => {
                    const element = document.getElementById('services');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Узнать больше
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-500" />
                  <span>Лицензированная компания</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-yellow-500" />
                  <span>Работаем с 2013 года</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column - App Mockup */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <div className="relative mx-auto max-w-md">
                {/* Phone Frame */}
                <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-4 shadow-2xl border border-gray-800">
                  <div className="bg-black rounded-[2.5rem] overflow-hidden">
                    {/* Phone Screen Content */}
                    <div className="aspect-[9/19] bg-gradient-to-br from-gray-950 to-black relative">
                      {/* Mock App Interface */}
                      <div className="absolute inset-0 p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-black" />
                          </div>
                          <div className="text-white font-bold text-xl">Securix</div>
                        </div>

                        <div className="space-y-4 flex-1">
                          {/* Service Tiles */}
                          {[
                            { icon: Shield, label: 'SOS', color: 'red' },
                            { icon: Users, label: 'Охранник', color: 'yellow' },
                            { icon: Smartphone, label: 'Водитель', color: 'blue' },
                          ].map((service, idx) => (
                            <motion.div
                              key={idx}
                              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800"
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 bg-${service.color}-500/20 rounded-lg flex items-center justify-center`}>
                                  <service.icon className={`w-6 h-6 text-${service.color}-400`} />
                                </div>
                                <div className="text-white font-medium">{service.label}</div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-yellow-500 rounded-full p-3 shadow-lg"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Shield className="w-6 h-6 text-black" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Statistics Bubbles */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 hover:border-yellow-500/50 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
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
        <div className="w-6 h-10 border-2 border-yellow-500/50 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-yellow-500 rounded-full mt-2"
            animate={{
              opacity: [1, 0.3, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
