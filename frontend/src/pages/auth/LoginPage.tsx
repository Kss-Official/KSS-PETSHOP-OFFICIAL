import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import apiClient from '../../lib/axios';
import type { AuthResponse } from '../../features/auth/types';
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
} from 'lucide-react';
import { getCloudinaryImageUrl } from '../../lib/utils';

interface LoginPageProps {
  initialMode?: 'login' | 'register';
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const logoUrl = getCloudinaryImageUrl('pawfectly_logo');

  const [isRegister, setIsRegister] = useState<boolean>(() => {
    if (initialMode === 'register') return true;
    return location.pathname === '/register';
  });

  useEffect(() => {
    if (initialMode) {
      setIsRegister(initialMode === 'register');
    } else {
      setIsRegister(location.pathname === '/register');
    }
  }, [location.pathname, initialMode]);

  // Form Fields State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Password Visibility Toggle State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status State
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleToggleMode = (mode: 'login' | 'register') => {
    setIsRegister(mode === 'register');
    setErrorMessage(null);
    window.history.replaceState(null, '', mode === 'register' ? '/register' : '/login');
  };

  useEffect(() => {
    const handlePopState = () => {
      setIsRegister(window.location.pathname === '/register');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/profile', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isRegister) {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        setErrorMessage('Phone number must be exactly 10 digits.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setErrorMessage('You must agree to the Terms & Privacy Policy.');
        return;
      }

      setLoading(true);
      try {
        const response = await apiClient.post<AuthResponse>('/auth/register', {
          name,
          email,
          password,
          phone: cleanPhone,
          role: 'CUSTOMER',
        });
        login(response.data);
        if (response.data.role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/profile', { replace: true });
        }
      } catch (err: unknown) {
        const error = err as Error;
        setErrorMessage(error.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!email.trim() || !password) {
        setErrorMessage('Please enter your email and password.');
        return;
      }
      setLoading(true);
      try {
        const response = await apiClient.post<AuthResponse>('/auth/login', {
          email,
          password,
        });
        login(response.data);
        if (response.data.role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/profile', { replace: true });
        }
      } catch (err: unknown) {
        const error = err as Error;
        setErrorMessage(error.message || 'Authentication failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat flex items-center justify-center p-3 sm:p-4 font-sans"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/vphylrop/image/upload/v1789131459/ChatGPT_Image_Sep_11_2026_06_27_14_PM.png')`,
      }}
    >
      {/* Centered White Card Container */}
      <div className="bg-white rounded-[24px] p-5 sm:p-6 lg:p-7 max-w-[440px] w-full border border-[#EDE7D9] shadow-2xl space-y-3.5">
        {/* Logo Row at Top Center */}
        <div className="flex flex-col items-center justify-center gap-1.5">
          <div className="flex items-center gap-2 select-none">
            <img
              src={logoUrl}
              alt="Pawfectly Logo"
              className="w-8 h-8 rounded-full object-cover shadow-xs"
            />
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1F5C2E]">
              Pawfectly<span className="text-[#E8792A]">.</span>
            </span>
          </div>

          {/* Status Badge directly under logo */}
          <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#E6F4E8] text-[#1F5C2E] text-[10px] font-black uppercase tracking-wider mt-0.5">
            {isRegister ? 'JOIN THE PAWFECTLY FAMILY' : 'WELCOME BACK'}
          </span>
        </div>

        {/* Headings & Subtext */}
        <div className="text-center space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-[#1F5C2E] tracking-tight">
            {isRegister ? 'Create Account' : 'Log In'}
          </h1>
          <p className="text-xs text-[#667085] font-normal leading-tight">
            {isRegister
              ? 'Join us and make every moment with your pet even more special.'
              : 'Access your pet profiles, appointments, orders, and more.'}
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-[#FDF2F2] border border-[#F87171]/30 text-xs font-bold text-[#DC2626] text-center">
            {errorMessage}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-2.5">
          {/* REGISTER: Field 1 - Full Name */}
          {isRegister && (
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-[#1F5C2E] mb-1 block">
                FULL NAME
              </label>
              <div className="relative">
                <UserIcon className="w-3.5 h-3.5 text-[#88998C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F2F6F0] border border-[#E2EADF] text-xs text-[#16241B] placeholder-[#88998C] focus:outline-hidden focus:ring-2 focus:ring-[#1F5C2E] focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          )}

          {/* EMAIL ADDRESS Field */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-[#1F5C2E] mb-1 block">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-[#88998C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isRegister ? 'Email Address' : 'Enter your email address'}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F2F6F0] border border-[#E2EADF] text-xs text-[#16241B] placeholder-[#88998C] focus:outline-hidden focus:ring-2 focus:ring-[#1F5C2E] focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {/* REGISTER: Field 3 - Phone Number */}
          {isRegister && (
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-[#1F5C2E] mb-1 block">
                PHONE NUMBER
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-[#88998C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Phone Number"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F2F6F0] border border-[#E2EADF] text-xs text-[#16241B] placeholder-[#88998C] focus:outline-hidden focus:ring-2 focus:ring-[#1F5C2E] focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          )}

          {/* PASSWORD Field */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-[#1F5C2E] mb-1 block">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-[#88998C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? 'Password' : 'Enter your password'}
                className="w-full pl-9 pr-9 py-2 rounded-lg bg-[#F2F6F0] border border-[#E2EADF] text-xs text-[#16241B] placeholder-[#88998C] focus:outline-hidden focus:ring-2 focus:ring-[#1F5C2E] focus:bg-white transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#88998C] hover:text-[#1F5C2E] cursor-pointer transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* REGISTER: Field 5 - Confirm Password */}
          {isRegister && (
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-[#1F5C2E] mb-1 block">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#88998C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full pl-9 pr-9 py-2 rounded-lg bg-[#F2F6F0] border border-[#E2EADF] text-xs text-[#16241B] placeholder-[#88998C] focus:outline-hidden focus:ring-2 focus:ring-[#1F5C2E] focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#88998C] hover:text-[#1F5C2E] cursor-pointer transition-colors"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* REGISTER: Terms & Privacy Checkbox Row */}
          {isRegister && (
            <div className="flex items-center gap-2 pt-0.5">
              <input
                id="terms-checkbox"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-[#1F5C2E] focus:ring-[#1F5C2E] accent-[#1F5C2E] cursor-pointer"
              />
              <label htmlFor="terms-checkbox" className="text-[11px] text-[#667085] font-medium cursor-pointer">
                I agree to the{' '}
                <a
                  href="#terms"
                  onClick={(e) => e.preventDefault()}
                  className="text-[#1F5C2E] font-bold hover:underline cursor-pointer"
                >
                  Terms & Privacy Policy
                </a>
              </label>
            </div>
          )}

          {/* Primary CTA Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-5 rounded-full bg-[#009E66] hover:bg-[#008757] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? 'Create Account' : 'Log In'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-2.5">
          <div className="w-full border-t border-[#E5E9E3]" />
          <span className="absolute bg-white px-2.5 text-[10px] font-bold text-[#88998C] uppercase tracking-wider">
            OR
          </span>
        </div>

        {/* Bottom Link Line */}
        <div className="text-center pt-0.5">
          <p className="text-xs text-[#667085] font-medium">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleToggleMode('login')}
                  className="font-bold text-[#1F5C2E] hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleToggleMode('register')}
                  className="font-bold text-[#1F5C2E] hover:underline cursor-pointer"
                >
                  Register
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
