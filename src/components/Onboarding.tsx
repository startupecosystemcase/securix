'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, MapPin, Phone, Users, X } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export default function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [contacts, setContacts] = useState<string[]>(['']);

  const steps = [
    {
      icon: Shield,
      title: t('onboarding.step1.title'),
      description: t('onboarding.step1.description'),
    },
    {
      icon: MapPin,
      title: t('onboarding.step2.title'),
      description: t('onboarding.step2.description'),
    },
    {
      icon: Users,
      title: t('onboarding.step3.title'),
      description: t('onboarding.step3.description'),
    },
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Моковое предоставление разрешений
    onComplete();
  };

  const addContact = () => {
    if (contacts.length < 5) {
      setContacts([...contacts, '']);
    }
  };

  const removeContact = (index: number) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((_, i) => i !== index));
    }
  };

  const updateContact = (index: number, value: string) => {
    const newContacts = [...contacts];
    newContacts[index] = value;
    setContacts(newContacts);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 bg-gray-900 border-gray-800 relative">
          {onSkip && (
            <button
              onClick={onSkip}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          )}

          <AnimatePresence mode="wait">
            {step <= steps.length ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                {(() => {
                  const StepIcon = steps[step - 1].icon;
                  return (
                    <div className="mb-6 flex justify-center">
                      <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <StepIcon className="w-10 h-10 text-yellow-500" />
                      </div>
                    </div>
                  );
                })()}

                <h2 className="text-3xl font-bold mb-4">{steps[step - 1].title}</h2>
                <p className="text-gray-400 mb-8">{steps[step - 1].description}</p>

                {step === 3 && (
                  <div className="mb-6 text-left">
                    <label className="block text-sm text-gray-400 mb-2">
                      Контакты для экстренных случаев (минимум 3)
                    </label>
                    <div className="space-y-2">
                      {contacts.map((contact, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="tel"
                            value={contact}
                            onChange={(e) => updateContact(index, e.target.value)}
                            placeholder="+7 777 123 4567"
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                          />
                          {contacts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeContact(index)}
                              className="text-red-500 hover:text-red-400"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      {contacts.length < 5 && (
                        <button
                          type="button"
                          onClick={addContact}
                          className="text-yellow-500 hover:text-yellow-400 text-sm"
                        >
                          + Добавить контакт
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  {onSkip && (
                    <Button
                      variant="outline"
                      onClick={onSkip}
                      className="border-gray-800"
                    >
                      {t('onboarding.skip')}
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    disabled={step === 3 && contacts.filter(c => c.trim()).length < 3}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    {step === steps.length ? t('onboarding.done') : t('onboarding.next')}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="mb-6">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-10 h-10 text-green-500" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-4">Готово!</h2>
                <p className="text-gray-400 mb-8">
                  Вы готовы использовать Securix. Все разрешения предоставлены.
                </p>
                <Button
                  onClick={handleComplete}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  {t('onboarding.grantPermissions')}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Indicator */}
          <div className="mt-8 flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index + 1 <= step ? 'bg-yellow-500 w-8' : 'bg-gray-700 w-2'
                }`}
              />
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

