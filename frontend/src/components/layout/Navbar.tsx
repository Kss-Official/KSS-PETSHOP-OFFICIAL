import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Menu,
  X,
  Calendar,
  LogIn,
  LogOut,
  Megaphone,
  CheckCheck,
  Trash2,
  Clock,
  Sparkles,
  Heart,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { getCloudinaryImageUrl } from '../../lib/utils';
import { useAuth } from '../../features/auth/AuthContext';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'admin' | 'appointment' | 'order' | 'promo';
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Admin Announcement',
    message: 'Weekend Special: 20% off all wellness pet checkups with code PAWFECT20!',
    time: '15m ago',
    isRead: false,
    type: 'admin',
  },
  {
    id: 'notif-2',
    title: 'New Specialist Available',
    message: 'Dr. Sarah Mitchell (Avian & Exotic Care) is now accepting appointments.',
    time: '2h ago',
    isRead: false,
    type: 'admin',
  },
  {
    id: 'notif-3',
    title: 'Clinic Schedule Notice',
    message: 'Pawfectly Central Clinic emergency helpline is active 24/7 at 1-800-PAWFECT.',
    time: '1d ago',
    isRead: true,
    type: 'admin',
  },
];

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
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('pawfectly_notifications');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const logoUrl = getCloudinaryImageUrl('pawfectly_logo');
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const saveNotifications = (updated: NotificationItem[]) => {
    setNotifications(updated);
    try {
      localStorage.setItem('pawfectly_notifications', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    saveNotifications(updated);
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    markAsRead(notif.id);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(target)
      ) {
        setNotificationMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { label: 'Find a Vet', href: '/find-a-vet', id: 'find-a-vet' },
    { label: 'Services', href: '/services', id: 'services' },
    { label: 'Pharmacy', href: '/pharmacy', id: 'pharmacy' },
    { label: 'Health Tips', href: '/health-tips', id: 'health-tips' },
    { label: 'Pet Insurance', href: '/insurance', id: 'insurance' },
  ];

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

        {/* Centered Component */}
        {activePage === 'profile' ? null : (
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
          </nav>
        )}

        {/* Rightmost: Actions */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {activePage === 'profile' ? (
            <>
              {/* 1. Liked / Wishlist Items Button */}
              <button
                onClick={() => navigate('/profile?tab=wishlist')}
                aria-label="Liked Items"
                title="Liked Items"
                className="relative w-10 h-10 rounded-full bg-white border border-[#E5DFCE] flex items-center justify-center text-[#334437] hover:bg-[#F3EDE0] transition-colors cursor-pointer shadow-2xs group"
              >
                <Heart className="w-4.5 h-4.5 text-[#16241B] group-hover:text-red-500 group-hover:fill-red-500 transition-colors" />
              </button>

              {/* 3. Notification Bell with Dropdown */}
              <div className="relative" ref={notificationDropdownRef}>
                <button
                  onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
                  aria-label="Notifications"
                  title="Notifications"
                  className={`relative w-10 h-10 rounded-full border flex items-center justify-center transition-colors cursor-pointer shadow-2xs ${
                    notificationMenuOpen
                      ? 'bg-[#E6F9EC] border-[#3FA65C] text-[#287A41]'
                      : 'bg-white border-[#E5DFCE] text-[#334437] hover:bg-[#F3EDE0]'
                  }`}
                >
                  <Bell className="w-4.5 h-4.5 text-[#16241B]" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {notificationMenuOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl border border-[#EDE7D9] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3.5 border-b border-[#F0EAE1] bg-[#FAF6EE]/70 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#16241B]">Inbox Notifications</span>
                        {unreadCount > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                            {unreadCount} new
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-[#E6F9EC] text-[#287A41] text-[10px] font-bold">
                            All read
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="flex items-center gap-1 text-xs font-bold text-[#3FA65C] hover:text-[#287A41] transition-colors cursor-pointer"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    <div className="max-h-[380px] overflow-y-auto divide-y divide-[#F0EAE1]">
                      {notifications.length === 0 ? (
                        <div className="py-10 px-4 text-center">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FAF6EE] border border-[#E5DFCE] flex items-center justify-center text-[#88998C]">
                            <Bell className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-bold text-[#16241B]">No notifications</p>
                          <p className="text-xs text-[#88998C] mt-1">You're all caught up with clinic updates!</p>
                        </div>
                      ) : (
                        notifications.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleNotificationClick(item)}
                            className={`group p-3.5 transition-colors cursor-pointer relative flex items-start gap-3 ${
                              item.isRead
                                ? 'bg-white hover:bg-[#FAF6EE]/50 text-[#6B7280]'
                                : 'bg-[#FAF6EE]/40 hover:bg-[#FAF6EE] text-[#16241B]'
                            }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center border ${
                                item.type === 'admin'
                                  ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]'
                                  : item.type === 'appointment'
                                  ? 'bg-[#E6F9EC] border-[#C3ECD0] text-[#287A41]'
                                  : 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]'
                              }`}
                            >
                              {item.type === 'admin' ? (
                                <Megaphone className="w-4 h-4" />
                              ) : item.type === 'appointment' ? (
                                <Calendar className="w-4 h-4" />
                              ) : (
                                <Sparkles className="w-4 h-4" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0 pr-4">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <p
                                  className={`text-xs truncate ${
                                    item.isRead ? 'font-semibold text-[#334437]' : 'font-black text-[#16241B]'
                                  }`}
                                >
                                  {item.title}
                                </p>
                                {!item.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                                )}
                              </div>
                              <p className="text-xs leading-relaxed text-[#55665B] line-clamp-2">
                                {item.message}
                              </p>
                              <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F0EAE1]/60">
                                <span className="text-[10px] font-medium text-[#88998C] flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {item.time}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={(e) => deleteNotification(item.id, e)}
                              title="Dismiss notification"
                              className="opacity-0 group-hover:opacity-100 p-1 text-[#88998C] hover:text-red-500 hover:bg-red-50 rounded-md transition-all absolute top-3 right-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="px-4 py-2.5 bg-[#FAF6EE]/50 border-t border-[#F0EAE1] flex items-center justify-between text-xs">
                        <button
                          onClick={clearAllNotifications}
                          className="font-bold text-[#88998C] hover:text-red-500 transition-colors cursor-pointer"
                        >
                          Clear all
                        </button>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="font-bold text-[#3FA65C] hover:text-[#287A41] transition-colors cursor-pointer"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 4. Logout Icon Button */}
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                aria-label="Logout"
                title="Log Out"
                className="w-10 h-10 rounded-full bg-white border border-[#E5DFCE] flex items-center justify-center text-[#334437] hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors cursor-pointer shadow-2xs"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </>
          ) : (
            <>
              {/* Liked / Wishlist Items Button */}
              <button
                onClick={() => navigate(isAuthenticated ? '/profile?tab=wishlist' : '/login')}
                aria-label="Liked Items"
                title="Liked Items"
                className="relative w-10 h-10 rounded-full bg-white border border-[#E5DFCE] flex items-center justify-center text-[#334437] hover:bg-[#F3EDE0] transition-colors cursor-pointer group"
              >
                <Heart className="w-4 h-4 text-[#16241B] group-hover:text-red-500 group-hover:fill-red-500 transition-colors" />
              </button>

              {/* Notification Bell with Dialogue Box */}
              <div className="relative" ref={notificationDropdownRef}>
                <button
                  onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
                  aria-label="Notifications"
                  aria-expanded={notificationMenuOpen}
                  className={`relative w-10 h-10 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                    notificationMenuOpen
                      ? 'bg-[#E6F9EC] border-[#3FA65C] text-[#287A41]'
                      : 'bg-white border-[#E5DFCE] text-[#334437] hover:bg-[#F3EDE0]'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {notificationMenuOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl border border-[#EDE7D9] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3.5 border-b border-[#F0EAE1] bg-[#FAF6EE]/70 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#16241B]">Notifications</span>
                        {unreadCount > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                            {unreadCount} new
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-[#E6F9EC] text-[#287A41] text-[10px] font-bold">
                            All read
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="flex items-center gap-1 text-xs font-bold text-[#3FA65C] hover:text-[#287A41] transition-colors cursor-pointer"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    <div className="max-h-[380px] overflow-y-auto divide-y divide-[#F0EAE1]">
                      {notifications.length === 0 ? (
                        <div className="py-10 px-4 text-center">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FAF6EE] border border-[#E5DFCE] flex items-center justify-center text-[#88998C]">
                            <Bell className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-bold text-[#16241B]">No notifications</p>
                          <p className="text-xs text-[#88998C] mt-1">You're all caught up with clinic updates!</p>
                        </div>
                      ) : (
                        notifications.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleNotificationClick(item)}
                            className={`group p-3.5 transition-colors cursor-pointer relative flex items-start gap-3 ${
                              item.isRead
                                ? 'bg-white hover:bg-[#FAF6EE]/50 text-[#6B7280]'
                                : 'bg-[#FAF6EE]/40 hover:bg-[#FAF6EE] text-[#16241B]'
                            }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center border ${
                                item.type === 'admin'
                                  ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]'
                                  : item.type === 'appointment'
                                  ? 'bg-[#E6F9EC] border-[#C3ECD0] text-[#287A41]'
                                  : 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]'
                              }`}
                            >
                              {item.type === 'admin' ? (
                                <Megaphone className="w-4 h-4" />
                              ) : item.type === 'appointment' ? (
                                <Calendar className="w-4 h-4" />
                              ) : (
                                <Sparkles className="w-4 h-4" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0 pr-4">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <p
                                  className={`text-xs truncate ${
                                    item.isRead ? 'font-semibold text-[#334437]' : 'font-black text-[#16241B]'
                                  }`}
                                >
                                  {item.title}
                                </p>
                                {!item.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                                )}
                              </div>
                              <p className="text-xs leading-relaxed text-[#55665B] line-clamp-2">
                                {item.message}
                              </p>
                              <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F0EAE1]/60">
                                <span className="text-[10px] font-medium text-[#88998C] flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {item.time}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={(e) => deleteNotification(item.id, e)}
                              title="Dismiss notification"
                              className="opacity-0 group-hover:opacity-100 p-1 text-[#88998C] hover:text-red-500 hover:bg-red-50 rounded-md transition-all absolute top-3 right-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="px-4 py-2.5 bg-[#FAF6EE]/50 border-t border-[#F0EAE1] flex items-center justify-between text-xs">
                        <button
                          onClick={clearAllNotifications}
                          className="font-bold text-[#88998C] hover:text-red-500 transition-colors cursor-pointer"
                        >
                          Clear all
                        </button>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="font-bold text-[#3FA65C] hover:text-[#287A41] transition-colors cursor-pointer"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Button */}
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/profile')}
                  aria-label="Profile"
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors cursor-pointer bg-white border-[#E5DFCE] text-[#334437] hover:bg-[#F3EDE0]"
                >
                  <span className="font-bold text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-bold bg-white border border-[#E5DFCE] text-[#16241B] hover:bg-[#F3EDE0] transition-colors shadow-xs"
                >
                  <LogIn className="w-4 h-4 text-[#3FA65C]" />
                  Sign In
                </Link>
              )}

              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(isAuthenticated ? '/profile?tab=appointments' : '/login')}
                className="h-10 px-5 text-sm font-bold cursor-pointer"
              >
                Book a Vet
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button & actions */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Liked Items */}
          <button
            onClick={() => navigate(isAuthenticated ? '/profile?tab=wishlist' : '/login')}
            aria-label="Liked Items"
            className="relative w-9 h-9 rounded-full bg-white border border-[#E5DFCE] flex items-center justify-center text-[#334437] hover:bg-[#F3EDE0] transition-colors cursor-pointer"
          >
            <Heart className="w-4 h-4 text-[#16241B]" />
          </button>

          {/* Mobile Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
              aria-label="Notifications"
              className="relative w-9 h-9 rounded-full bg-white border border-[#E5DFCE] flex items-center justify-center text-[#334437] hover:bg-[#F3EDE0] transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4 text-[#16241B]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </div>

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
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate(isAuthenticated ? '/profile?tab=appointments' : '/login');
              }}
              className="w-full cursor-pointer"
            >
              Book a Vet
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};


