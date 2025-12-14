'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Handshake, TrendingUp, Users, Award } from 'lucide-react';

const Partners = () => {
  const { t } = useTranslation();

  return (
    <section id="partners" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            {t('partners.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full mb-8"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Handshake className="w-10 h-10 text-black" />
              </div>
              
              <h3 className="text-3xl font-bold text-black mb-6">
                {t('partners.title')}
              </h3>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
                {t('partners.description')}
              </p>

              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => window.open('https://wa.me/+77476378185', '_blank')}
              >
                {t('partners.contact')}
              </Button>
            </CardContent>
          </Card>

          {/* Benefits Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-black mb-3">Выгодные условия</h4>
              <p className="text-gray-600">Конкурентные тарифы и гибкие условия сотрудничества</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-black mb-3">Поддержка команды</h4>
              <p className="text-gray-600">Полная техническая и маркетинговая поддержка</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-black mb-3">Престижное партнерство</h4>
              <p className="text-gray-600">Статус официального партнера Securix</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
