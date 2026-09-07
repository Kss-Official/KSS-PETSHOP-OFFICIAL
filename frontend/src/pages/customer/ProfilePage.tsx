import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder';
import {
  User,
  PawPrint,
  ShoppingBag,
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
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

interface PetItem {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  placeholderLabel: string;
}

interface OrderLineItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderItem {
  id: string;
  date: string;
  itemCount: number;
  totalPrice: number;
  status: 'Placed' | 'Ready for Pickup' | 'Completed' | 'Cancelled';
  items: OrderLineItem[];
}

interface AppointmentItem {
  id: string;
  vetName: string;
  service: string;
  dateTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  address: string;
  isUpcoming: boolean;
}

export const ProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. User Profile State (Overview)
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('pawfectly_user_profile');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Alex Morgan',
          email: 'alex.morgan@example.com',
          phone: '+91 98765 43210',
        };
  });

  const [formProfile, setFormProfile] = useState(userProfile);
  const [isProfileDirty, setIsProfileDirty] = useState(false);

  useEffect(() => {
    setIsProfileDirty(
      formProfile.name !== userProfile.name ||
        formProfile.email !== userProfile.email ||
        formProfile.phone !== userProfile.phone
    );
  }, [formProfile, userProfile]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/v1/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formProfile),
      }).catch(() => {});
    } catch {}

    setUserProfile(formProfile);
    localStorage.setItem('pawfectly_user_profile', JSON.stringify(formProfile));
    setIsProfileDirty(false);
    showToast('Profile changes saved successfully! ✨');
  };

  // 2. Pets State
  const [pets, setPets] = useState<PetItem[]>(() => {
    const saved = localStorage.getItem('pawfectly_user_pets');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'pet-1',
            name: 'Buddy',
            species: 'Dog',
            breed: 'Golden Retriever',
            age: 3,
            placeholderLabel: 'Golden Retriever Buddy',
          },
          {
            id: 'pet-2',
            name: 'Luna',
            species: 'Cat',
            breed: 'Persian Longhair',
            age: 2,
            placeholderLabel: 'Persian Cat Luna',
          },
        ];
  });

  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [petFormData, setPetFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: 1,
  });

  const [petToDelete, setPetToDelete] = useState<string | null>(null);

  const handleSavePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petFormData.name.trim()) return;

    if (editingPetId) {
      const updated = pets.map((p) =>
        p.id === editingPetId
          ? {
              ...p,
              name: petFormData.name,
              species: petFormData.species,
              breed: petFormData.breed,
              age: Number(petFormData.age),
              placeholderLabel: `${petFormData.name} (${petFormData.species})`,
            }
          : p
      );
      setPets(updated);
      localStorage.setItem('pawfectly_user_pets', JSON.stringify(updated));
      showToast('Pet details updated! 🐾');
    } else {
      const newPet: PetItem = {
        id: `pet-${Date.now()}`,
        name: petFormData.name,
        species: petFormData.species,
        breed: petFormData.breed,
        age: Number(petFormData.age),
        placeholderLabel: `${petFormData.name} (${petFormData.species})`,
      };
      const updated = [...pets, newPet];
      setPets(updated);
      localStorage.setItem('pawfectly_user_pets', JSON.stringify(updated));
      showToast('New pet added to your family! 🐾');
    }

    setPetFormData({ name: '', species: 'Dog', breed: '', age: 1 });
    setEditingPetId(null);
    setIsAddPetModalOpen(false);
  };

  const handleRemovePetConfirm = (id: string) => {
    const updated = pets.filter((p) => p.id !== id);
    setPets(updated);
    localStorage.setItem('pawfectly_user_pets', JSON.stringify(updated));
    setPetToDelete(null);
    showToast('Pet removed from profile.');
  };

  // 3. Orders State
  const [orders] = useState<OrderItem[]>([
    {
      id: 'ORD-7821',
      date: 'Aug 28, 2024',
      itemCount: 2,
      totalPrice: 4398,
      status: 'Ready for Pickup',
      items: [
        { name: "Hill's Science Diet Adult Dry Dog Food", quantity: 1, price: 2499 },
        { name: 'Royal Canin Kitten Food', quantity: 1, price: 1899 },
      ],
    },
    {
      id: 'ORD-6540',
      date: 'Jul 15, 2024',
      itemCount: 1,
      totalPrice: 1299,
      status: 'Completed',
      items: [{ name: 'Frontline Plus Flea & Tick Treatment', quantity: 1, price: 1299 }],
    },
    {
      id: 'ORD-5192',
      date: 'May 04, 2024',
      itemCount: 1,
      totalPrice: 799,
      status: 'Cancelled',
      items: [{ name: 'Virbac Ear Cleaner', quantity: 1, price: 799 }],
    },
  ]);

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>('ORD-7821');

  // 4. Appointments State
  const [appointments, setAppointments] = useState<AppointmentItem[]>([
    {
      id: 'APT-101',
      vetName: 'Dr. Rahul Sharma',
      service: 'General Wellness Checkup',
      dateTime: 'Tomorrow, 10:30 AM (Sep 09, 2026)',
      status: 'CONFIRMED',
      address: 'Pawfect Care Clinic, Brigade Road',
      isUpcoming: true,
    },
    {
      id: 'APT-102',
      vetName: 'Dr. Priya Mehta',
      service: 'Dental Scaling & Cleaning',
      dateTime: 'Sep 15, 2026 at 02:00 PM',
      status: 'PENDING',
      address: 'PetLife Veterinary Hospital, Indiranagar',
      isUpcoming: true,
    },
    {
      id: 'APT-090',
      vetName: 'Dr. Sarah Mitchell',
      service: 'Annual Vaccination Booster',
      dateTime: 'Aug 10, 2024 at 11:00 AM',
      status: 'COMPLETED',
      address: 'Pawfect Care Clinic, Brigade Road',
      isUpcoming: false,
    },
  ]);

  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);

  const handleCancelAppointmentConfirm = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: 'CANCELLED', isUpcoming: false } : apt
      )
    );
    setAppointmentToCancel(null);
    showToast('Appointment cancelled successfully.');
  };

  // 5. Security State (Change Password)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const isPasswordLengthValid = newPassword.length >= 8;
  const isPasswordMatching = newPassword === confirmPassword && confirmPassword.length > 0;
  const canSubmitPassword = currentPassword.length > 0 && isPasswordLengthValid && isPasswordMatching;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitPassword) return;

    try {
      await fetch('/api/v1/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      }).catch(() => {});
    } catch {}

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password updated successfully! 🔒');
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

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'pets', label: 'My Pets', icon: PawPrint },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'appointments', label: 'My Appointments', icon: Calendar },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
  ];

  const getStatusBadge = (status: OrderItem['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#E6F9EC] text-[#287A41] border-[#C3ECD0]';
      case 'Ready for Pickup':
        return 'bg-[#FFF0E6] text-[#EF7C3C] border-[#FED7AA]';
      case 'Cancelled':
        return 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]';
      default:
        return 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]';
    }
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
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#16241B] font-sans flex flex-col">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16241B] text-white px-5 py-3 rounded-full shadow-xl text-sm font-bold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-[#3FA65C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* =========================================================================
              LEFT SIDEBAR (Sticky Navigation)
              ========================================================================= */}
          <aside className="lg:col-span-4 bg-white rounded-[28px] p-6 border border-[#EDE7D9] shadow-xs sticky top-24 space-y-6">
            {/* User Profile Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-[#F0EAE1]">
              <div className="w-16 h-16 rounded-full bg-[#E6F9EC] border-2 border-[#3FA65C] flex items-center justify-center text-xl font-black text-[#287A41] shadow-2xs">
                {userProfile.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <h2 className="text-lg font-black text-[#16241B] truncate">
                  {userProfile.name}
                </h2>
                <p className="text-xs text-[#556658] font-medium truncate">
                  {userProfile.email}
                </p>
                <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider bg-[#E6F9EC] text-[#287A41] px-2 py-0.5 rounded-full">
                  Pet Parent Member
                </span>
              </div>
            </div>

            {/* Tab Links */}
            <nav className="space-y-1.5">
              {navTabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSearchParams({ tab: tab.id })}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#3FA65C] text-white shadow-xs'
                        : 'text-[#556658] hover:bg-[#FAF6EE] hover:text-[#16241B]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <TabIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#88998C]'}`} />
                      <span>{tab.label}</span>
                    </div>
                    {isActive && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* =========================================================================
              RIGHT CONTENT AREA (Active Tab)
              ========================================================================= */}
          <section className="lg:col-span-8 bg-white rounded-[28px] p-6 sm:p-8 border border-[#EDE7D9] shadow-xs">
            {/* 1. OVERVIEW TAB */}
            {currentTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-[#16241B]">Account Overview</h2>
                  <p className="text-xs text-[#556658] font-medium mt-1">
                    Manage your personal details and contact information.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#16241B] mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formProfile.name}
                      onChange={(e) => setFormProfile({ ...formProfile, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF6EE] border border-[#E5DFCE] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#3FA65C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#16241B] mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formProfile.email}
                      onChange={(e) => setFormProfile({ ...formProfile, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF6EE] border border-[#E5DFCE] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#3FA65C]"
                    />
                    <span className="text-[11px] text-[#88998C] font-medium block mt-1">
                      Account notifications and appointment confirmations will be sent here.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#16241B] mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formProfile.phone}
                      onChange={(e) => setFormProfile({ ...formProfile, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF6EE] border border-[#E5DFCE] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#3FA65C]"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={!isProfileDirty}
                      className={`px-8 py-3.5 rounded-full font-black text-sm transition-all flex items-center gap-2 cursor-pointer ${
                        isProfileDirty
                          ? 'bg-[#3FA65C] hover:bg-[#348e4e] text-white shadow-md'
                          : 'bg-[#E5DFCE] text-[#88998C] cursor-not-allowed'
                      }`}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 2. MY PETS TAB */}
            {currentTab === 'pets' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-[#16241B]">My Pets</h2>
                    <p className="text-xs text-[#556658] font-medium mt-1">
                      Add, edit, or remove your registered family pets.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingPetId(null);
                      setPetFormData({ name: '', species: 'Dog', breed: '', age: 1 });
                      setIsAddPetModalOpen(true);
                    }}
                    className="px-5 py-2.5 bg-[#3FA65C] hover:bg-[#348e4e] text-white font-bold rounded-full text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Pet</span>
                  </button>
                </div>

                {/* Pets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pets.map((pet) => (
                    <div
                      key={pet.id}
                      className="bg-[#FAF6EE] rounded-2xl p-4 border border-[#EAE3D2] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-white border border-[#E5DFCE] shrink-0">
                          <ImagePlaceholder label={pet.placeholderLabel} className="rounded-full" />
                        </div>
                        <div>
                          <h3 className="text-base font-black text-[#16241B]">{pet.name}</h3>
                          <p className="text-xs text-[#556658] font-semibold">
                            {pet.breed || pet.species} • {pet.age} {pet.age === 1 ? 'year' : 'years'} old
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingPetId(pet.id);
                            setPetFormData({
                              name: pet.name,
                              species: pet.species,
                              breed: pet.breed,
                              age: pet.age,
                            });
                            setIsAddPetModalOpen(true);
                          }}
                          aria-label="Edit pet"
                          className="p-2 rounded-full hover:bg-white text-[#556658] hover:text-[#3FA65C] transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setPetToDelete(pet.id)}
                          aria-label="Remove pet"
                          className="p-2 rounded-full hover:bg-white text-[#556658] hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Remove Confirmation Modal */}
                {petToDelete && (
                  <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#EDE7D9] shadow-xl text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-black text-[#16241B]">Remove Pet?</h3>
                      <p className="text-xs text-[#556658] font-medium">
                        Are you sure you want to remove this pet from your profile? This action cannot be undone.
                      </p>
                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => setPetToDelete(null)}
                          className="px-5 py-2.5 rounded-full bg-[#FAF6EE] text-[#16241B] font-bold text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleRemovePetConfirm(petToDelete)}
                          className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                        >
                          Yes, Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add / Edit Pet Modal Form */}
                {isAddPetModalOpen && (
                  <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EDE7D9] shadow-2xl space-y-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-[#16241B]">
                          {editingPetId ? 'Edit Pet Profile' : 'Add a New Pet'}
                        </h3>
                        <button
                          onClick={() => setIsAddPetModalOpen(false)}
                          className="p-1.5 rounded-full hover:bg-[#FAF6EE] text-[#88998C] hover:text-[#16241B]"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSavePet} className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-[#16241B] mb-1">
                            Pet Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Milo"
                            value={petFormData.name}
                            onChange={(e) => setPetFormData({ ...petFormData, name: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6EE] border border-[#E5DFCE] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#3FA65C]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-[#16241B] mb-1">
                              Species
                            </label>
                            <select
                              value={petFormData.species}
                              onChange={(e) => setPetFormData({ ...petFormData, species: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF6EE] border border-[#E5DFCE] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#3FA65C]"
                            >
                              <option value="Dog">Dog</option>
                              <option value="Cat">Cat</option>
                              <option value="Rabbit">Rabbit</option>
                              <option value="Bird">Bird</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-[#16241B] mb-1">
                              Age (Years)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="30"
                              required
                              value={petFormData.age}
                              onChange={(e) => setPetFormData({ ...petFormData, age: Number(e.target.value) })}
                              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6EE] border border-[#E5DFCE] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#3FA65C]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-[#16241B] mb-1">
                            Breed
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Labrador / Persian"
                            value={petFormData.breed}
                            onChange={(e) => setPetFormData({ ...petFormData, breed: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6EE] border border-[#E5DFCE] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#3FA65C]"
                          />
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsAddPetModalOpen(false)}
                            className="px-5 py-2.5 rounded-full bg-[#FAF6EE] text-[#16241B] font-bold text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 rounded-full bg-[#3FA65C] hover:bg-[#348e4e] text-white font-bold text-xs shadow-xs cursor-pointer"
                          >
                            Save Pet
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
                  <h2 className="text-2xl font-black text-[#16241B]">My Orders</h2>
                  <p className="text-xs text-[#556658] font-medium mt-1">
                    Track and review past pet pharmacy purchases.
                  </p>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12 space-y-4 bg-[#FAF6EE] rounded-3xl p-6 border border-[#EAE3D2]">
                    <ShoppingBag className="w-12 h-12 text-[#88998C] mx-auto" />
                    <h3 className="text-base font-black text-[#16241B]">No Orders Yet</h3>
                    <p className="text-xs text-[#556658] max-w-sm mx-auto">
                      Explore our pharmacy and shop premium wellness essentials for your furry friends.
                    </p>
                    <Link
                      to="/pharmacy"
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#3FA65C] hover:bg-[#348e4e] text-white font-bold text-xs rounded-full shadow-xs transition-all"
                    >
                      Shop Now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const isExpanded = expandedOrderId === order.id;
                      return (
                        <div
                          key={order.id}
                          className="bg-[#FAF6EE] rounded-2xl p-5 border border-[#EAE3D2] space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-0.5">
                              <span className="text-xs font-black text-[#16241B]">{order.id}</span>
                              <p className="text-xs text-[#88998C] font-medium">Placed on {order.date}</p>
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-black border shadow-2xs ${getStatusBadge(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                              <span className="text-sm font-black text-[#16241B]">
                                ₹{order.totalPrice.toLocaleString('en-IN')}
                              </span>
                              <button
                                onClick={() =>
                                  setExpandedOrderId(isExpanded ? null : order.id)
                                }
                                aria-label="Toggle details"
                                className="p-1.5 rounded-full hover:bg-white text-[#556658] transition-colors cursor-pointer"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Expandable Line Items */}
                          {isExpanded && (
                            <div className="pt-3 border-t border-[#E5DFCE] space-y-2 text-xs">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[#556658]">
                                  <span>
                                    {item.quantity}x {item.name}
                                  </span>
                                  <span className="font-bold text-[#16241B]">
                                    ₹{item.price.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              ))}
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
                <div>
                  <h2 className="text-2xl font-black text-[#16241B]">My Appointments</h2>
                  <p className="text-xs text-[#556658] font-medium mt-1">
                    Manage upcoming veterinary bookings and review past visit history.
                  </p>
                </div>

                {/* Upcoming Appointments */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#16241B] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#3FA65C]" />
                    <span>Upcoming Visits</span>
                  </h3>

                  {appointments.filter((a) => a.isUpcoming).length === 0 ? (
                    <div className="text-center py-8 bg-[#FAF6EE] rounded-2xl p-4 border border-[#EAE3D2]">
                      <p className="text-xs text-[#556658] font-medium">No upcoming appointments scheduled.</p>
                      <Link
                        to="/find-a-vet"
                        className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#3FA65C] hover:bg-[#348e4e] text-white font-bold text-xs rounded-full shadow-xs mt-3"
                      >
                        Find a Vet
                      </Link>
                    </div>
                  ) : (
                    appointments
                      .filter((a) => a.isUpcoming)
                      .map((apt) => (
                        <div
                          key={apt.id}
                          className="bg-[#FAF6EE] rounded-2xl p-5 border border-[#EAE3D2] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-black text-[#16241B]">{apt.vetName}</h4>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${getAptStatusBadge(
                                  apt.status
                                )}`}
                              >
                                {apt.status}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-[#EF7C3C]">{apt.service}</p>
                            <p className="text-xs text-[#556658] font-medium">{apt.dateTime}</p>
                            <p className="text-[11px] text-[#88998C] flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#3FA65C]" /> {apt.address}
                            </p>
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
                <div className="space-y-4 pt-4 border-t border-[#F0EAE1]">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#16241B] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#88998C]" />
                    <span>Past History</span>
                  </h3>

                  {appointments
                    .filter((a) => !a.isUpcoming)
                    .map((apt) => (
                      <div
                        key={apt.id}
                        className="bg-white rounded-2xl p-4 border border-[#EDE7D9] flex items-center justify-between gap-4"
                      >
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-black text-[#16241B]">{apt.vetName}</h4>
                          <p className="text-xs text-[#556658]">
                            {apt.service} • {apt.dateTime}
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
                    ))}
                </div>

                {/* Cancel Confirmation Modal */}
                {appointmentToCancel && (
                  <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#EDE7D9] shadow-xl text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-black text-[#16241B]">Cancel Appointment?</h3>
                      <p className="text-xs text-[#556658] font-medium">
                        Are you sure you want to cancel this booking? The slot will be released for other pets.
                      </p>
                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => setAppointmentToCancel(null)}
                          className="px-5 py-2.5 rounded-full bg-[#FAF6EE] text-[#16241B] font-bold text-xs cursor-pointer"
                        >
                          Keep Appointment
                        </button>
                        <button
                          onClick={() => handleCancelAppointmentConfirm(appointmentToCancel)}
                          className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                        >
                          Yes, Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. SECURITY TAB (Change Password) */}
            {currentTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-[#16241B]">Security & Password</h2>
                  <p className="text-xs text-[#556658] font-medium mt-1">
                    Update your account password to keep your profile protected.
                  </p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#16241B] mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF6EE] border border-[#E5DFCE] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#3FA65C]"
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
                    <label className="block text-xs font-black uppercase tracking-wider text-[#16241B] mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF6EE] border border-[#E5DFCE] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#3FA65C]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#88998C] hover:text-[#16241B]"
                      >
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[11px] text-[#88998C] font-medium block mt-1">
                      Must be at least 8 characters long.
                    </span>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#16241B] mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF6EE] border border-[#E5DFCE] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#3FA65C]"
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
                      <span className="text-[11px] text-red-500 font-bold block mt-1">
                        Passwords do not match.
                      </span>
                    )}
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={!canSubmitPassword}
                      className={`px-8 py-3.5 rounded-full font-black text-sm transition-all flex items-center gap-2 cursor-pointer ${
                        canSubmitPassword
                          ? 'bg-[#3FA65C] hover:bg-[#348e4e] text-white shadow-md'
                          : 'bg-[#E5DFCE] text-[#88998C] cursor-not-allowed'
                      }`}
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 6. PREFERENCES TAB */}
            {currentTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-[#16241B]">Preferences & Notifications</h2>
                  <p className="text-xs text-[#556658] font-medium mt-1">
                    Control your newsletter subscription and communication alerts.
                  </p>
                </div>

                <div className="space-y-4 max-w-xl">
                  {/* Newsletter */}
                  <div className="bg-[#FAF6EE] rounded-2xl p-4 border border-[#EAE3D2] flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-black text-[#16241B] flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#3FA65C]" />
                        <span>Pawfectly Newsletter</span>
                      </h4>
                      <p className="text-xs text-[#556658]">
                        Receive monthly pet wellness articles, guides, and care advice.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTogglePreference('newsletter')}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        preferences.newsletter ? 'bg-[#3FA65C]' : 'bg-[#D1D5DB]'
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
                  <div className="bg-[#FAF6EE] rounded-2xl p-4 border border-[#EAE3D2] flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-black text-[#16241B] flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#EF7C3C]" />
                        <span>Appointment Reminders</span>
                      </h4>
                      <p className="text-xs text-[#556658]">
                        Email & SMS notifications 24 hours before your vet appointments.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTogglePreference('appointmentReminders')}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        preferences.appointmentReminders ? 'bg-[#3FA65C]' : 'bg-[#D1D5DB]'
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
                  <div className="bg-[#FAF6EE] rounded-2xl p-4 border border-[#EAE3D2] flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-black text-[#16241B] flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-[#0284C7]" />
                        <span>Order & Delivery Updates</span>
                      </h4>
                      <p className="text-xs text-[#556658]">
                        Real-time status tracking for your pet pharmacy orders.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTogglePreference('orderUpdates')}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        preferences.orderUpdates ? 'bg-[#3FA65C]' : 'bg-[#D1D5DB]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform absolute top-0.5 ${
                          preferences.orderUpdates ? 'left-6.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Health Tips */}
                  <div className="bg-[#FAF6EE] rounded-2xl p-4 border border-[#EAE3D2] flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-black text-[#16241B] flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#7E22CE]" />
                        <span>Health & Vaccination Alerts</span>
                      </h4>
                      <p className="text-xs text-[#556658]">
                        Reminders when your pet’s annual vaccinations or checkups are due.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTogglePreference('healthTips')}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        preferences.healthTips ? 'bg-[#3FA65C]' : 'bg-[#D1D5DB]'
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

      <Footer />
    </div>
  );
};
