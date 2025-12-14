'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Target, Users, Award } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: Shield,
      title: 'Безопасность',
      description: 'Наша главная ценность - обеспечение максимальной безопасности наших клиентов',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: Target,
      title: 'Надежность',
      description: 'Мы гарантируем качество услуг и оперативное реагирование в любой ситуации',
      color: 'from-green-400 to-green-600',
    },
    {
      icon: Users,
      title: 'Команда',
      description: 'Профессиональные специалисты с многолетним опытом работы в сфере безопасности',
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: Award,
      title: 'Инновации',
      description: 'Используем передовые технологии для обеспечения современной защиты',
      color: 'from-yellow-400 to-yellow-600',
    },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            О компании Securix
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Мы - команда профессионалов, объединенных общей миссией создания безопасного цифрового пространства для Центральной Азии
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${value.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3 group-hover:text-gray-700 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Company Stats */}
        <div className="bg-gradient-to-r from-black to-gray-900 rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-8">Securix в цифрах</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">1000+</div>
              <div className="text-gray-300">Довольных клиентов</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-gray-300">Круглосуточная поддержка</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">99.9%</div>
              <div className="text-gray-300">Надежность системы</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">&lt;30с</div>
              <div className="text-gray-300">Время реакции</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
