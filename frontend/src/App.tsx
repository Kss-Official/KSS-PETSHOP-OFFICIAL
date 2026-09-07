import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/customer/HomePage';
import { FindVetPage } from './pages/customer/FindVetPage';
import { ServicesPage } from './pages/customer/ServicesPage';
import { HealthTipsPage } from './pages/customer/HealthTipsPage';
import { PharmacyPage } from './pages/customer/PharmacyPage';
import { InsurancePage } from './pages/customer/InsurancePage';
import { ProfilePage } from './pages/customer/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/find-a-vet" element={<FindVetPage />} />
        <Route path="/vets" element={<FindVetPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/health-tips" element={<HealthTipsPage />} />
        <Route path="/pharmacy" element={<PharmacyPage />} />
        <Route path="/insurance" element={<InsurancePage />} />
        <Route path="/pet-insurance" element={<InsurancePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}






