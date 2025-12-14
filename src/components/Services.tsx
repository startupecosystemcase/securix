'use client';

import { useTranslation } from 'react-i18next';
import type { Variants } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Car, ConciergeBell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Services = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const services = [
    {
      icon: AlertTriangle,
      title: t('services.sos.title'),
      description: t('services.sos.description'),
      gradient: 'from-red-500 to-red-600',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
      borderColor: 'border-red-500/30',
      hoverBorder: 'hover:border-red-500/60',
    },
    {
      icon: Shield,
      title: t('services.bodyguard.title'),
      description: t('services.bodyguard.description'),
      gradient: 'from-yellow-500 to-yellow-600',
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/30',
      hoverBorder: 'hover:border-yellow-500/60',
    },
    {
      icon: Car,
      title: t('services.driver.title'),
      description: t('services.driver.description'),
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      hoverBorder: 'hover:border-blue-500/60',
    },
    {
      icon: ConciergeBell,
      title: 'Консьерж-сервис',
      description: 'Персональный консьерж для организации мероприятий, бронирования и решения бытовых задач',
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      hoverBorder: 'hover:border-purple-500/60',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <section id="services" className="py-20 bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.03),transparent_70%)]"></div>
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t('services.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full mb-4"></div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Комплексные решения для вашей безопасности и комфорта
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="group h-full bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm border border-gray-800/50 hover:border-yellow-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/10">
                  <CardHeader className="text-center pb-4">
                    <motion.div
                      className={`w-20 h-20 mx-auto mb-4 rounded-2xl ${service.iconBg} flex items-center justify-center border ${service.borderColor} group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <IconComponent className={`w-10 h-10 ${service.iconColor}`} />
                    </motion.div>
                    <CardTitle className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors mb-2">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-400 mb-6 leading-relaxed min-h-[80px]">
                      {service.description}
                    </CardDescription>
                    <Button
                      className={`w-full bg-gradient-to-r ${service.gradient} hover:opacity-90 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg`}
                      onClick={() => {
                        const element = document.getElementById('registration');
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {t('services.learnMore')}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
