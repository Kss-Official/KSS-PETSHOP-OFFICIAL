import { useEffect, useLayoutEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/customer/HomePage';
import { FindVetPage } from './pages/customer/FindVetPage';
import { ServicesPage } from './pages/customer/ServicesPage';
import { HealthTipsPage } from './pages/customer/HealthTipsPage';
import { PharmacyPage } from './pages/customer/PharmacyPage';
import { InsurancePage } from './pages/customer/InsurancePage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { LoginPage } from './pages/auth/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthProvider } from './features/auth/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
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
      if (
        typeof document !== 'undefined' &&
        'startViewTransition' in document &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        document.startViewTransition(() => {
          flushSync(() => {
            setDisplayLocation(location);
          });
        });
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
        <Route path="/find-a-vet" element={<FindVetPage />} />
        <Route path="/vets" element={<FindVetPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/health-tips" element={<HealthTipsPage />} />
        <Route path="/pharmacy" element={<PharmacyPage />} />
        <Route path="/insurance" element={<InsurancePage />} />
        <Route path="/pet-insurance" element={<InsurancePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Customer Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <ProfilePage />
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
        <BrowserRouter>
          <ScrollToTop />
          <AnimatedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}






