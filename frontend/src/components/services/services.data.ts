import React from 'react';
import {
  Stethoscope,
  Scissors,
  Utensils,
  Home,
  PawPrint,
  ShieldCheck,
  Truck,
  Sparkles,
  Pill,
  CalendarCheck,
  Heart,
} from 'lucide-react';

export interface ServiceDto {
  id: number;
  name: string;
  category?: string;
  tagline?: string;
  description: string;
  price?: number;
  durationMinutes?: number;
  available?: boolean;
  isActive?: boolean;
  imageUrl?: string;
  iconUrl?: string;
}

export const resolveServiceImageUrl = (service: ServiceDto): string => {
  if (service.imageUrl && service.imageUrl.startsWith('http')) {
    return service.imageUrl;
  }
  const name = (service.name || '').toLowerCase();
  if (name.includes('vet') || name.includes('health') || name.includes('doctor')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896182/c52497e6-b462-42af-8257-69b80c7369c7_1.png';
  }
  if (name.includes('food') || name.includes('nutrition') || name.includes('diet')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896176/f2cf2664-43f8-4d4b-8189-53b787d9813f_1.png';
  }
  if (name.includes('grooming') || name.includes('groom') || name.includes('spa')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896181/f911c486-badb-4db4-9d87-471e79ad0437_1.png';
  }
  if (name.includes('pharmacy') || name.includes('med') || name.includes('drug')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896180/56e92693-e2f2-4587-9e7c-83e25d7b523f_1.png';
  }
  if (name.includes('toy') || name.includes('enrichment') || name.includes('play')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896179/46d5d20e-fe06-4b2f-afd0-c5fb7d7e10a3_1.png';
  }
  if (name.includes('boarding') || name.includes('daycare') || name.includes('stay')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896177/5041fe2b-47be-4fa0-b556-8d2c5926e54b_1.png';
  }
  if (name.includes('training') || name.includes('behaviour') || name.includes('behavior')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896174/c1b76666-8097-4311-911e-8b51d62c4739_1.png';
  }
  if (name.includes('transport') || name.includes('ambulance')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896169/8e9541cf-3bdc-4ed9-8979-e137acb9e77b_1.png';
  }
  const fallbacks = [
    'https://res.cloudinary.com/vphylrop/image/upload/v1788896182/c52497e6-b462-42af-8257-69b80c7369c7_1.png',
    'https://res.cloudinary.com/vphylrop/image/upload/v1788896176/f2cf2664-43f8-4d4b-8189-53b787d9813f_1.png',
    'https://res.cloudinary.com/vphylrop/image/upload/v1788896181/f911c486-badb-4db4-9d87-471e79ad0437_1.png',
    'https://res.cloudinary.com/vphylrop/image/upload/v1788896180/56e92693-e2f2-4587-9e7c-83e25d7b523f_1.png',
    'https://res.cloudinary.com/vphylrop/image/upload/v1788896179/46d5d20e-fe06-4b2f-afd0-c5fb7d7e10a3_1.png',
    'https://res.cloudinary.com/vphylrop/image/upload/v1788896177/5041fe2b-47be-4fa0-b556-8d2c5926e54b_1.png',
    'https://res.cloudinary.com/vphylrop/image/upload/v1788896174/c1b76666-8097-4311-911e-8b51d62c4739_1.png',
    'https://res.cloudinary.com/vphylrop/image/upload/v1788896169/8e9541cf-3bdc-4ed9-8979-e137acb9e77b_1.png',
  ];
  return fallbacks[((service.id || 1) - 1) % fallbacks.length];
};

export const serviceIconsMap: Record<
  string,
  { icon: React.ElementType; bg: string; text: string }
> = {
  'Veterinary Care': { icon: Stethoscope, bg: 'bg-[#E6F9EC]', text: 'text-[#287A41]' },
  'Vet Care': { icon: Stethoscope, bg: 'bg-[#E6F9EC]', text: 'text-[#287A41]' },
  'Pet Food & Nutrition': { icon: Utensils, bg: 'bg-[#FEF9C3]', text: 'text-[#B45309]' },
  'Pet Food': { icon: Utensils, bg: 'bg-[#FEF9C3]', text: 'text-[#B45309]' },
  'Professional Grooming': { icon: Scissors, bg: 'bg-[#FFE4E6]', text: 'text-[#E11D48]' },
  'Grooming': { icon: Scissors, bg: 'bg-[#FFE4E6]', text: 'text-[#E11D48]' },
  'Pet Pharmacy & Meds': { icon: Pill, bg: 'bg-[#E0F2FE]', text: 'text-[#0284C7]' },
  'Pharmacy': { icon: Pill, bg: 'bg-[#E0F2FE]', text: 'text-[#0284C7]' },
  'Toys & Enrichment': { icon: Sparkles, bg: 'bg-[#F3E8FF]', text: 'text-[#7E22CE]' },
  'Boarding & Daycare': { icon: Home, bg: 'bg-[#FFEDD5]', text: 'text-[#C2410C]' },
  'Boarding': { icon: Home, bg: 'bg-[#FFEDD5]', text: 'text-[#C2410C]' },
  'Pet Training & Behaviour': { icon: PawPrint, bg: 'bg-[#DCFCE7]', text: 'text-[#15803D]' },
  'Training': { icon: PawPrint, bg: 'bg-[#DCFCE7]', text: 'text-[#15803D]' },
  'Pet Transport & Ambulance': { icon: Truck, bg: 'bg-[#FCE7F3]', text: 'text-[#BE185D]' },
  'Pet Transport': { icon: Truck, bg: 'bg-[#FCE7F3]', text: 'text-[#BE185D]' },
  'Pet Insurance': { icon: ShieldCheck, bg: 'bg-[#FFEDD5]', text: 'text-[#C2410C]' },
};

