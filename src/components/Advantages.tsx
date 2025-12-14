'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Zap, 
  Smartphone, 
  CreditCard, 
  MessageCircle,
  Star,
  Clock,
  Users,
  Shield
} from 'lucide-react';

const Advantages = () => {
  const { t } = useTranslation();

  const advantages = [
    {
      icon: Star,
      title: t('advantages.pioneers.title'),
      description: t('advantages.pioneers.description'),
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      icon: Smartphone,
      title: t('advantages.access.title'),
      description: t('advantages.access.description'),
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: CreditCard,
      title: t('advantages.pricing.title'),
      description: t('advantages.pricing.description'),
      color: 'from-green-400 to-green-600',
    },
    {
      icon: MessageCircle,
      title: t('advantages.support.title'),
      description: t('advantages.support.description'),
      color: 'from-purple-400 to-purple-600',
    },
  ];

  return (
    <section id="advantages" className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('advantages.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {t('advantages.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            return (
              <Card
                key={index}
                className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/10"
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${advantage.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                        {advantage.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {advantage.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-black" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-gray-400">Доступность</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-black" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">1000+</div>
            <div className="text-gray-400">Клиентов</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-black" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">99.9%</div>
            <div className="text-gray-400">Надежность</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-black" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">&lt;30с</div>
            <div className="text-gray-400">Реакция</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advantages;
