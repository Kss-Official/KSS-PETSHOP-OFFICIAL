import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ChevronRight,
  PawPrint,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Heart,
  Calendar,
  FileCheck,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Skeleton } from '../../components/ui/Skeleton';
import { apiClient } from '../../lib/axios';
import { useAuth } from '../../features/auth/AuthContext';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import type { ServiceDto } from '../../components/services/services.data';
import { resolveServiceImageUrl, serviceIconsMap } from '../../components/services/services.data';

interface DetailedServiceInfo {
  heroTagline: string;
  inclusions: string[];
  specs: { label: string; value: string; icon?: React.ElementType }[];
  highlights: { title: string; desc: string; iconBg: string }[];
  steps: { step: string; title: string; desc: string }[];
}

const getDetailedServiceInfo = (serviceName?: string): DetailedServiceInfo => {
  const name = (serviceName || '').toLowerCase();

  if (name.includes('vet') || name.includes('health') || name.includes('doctor')) {
    return {
      heroTagline: 'Comprehensive physical exams, preventive immunizations, diagnostic testing, and certified clinical care.',
      inclusions: [
        'Complete nose-to-tail physical evaluation',
        'Heart, lung & vital signs diagnostic auscultation',
        'Preventive core & lifestyle vaccination booster scheduling',
        'Parasite screening & preventive prescription guidance',
        'Dental hygiene, ear canal & ophthalmology examination',
        'Digital health summary & medication notes in Pawfectly app',
      ],
      specs: [
        { label: 'Session Duration', value: '30 - 45 Minutes', icon: Clock },
        { label: 'Care Level', value: 'Board-Certified Veterinarian', icon: ShieldCheck },
        { label: 'Suitable For', value: 'Dogs, Cats & Small Pets', icon: PawPrint },
        { label: 'Follow-up Support', value: '24/7 Digital Messaging', icon: Heart },
      ],
      highlights: [
        {
          title: 'Physical Diagnostics & Vitals',
          desc: 'Thorough assessment of joints, skin, coat, abdomen, and cardiovascular health to detect early warning signs.',
          iconBg: 'bg-[#FEF3EB] text-[#EF7C3C]',
        },
        {
          title: 'Vaccinations & Boosters',
          desc: 'Up-to-date immunizations tailored to your pet’s age, lifestyle, and local epidemiological risks.',
          iconBg: 'bg-[#E6F9EC] text-[#287A41]',
        },
        {
          title: 'Preventive Lab Screenings',
          desc: 'Fecal parasite checks, blood chemistry panels, and urinalysis to ensure internal organ vitality.',
          iconBg: 'bg-[#FEF3EB] text-[#EF7C3C]',
        },
        {
          title: 'Critical & Emergency Care',
          desc: 'Rapid intervention protocols for sudden illness, wound management, poisoning, or post-operative recovery.',
          iconBg: 'bg-[#E6F9EC] text-[#287A41]',
        },
      ],
      steps: [
        {
          step: '01',
          title: 'Gentle Triage & Low-Stress Greeting',
          desc: 'We allow your pet to settle in comfortably with fear-free calming techniques and pet-friendly treats before beginning.',
        },
        {
          step: '02',
          title: 'Thorough Clinical Examination',
          desc: 'Our veterinarian performs a comprehensive head-to-paw assessment and discusses all observations openly with you.',
        },
        {
          step: '03',
          title: 'Personalized Care Plan & Digital Records',
          desc: 'Receive immediate prescription guidance, dietary tips, and an updated digital health chart saved to your profile.',
        },
      ],
    };
  }

  if (name.includes('groom') || name.includes('spa')) {
    return {
      heroTagline: 'Luxury hydrotherapy baths, breed-standard precision styling, sanitary care, and gentle coat nourishment.',
      inclusions: [
        'Hydrotherapy bath with organic botanical shampoos',
        'Hand fluff blowout & thorough deshedding treatment',
        'Breed-standard styling, scissoring & sanitary trims',
        'Gentle nail trimming & smooth edge grinding',
        'Ear canal sanitization & plaque-clearing dental foam',
        'Signature coat conditioning spritz & bandana finish',
      ],
      specs: [
        { label: 'Session Duration', value: '60 - 90 Minutes', icon: Clock },
        { label: 'Grooming Staff', value: 'Master Certified Pet Stylist', icon: ShieldCheck },
        { label: 'Suitable For', value: 'All Coat Types & Breeds', icon: PawPrint },
        { label: 'Products Used', value: '100% Organic & Tearless', icon: Sparkles },
      ],
      highlights: [
        {
          title: 'Hydro-Surge Botanical Bath',
          desc: 'Deep cleansing micro-bubble hydrotherapy that lifts dead undercoat and hydrates sensitive skin.',
          iconBg: 'bg-[#FEF3EB] text-[#EF7C3C]',
        },
        {
          title: 'Breed Styling & Hand Scissoring',
          desc: 'Customized trims, teddy bear cuts, and precise sanitary scissoring designed for both beauty and comfort.',
          iconBg: 'bg-[#E6F9EC] text-[#287A41]',
        },
        {
          title: 'Paws, Claws & Pad Therapy',
          desc: 'Smooth nail dremel grinding and soothing herbal paw balm application to prevent cracking and scratching.',
          iconBg: 'bg-[#FEF3EB] text-[#EF7C3C]',
        },
        {
          title: 'Ear & Oral Hygiene Polish',
          desc: 'Gentle antibacterial ear cleansing and enzymatic breath-freshening foam to protect dental wellness.',
          iconBg: 'bg-[#E6F9EC] text-[#287A41]',
        },
      ],
      steps: [
        {
          step: '01',
          title: 'Coat & Skin Inspection',
          desc: 'We examine your pet’s coat texture, matting levels, and skin sensitivity to select the ideal shampoo formula.',
        },
        {
          step: '02',
          title: 'Spa Bath & Deshedding Blowout',
          desc: 'Warm hydrotherapy wash followed by high-velocity temperature-controlled fluff drying to release loose hair.',
        },
        {
          step: '03',
          title: 'Custom Styling & Final Polish',
          desc: 'Precision hand scissor styling, nail grinding, and ear cleansing leaving your pet looking and smelling wonderful.',
        },
      ],
    };
  }

  if (name.includes('food') || name.includes('nutrition') || name.includes('diet')) {
    return {
      heroTagline: 'Customized dietary formulation, food allergy screenings, life-stage nutrition, and clinical weight management.',
      inclusions: [
        'Comprehensive body condition score (BCS) assessment',
        'Custom macronutrient & calorie target calculation',
        'Elimination diet planning for food sensitivities & allergies',
        'Kitten / puppy growth charts and senior joint diets',
        'Targeted supplement protocols (Omega-3, Probiotics)',
        'Quarterly nutritional milestone tracking & meal adjustments',
      ],
      specs: [
        { label: 'Consultation Duration', value: '30 - 45 Minutes', icon: Clock },
        { label: 'Nutritionist', value: 'Certified Veterinary Nutritionist', icon: ShieldCheck },
        { label: 'Focus Areas', value: 'Weight, Allergies & Longevity', icon: Heart },
        { label: 'Diet Formats', value: 'Fresh, Raw, Dry & Prescription', icon: Sparkles },
      ],
      highlights: [
        {
          title: 'Custom Meal Formulation',
          desc: 'Personalized meal plans built around your pet’s exact breed, metabolic rate, and daily activity levels.',
          iconBg: 'bg-[#FEF3EB] text-[#EF7C3C]',
        },
        {
          title: 'Allergy & Gut Screening',
          desc: 'Identifies common dietary triggers to eliminate chronic itching, ear flare-ups, and digestive distress.',
          iconBg: 'bg-[#E6F9EC] text-[#287A41]',
        },
        {
          title: 'Metabolic Weight Management',
          desc: 'Healthy, sustained fat-loss protocols that protect lean muscle mass and reduce joint pressure.',
          iconBg: 'bg-[#FEF3EB] text-[#EF7C3C]',
        },
        {
          title: 'Life-Stage Optimization',
          desc: 'Specialized nutrient balances for growing puppies, pregnant mothers, and aging senior companions.',
          iconBg: 'bg-[#E6F9EC] text-[#287A41]',
        },
      ],
      steps: [
        {
          step: '01',
          title: 'Dietary History & Lifestyle Intake',
          desc: 'We analyze current food brands, treats, feeding schedules, and any recurring digestive symptoms.',
        },
        {
          step: '02',
          title: 'Body Composition Analysis',
          desc: 'We calculate exact caloric requirements and formulate a tailored ingredient breakdown for your pet.',
        },
        {
          step: '03',
          title: 'Custom Diet Plan Handover',
          desc: 'Receive and review your pet’s personalized recipe, nutritional chart, and portioning guide directly in your Pawfectly portal or in-store.',
        },
      ],
    };
  }

  // Default fallback for other services (Pharmacy, Training, Boarding, Transport, Toys)
  return {
    heroTagline: 'Professional care protocols, licensed specialists, and rigorous safety standards for your furry family.',
    inclusions: [
      'Comprehensive 1-on-1 consultation with verified experts',
      'Personalized care schedule tailored to your pet’s unique needs',
      'Pet-first gentle handling and low-stress environment',
      'Full compliance with national veterinary and safety standards',
      'Real-time appointment updates & digital summary via app',
      'Dedicated in-store pickup and post-service customer assistance',
    ],
    specs: [
      { label: 'Availability', value: 'Daily In-Store Slots', icon: Clock },
      { label: 'Verification', value: '100% Licensed & Insured', icon: ShieldCheck },
      { label: 'Applicable Pets', value: 'All Breeds & Life Stages', icon: PawPrint },
      { label: 'Care Support', value: 'In-Store & Digital Support', icon: Heart },
    ],
    highlights: [
      {
        title: 'Certified Expert Execution',
        desc: 'Every procedure and session is performed by trained, background-checked pet care specialists.',
        iconBg: 'bg-[#FEF3EB] text-[#EF7C3C]',
      },
      {
        title: 'Safety & Sterilization',
        desc: 'Hospital-grade sanitized tools and dedicated climate-controlled environments for complete peace of mind.',
        iconBg: 'bg-[#E6F9EC] text-[#287A41]',
      },
      {
        title: 'Stress-Free Handling',
        desc: 'Positive reinforcement, soothing acoustics, and patient staff who prioritize your pet’s emotional comfort.',
        iconBg: 'bg-[#FEF3EB] text-[#EF7C3C]',
      },
      {
        title: 'Direct Digital Care Summary',
        desc: 'Clear, transparent records of every service completed sent straight to your mobile account.',
        iconBg: 'bg-[#E6F9EC] text-[#287A41]',
      },
    ],
    steps: [
      {
        step: '01',
        title: 'In-Store Booking & Intake',
        desc: 'Reserve your appointment slot and let us know your pet’s preferences, medical notes, or special requirements.',
      },
      {
        step: '02',
        title: 'Attentive In-Store Care',
        desc: 'Our verified specialists carry out the service on-site at our store with utmost attention to safety, hygiene, and comfort.',
      },
      {
        step: '03',
        title: 'Pickup & Ongoing Wellness',
        desc: 'Pick up your happy, refreshed pet with complete digital records and easy one-tap appointment rebooking.',
      },
    ],
  };
};

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const prefersReduced = usePrefersReducedMotion();

  const [services, setServices] = useState<ServiceDto[]>([]);
  const [currentService, setCurrentService] = useState<ServiceDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all services and find the current one
  useEffect(() => {
    setLoading(true);
    setError(null);

    apiClient
      .get('/services')
      .then((res) => {
        const list: ServiceDto[] = res.data || [];
        setServices(list);

        const found = list.find(
          (s) => String(s.id) === id || s.name.toLowerCase().replace(/\s+/g, '-') === id
        );

        if (found) {
          setCurrentService(found);
        } else if (list.length > 0) {
          setCurrentService(list[0]);
        }
      })
      .catch(() => {
        setError('Unable to load service details. Please check your connection and try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleServiceSelect = (serviceId: number) => {
    navigate(`/services/${serviceId}`);
  };

  const handleBookNow = () => {
    if (isAuthenticated) {
      navigate('/profile?tab=appointments');
    } else {
      navigate('/login');
    }
  };

  const activeServiceId = currentService?.id || Number(id) || 1;
  const imageUrl = currentService ? resolveServiceImageUrl(currentService) : '';
  const serviceIconConfig = currentService
    ? serviceIconsMap[currentService.name] || { icon: PawPrint, bg: 'bg-[#E6F9EC]', text: 'text-[#287A41]' }
    : { icon: PawPrint, bg: 'bg-[#E6F9EC]', text: 'text-[#287A41]' };
  const MainIcon = serviceIconConfig.icon;
  const detailedInfo = getDetailedServiceInfo(currentService?.name);

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#16241B] font-sans flex flex-col selection:bg-[#EF7C3C]/20 selection:text-[#EF7C3C] relative">
      <Navbar activePage="services" />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <Skeleton className="h-96 rounded-3xl" />
            </div>
            <div className="lg:col-span-8 space-y-6">
              <Skeleton className="h-96 rounded-3xl" />
              <Skeleton className="h-10 w-3/4 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-80 rounded-3xl" />
            </div>
          </div>
        ) : error && !currentService ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#EDE7D9] p-8 max-w-lg mx-auto">
            <p className="text-red-600 font-bold mb-4">{error}</p>
            <button
              onClick={() => navigate('/services')}
              className="px-6 py-2.5 bg-[#EF7C3C] text-white font-bold rounded-full hover:bg-[#d9692a] transition-colors cursor-pointer"
            >
              Back to Services
            </button>
          </div>
        ) : (
          <div>
            {/* Back to Services Button */}
            <div className="mb-6">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#EDE7D9] text-xs sm:text-sm font-bold text-[#16241B] hover:border-[#EF7C3C] hover:text-[#EF7C3C] hover:bg-[#FEF3EB]/40 transition-all shadow-2xs group cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#EF7C3C] group-hover:-translate-x-1 transition-transform" />
                <span>Back to Services</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* ================= LEFT SIDEBAR ================= */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {/* Our Services Navigation Card */}
              <div className="bg-[#FAF6EE] rounded-[24px] p-6 border border-[#EDE7D9] shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EAE3D2]">
                  <h3 className="text-lg font-black text-[#16241B] relative inline-block">
                    Our Services
                    <span className="absolute bottom-[-17px] left-0 w-8 h-[2.5px] bg-[#EF7C3C] rounded-full" />
                  </h3>
                  <span className="text-xs font-bold text-[#556658] bg-white px-2.5 py-1 rounded-full border border-[#EDE7D9]">
                    {services.length || 8} Options
                  </span>
                </div>

                <div className="space-y-2">
                  {services.map((srv) => {
                    const isSelected = srv.id === activeServiceId;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => handleServiceSelect(srv.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-[16px] text-xs sm:text-sm font-bold transition-all duration-200 text-left cursor-pointer ${
                          isSelected
                            ? 'bg-[#EF7C3C] text-white shadow-md shadow-[#EF7C3C]/20 scale-[1.02]'
                            : 'bg-white/90 text-[#16241B] hover:bg-white border border-[#EDE7D9] hover:border-[#EF7C3C]/50 hover:text-[#EF7C3C]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <PawPrint
                            className={`w-4 h-4 shrink-0 transition-transform ${
                              isSelected ? 'text-white' : 'text-[#EF7C3C]'
                            }`}
                          />
                          <span className="truncate">{srv.name}</span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            isSelected ? 'text-white translate-x-0.5' : 'text-[#556658]/40'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Service Specs Box */}
              <div className="bg-white rounded-[24px] p-6 border border-[#EDE7D9] shadow-xs space-y-4">
                <h4 className="text-sm font-black text-[#16241B] uppercase tracking-wider flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#EF7C3C]" />
                  Service Specifications
                </h4>

                <div className="space-y-3">
                  {detailedInfo.specs.map((item, idx) => {
                    const SpecIcon = item.icon || ShieldCheck;
                    return (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-[#F5EFE4] last:border-none text-xs">
                        <span className="text-[#556658] font-medium flex items-center gap-2">
                          <SpecIcon className="w-3.5 h-3.5 text-[#3FA65C]" />
                          {item.label}
                        </span>
                        <span className="text-[#16241B] font-bold text-right truncate max-w-[150px]">
                          {item.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* ================= RIGHT CONTENT AREA ================= */}
            <section className="lg:col-span-8 space-y-8">
              {/* 1. Large Featured Service Image */}
              <motion.div
                initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
                animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full aspect-[16/9] max-h-[440px] rounded-[28px] overflow-hidden bg-[#FAF7F2] border border-[#EDE7D9] shadow-sm"
              >
                <img
                  src={imageUrl}
                  alt={currentService?.name || 'Pet Care'}
                  className="w-full h-full object-cover sm:object-contain bg-[#FAF7F2] p-2 sm:p-4"
                />

                {/* Floating Service Badge */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-white/80">
                  <div className={`w-6 h-6 rounded-full ${serviceIconConfig.bg} ${serviceIconConfig.text} flex items-center justify-center`}>
                    <MainIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-extrabold text-[#16241B]">
                    {currentService?.name}
                  </span>
                </div>
              </motion.div>

              {/* 2. Headlines & Overview Description */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-[#EF7C3C] uppercase tracking-wider block mb-1">
                    Certified Pet Wellness
                  </span>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#16241B] tracking-tight">
                    We Love to Take Care of Your Pets
                  </h1>
                </div>

                <p className="text-sm sm:text-base text-[#556658] font-normal leading-relaxed">
                  {currentService?.description || detailedInfo.heroTagline}
                </p>

                {currentService?.tagline && (
                  <p className="text-xs sm:text-sm text-[#16241B] font-semibold bg-white p-4 rounded-2xl border border-[#EDE7D9] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#EF7C3C] shrink-0" />
                    <span>{currentService.tagline}</span>
                  </p>
                )}
              </div>

              {/* 3. "What's Included in Every Visit" Checklist */}
              <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#EDE7D9] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#16241B]">
                    What’s Included in This Service
                  </h3>
                  <span className="text-xs font-bold text-[#287A41] bg-[#E6F9EC] px-3 py-1 rounded-full border border-[#3FA65C]/30">
                    Comprehensive Standard
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {detailedInfo.inclusions.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FAF6EE]/70 border border-[#EDE7D9]/60">
                      <CheckCircle2 className="w-4 h-4 text-[#287A41] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-[#16241B] font-semibold leading-snug">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Treatment & Care Highlights Container */}
              <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#EDE7D9] shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-black text-[#16241B]">
                    Key Treatment & Care Highlights
                  </h3>
                  <span className="text-xs text-[#EF7C3C] font-bold bg-[#FEF3EB] px-3 py-1 rounded-full border border-[#EF7C3C]/20">
                    Customized Care
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {detailedInfo.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FAF6EE] rounded-[22px] p-5 sm:p-6 border border-[#EDE7D9] text-[#16241B] flex flex-col justify-between hover:border-[#3FA65C]/50 hover:bg-white hover:shadow-sm transition-all group"
                    >
                      <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center mb-4 border border-current/15 shadow-2xs font-black text-base group-hover:scale-105 transition-transform`}>
                        <PawPrint className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-[#16241B] mb-2 group-hover:text-[#3FA65C] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#556658] font-medium leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. 3-Step Care Journey ("How Your Appointment Works") */}
              <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#EDE7D9] shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-bold text-[#EF7C3C] uppercase tracking-wider block mb-1">
                    Care Process
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-[#16241B]">
                    How Your Appointment Works
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {detailedInfo.steps.map((step, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#EDE7D9] flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-black text-[#EF7C3C]/80 font-mono">
                          {step.step}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#3FA65C] shadow-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-[#16241B] mb-1.5">
                          {step.title}
                        </h4>
                        <p className="text-xs text-[#556658] leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Bottom Assurance & Safety Guarantee */}
              <div className="bg-white rounded-[24px] p-6 border border-[#EDE7D9] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E6F9EC] text-[#287A41] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#16241B]">
                      100% Certified & Verified Professionals
                    </h4>
                    <p className="text-xs text-[#556658]">
                      Every doctor and pet caregiver is vetted for safety, hygiene, and clinical excellence.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBookNow}
                  className="px-5 py-2.5 bg-[#EF7C3C] hover:bg-[#d9692a] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-xs shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Schedule Visit
                </button>
              </div>
            </section>
          </div>
        </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
