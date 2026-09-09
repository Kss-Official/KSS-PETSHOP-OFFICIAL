import React, { useState, useEffect } from 'react';
import { User, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { AdminLayout, useAdminToast } from '../../components/admin/AdminLayout';
import { useAuth } from '../../features/auth/AuthContext';
import api from '../../lib/axios';

export const AdminSettingsPage: React.FC = () => {
  const { updateUser } = useAuth();
  const { showToast } = useAdminToast();
  // Profile State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const res = await api.get('/admin/settings/profile');
        const data = res.data;
        setName(data.name || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setRole(data.role || 'ADMIN');
      } catch (err: any) {
        console.error('Failed to load admin profile', err);
        const msg = err.response?.data?.message || 'Failed to load admin profile.';
        showToast(msg, 'error');
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(null);
    setProfileError(null);

    try {
      const res = await api.put('/admin/settings/profile', { name, phone });
      const msg = res.data.message || 'Profile updated successfully';
      setProfileSuccess(msg);
      showToast(msg);

      // Update auth context representation
      updateUser({ name, phone });
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordSuccess(null);
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      setPasswordSaving(false);
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      setPasswordSaving(false);
      return;
    }

    try {
      const res = await api.put('/admin/settings/password', {
        currentPassword,
        newPassword,
      });
      const msg = res.data.message || 'Password changed successfully';
      setPasswordSuccess(msg);
      showToast(msg);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <AdminLayout title="Profile">
      <div className="max-w-4xl space-y-8">
        {/* Profile Settings Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#3FA65C] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Administrator Profile</h2>
              <p className="text-xs text-gray-500">Update your administrative account identity</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
            {profileSuccess && (
              <div className="p-3 bg-[#EBF7EE] border border-[#C3E8CC] rounded-lg flex items-center gap-2 text-xs text-[#3FA65C]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="p-3 bg-[#FDEDEC] border border-[#FADBD8] rounded-lg flex items-center gap-2 text-xs text-[#C0392B]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={profileLoading}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/30 focus:border-[#3FA65C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address (Fixed)
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  disabled={profileLoading}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/30 focus:border-[#3FA65C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Assigned Role
                </label>
                <input
                  type="text"
                  disabled
                  value={role}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={profileSaving || profileLoading}
                className="px-4 py-2 bg-[#3FA65C] hover:bg-[#358E4E] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs disabled:opacity-50"
              >
                {profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Security & Password Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#3B7DD8] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Security & Password</h2>
              <p className="text-xs text-gray-500">
                Change your administrative login password (min 8 characters)
              </p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="p-6 space-y-4">
            {passwordSuccess && (
              <div className="p-3 bg-[#EBF7EE] border border-[#C3E8CC] rounded-lg flex items-center gap-2 text-xs text-[#3FA65C]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 bg-[#FDEDEC] border border-[#FADBD8] rounded-lg flex items-center gap-2 text-xs text-[#C0392B]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/30 focus:border-[#3FA65C]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full px-3 py-2 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/30 focus:border-[#3FA65C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/30 focus:border-[#3FA65C]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={passwordSaving}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs disabled:opacity-50"
              >
                {passwordSaving ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
