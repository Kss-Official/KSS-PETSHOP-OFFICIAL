import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { useAuth } from '../../features/auth/AuthContext';
import { getCloudinaryImageUrl, getPetSpeciesImage } from '../../lib/utils';
import apiClient from '../../lib/axios';
import {
  User,
  PawPrint,
  Package,
  Calendar,
  Lock,
  Sliders,
  Check,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Bell,
  Mail,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  AlertCircle,
  Loader2,
  Info,
  ShoppingBag,
  Heart,
  Minus,
} from 'lucide-react';

interface PetItem {
  id: number;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  imageUrl?: string;
  medicalNotes?: string;
}

interface OrderLineItem {
  id?: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice?: number;
}

interface OrderItem {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  shippingAddress?: string;
  createdAt?: string;
  items: OrderLineItem[];
}

interface AppointmentItem {
  id: number;
  vetName?: string;
  serviceName?: string;
  petName?: string;
  petBreed?: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt?: string;
}

interface VetDoctorItem {
  id: number;
  name: string;
  fullName?: string;
  specialization: string;
  secondarySpecialization?: string;
  city?: string;
  consultationFee?: number;
}

interface CartItemData {
  id: number;
  productId: number;
  productName: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  stockQuantity?: number;
}

export const ProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';
  const { user } = useAuth();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 1. User Profile State (Overview)
  const [userProfile, setUserProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });
  const [formProfile, setFormProfile] = useState(userProfile);
  const [isProfileDirty, setIsProfileDirty] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      const res = await apiClient.get('/customer/profile');
      if (res.data) {
        setUserProfile({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          address: res.data.address || '',
        });
        setFormProfile({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          address: res.data.address || '',
        });
      }
    } catch {
      if (user) {
        setUserProfile((prev) => ({ ...prev, name: user.name, email: user.email }));
        setFormProfile((prev) => ({ ...prev, name: user.name, email: user.email }));
      }
    } finally {
      setProfileLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    setIsProfileDirty(
      formProfile.name !== userProfile.name ||
        formProfile.email !== userProfile.email ||
        formProfile.phone !== userProfile.phone ||
        formProfile.address !== userProfile.address
    );
  }, [formProfile, userProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formProfile.phone) {
      const cleanPhone = formProfile.phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        showToast('Phone number must be exactly 10 digits.', 'error');
        return;
      }
    }

    setProfileSaving(true);
    try {
      const cleanPhone = formProfile.phone ? formProfile.phone.replace(/\D/g, '') : '';
      const res = await apiClient.put('/customer/profile', {
        ...formProfile,
        phone: cleanPhone,
      });
      setUserProfile({
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone || '',
        address: res.data.address || '',
      });
      setIsProfileDirty(false);
      showToast('Profile updated successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.';
      showToast(msg, 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  // 2. Pets State
  const [pets, setPets] = useState<PetItem[]>([]);
  const [petsLoading, setPetsLoading] = useState(false);
  const [petsError, setPetsError] = useState<string | null>(null);

  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [editingPetId, setEditingPetId] = useState<number | null>(null);
  const [petFormData, setPetFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: 1,
    medicalNotes: '',
  });
  const [petSubmitting, setPetSubmitting] = useState(false);
  const [petToDelete, setPetToDelete] = useState<number | null>(null);
  const [petDeleting, setPetDeleting] = useState(false);

  const fetchPets = useCallback(async () => {
    setPetsLoading(true);
    setPetsError(null);
    try {
      const res = await apiClient.get<PetItem[]>('/customer/pets');
      setPets(res.data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load pets.';
      setPetsError(msg);
    } finally {
      setPetsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentTab === 'pets') {
      fetchPets();
    }
  }, [currentTab, fetchPets]);

  const handleSavePet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petFormData.name.trim()) return;

    setPetSubmitting(true);
    try {
      const payload = {
        name: petFormData.name,
        species: petFormData.species,
        breed: petFormData.breed,
        age: Number(petFormData.age),
        medicalNotes: petFormData.medicalNotes,
      };

      if (editingPetId) {
        const res = await apiClient.put<PetItem>(`/customer/pets/${editingPetId}`, payload);
        setPets((prev) => prev.map((p) => (p.id === editingPetId ? res.data : p)));
        showToast('Pet profile updated!');
      } else {
        const res = await apiClient.post<PetItem>('/customer/pets', payload);
        setPets((prev) => [...prev, res.data]);
        showToast('New pet registered!');
      }

      setPetFormData({ name: '', species: 'Dog', breed: '', age: 1, medicalNotes: '' });
      setEditingPetId(null);
      setIsAddPetModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save pet.';
      showToast(msg, 'error');
    } finally {
      setPetSubmitting(false);
    }
  };

  const handleRemovePetConfirm = async (id: number) => {
    setPetDeleting(true);
    try {
      await apiClient.delete(`/customer/pets/${id}`);
      setPets((prev) => prev.filter((p) => p.id !== id));
      setPetToDelete(null);
      showToast('Pet removed from profile.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove pet.';
      showToast(msg, 'error');
    } finally {
      setPetDeleting(false);
    }
  };

  // 3. Orders State
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const res = await apiClient.get<OrderItem[]>('/customer/orders');
      setOrders(res.data || []);
      if (res.data && res.data.length > 0) {
        setExpandedOrderId(res.data[0].id);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load order history.';
      setOrdersError(msg);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentTab === 'orders') {
      fetchOrders();
    }
  }, [currentTab, fetchOrders]);

  // 4. Appointments State
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(null);
  const [appointmentToCancel, setAppointmentToCancel] = useState<number | null>(null);
  const [cancellingAppointment, setCancellingAppointment] = useState(false);

  // Booking Modal State (In Profile)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [vetsList, setVetsList] = useState<VetDoctorItem[]>([]);
  const [selectedVetId, setSelectedVetId] = useState<number | null>(null);
  const [bookingDate, setBookingDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [petNameInput, setPetNameInput] = useState('');
  const [bookingNotesInput, setBookingNotesInput] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingErrorMsg, setBookingErrorMsg] = useState<string | null>(null);

  const fetchVetsList = useCallback(async () => {
    try {
      const res = await apiClient.get<VetDoctorItem[]>('/vets');
      setVetsList(res.data || []);
    } catch {
      // ignore
    }
  }, []);

  const fetchAppointments = useCallback(async () => {
    setAppointmentsLoading(true);
    setAppointmentsError(null);
    try {
      const res = await apiClient.get<AppointmentItem[]>('/customer/appointments');
      setAppointments(res.data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load appointments.';
      setAppointmentsError(msg);
    } finally {
      setAppointmentsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentTab === 'appointments') {
      fetchAppointments();
      fetchVetsList();
    }
  }, [currentTab, fetchAppointments, fetchVetsList]);

  useEffect(() => {
    const vetIdParam = searchParams.get('vetId');
    const bookParam = searchParams.get('book');
    if (currentTab === 'appointments' && (vetIdParam || bookParam === 'true')) {
      setIsBookingModalOpen(true);
      fetchVetsList();
      if (vetIdParam) {
        setSelectedVetId(Number(vetIdParam));
      }
    }
  }, [currentTab, searchParams, fetchVetsList]);

  const handleConfirmNewAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVetId) {
      setBookingErrorMsg('Please select a veterinarian.');
      return;
    }

    setBookingSubmitting(true);
    setBookingErrorMsg(null);

    try {
      await apiClient.post('/customer/appointments', {
        vetId: selectedVetId,
        appointmentDate: bookingDate,
        appointmentTime: bookingTime,
        petName: petNameInput || 'My Pet',
        reason: bookingNotesInput || 'Regular checkup',
      });
      showToast('Appointment booked successfully! 📅');
      setIsBookingModalOpen(false);
      setPetNameInput('');
      setBookingNotesInput('');
      fetchAppointments();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to confirm appointment. Please try again.';
      setBookingErrorMsg(msg);
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleCancelAppointmentConfirm = async (id: number) => {
    setCancellingAppointment(true);
    try {
      const res = await apiClient.put<AppointmentItem>(`/customer/appointments/${id}/cancel`);
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status: res.data.status || 'CANCELLED' } : apt))
      );
      setAppointmentToCancel(null);
      showToast('Appointment cancelled successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to cancel appointment.';
      showToast(msg, 'error');
    } finally {
      setCancellingAppointment(false);
    }
  };

  // 5. Security State (Change Password)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const isPasswordLengthValid = newPassword.length >= 8;
  const isPasswordMatching = newPassword === confirmPassword && confirmPassword.length > 0;
  const canSubmitPassword = currentPassword.length > 0 && isPasswordLengthValid && isPasswordMatching;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitPassword) return;

    setPasswordSubmitting(true);
    try {
      await apiClient.post('/customer/change-password', {
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated successfully! 🔒');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update password. Please check your current password.';
      showToast(msg, 'error');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  // 6. Preferences State
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('pawfectly_user_preferences');
    return saved
      ? JSON.parse(saved)
      : {
          newsletter: true,
          appointmentReminders: true,
          orderUpdates: true,
          healthTips: true,
          promotions: false,
        };
  });

  const handleTogglePreference = (key: keyof typeof preferences) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    localStorage.setItem('pawfectly_user_preferences', JSON.stringify(updated));
    showToast('Preferences updated.');
  };

  // Cart State (In Profile)
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const fetchCartItems = useCallback(async () => {
    setCartLoading(true);
    setCartError(null);
    try {
      const res = await apiClient.get<CartItemData[]>('/customer/cart');
      setCartItems(res.data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load cart.';
      setCartError(msg);
    } finally {
      setCartLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentTab === 'cart') {
      fetchCartItems();
    }
  }, [currentTab, fetchCartItems]);

  const handleUpdateCartQuantity = async (itemId: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(itemId);
      return;
    }
    try {
      const res = await apiClient.put<CartItemData>(`/customer/cart/${itemId}?quantity=${newQty}`);
      setCartItems((prev) => prev.map((item) => (item.id === itemId ? res.data : item)));
      window.dispatchEvent(new Event('cart-updated'));
    } catch {
      showToast('Failed to update quantity.', 'error');
    }
  };

  const handleRemoveCartItem = async (itemId: number) => {
    try {
      await apiClient.delete(`/customer/cart/${itemId}`);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      showToast('Item removed from cart.');
      window.dispatchEvent(new Event('cart-updated'));
    } catch {
      showToast('Failed to remove item.', 'error');
    }
  };

  const handleClearCart = async () => {
    try {
      await apiClient.delete('/customer/cart');
      setCartItems([]);
      showToast('Cart cleared.');
      window.dispatchEvent(new Event('cart-updated'));
    } catch {
      showToast('Failed to clear cart.', 'error');
    }
  };

  const handleCheckoutCart = async () => {
    if (cartItems.length === 0) return;
    setCheckoutLoading(true);
    try {
      await apiClient.post('/customer/orders/checkout');
      setCartItems([]);
      showToast('Order placed successfully!');
      window.dispatchEvent(new Event('cart-updated'));
      setSearchParams({ tab: 'orders' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout failed. Please try again.';
      showToast(msg, 'error');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'cart', label: 'My Cart', icon: ShoppingBag },
    { id: 'pets', label: 'My Pets', icon: PawPrint },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'appointments', label: 'My Appointments', icon: Calendar },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
  ];

  const getStatusBadge = (status?: string) => {
    if (!status) return 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]';
    const s = status.toUpperCase();
    if (s === 'DELIVERED' || s === 'COMPLETED') {
      return 'bg-[#E6F9EC] text-[#287A41] border-[#C3ECD0]';
    } else if (s === 'READY_FOR_PICKUP' || s === 'SHIPPED' || s === 'PROCESSING') {
      return 'bg-[#FFF0E6] text-[#EF7C3C] border-[#FED7AA]';
    } else if (s === 'CANCELLED') {
      return 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]';
    }
    return 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]';
  };

  const getAptStatusBadge = (status: AppointmentItem['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-[#E6F9EC] text-[#287A41] border-[#C3ECD0]';
      case 'PENDING':
        return 'bg-[#FEF9C3] text-[#B45309] border-[#FDE047]';
      case 'COMPLETED':
        return 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]';
      case 'CANCELLED':
        return 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]';
      default:
        return 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]';
    }
  };

  return (
    <div className="min-h-screen lg:h-screen bg-white text-[#16241B] font-sans flex flex-col lg:overflow-hidden">
      {/* 1. Navbar */}
      <Navbar activePage="profile" />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-2.5 rounded-full shadow-lg text-xs font-bold flex items-center gap-2 transition-all ${
            toastType === 'success' ? 'bg-[#16241B] text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toastType === 'success' ? (
            <Check className="w-4 h-4 text-[#009E66]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:h-[calc(100vh-80px)] lg:flex lg:flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch lg:h-full lg:min-h-0">
          {/* =========================================================================
              LEFT SIDEBAR CARD
              ========================================================================= */}
          <aside className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-[#009E66]/20 shadow-[0_10px_35px_rgba(0,158,102,0.12)] relative flex flex-col justify-between overflow-hidden lg:h-full lg:min-h-0">
            <div className="space-y-4 z-10">
              {/* Profile Summary Header with Paw Avatar Badge */}
              <div className="flex items-center gap-3.5 pb-4 border-b border-[#E8E4D8]">
                <div className="w-12 h-12 rounded-full bg-[#E6F9EC] border border-[#C3ECD0] flex items-center justify-center text-[#009E66] shrink-0 shadow-2xs">
                  <PawPrint className="w-6 h-6 fill-[#009E66] text-[#009E66]" />
                </div>
                <div className="overflow-hidden">
                  <h2 className="text-base font-black text-[#16241B] truncate tracking-tight font-sans">
                    {userProfile.name || 'Pawfectly Member'}
                  </h2>
                  <p className="text-xs text-[#556658] font-medium truncate mt-0.5 font-sans">
                    {userProfile.email || 'user@pawfectly.com'}
                  </p>
                </div>
              </div>

              {/* Vertical Navigation List */}
              <nav className="space-y-1">
                {navTabs.map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = currentTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSearchParams({ tab: tab.id })}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer font-sans ${
                        isActive
                          ? 'bg-[#009E66] text-white shadow-xs'
                          : 'text-[#16241B] hover:bg-[#E6F9EC]/50 hover:text-[#009E66]'
                      }`}
                    >
                      <TabIcon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-[#556658]'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Linework Pet Illustration */}
            <div className="pt-2 z-0 pointer-events-none flex justify-start items-end -mb-5 -ml-1">
              <img
                src={getCloudinaryImageUrl('profile_dog_cat_watermark')}
                alt="Dog & Cat Linework Illustration"
                className="w-full max-w-[250px] sm:max-w-[270px] xl:max-w-[290px] h-auto object-contain mix-blend-multiply opacity-95"
              />
            </div>
          </aside>

          {/* =========================================================================
              RIGHT MAIN CARD (Active Tab)
              ========================================================================= */}
          <section className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-7 border border-[#009E66]/20 shadow-[0_10px_35px_rgba(0,158,102,0.12)] lg:h-full lg:min-h-0 overflow-y-auto">
            {/* 1. OVERVIEW TAB */}
            {currentTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#16241B] font-sans tracking-tight">
                    Account Overview
                  </h1>
                  <p className="text-xs sm:text-sm text-[#556658] font-medium font-sans mt-1">
                    Manage your personal details and contact information.
                  </p>
                </div>

                {profileLoading ? (
                  <div className="space-y-5 max-w-2xl">
                    <Skeleton className="h-14 w-full rounded-2xl" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                    <Skeleton className="h-12 w-36 rounded-full mt-4" />
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#16241B] font-sans mb-2">
                        FULL NAME
                      </label>
                      <div className="relative">
                        <User className="w-5 h-5 text-[#88998C] absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formProfile.name}
                          onChange={(e) => setFormProfile({ ...formProfile, name: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF8F3] border border-[#D3D1C7] text-sm text-[#16241B] font-medium font-sans focus:outline-none focus:ring-2 focus:ring-[#009E66] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#16241B] font-sans mb-2">
                        EMAIL ADDRESS
                      </label>
                      <div className="relative">
                        <Mail className="w-5 h-5 text-[#88998C] absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={formProfile.email}
                          onChange={(e) => setFormProfile({ ...formProfile, email: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF8F3] border border-[#D3D1C7] text-sm text-[#16241B] font-medium font-sans focus:outline-none focus:ring-2 focus:ring-[#009E66] focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-[#556658] font-normal font-sans">
                        <Info className="w-4 h-4 text-[#556658] shrink-0" />
                        <span>
                          Changing your email may require re-verification. You will be notified if additional steps are needed.
                        </span>
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#16241B] font-sans mb-2">
                        PHONE NUMBER
                      </label>
                      <div className="relative">
                        <Phone className="w-5 h-5 text-[#88998C] absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          maxLength={10}
                          value={formProfile.phone}
                          placeholder="9876543210"
                          onChange={(e) =>
                            setFormProfile({
                              ...formProfile,
                              phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                            })
                          }
                          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF8F3] border border-[#D3D1C7] text-sm text-[#16241B] font-medium font-sans focus:outline-none focus:ring-2 focus:ring-[#009E66] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Primary Address */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#16241B] font-sans mb-2">
                        PRIMARY ADDRESS
                      </label>
                      <div className="relative">
                        <MapPin className="w-5 h-5 text-[#88998C] absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={formProfile.address}
                          placeholder="Street Address, City, Postal Code"
                          onChange={(e) => setFormProfile({ ...formProfile, address: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF8F3] border border-[#D3D1C7] text-sm text-[#16241B] font-medium font-sans focus:outline-none focus:ring-2 focus:ring-[#009E66] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={!isProfileDirty || profileSaving}
                        className={`px-8 py-3.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 font-sans ${
                          isProfileDirty && !profileSaving
                            ? 'bg-[#009E66] hover:bg-[#008757] text-white shadow-md cursor-pointer'
                            : 'bg-[#009E66]/40 text-white cursor-not-allowed opacity-70'
                        }`}
                      >
                        {profileSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* MY CART TAB */}
            {currentTab === 'cart' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#16241B] tracking-tight">My Shopping Cart</h1>
                    <p className="text-xs sm:text-sm text-[#67796B] font-medium mt-1">
                      Review selected pharmacy items and proceed to instant checkout.
                    </p>
                  </div>
                  {cartItems.length > 0 && (
                    <button
                      onClick={handleClearCart}
                      className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      Clear Cart
                    </button>
                  )}
                </div>

                {cartLoading && (
                  <div className="space-y-4">
                    <Skeleton className="h-24 rounded-2xl" />
                    <Skeleton className="h-24 rounded-2xl" />
                  </div>
                )}

                {cartError && !cartLoading && (
                  <ErrorState
                    title="Could not load your cart"
                    description={cartError}
                    onRetry={fetchCartItems}
                  />
                )}

                {!cartLoading && !cartError && cartItems.length === 0 && (
                  <EmptyState
                    icon={ShoppingBag}
                    title="Your Cart is Empty"
                    description="Browse our verified pet pharmacy for food, toys, supplements, and health essentials."
                    actionLabel="Shop Pet Pharmacy"
                    actionLink="/pharmacy"
                  />
                )}

                {!cartLoading && !cartError && cartItems.length > 0 && (
                  <div className="space-y-6">
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {cartItems.map((item) => {
                        const itemTotal = (item.price || 0) * (item.quantity || 1);
                        return (
                          <div
                            key={item.id}
                            className="bg-[#F8F6F0] rounded-2xl p-4 border border-[#EAE3D4] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-[#E5DFCE] shrink-0 flex items-center justify-center">
                                {item.imageUrl ? (
                                  <img src={getCloudinaryImageUrl(item.imageUrl)} alt={item.productName} className="w-full h-full object-cover" />
                                ) : (
                                  <ShoppingBag className="w-6 h-6 text-[#009E66]" />
                                )}
                              </div>
                              <div>
                                <h3 className="text-sm font-black text-[#16241B]">{item.productName}</h3>
                                <p className="text-xs font-bold text-[#009E66]">₹{item.price ? item.price.toLocaleString('en-IN') : '0'}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                              <div className="flex items-center gap-2 bg-white border border-[#EAE3D4] rounded-full px-2 py-1">
                                <button
                                  onClick={() => handleUpdateCartQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 rounded-full bg-[#F8F6F0] hover:bg-[#E6F9EC] text-[#16241B] flex items-center justify-center cursor-pointer transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-black text-[#16241B] px-1">{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateCartQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded-full bg-[#F8F6F0] hover:bg-[#E6F9EC] text-[#16241B] flex items-center justify-center cursor-pointer transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <span className="text-sm font-black text-[#16241B] min-w-[70px] text-right">
                                ₹{itemTotal.toLocaleString('en-IN')}
                              </span>

                              <button
                                onClick={() => handleRemoveCartItem(item.id)}
                                aria-label="Remove item"
                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Cart Summary Card */}
                    <div className="bg-[#FAF8F3] rounded-2xl p-5 border border-[#E8E4D8] space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#556658]">
                        <span>Items ({cartItems.reduce((acc, i) => acc + i.quantity, 0)}):</span>
                        <span className="font-bold text-[#16241B]">
                          ₹{cartItems.reduce((acc, i) => acc + (i.price || 0) * i.quantity, 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold text-[#556658]">
                        <span>Delivery / In-Store Pickup:</span>
                        <span className="font-bold text-[#009E66]">FREE</span>
                      </div>
                      <div className="pt-2 border-t border-[#E8E4D8] flex items-center justify-between text-base font-black text-[#16241B]">
                        <span>Total Amount:</span>
                        <span className="text-lg text-[#009E66]">
                          ₹{cartItems.reduce((acc, i) => acc + (i.price || 0) * i.quantity, 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        onClick={handleCheckoutCart}
                        disabled={checkoutLoading}
                        className="w-full mt-2 py-3.5 bg-[#009E66] hover:bg-[#008757] text-white font-black rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
                      >
                        {checkoutLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Processing Order...
                          </>
                        ) : (
                          'Proceed to Checkout →'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. MY PETS TAB */}
            {currentTab === 'pets' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#16241B] tracking-tight">My Pets</h1>
                    <p className="text-xs sm:text-sm text-[#67796B] font-medium mt-1">
                      Add, edit, or remove your registered family pets.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingPetId(null);
                      setPetFormData({ name: '', species: 'Dog', breed: '', age: 1, medicalNotes: '' });
                      setIsAddPetModalOpen(true);
                    }}
                    className="px-6 py-3 bg-[#548B60] hover:bg-[#437750] text-white font-bold rounded-full text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Pet</span>
                  </button>
                </div>

                {/* State: Loading */}
                {petsLoading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Skeleton className="h-28 rounded-2xl" />
                    <Skeleton className="h-28 rounded-2xl" />
                  </div>
                )}

                {/* State: Error */}
                {petsError && !petsLoading && (
                  <ErrorState
                    title="Could not load your pets"
                    description={petsError}
                    onRetry={fetchPets}
                  />
                )}

                {/* State: Empty */}
                {!petsLoading && !petsError && pets.length === 0 && (
                  <EmptyState
                    icon={PawPrint}
                    title="No Pets Registered Yet"
                    description="Add your companion animals to quickly book appointments and manage their health history."
                  />
                )}

                {/* State: Pets List */}
                {!petsLoading && !petsError && pets.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pets.map((pet) => (
                      <div
                        key={pet.id}
                        className="bg-[#F8F6F0] rounded-2xl p-5 border border-[#EAE3D4] flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full overflow-hidden bg-white border border-[#E5DFCE] shrink-0">
                            <img
                              src={getPetSpeciesImage(pet.species, pet.imageUrl)}
                              alt={`${pet.name} (${pet.species})`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = getPetSpeciesImage(pet.species);
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="text-base font-black text-[#16241B]">{pet.name}</h3>
                            <p className="text-xs text-[#67796B] font-semibold">
                              {pet.breed || pet.species} • {pet.age ?? 0} {(pet.age ?? 0) === 1 ? 'year' : 'years'} old
                            </p>
                            {pet.medicalNotes && (
                              <p className="text-[11px] text-[#88998C] truncate max-w-[150px] mt-0.5">
                                {pet.medicalNotes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingPetId(pet.id);
                              setPetFormData({
                                name: pet.name,
                                species: pet.species,
                                breed: pet.breed || '',
                                age: pet.age || 1,
                                medicalNotes: pet.medicalNotes || '',
                              });
                              setIsAddPetModalOpen(true);
                            }}
                            aria-label="Edit pet"
                            className="p-2 rounded-full hover:bg-white text-[#67796B] hover:text-[#548B60] transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setPetToDelete(pet.id)}
                            aria-label="Remove pet"
                            className="p-2 rounded-full hover:bg-white text-[#67796B] hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Remove Confirmation Modal */}
                {petToDelete !== null && (
                  <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#EDE7D9] shadow-2xl text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-black text-[#16241B]">Remove Pet?</h3>
                      <p className="text-xs text-[#67796B] font-medium">
                        Are you sure you want to remove this pet from your profile?
                      </p>
                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => setPetToDelete(null)}
                          disabled={petDeleting}
                          className="px-5 py-2.5 rounded-full bg-[#F8F6F0] text-[#16241B] font-bold text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleRemovePetConfirm(petToDelete)}
                          disabled={petDeleting}
                          className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          {petDeleting ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Removing...
                            </>
                          ) : (
                            'Yes, Remove'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add/Edit Pet Modal */}
                {isAddPetModalOpen && (
                  <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EDE7D9] shadow-2xl space-y-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-[#16241B]">
                          {editingPetId ? 'Edit Pet Profile' : 'Add a New Pet'}
                        </h3>
                        <button
                          onClick={() => setIsAddPetModalOpen(false)}
                          className="p-1.5 rounded-full hover:bg-[#F8F6F0] text-[#88998C] hover:text-[#16241B]"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSavePet} className="space-y-4">
                        <div>
                          <label className="block text-[11px] font-black uppercase tracking-wider text-[#16241B] mb-1.5">
                            Pet Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Milo"
                            value={petFormData.name}
                            onChange={(e) => setPetFormData({ ...petFormData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-full bg-[#F8F6F0] border border-[#EAE3D4] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#548B60]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-black uppercase tracking-wider text-[#16241B] mb-1.5">
                              Species
                            </label>
                            <select
                              value={petFormData.species}
                              onChange={(e) => setPetFormData({ ...petFormData, species: e.target.value })}
                              className="w-full px-4 py-3 rounded-full bg-[#F8F6F0] border border-[#EAE3D4] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#548B60]"
                            >
                              <option value="Dog">Dog</option>
                              <option value="Cat">Cat</option>
                              <option value="Rabbit">Rabbit</option>
                              <option value="Bird">Bird</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-black uppercase tracking-wider text-[#16241B] mb-1.5">
                              Age (Years)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="30"
                              required
                              value={petFormData.age}
                              onChange={(e) => setPetFormData({ ...petFormData, age: Number(e.target.value) })}
                              className="w-full px-4 py-3 rounded-full bg-[#F8F6F0] border border-[#EAE3D4] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#548B60]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-black uppercase tracking-wider text-[#16241B] mb-1.5">
                            Breed
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Golden Retriever"
                            value={petFormData.breed}
                            onChange={(e) => setPetFormData({ ...petFormData, breed: e.target.value })}
                            className="w-full px-4 py-3 rounded-full bg-[#F8F6F0] border border-[#EAE3D4] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#548B60]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-black uppercase tracking-wider text-[#16241B] mb-1.5">
                            Medical Notes / Allergies
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Optional health conditions or notes"
                            value={petFormData.medicalNotes}
                            onChange={(e) => setPetFormData({ ...petFormData, medicalNotes: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl bg-[#F8F6F0] border border-[#EAE3D4] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#548B60]"
                          />
                        </div>

                        <div className="pt-2 flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setIsAddPetModalOpen(false)}
                            className="px-5 py-2.5 rounded-full bg-[#F8F6F0] text-[#16241B] font-bold text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={petSubmitting}
                            className="px-6 py-2.5 rounded-full bg-[#548B60] hover:bg-[#437750] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                          >
                            {petSubmitting ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                              </>
                            ) : (
                              'Save Pet'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. MY ORDERS TAB */}
            {currentTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#16241B] tracking-tight">My Orders</h1>
                  <p className="text-xs sm:text-sm text-[#67796B] font-medium mt-1">
                    Track and review past pet pharmacy purchases.
                  </p>
                </div>

                {ordersLoading && (
                  <div className="space-y-4">
                    <Skeleton className="h-28 rounded-2xl" />
                    <Skeleton className="h-28 rounded-2xl" />
                  </div>
                )}

                {ordersError && !ordersLoading && (
                  <ErrorState
                    title="Could not load your orders"
                    description={ordersError}
                    onRetry={fetchOrders}
                  />
                )}

                {!ordersLoading && !ordersError && orders.length === 0 && (
                  <EmptyState
                    icon={ShoppingBag}
                    title="No Orders Found"
                    description="Explore our curated pet pharmacy and supply store to get premium supplements, food, and medications."
                    actionLabel="Shop Pharmacy"
                    actionLink="/pharmacy"
                  />
                )}

                {!ordersLoading && !ordersError && orders.length > 0 && (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const isExpanded = expandedOrderId === order.id;
                      return (
                        <div
                          key={order.id}
                          className="bg-[#F8F6F0] rounded-2xl p-5 border border-[#EAE3D4] space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-0.5">
                              <span className="text-xs font-black text-[#16241B]">
                                {order.orderNumber || `ORD-${order.id}`}
                              </span>
                              {order.createdAt && (
                                <p className="text-xs text-[#88998C] font-medium">
                                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-black border shadow-2xs ${getStatusBadge(
                                  order.status
                                )}`}
                              >
                                {order.status ?? 'UNKNOWN'}
                              </span>
                              <span className="text-sm font-black text-[#16241B]">
                                ₹{order.totalAmount.toLocaleString('en-IN')}
                              </span>
                              <button
                                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                aria-label="Toggle details"
                                className="p-1.5 rounded-full hover:bg-white text-[#67796B] transition-colors cursor-pointer"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="pt-3 border-t border-[#EAE3D4] space-y-2 text-xs">
                              {order.items && order.items.length > 0 ? (
                                order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-[#67796B]">
                                    <span>
                                      {item.quantity}x {item.productName}
                                    </span>
                                    <span className="font-bold text-[#16241B]">
                                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-[#88998C]">No item details available.</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 4. MY APPOINTMENTS TAB */}
            {currentTab === 'appointments' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#16241B] tracking-tight">My Appointments</h1>
                    <p className="text-xs sm:text-sm text-[#67796B] font-medium mt-1">
                      Manage upcoming veterinary bookings and review past visit history.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      fetchVetsList();
                      if (pets.length > 0 && !petNameInput) {
                        setPetNameInput(pets[0].name);
                      }
                      setIsBookingModalOpen(true);
                    }}
                    className="px-6 py-3 bg-[#009E66] hover:bg-[#008757] text-white font-bold rounded-full text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Book New Appointment</span>
                  </button>
                </div>

                {appointmentsLoading && (
                  <div className="space-y-4">
                    <Skeleton className="h-28 rounded-2xl" />
                    <Skeleton className="h-28 rounded-2xl" />
                  </div>
                )}

                {appointmentsError && !appointmentsLoading && (
                  <ErrorState
                    title="Could not load your appointments"
                    description={appointmentsError}
                    onRetry={fetchAppointments}
                  />
                )}

                {!appointmentsLoading && !appointmentsError && (
                  <>
                    {/* Upcoming Appointments */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-wider text-[#16241B] flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#548B60]" />
                        <span>Upcoming Visits</span>
                      </h3>

                      {appointments.filter((a) => a.status === 'CONFIRMED' || a.status === 'PENDING').length === 0 ? (
                        <div className="text-center py-8 bg-[#F8F6F0] rounded-2xl p-4 border border-[#EAE3D4]">
                          <p className="text-xs text-[#67796B] font-medium">No upcoming appointments scheduled.</p>
                        </div>
                      ) : (
                        appointments
                          .filter((a) => a.status === 'CONFIRMED' || a.status === 'PENDING')
                          .map((apt) => (
                            <div
                              key={apt.id}
                              className="bg-[#F8F6F0] rounded-2xl p-5 border border-[#EAE3D4] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-base font-black text-[#16241B]">
                                    {apt.vetName || 'Assigned Veterinarian'}
                                  </h4>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${getAptStatusBadge(
                                      apt.status
                                    )}`}
                                  >
                                    {apt.status}
                                  </span>
                                </div>
                                <p className="text-xs font-semibold text-[#EF7C3C]">
                                  {apt.serviceName || 'General Consultation'}
                                </p>
                                <p className="text-xs text-[#67796B] font-medium">
                                  {apt.appointmentDate} at {apt.appointmentTime}
                                </p>
                                {apt.petName && (
                                  <p className="text-[11px] text-[#88998C] flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-[#548B60]" /> Pet: {apt.petName}{' '}
                                    {apt.petBreed ? `(${apt.petBreed})` : ''}
                                  </p>
                                )}
                              </div>

                              <button
                                onClick={() => setAppointmentToCancel(apt.id)}
                                className="px-4 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer shrink-0"
                              >
                                Cancel Appointment
                              </button>
                            </div>
                          ))
                      )}
                    </div>

                    {/* Past Appointments */}
                    <div className="space-y-4 pt-4 border-t border-[#EAE3D4]">
                      <h3 className="text-xs font-black uppercase tracking-wider text-[#16241B] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#88998C]" />
                        <span>Past History</span>
                      </h3>

                      {appointments.filter((a) => a.status === 'COMPLETED' || a.status === 'CANCELLED').length === 0 ? (
                        <p className="text-xs text-[#88998C] italic">No past appointments recorded.</p>
                      ) : (
                        appointments
                          .filter((a) => a.status === 'COMPLETED' || a.status === 'CANCELLED')
                          .map((apt) => (
                            <div
                              key={apt.id}
                              className="bg-white rounded-2xl p-4 border border-[#EAE3D4] flex items-center justify-between gap-4"
                            >
                              <div className="space-y-0.5">
                                <h4 className="text-sm font-black text-[#16241B]">
                                  {apt.vetName || 'Veterinary Consultation'}
                                </h4>
                                <p className="text-xs text-[#67796B]">
                                  {apt.serviceName || 'Consultation'} • {apt.appointmentDate} at {apt.appointmentTime}
                                </p>
                              </div>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${getAptStatusBadge(
                                  apt.status
                                )}`}
                              >
                                {apt.status}
                              </span>
                            </div>
                          ))
                      )}
                    </div>
                  </>
                )}

                {/* Cancel Confirmation Modal */}
                {appointmentToCancel !== null && (
                  <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#EDE7D9] shadow-2xl text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-black text-[#16241B]">Cancel Appointment?</h3>
                      <p className="text-xs text-[#67796B] font-medium">
                        Are you sure you want to cancel this booking?
                      </p>
                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => setAppointmentToCancel(null)}
                          disabled={cancellingAppointment}
                          className="px-5 py-2.5 rounded-full bg-[#F8F6F0] text-[#16241B] font-bold text-xs cursor-pointer"
                        >
                          Keep Appointment
                        </button>
                        <button
                          onClick={() => handleCancelAppointmentConfirm(appointmentToCancel)}
                          disabled={cancellingAppointment}
                          className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          {cancellingAppointment ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Cancelling...
                            </>
                          ) : (
                            'Yes, Cancel'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* New Appointment Booking Modal */}
                {isBookingModalOpen && (
                  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#EDE7D9] shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
                      <button
                        onClick={() => setIsBookingModalOpen(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <form onSubmit={handleConfirmNewAppointment} className="space-y-4">
                        <div>
                          <span className="text-xs font-bold text-[#EF7C3C] uppercase tracking-wider">Book an Appointment</span>
                          <h3 className="text-xl font-black text-[#16241B] mt-0.5">Schedule Vet Visit</h3>
                          <p className="text-xs text-[#556658]">Select your preferred veterinarian and appointment details.</p>
                        </div>

                        {bookingErrorMsg && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold">
                            {bookingErrorMsg}
                          </div>
                        )}

                        {/* Vet Selection */}
                        <div className="space-y-1 text-left">
                          <label className="text-xs font-bold text-[#334437]">Select Veterinarian</label>
                          <select
                            required
                            value={selectedVetId || ''}
                            onChange={(e) => setSelectedVetId(Number(e.target.value))}
                            className="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#E5DFCE] rounded-xl text-xs font-bold text-[#16241B] focus:outline-none focus:border-[#3FA65C]"
                          >
                            <option value="">-- Choose a Veterinarian --</option>
                            {vetsList.map((vet) => (
                              <option key={vet.id} value={vet.id}>
                                {vet.name || vet.fullName} ({vet.specialization} - ${vet.consultationFee ? vet.consultationFee.toFixed(2) : '50.00'})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Pet Name */}
                        <div className="space-y-1 text-left">
                          <label className="text-xs font-bold text-[#334437]">Pet Name</label>
                          {pets.length > 0 ? (
                            <select
                              value={petNameInput}
                              onChange={(e) => setPetNameInput(e.target.value)}
                              className="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#E5DFCE] rounded-xl text-xs font-bold text-[#16241B] focus:outline-none focus:border-[#3FA65C]"
                            >
                              <option value="">-- Select or enter pet name --</option>
                              {pets.map((p) => (
                                <option key={p.id} value={p.name}>
                                  {p.name} ({p.species})
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              required
                              placeholder="e.g. Bella"
                              value={petNameInput}
                              onChange={(e) => setPetNameInput(e.target.value)}
                              className="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#E5DFCE] rounded-xl text-xs font-bold text-[#16241B] focus:outline-none focus:border-[#3FA65C]"
                            />
                          )}
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1 text-left">
                            <label className="text-xs font-bold text-[#334437]">Preferred Date</label>
                            <input
                              type="date"
                              required
                              value={bookingDate}
                              onChange={(e) => setBookingDate(e.target.value)}
                              className="w-full px-3 py-2.5 bg-[#FAF6EE] border border-[#E5DFCE] rounded-xl text-xs font-bold text-[#16241B] focus:outline-none focus:border-[#3FA65C]"
                            />
                          </div>

                          <div className="space-y-1 text-left">
                            <label className="text-xs font-bold text-[#334437]">Preferred Time</label>
                            <select
                              value={bookingTime}
                              onChange={(e) => setBookingTime(e.target.value)}
                              className="w-full px-3 py-2.5 bg-[#FAF6EE] border border-[#E5DFCE] rounded-xl text-xs font-bold text-[#16241B] focus:outline-none focus:border-[#3FA65C]"
                            >
                              <option value="09:00 AM">09:00 AM</option>
                              <option value="10:00 AM">10:00 AM</option>
                              <option value="11:30 AM">11:30 AM</option>
                              <option value="02:00 PM">02:00 PM</option>
                              <option value="03:30 PM">03:30 PM</option>
                              <option value="05:00 PM">05:00 PM</option>
                            </select>
                          </div>
                        </div>

                        {/* Reason / Symptoms */}
                        <div className="space-y-1 text-left">
                          <label className="text-xs font-bold text-[#334437]">Reason / Symptoms</label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Routine vaccination and annual checkup"
                            value={bookingNotesInput}
                            onChange={(e) => setBookingNotesInput(e.target.value)}
                            className="w-full px-3.5 py-2 bg-[#FAF6EE] border border-[#E5DFCE] rounded-xl text-xs font-semibold text-[#16241B] focus:outline-none focus:border-[#3FA65C]"
                          />
                        </div>

                        {selectedVetId && (
                          <div className="p-3 bg-[#EFF8F0] border border-[#D5EAD9] rounded-xl flex items-center justify-between text-xs font-bold text-[#16241B]">
                            <span>Consultation Fee:</span>
                            <span className="text-sm font-black text-[#287A41]">
                              ${vetsList.find((v) => v.id === selectedVetId)?.consultationFee ? vetsList.find((v) => v.id === selectedVetId)?.consultationFee?.toFixed(2) : '50.00'}
                            </span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={bookingSubmitting}
                          className="w-full bg-[#009E66] hover:bg-[#008757] text-white font-black py-3 rounded-full shadow-xs cursor-pointer flex items-center justify-center gap-2 text-sm transition-all"
                        >
                          {bookingSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" /> Confirming...
                            </>
                          ) : (
                            'Confirm Appointment'
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {currentTab === 'wishlist' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#16241B] tracking-tight">Saved & Liked Items</h1>
                  <p className="text-xs sm:text-sm text-[#67796B] font-medium mt-1">
                    Your favorite pharmacy products, supplements, and bookmarked care services.
                  </p>
                </div>

                <EmptyState
                  icon={Heart}
                  title="No Liked Items Saved Yet"
                  description="Tap the heart icon on any pet service, vet profile, or pharmacy product to save it to your personal wishlist."
                  actionLabel="Explore Pharmacy"
                  actionLink="/pharmacy"
                />
              </div>
            )}

            {/* 5. SECURITY TAB (Change Password) */}
            {currentTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#16241B] tracking-tight">Security & Password</h1>
                  <p className="text-xs sm:text-sm text-[#67796B] font-medium mt-1">
                    Update your account password to keep your profile protected.
                  </p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-6 max-w-2xl">
                  {/* Current Password */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-[#16241B] mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-[#88998C] absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3.5 rounded-full bg-[#F8F6F0] border border-[#EAE3D4] text-sm text-[#16241B] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#548B60]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#88998C] hover:text-[#16241B]"
                      >
                        {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-[#16241B] mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-[#88998C] absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3.5 rounded-full bg-[#F8F6F0] border border-[#EAE3D4] text-sm text-[#16241B] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#548B60]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#88998C] hover:text-[#16241B]"
                      >
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[11px] text-[#88998C] font-medium block mt-1.5">
                      Must be at least 8 characters long.
                    </span>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-[#16241B] mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-[#88998C] absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3.5 rounded-full bg-[#F8F6F0] border border-[#EAE3D4] text-sm text-[#16241B] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#548B60]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#88998C] hover:text-[#16241B]"
                      >
                        {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword.length > 0 && !isPasswordMatching && (
                      <span className="text-[11px] text-red-500 font-bold block mt-1.5">
                        Passwords do not match.
                      </span>
                    )}
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={!canSubmitPassword || passwordSubmitting}
                      className={`px-8 py-3.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                        canSubmitPassword && !passwordSubmitting
                          ? 'bg-[#548B60] hover:bg-[#437750] text-white shadow-md'
                          : 'bg-[#84A88C] text-white cursor-not-allowed opacity-80'
                      }`}
                    >
                      {passwordSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 6. PREFERENCES TAB */}
            {currentTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#16241B] tracking-tight">Preferences & Notifications</h1>
                  <p className="text-xs sm:text-sm text-[#67796B] font-medium mt-1">
                    Control your newsletter subscription and communication alerts.
                  </p>
                </div>

                <div className="space-y-4 max-w-2xl">
                  {/* Newsletter */}
                  <div className="bg-[#F8F6F0] rounded-2xl p-4 sm:p-5 border border-[#EAE3D4] flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-black text-[#16241B] flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#548B60]" />
                        <span>Pawfectly Newsletter</span>
                      </h4>
                      <p className="text-xs text-[#67796B]">
                        Receive monthly pet wellness articles, guides, and care advice.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTogglePreference('newsletter')}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        preferences.newsletter ? 'bg-[#548B60]' : 'bg-[#D1D5DB]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform absolute top-0.5 ${
                          preferences.newsletter ? 'left-6.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Appointment Reminders */}
                  <div className="bg-[#F8F6F0] rounded-2xl p-4 sm:p-5 border border-[#EAE3D4] flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-black text-[#16241B] flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#EF7C3C]" />
                        <span>Appointment Reminders</span>
                      </h4>
                      <p className="text-xs text-[#67796B]">
                        Email & SMS notifications 24 hours before your vet appointments.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTogglePreference('appointmentReminders')}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        preferences.appointmentReminders ? 'bg-[#548B60]' : 'bg-[#D1D5DB]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform absolute top-0.5 ${
                          preferences.appointmentReminders ? 'left-6.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Order Status Updates */}
                  <div className="bg-[#F8F6F0] rounded-2xl p-4 sm:p-5 border border-[#EAE3D4] flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-black text-[#16241B] flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-[#0284C7]" />
                        <span>Order & Pickup Updates</span>
                      </h4>
                      <p className="text-xs text-[#67796B]">
                        Real-time status tracking for your pet pharmacy orders.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTogglePreference('orderUpdates')}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        preferences.orderUpdates ? 'bg-[#548B60]' : 'bg-[#D1D5DB]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform absolute top-0.5 ${
                          preferences.orderUpdates ? 'left-6.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Health & Vaccination Alerts */}
                  <div className="bg-[#F8F6F0] rounded-2xl p-4 sm:p-5 border border-[#EAE3D4] flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-black text-[#16241B] flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#7E22CE]" />
                        <span>Health & Vaccination Alerts</span>
                      </h4>
                      <p className="text-xs text-[#67796B]">
                        Reminders when your pet’s annual vaccinations or checkups are due.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTogglePreference('healthTips')}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        preferences.healthTips ? 'bg-[#548B60]' : 'bg-[#D1D5DB]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform absolute top-0.5 ${
                          preferences.healthTips ? 'left-6.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};
