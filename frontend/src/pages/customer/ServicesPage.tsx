import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { apiClient } from '../../lib/axios';
import { useAuth } from '../../features/auth/AuthContext';
import { GroomingExcellence } from '../../components/services/GroomingExcellence';
import { ServicesGrid } from '../../components/services/ServicesGrid';
import { ServicesFaq } from '../../components/services/ServicesFaq';
import type { ServiceDto } from '../../components/services/services.data';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [highlightedServiceId, setHighlightedServiceId] = useState<number | null>(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const prefersReduced = usePrefersReducedMotion();

  const fetchServices = () => {
    setLoading(true);
    setError(null);
    apiClient
      .get('/services')
      .then((res) => {
        setServices(res.data || []);
      })
      .catch(() => {
        setError('Failed to load services. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleBookService = (_service?: ServiceDto) => {
    if (isAuthenticated) {
      navigate('/profile?tab=appointments');
    } else {
      navigate('/login');
    }
  };

  const handleJumpToService = (serviceId: number) => {
    const cardEl = document.getElementById(`service-card-${serviceId}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' });
      setHighlightedServiceId(serviceId);
      setTimeout(() => {
        setHighlightedServiceId(null);
      }, 2500);
    } else {
      const gridEl = document.getElementById('services-grid');
      if (gridEl) {
        gridEl.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#16241B] font-sans flex flex-col selection:bg-[#EF7C3C]/20 selection:text-[#EF7C3C] overflow-x-clip relative">
      {/* 1. Sticky Glass Navbar */}
      <Navbar activePage="services" />

      {/* Main Content with subtle page entrance */}
      <motion.main
        initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
        animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex-grow space-y-16 lg:space-y-24 pt-6 pb-16"
      >
        {/* 1. Services Grid with Animated Filters & Micro-interactions */}
        <ServicesGrid
          services={services}
          loading={loading}
          error={error}
          highlightedServiceId={highlightedServiceId}
          onRetry={fetchServices}
          onBook={handleBookService}
        />

        {/* 2. Grooming Excellence / Why Us Section */}
        <GroomingExcellence
          onExploreGrooming={() => {
            const groomingService = services.find(
              (s) => s.name.toLowerCase().includes('groom') || s.name.toLowerCase().includes('spa')
            );
            if (groomingService) {
              handleJumpToService(groomingService.id);
            } else {
              const gridEl = document.getElementById('services-grid');
              gridEl?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* 3. Services FAQ Accordion */}
        <ServicesFaq />
      </motion.main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
};

export default ServicesPage;
