/**
 * Общие типы для приложения Securix
 */

export type Language = 'ru' | 'kk' | 'en';

export type UserRole = 'client' | 'admin' | 'gbr';

export type ServiceType = 'bodyguard' | 'driver' | 'concierge' | 'sos';

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number; // в KZT
  hours: number;
  features: string[];
  duration: number; // в месяцах
  popular?: boolean;
};

export type User = {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: UserRole;
  subscription?: {
    planId: string;
    startDate: string;
    endDate: string;
    hoursRemaining: number;
    isActive: boolean;
  };
  emergencyContacts?: EmergencyContact[];
  createdAt: string;
};

export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  label: string;
  consent: boolean;
};

export type Order = {
  id: string;
  userId: string;
  serviceType: ServiceType;
  status: OrderStatus;
  date: string;
  time: string;
  duration: number; // в часах
  location?: {
    address: string;
    lat?: number;
    lng?: number;
  };
  description?: string;
  price: number; // в KZT
  createdAt: string;
  updatedAt: string;
};

export type SOSActivation = {
  id: string;
  userId: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  audioRecorded: boolean;
  contactsNotified: boolean;
  gbrNotified: boolean;
  status: 'active' | 'resolved' | 'cancelled';
};

export type ChatMessage = {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
  read: boolean;
};

export type NotificationSettings = {
  push: boolean;
  email: boolean;
  sms: boolean;
};

