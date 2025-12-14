'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

const Contacts = () => {
  const { t } = useTranslation();

  const contactMethods = [
    {
      icon: Phone,
      title: 'Телефон',
      description: 'Позвоните нам в любое время',
      contact: '+7 (747) 637-81-85',
      action: 'tel:+77476378185',
      color: 'from-green-400 to-green-600',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Быстрое сообщение через WhatsApp',
      contact: '+7 (747) 637-81-85',
      action: 'https://wa.me/+77476378185',
      color: 'from-green-400 to-green-600',
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Напишите нам на почту',
      contact: 'info@securix.kz',
      action: 'mailto:info@securix.kz',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: MapPin,
      title: 'Адрес',
      description: 'Наш офис в Алматы',
      contact: 'г. Алматы, ул. Абая, 150',
      action: '#',
      color: 'from-purple-400 to-purple-600',
    },
  ];

  return (
    <section id="contacts" className="py-20 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('navigation.contacts')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Свяжитесь с нами любым удобным способом. Мы всегда готовы помочь!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <Card
                key={index}
                className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/10"
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                    {method.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-300 mb-4 text-sm">
                    {method.description}
                  </p>
                  <p className="text-white font-semibold mb-4">
                    {method.contact}
                  </p>
                  <Button
                    className={`w-full bg-gradient-to-r ${method.color} hover:opacity-90 text-white font-semibold transition-all duration-300 transform hover:scale-105`}
                    onClick={() => {
                      if (method.action.startsWith('http') || method.action.startsWith('mailto') || method.action.startsWith('tel')) {
                        window.open(method.action, '_blank');
                      }
                    }}
                  >
                    Связаться
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Working Hours */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Clock className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Режим работы</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div>
                <div className="font-semibold text-white">Техническая поддержка</div>
                <div>24/7 - круглосуточно</div>
              </div>
              <div>
                <div className="font-semibold text-white">Офис</div>
                <div>Пн-Пт: 9:00 - 18:00</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Contacts;
