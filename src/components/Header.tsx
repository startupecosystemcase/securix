'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { key: 'home', id: 'hero' },
    { key: 'services', id: 'services' },
    { key: 'advantages', id: 'advantages' },
    { key: 'partners', id: 'partners' },
    { key: 'about', id: 'about' },
    { key: 'contacts', id: 'contacts' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-md border-b border-yellow-500/20'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">S</span>
            </div>
            <span className="text-white font-bold text-xl">Securix</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.id)}
                className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium"
              >
                {t(`navigation.${item.key}`)}
              </button>
            ))}
          </nav>

          {/* Language Switcher */}
          <div className="flex items-center space-x-4">
            <div className="flex bg-black/20 rounded-lg p-1">
              <Button
                variant={i18n.language === 'ru' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => changeLanguage('ru')}
                className={`px-3 py-1 text-xs ${
                  i18n.language === 'ru'
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                    : 'text-white hover:text-yellow-400'
                }`}
              >
                RU
              </Button>
              <Button
                variant={i18n.language === 'kk' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => changeLanguage('kk')}
                className={`px-3 py-1 text-xs ${
                  i18n.language === 'kk'
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                    : 'text-white hover:text-yellow-400'
                }`}
              >
                KZ
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-yellow-400"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-black/90 backdrop-blur-md rounded-lg p-4">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.id)}
                  className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium text-left"
                >
                  {t(`navigation.${item.key}`)}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
