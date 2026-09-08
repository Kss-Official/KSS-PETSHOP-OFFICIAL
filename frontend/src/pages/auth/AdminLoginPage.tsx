import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../features/auth/AuthContext';
import apiClient from '../../lib/axios';
import type { AuthResponse } from '../../features/auth/types';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      if (response.data.role !== 'ADMIN') {
        throw new Error('Access denied: You must be an administrator to access the admin portal.');
      }

      login(response.data);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#16241B] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="bg-[#1F3325] rounded-[32px] p-8 sm:p-12 max-w-md w-full border border-[#2E4A37] shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-[#EF7C3C]/20 border border-[#EF7C3C]/40 text-[#EF7C3C] flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-[#A3B8A8] font-medium">
              Sign in with your staff administrator credentials to manage products, vets, and bookings.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-950/60 border border-red-800 text-xs font-bold text-red-200 text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#A3B8A8] mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6A8571] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pawfectly.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#142318] border border-[#2E4A37] text-sm text-white placeholder-[#6A8571] focus:outline-hidden focus:ring-2 focus:ring-[#EF7C3C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#A3B8A8] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6A8571] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#142318] border border-[#2E4A37] text-sm text-white placeholder-[#6A8571] focus:outline-hidden focus:ring-2 focus:ring-[#EF7C3C]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-[#009E66] hover:bg-[#008757] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-[#2E4A37] text-center">
            <Link
              to="/login"
              className="text-xs font-bold text-[#A3B8A8] hover:text-white transition-colors"
            >
              ← Return to Customer Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLoginPage;
