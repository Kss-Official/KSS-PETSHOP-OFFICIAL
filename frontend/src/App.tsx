import { useEffect, useLayoutEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/customer/HomePage';
import { ServicesPage } from './pages/customer/ServicesPage';
import { VetProfilePage } from './pages/customer/VetProfilePage';
import { HealthTipsPage } from './pages/customer/HealthTipsPage';
import { ArticleDetailPage } from './pages/customer/ArticleDetailPage';
import { BrowsePetHealthTipsPage } from './pages/customer/BrowsePetHealthTipsPage';
import { PharmacyPage } from './pages/customer/PharmacyPage';
import { PharmacyCategoryPage } from './pages/customer/PharmacyCategoryPage';
import { PharmacyConcernPage } from './pages/customer/PharmacyConcernPage';
import { PetEssentialsPage } from './pages/customer/PetEssentialsPage';
import { ContactSupportPage } from './pages/customer/ContactSupportPage';
import { PrivacyPolicyPage } from './pages/customer/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/customer/TermsOfServicePage';
import { HelpCenterPage } from './pages/customer/HelpCenterPage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { LoginPage } from './pages/auth/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminVetsPage } from './pages/admin/AdminVetsPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminArticlesPage } from './pages/admin/AdminArticlesPage';
import { AdminNewsletterPage } from './pages/admin/AdminNewsletterPage';
import { AdminInsuranceQuotesPage } from './pages/admin/AdminInsuranceQuotesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AuthProvider } from './features/auth/AuthContext';
import { CartProvider, useCart } from './hooks/useCart';
import { CompareProvider } from './hooks/useCompare';
import { Confetti } from './components/ui/Confetti';
import { CompareBar } from './components/products/CompareBar';
import { CompareSheet } from './components/products/CompareSheet';
import { AdminToastProvider } from './components/admin/AdminLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';

import { LoginPromptModal } from './components/common/LoginPromptModal';

function AppCartOverlay() {
  const { confettiParticles, isAuthModalOpen, closeAuthModal } = useCart();
  return (
    <>
      <Confetti particles={confettiParticles} />
      <CompareBar />
      <CompareSheet />
      <LoginPromptModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);

  useLayoutEffect(() => {
    if (
      location.pathname !== displayLocation.pathname ||
      location.search !== displayLocation.search
    ) {
      // Only invoke view transitions for page route changes (not in-page query params)
      const isRoutePathChange = location.pathname !== displayLocation.pathname;

      if (
        isRoutePathChange &&
        typeof document !== 'undefined' &&
        'startViewTransition' in document &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        try {
          const transition = (document as unknown as { startViewTransition: (cb: () => void) => { ready?: Promise<void>; finished?: Promise<void>; updateCallbackDone?: Promise<void> } }).startViewTransition(() => {
            flushSync(() => {
              setDisplayLocation(location);
            });
          });

          // Safely catch any transition aborts triggered by viewport resize, devtools emulation, or DOM interruption
          transition?.ready?.catch(() => {});
          transition?.finished?.catch(() => {});
          transition?.updateCallbackDone?.catch(() => {});
        } catch {
          setDisplayLocation(location);
        }
      } else {
        setDisplayLocation(location);
      }
    }
  }, [location, displayLocation]);

  return (
    <div className="page-transition min-h-screen">
      <Routes location={displayLocation}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/vets/:id" element={<VetProfilePage />} />
        <Route path="/health-tips" element={<HealthTipsPage />} />
        <Route path="/health-tips/by-pet-type" element={<BrowsePetHealthTipsPage />} />
        <Route path="/health-tips/pet-types" element={<BrowsePetHealthTipsPage />} />
        <Route path="/pet-health-tips" element={<BrowsePetHealthTipsPage />} />
        <Route path="/health-tips/:id" element={<ArticleDetailPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/pharmacy" element={<PharmacyPage />} />
        <Route path="/pharmacy/concern/:concernSlug" element={<PharmacyConcernPage />} />
        <Route path="/pharmacy/:category" element={<PharmacyCategoryPage />} />
        <Route path="/pet-essentials" element={<PetEssentialsPage />} />
        <Route path="/essentials" element={<PetEssentialsPage />} />
        <Route path="/contact-support" element={<ContactSupportPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/help-center" element={<HelpCenterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />

        {/* Customer Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminAppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vets"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminVetsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminServicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminCustomersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/articles"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminArticlesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/newsletter"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminNewsletterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/quotes"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminInsuranceQuotesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminSettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <CompareProvider>
            <AdminToastProvider>
              <BrowserRouter>
                <ScrollToTop />
                <AnimatedRoutes />
                <AppCartOverlay />
              </BrowserRouter>
            </AdminToastProvider>
          </CompareProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}






