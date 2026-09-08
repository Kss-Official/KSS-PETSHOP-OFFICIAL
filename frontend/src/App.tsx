import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/customer/HomePage';
import { FindVetPage } from './pages/customer/FindVetPage';
import { ServicesPage } from './pages/customer/ServicesPage';
import { HealthTipsPage } from './pages/customer/HealthTipsPage';
import { PharmacyPage } from './pages/customer/PharmacyPage';
import { InsurancePage } from './pages/customer/InsurancePage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { LoginPage } from './pages/auth/LoginPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthProvider } from './features/auth/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
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
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Customer Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}






