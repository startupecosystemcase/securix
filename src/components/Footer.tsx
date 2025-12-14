'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter, Linkedin, ExternalLink } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo and Company Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">S</span>
              </div>
              <span className="text-white font-bold text-xl">Securix</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              Революционная экосистема защиты для Центральной Азии
            </p>
          </div>

          {/* Social Links */}
          <div className="text-center">
            <h4 className="text-white font-semibold mb-4">Следите за нами</h4>
            <div className="flex justify-center space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-yellow-500 hover:text-black transition-all duration-300"
                    onClick={() => window.open(social.href, '_blank')}
                  >
                    <IconComponent className="w-5 h-5" />
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Copyright and Powered By */}
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm mb-2">
              {t('footer.copyright')}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-yellow-400 transition-colors text-xs"
              onClick={() => window.open('https://benevsky.com', '_blank')}
            >
              {t('footer.poweredBy')}
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="text-center">
            <p className="text-gray-500 text-xs">
              Securix - Ваша безопасность в один клик
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
