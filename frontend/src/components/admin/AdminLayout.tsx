import React, { useState, useEffect, createContext, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import api from '../../lib/axios';
import { getCloudinaryImageUrl } from '../../lib/utils';
import {
  LayoutDashboard,
  Package,
  Stethoscope,
  Sparkles,
  ShoppingBag,
  Calendar,
  Users,
  BookOpen,
  Mail,
  ShieldCheck,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  Bell,
  RefreshCw,
  AlertTriangle,
  CheckCheck,
  Trash2
} from 'lucide-react';

interface AdminNotification {
  id: string;
  type: 'ORDER' | 'APPOINTMENT' | 'STOCK' | 'CUSTOMER';
  title: string;
  description: string;
  time: string;
  link: string;
  isUnread: boolean;
}

interface AdminToastContextType {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const AdminToastContext = createContext<AdminToastContextType | undefined>(undefined);

export const useAdminToast = () => {
  const context = useContext(AdminToastContext);
  if (!context) {
    throw new Error('useAdminToast must be used within an AdminToastProvider');
  }
  return context;
};

export const AdminToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <AdminToastContext.Provider value={{ showToast }}>
      {children}
      {/* Shared Admin Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in pointer-events-none">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs font-semibold pointer-events-auto ${
              toast.type === 'success'
                ? 'bg-[#EBF7EE] border-[#C3E8CC] text-[#287A41]'
                : 'bg-[#FDEDEC] border-[#FADBD8] text-[#C0392B]'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#3FA65C] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#C0392B] shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </AdminToastContext.Provider>
  );
};

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const logoUrl = getCloudinaryImageUrl('pawfectly_logo');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const READ_STORAGE_KEY = 'pawfectly_admin_read_notifs';
  const DELETED_STORAGE_KEY = 'pawfectly_admin_deleted_notifs';

  const getStoredIds = (key: string): Set<string> => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  };

  const saveStoredIds = (key: string, ids: Set<string>) => {
    try {
      localStorage.setItem(key, JSON.stringify(Array.from(ids)));
    } catch {}
  };

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const [ordersRes, apptsRes, statsRes, custRes] = await Promise.all([
        api.get('/admin/orders').catch(() => api.get('/admin/dashboard/recent-orders')),
        api.get('/admin/dashboard/recent-appointments').catch(() => ({ data: [] })),
        api.get('/admin/dashboard/stats').catch(() => ({ data: {} })),
        api.get('/admin/customers').catch(() => ({ data: [] })),
      ]);

      const readIds = getStoredIds(READ_STORAGE_KEY);
      const deletedIds = getStoredIds(DELETED_STORAGE_KEY);
      const items: AdminNotification[] = [];

      // 1. Orders (All statuses: Placed, Ready, Completed, Cancelled)
      const orders = ordersRes.data || [];
      orders.forEach((o: any) => {
        const orderId = o.id;
        const total = Number(o.totalAmount || 0).toFixed(2);
        const custName = o.customerName || 'Customer';
        const status = o.orderStatus || 'PLACED';

        let title = `New Order #${orderId}`;
        let description = `${custName} placed an in-store pickup order (₹${total})`;

        if (status === 'READY_FOR_PICKUP') {
          title = `Order #${orderId} Ready`;
          description = `Order #${orderId} (${custName}) is prepared and ready for customer pickup`;
        } else if (status === 'COMPLETED') {
          title = `Order #${orderId} Completed`;
          description = `Order #${orderId} (${custName}) was successfully picked up and completed`;
        } else if (status === 'CANCELLED') {
          title = `Order #${orderId} Cancelled`;
          description = `Order #${orderId} for ${custName} was cancelled`;
        }

        const notifId = `order-${orderId}-${status}`;
        if (!deletedIds.has(notifId)) {
          items.push({
            id: notifId,
            type: 'ORDER',
            title,
            description,
            time: o.createdAt || new Date().toISOString(),
            link: '/admin/orders',
            isUnread: !readIds.has(notifId),
          });
        }
      });

      // 2. Appointments (Pending, Confirmed, Cancelled, Completed)
      const appointments = apptsRes.data || [];
      appointments.forEach((a: any) => {
        const apptId = a.id;
        const petName = a.petName || 'Pet';
        const vetName = a.vetName || 'Doctor';
        const serviceName = a.serviceName || 'Consultation';
        const status = a.status || 'PENDING';

        let title = `New Appointment Request`;
        let description = `${petName} with ${vetName} (${serviceName})`;

        if (status === 'CONFIRMED') {
          title = `Appointment Confirmed`;
          description = `Appointment #${apptId} for ${petName} with ${vetName} confirmed`;
        } else if (status === 'CANCELLED') {
          title = `Appointment Cancelled`;
          description = `Appointment #${apptId} for ${petName} with ${vetName} was cancelled`;
        } else if (status === 'COMPLETED') {
          title = `Appointment Completed`;
          description = `Appointment #${apptId} for ${petName} completed`;
        }

        const notifId = `appt-${apptId}-${status}`;
        if (!deletedIds.has(notifId)) {
          items.push({
            id: notifId,
            type: 'APPOINTMENT',
            title,
            description,
            time: a.dateTime || a.createdAt || new Date().toISOString(),
            link: '/admin/appointments',
            isUnread: !readIds.has(notifId),
          });
        }
      });

      // 3. Low Stock Inventory Alerts
      const lowStockProducts = statsRes.data?.lowStockProducts || [];
      lowStockProducts.forEach((p: any) => {
        const notifId = `stock-${p.id}-${p.stockQuantity}`;
        if (!deletedIds.has(notifId)) {
          items.push({
            id: notifId,
            type: 'STOCK',
            title: `Low Stock Alert`,
            description: `${p.name} has only ${p.stockQuantity} units left in stock`,
            time: new Date().toISOString(),
            link: '/admin/products',
            isUnread: !readIds.has(notifId),
          });
        }
      });

      // 4. Customer Signups
      const customers = custRes.data || [];
      customers.slice(0, 5).forEach((c: any) => {
        const notifId = `cust-${c.id}`;
        if (!deletedIds.has(notifId)) {
          items.push({
            id: notifId,
            type: 'CUSTOMER',
            title: `New Customer Signup`,
            description: `${c.name || 'New User'} (${c.email || ''}) registered an account`,
            time: c.createdAt || new Date().toISOString(),
            link: '/admin/customers',
            isUnread: !readIds.has(notifId),
          });
        }
      });

      // Sort by newest first
      items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

      setNotifications(items);
      setUnreadCount(items.filter((n) => n.isUnread).length);
    } catch (err) {
      console.error('Failed to fetch admin notifications', err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleMarkAllAsRead = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const readSet = getStoredIds(READ_STORAGE_KEY);
    notifications.forEach((n) => readSet.add(n.id));
    saveStoredIds(READ_STORAGE_KEY, readSet);
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    setUnreadCount(0);
  };

  const handleDeleteAll = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const delSet = getStoredIds(DELETED_STORAGE_KEY);
    notifications.forEach((n) => delSet.add(n.id));
    saveStoredIds(DELETED_STORAGE_KEY, delSet);
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleDeleteSingle = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const delSet = getStoredIds(DELETED_STORAGE_KEY);
    delSet.add(id);
    saveStoredIds(DELETED_STORAGE_KEY, delSet);
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      setUnreadCount(updated.filter((n) => n.isUnread).length);
      return updated;
    });
  };

  const handleNotificationClick = (n: AdminNotification) => {
    const readSet = getStoredIds(READ_STORAGE_KEY);
    readSet.add(n.id);
    saveStoredIds(READ_STORAGE_KEY, readSet);
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, isUnread: false } : item))
    );
    setUnreadCount((prev) => Math.max(0, prev - (n.isUnread ? 1 : 0)));
    navigate(n.link);
    setNotificationsOpen(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Vets', path: '/admin/vets', icon: Stethoscope },
    { label: 'Services', path: '/admin/services', icon: Sparkles },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { label: 'Health Tips', path: '/admin/articles', icon: BookOpen },
    { label: 'Newsletter', path: '/admin/newsletter', icon: Mail },
    { label: 'Insurance Quotes', path: '/admin/quotes', icon: ShieldCheck },
    { label: 'Profile', path: '/admin/settings', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col antialiased">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#16241B] text-white flex flex-col transition-transform duration-200 ease-in-out border-r border-white/[0.06] shadow-xl lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-white/15 bg-[#111C14] shadow-xs">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <img
              src={logoUrl}
              alt="Pawfectly Logo"
              className="w-10 h-10 rounded-full object-cover shadow-md ring-1 ring-white/20 group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-black text-[17px] tracking-tight text-white leading-tight">
                Pawfectly<span className="text-[#EF7C3C]">.</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest font-black text-[#3FA65C] mt-0.5">
                ADMIN PORTAL
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/50 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3.5 py-5 space-y-2.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-150 group ${
                  isActive
                    ? 'bg-[#3FA65C] text-white shadow-sm shadow-[#3FA65C]/25'
                    : 'text-white/80 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>


      </aside>

      {/* Main Container */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen bg-[#F7F7F5]">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-[#EBEBE8] px-4 sm:px-8 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#4B5563] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-black text-[#16241B] tracking-tight">{title}</h1>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-xl bg-[#F9FAF8] hover:bg-[#F3F4F6] border border-[#E5E7EB] hover:border-[#D1D5DB] text-[#4B5563] hover:text-[#111827] transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-center group"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4 text-[#4B5563] group-hover:text-[#16241B] transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#EF7C3C] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#EBEBE8] py-2 z-50 animate-in fade-in-50 zoom-in-95 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-[#F3F4F6] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-[#16241B]">
                          Notifications
                        </span>
                        {unreadCount > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#FEF3EC] text-[#EF7C3C] text-[10px] font-bold">
                            {unreadCount} pending
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-gray-500 text-[10px] font-bold">
                            All read
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {notifications.length > 0 && unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-[#3FA65C] hover:bg-emerald-50 transition-colors cursor-pointer text-[11px] font-semibold flex items-center gap-1"
                            title="Mark all as read"
                          >
                            <CheckCheck className="w-3.5 h-3.5 text-[#3FA65C]" />
                            <span className="hidden sm:inline text-xs">Mark read</span>
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button
                            onClick={handleDeleteAll}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-[11px] font-semibold flex items-center gap-1"
                            title="Delete all notifications"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            <span className="hidden sm:inline text-xs">Delete all</span>
                          </button>
                        )}
                        <button
                          onClick={fetchNotifications}
                          disabled={loadingNotifications}
                          className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          title="Refresh notifications"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${loadingNotifications ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                      {loadingNotifications && notifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-gray-400 font-medium">
                          Checking notifications...
                        </div>
                      ) : notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`w-full text-left px-4 py-3 hover:bg-[#F9FAF8] transition-colors flex items-start justify-between gap-2.5 group relative ${
                              n.isUnread ? 'bg-[#FDFCF7]' : 'bg-white'
                            }`}
                          >
                            <div
                              onClick={() => handleNotificationClick(n)}
                              className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer"
                            >
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                  n.type === 'ORDER'
                                    ? 'bg-[#EFF6FF] text-[#3B7DD8]'
                                    : n.type === 'APPOINTMENT'
                                    ? 'bg-[#FEF3EC] text-[#EF7C3C]'
                                    : n.type === 'STOCK'
                                    ? 'bg-[#FEF2F2] text-[#DC2626]'
                                    : 'bg-[#EBF7EE] text-[#3FA65C]'
                                }`}
                              >
                                {n.type === 'ORDER' ? (
                                  <ShoppingBag className="w-4 h-4" />
                                ) : n.type === 'APPOINTMENT' ? (
                                  <Calendar className="w-4 h-4" />
                                ) : n.type === 'STOCK' ? (
                                  <AlertTriangle className="w-4 h-4" />
                                ) : (
                                  <User className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="text-xs font-bold text-gray-900 group-hover:text-[#3FA65C] transition-colors truncate">
                                    {n.title}
                                  </p>
                                  {n.isUnread && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF7C3C] shrink-0" />
                                  )}
                                </div>
                                <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5 leading-relaxed">
                                  {n.description}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1">
                                  {n.time ? new Date(n.time).toLocaleString() : 'Recent'}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={(e) => handleDeleteSingle(n.id, e)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer shrink-0 mt-0.5"
                              title="Dismiss notification"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center px-4">
                          <CheckCircle2 className="w-8 h-8 text-[#3FA65C] mx-auto mb-2 opacity-80" />
                          <p className="text-xs font-bold text-gray-800">All caught up!</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            No notifications to display right now.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl bg-[#F9FAF8] hover:bg-[#F3F4F6] border border-[#E5E7EB] hover:border-[#D1D5DB] transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#16241B] to-[#283E2F] text-[#3FA65C] font-extrabold text-xs flex items-center justify-center border border-white/10 shadow-xs">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#3FA65C] border-2 border-white rounded-full"></span>
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-[#111827] leading-tight group-hover:text-[#3FA65C] transition-colors">
                    {user?.name || 'Admin User'}
                  </span>
                  <span className="text-[10px] font-medium text-[#6B7280]">{user?.email || 'admin@pawfectly.com'}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-[#9CA3AF] transition-transform duration-150 ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#EBEBE8] py-1.5 z-50 animate-in fade-in-50 zoom-in-95">
                    <div className="px-4 py-2.5 border-b border-[#F3F4F6]">
                      <p className="text-xs font-bold text-[#111827]">{user?.name || 'Admin User'}</p>
                      <p className="text-[10px] text-[#6B7280] truncate mt-0.5">{user?.email || 'admin@pawfectly.com'}</p>
                    </div>
                    <Link
                      to="/admin/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[#9CA3AF]" />
                      <span>Admin Profile</span>
                    </Link>
                    <div className="my-1 border-t border-[#F3F4F6]" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#D0453C] hover:bg-[#FDEDEC] text-left transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-[#D0453C]" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};

