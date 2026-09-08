import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  User,
  Menu,
  X,
  PawPrint,
  ShoppingBag,
  Calendar,
  Lock,
  LogOut,
  ShieldCheck,
  LogIn,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { getCloudinaryImageUrl } from '../../lib/utils';
import { useAuth } from '../../features/auth/AuthContext';

interface NavbarProps {
  activePage?:
    | 'home'
    | 'find-a-vet'
    | 'services'
    | 'pharmacy'
    | 'health-tips'
    | 'insurance'
    | 'profile';
}

export const Navbar: React.FC<NavbarProps> = ({ activePage = 'home' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const logoUrl = getCloudinaryImageUrl('pawfectly_logo');
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { label: 'Home', href: '/', id: 'home' },
    { label: 'Find a Vet', href: '/find-a-vet', id: 'find-a-vet' },
    { label: 'Services', href: '/services', id: 'services' },
    { label: 'Pharmacy', href: '/pharmacy', id: 'pharmacy' },
    { label: 'Health Tips', href: '/health-tips', id: 'health-tips' },
    { label: 'Pet Insurance', href: '/insurance', id: 'insurance' },
  ];

  const profileMenuItems = [
    { label: 'My Profile', href: '/profile?tab=overview', icon: User },
    { label: 'My Pets', href: '/profile?tab=pets', icon: PawPrint },
    { label: 'My Orders', href: '/profile?tab=orders', icon: ShoppingBag },
    { label: 'My Appointments', href: '/profile?tab=appointments', icon: Calendar },
    { label: 'Change Password', href: '/profile?tab=security', icon: Lock },
  ];

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF6EE]/75 backdrop-blur-xl backdrop-saturate-150 border-b border-white/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
        {/* Leftmost: Logo & Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = '/';
          }}
          className="flex items-center gap-3 cursor-pointer shrink-0"
        >
          <img
            src={logoUrl}
            alt="Pawfectly Logo"
            className="w-10 h-10 rounded-full object-cover shadow-xs"
          />
          <span className="text-2xl font-black tracking-tight text-[#16241B] font-sans">
            Pawfectly<span className="text-[#EF7C3C]">.</span>
          </span>
        </a>

        {/* Centered: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-semibold text-sm absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <Link
                key={link.id}
                to={link.href}
                className={
                  isActive
                    ? 'text-[#3FA65C] font-bold transition-colors relative after:content-[\'\'] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#3FA65C]'
                    : 'text-[#334437] hover:text-[#3FA65C] transition-colors'
                }
              >
                {link.label}
              </Link>
            );
          })}
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin/dashboard"
              className="text-[#EF7C3C] hover:text-[#D66829] font-bold transition-colors flex items-center gap-1.5 px-2.5 py-1 bg-[#FFF4ED] border border-[#FCD4C2] rounded-full text-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Rightmost: Actions */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <button
            onClick={() => navigate(isAuthenticated ? '/profile?tab=appointments' : '/login')}
            aria-label="Notifications"
            className="relative w-10 h-10 rounded-full bg-white border border-[#E5DFCE] flex items-center justify-center text-[#334437] hover:bg-[#F3EDE0] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              1
            </span>
          </button>

          {/* Profile Dropdown / Login Button */}
          {isAuthenticated ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                aria-label="Profile"
                aria-expanded={profileMenuOpen}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                  profileMenuOpen || activePage === 'profile'
                    ? 'bg-[#E6F9EC] border-[#3FA65C] text-[#287A41]'
                    : 'bg-white border-[#E5DFCE] text-[#334437] hover:bg-[#F3EDE0]'
                }`}
              >
                <span className="font-bold text-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </button>

              {/* Profile Dropdown Card */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-[#EDE7D9] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-[#F0EAE1] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E6F9EC] text-[#287A41] font-black text-sm flex items-center justify-center shrink-0 border border-[#C3ECD0]">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-black text-[#16241B] truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-[#88998C] truncate">
                        {user?.email || ''}
                      </p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 bg-[#FAF6EE] border border-[#E5DFCE] rounded text-[10px] font-bold text-[#334437]">
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  {/* Navigation Items */}
                  <div className="py-1.5">
                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-[#EF7C3C] hover:bg-[#FFF4ED] transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#EF7C3C]" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    {profileMenuItems.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-[#334437] hover:bg-[#FAF6EE] hover:text-[#3FA65C] transition-colors"
                        >
                          <ItemIcon className="w-4 h-4 text-[#88998C]" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Log Out */}
                  <div className="pt-1.5 border-t border-[#F0EAE1]">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-[#E5DFCE] text-[#16241B] hover:bg-[#F3EDE0] transition-colors shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5 text-[#3FA65C]" />
              Sign In
            </Link>
          )}

          <Link to="/find-a-vet">
            <Button variant="primary" size="md">
              Book a Vet 🐾
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#16241B] hover:bg-[#EAE3D2]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF6EE] border-b border-[#EAE3D2] px-6 py-6 space-y-4">
          <nav className="flex flex-col gap-4 font-semibold text-base">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={
                  activePage === link.id
                    ? 'text-[#3FA65C] font-bold'
                    : 'text-[#334437] hover:text-[#3FA65C]'
                }
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#334437] hover:text-[#3FA65C] font-bold pt-2 border-t border-[#EAE3D2]"
            >
              My Profile
            </Link>
          </nav>
          <div className="pt-4 border-t border-[#EAE3D2] flex flex-col gap-3">
            <Button variant="primary" size="md" className="w-full">
              Book a Vet 🐾
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};