export const SERVICES_HERO_SUBTITLE =
  'Explore our verified range of pet care services designed to keep your furry friends healthy, happy, and loved.';

export const SERVICES_HERO_IMAGE_PUBLIC_ID = 'services_hero_lake_pets';

export const HERO_FLOATING_CARDS = [
  {
    id: 'support',
    text: '24/7 Pet Support',
    icon: '💬',
    positionClass: 'top-6 left-4 sm:left-8',
    bgClass: 'bg-white/95 border-white/80 text-[#854D0E]',
    animationClass: 'animate-float-slow',
  },
  {
    id: 'vets',
    text: '500+ Verified Vets',
    icon: '🩺',
    positionClass: 'top-1/2 -right-2 sm:right-4 -translate-y-1/2',
    bgClass: 'bg-white/95 border-white/80 text-[#166534]',
    animationClass: 'animate-float-delayed',
  },
  {
    id: 'appointment',
    text: 'Appointment Booked ✓',
    icon: '📅',
    positionClass: 'bottom-8 left-6 sm:left-16',
    bgClass: 'bg-white/95 border-white/80 text-[#9D174D]',
    animationClass: 'animate-float-updown',
  },
];

export const BOOKING_STEPS_DATA = [
  {
    step: '01',
    title: 'Choose a Service',
    description: 'Browse certified vet clinics, spa grooming, and personalized care options.',
    icon: Stethoscope,
  },
  {
    step: '02',
    title: 'Pick a Slot',
    description: 'Select your preferred time with guaranteed instant booking confirmation.',
    icon: CalendarCheck,
  },
  {
    step: '03',
    title: 'Get Care',
    description: 'Enjoy expert care from verified pet professionals who treat your pet like family.',
    icon: Heart,
  },
];

export const SERVICES_FAQ_DATA = [
  {
    id: 'faq-1',
    question: 'How do I book an in-clinic veterinary consultation?',
    answer:
      'Simply choose "Veterinary Care" or your desired doctor from our service catalog, pick your date and available time slot, and confirm your appointment. You will receive an instant confirmation notification.',
  },
  {
    id: 'faq-2',
    question: 'Are all groomers and trainers verified and certified?',
    answer:
      'Yes! Every groomer, clinic, and behavioral trainer on Pawfectly undergoes rigorous background checks, license verifications, and clinic quality audits to ensure the highest safety standards for your pet.',
  },
  {
    id: 'faq-3',
    question: 'What is included in the full Pet Grooming service?',
    answer:
      'Our comprehensive grooming includes soothing hydrotherapy baths, coat deshedding/styling, nail clipping, gentle ear cleaning, sanitary trims, and a full coat conditioning blowout with pet-safe organic botanicals.',
  },
  {
    id: 'faq-4',
    question: 'What happens in case of an emergency or urgent transport?',
    answer:
      'Our Pet Taxi & Ambulance service is on standby 24/7. You can request urgent transport or contact our on-call veterinary partner clinics directly through the app anytime.',
  },
  {
    id: 'faq-5',
    question: 'Can I reschedule or cancel my service booking?',
    answer:
      'Yes, you can easily reschedule or cancel appointments with zero hassle up to 2 hours before your scheduled time directly from your Profile Appointment Manager.',
  },
  {
    id: 'faq-6',
    question: 'What should I bring along for my pet’s first visit?',
    answer:
      'Please bring your pet’s previous vaccination records or medical history (if available) and their favorite comfort blanket or toy. All clinical exam supplies, hypoallergenic shampoos, and sanitized grooming tools are provided on-site.',
  },
  {
    id: 'faq-7',
    question: 'Do you offer customized diet plans for pets with food allergies?',
    answer:
      'Yes! Our certified veterinary nutritionists perform detailed body condition scoring and formulate specialized elimination diets and hypoallergenic recipes tailored precisely to your pet’s unique metabolic needs.',
  },
];
