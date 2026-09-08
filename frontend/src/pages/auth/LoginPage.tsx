import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../features/auth/AuthContext';
import apiClient from '../../lib/axios';
import type { AuthResponse } from '../../features/auth/types';
import { Mail, Lock, User as UserIcon, Phone, ArrowRight } from 'lucide-react';
import { getCloudinaryImageUrl } from '../../lib/utils';

export const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const logoUrl = getCloudinaryImageUrl('pawfectly_logo');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (isRegister) {
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length !== 10) {
          setErrorMessage('Phone number must be exactly 10 digits.');
          setLoading(false);
          return;
        }

        const response = await apiClient.post<AuthResponse>('/auth/register', {
          name,
          email,
          password,
          phone: cleanPhone,
          role: 'CUSTOMER',
        });
        login(response.data);
      } else {
        const response = await apiClient.post<AuthResponse>('/auth/login', {
          email,
          password,
        });
        login(response.data);
      }
      navigate('/profile', { replace: true });
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#16241B] flex flex-col font-sans">
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="bg-white rounded-[32px] p-8 sm:p-12 max-w-md w-full border border-[#EDE7D9] shadow-xl space-y-6">
          {/* Logo Brand Header */}
          <div className="flex justify-center mb-2">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <img
                src={logoUrl}
                alt="Pawfectly Logo"
                className="w-9 h-9 rounded-full object-cover shadow-xs"
              />
              <span className="text-2xl font-black tracking-tight text-[#16241B]">
                Pawfectly<span className="text-[#EF7C3C]">.</span>
              </span>
            </a>
          </div>
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F9EC] text-[#287A41] text-xs font-black uppercase tracking-wider">
              {isRegister ? 'JOIN PAWFECTLY' : 'WELCOME BACK'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#16241B] tracking-tight">
              {isRegister ? 'Create Your Account' : 'Log In to Pawfectly'}
            </h1>
            <p className="text-xs sm:text-sm text-[#556658] font-medium">
              {isRegister
                ? 'Register to manage your pets, bookings, and pharmacy orders.'
                : 'Access your pet profiles, appointment history, and order tracking.'}
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#FED7D7] text-xs font-bold text-[#E53E3E] text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#16241B] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#88998C] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF6EE] border border-[#E5DFCE] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#3FA65C]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#16241B] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#88998C] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@pawfectly.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF6EE] border border-[#E5DFCE] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#3FA65C]"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#16241B] mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#88998C] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF6EE] border border-[#E5DFCE] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#3FA65C]"
                  />
                </div>
                <span className="text-[11px] text-[#88998C] font-medium block mt-1">
                  Must be a valid 10-digit mobile number.
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#16241B] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#88998C] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF6EE] border border-[#E5DFCE] text-sm text-[#16241B] focus:outline-hidden focus:ring-2 focus:ring-[#3FA65C]"
                />
              </div>
              {isRegister && (
                <span className="text-[11px] text-[#88998C] font-medium block mt-1">
                  Must be at least 8 characters long.
                </span>
              )}
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={loading}
                className="w-full justify-center flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="pt-4 border-t border-[#F0EAE1] text-center space-y-3">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMessage(null);
              }}
              className="text-xs font-bold text-[#3FA65C] hover:text-[#287A41] transition-colors cursor-pointer"
            >
              {isRegister
                ? 'Already have an account? Log In'
                : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
