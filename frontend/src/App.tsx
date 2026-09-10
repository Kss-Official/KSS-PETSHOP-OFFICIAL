import { useEffect, useLayoutEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/customer/HomePage';
import { FindVetPage } from './pages/customer/FindVetPage';
import { VetProfilePage } from './pages/customer/VetProfilePage';
import { ServicesPage } from './pages/customer/ServicesPage';
import { HealthTipsPage } from './pages/customer/HealthTipsPage';
import { ArticleDetailPage } from './pages/customer/ArticleDetailPage';
import { PharmacyPage } from './pages/customer/PharmacyPage';
import { InsurancePage } from './pages/customer/InsurancePage';
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
import { AdminToastProvider } from './components/admin/AdminLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';

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
        <Route path="/vets/:id" element={<VetProfilePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/health-tips" element={<HealthTipsPage />} />
        <Route path="/health-tips/:id" element={<ArticleDetailPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/pharmacy" element={<PharmacyPage />} />
        <Route path="/insurance" element={<InsurancePage />} />
        <Route path="/pet-insurance" element={<InsurancePage />} />
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
        <AdminToastProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AnimatedRoutes />
          </BrowserRouter>
        </AdminToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}






