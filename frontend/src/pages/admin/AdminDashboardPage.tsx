import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import apiClient from '../../lib/axios';
import {
  Users,
  ShoppingBag,
  Calendar,
  DollarSign,
  Stethoscope,
  BookOpen,
  Mail,
  Package,
  Plus,
  Trash2,
  RefreshCw,
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalPets: number;
  totalVets: number;
  totalProducts: number;
  totalOrders: number;
  totalAppointments: number;
  totalArticles: number;
  totalSubscribers: number;
  totalRevenue: number;
}

interface ProductItem {
  id: number;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
}

interface OrderItem {
  id: number;
  customerName: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

interface AppointmentItem {
  id: number;
  petName: string;
  vetName: string;
  serviceName: string;
  dateTime: string;
  status: string;
}

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'appointments'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Product Modal
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: 'FOOD & NUTRITION',
    price: 999,
    stockQuantity: 20,
    imageUrl: 'service_02_pet_food_rabbit_bowl',
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, prodRes, ordersRes, aptRes] = await Promise.all([
        apiClient.get<AdminStats>('/admin/stats'),
        apiClient.get<ProductItem[]>('/products'),
        apiClient.get<OrderItem[]>('/admin/orders'),
        apiClient.get<AppointmentItem[]>('/admin/appointments'),
      ]);
      setStats(statsRes.data);
      setProducts(prodRes.data);
      setOrders(ordersRes.data);
      setAppointments(aptRes.data);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post<ProductItem>('/admin/products', productForm);
      setProducts([response.data, ...products]);
      setIsAddProductOpen(false);
      setProductForm({
        name: '',
        description: '',
        category: 'FOOD & NUTRITION',
        price: 999,
        stockQuantity: 20,
        imageUrl: 'service_02_pet_food_rabbit_bowl',
      });
    } catch (err: unknown) {
      const e = err as Error;
      alert(e.message || 'Error creating product.');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiClient.delete(`/admin/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: unknown) {
      const e = err as Error;
      alert(e.message || 'Error deleting product.');
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await apiClient.put(`/admin/orders/${orderId}/status?status=${status}`);
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
      );
    } catch (err: unknown) {
      const e = err as Error;
      alert(e.message || 'Error updating order status.');
    }
  };

  const handleUpdateAppointmentStatus = async (aptId: number, status: string) => {
    try {
      await apiClient.put(`/admin/appointments/${aptId}/status?status=${status}`);
      setAppointments(
        appointments.map((a) => (a.id === aptId ? { ...a, status } : a))
      );
    } catch (err: unknown) {
      const e = err as Error;
      alert(e.message || 'Error updating appointment status.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#16241B] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#16241B] text-white text-xs font-black uppercase tracking-wider">
              ADMINISTRATOR CONSOLE 🛡️
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#16241B] tracking-tight mt-2">
              Management Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={fetchData} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsAddProductOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Product</span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#EAE3D2] pb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview & Metrics' },
            { id: 'products', label: `Products (${products.length})` },
            { id: 'orders', label: `Orders (${orders.length})` },
            { id: 'appointments', label: `Appointments (${appointments.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#16241B] text-white shadow-xs'
                  : 'text-[#556658] hover:bg-[#FAF6EE] hover:text-[#16241B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error ? (
          <ErrorState message={error} onRetry={fetchData} />
        ) : loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : (
          <>
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && stats && (
              <div className="space-y-8">
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-white rounded-3xl p-5 border border-[#EDE7D9] shadow-xs space-y-1">
                    <div className="w-10 h-10 rounded-2xl bg-[#E6F9EC] text-[#287A41] flex items-center justify-center mb-2">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-[#556658] font-bold">Total Revenue</span>
                    <p className="text-2xl font-black text-[#16241B]">
                      ₹{stats.totalRevenue.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-[#EDE7D9] shadow-xs space-y-1">
                    <div className="w-10 h-10 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mb-2">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-[#556658] font-bold">Total Orders</span>
                    <p className="text-2xl font-black text-[#16241B]">{stats.totalOrders}</p>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-[#EDE7D9] shadow-xs space-y-1">
                    <div className="w-10 h-10 rounded-2xl bg-[#FEF9C3] text-[#B45309] flex items-center justify-center mb-2">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-[#556658] font-bold">Appointments</span>
                    <p className="text-2xl font-black text-[#16241B]">{stats.totalAppointments}</p>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-[#EDE7D9] shadow-xs space-y-1">
                    <div className="w-10 h-10 rounded-2xl bg-[#F3E8FF] text-[#7E22CE] flex items-center justify-center mb-2">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-[#556658] font-bold">Registered Users</span>
                    <p className="text-2xl font-black text-[#16241B]">{stats.totalUsers}</p>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-[#EDE7D9] shadow-xs space-y-1">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center mb-2">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-[#556658] font-bold">Active Vets</span>
                    <p className="text-2xl font-black text-[#16241B]">{stats.totalVets}</p>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-[#EDE7D9] shadow-xs space-y-1">
                    <div className="w-10 h-10 rounded-2xl bg-[#E6F9EC] text-[#287A41] flex items-center justify-center mb-2">
                      <Package className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-[#556658] font-bold">Products in Stock</span>
                    <p className="text-2xl font-black text-[#16241B]">{stats.totalProducts}</p>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-[#EDE7D9] shadow-xs space-y-1">
                    <div className="w-10 h-10 rounded-2xl bg-[#FEF08A] text-[#A16207] flex items-center justify-center mb-2">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-[#556658] font-bold">Health Articles</span>
                    <p className="text-2xl font-black text-[#16241B]">{stats.totalArticles}</p>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-[#EDE7D9] shadow-xs space-y-1">
                    <div className="w-10 h-10 rounded-2xl bg-[#F3F4F6] text-[#4B5563] flex items-center justify-center mb-2">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-[#556658] font-bold">Subscribers</span>
                    <p className="text-2xl font-black text-[#16241B]">{stats.totalSubscribers}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="bg-white rounded-[28px] p-6 border border-[#EDE7D9] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-[#16241B]">Product Catalog</h2>
                  <Button size="sm" variant="primary" onClick={() => setIsAddProductOpen(true)}>
                    + Add Product
                  </Button>
                </div>

                {products.length === 0 ? (
                  <EmptyState
                    title="No Products Listed"
                    description="Your pharmacy inventory is currently empty."
                    actionLabel="Add First Product"
                    onAction={() => setIsAddProductOpen(true)}
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-[#EAE3D2] text-[#88998C] font-black uppercase tracking-wider">
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4">Stock</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0EAE1]">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-[#FAF6EE]/60 transition-colors">
                            <td className="py-3.5 px-4 font-black text-[#16241B]">{p.name}</td>
                            <td className="py-3.5 px-4 font-bold text-[#556658]">{p.category}</td>
                            <td className="py-3.5 px-4 font-black text-[#16241B]">₹{p.price}</td>
                            <td className="py-3.5 px-4 font-bold text-[#16241B]">{p.stockQuantity} units</td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                  p.isActive
                                    ? 'bg-[#E6F9EC] text-[#287A41]'
                                    : 'bg-red-100 text-red-600'
                                }`}
                              >
                                {p.isActive ? 'ACTIVE' : 'INACTIVE'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 3. ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-[28px] p-6 border border-[#EDE7D9] shadow-xs space-y-4">
                <h2 className="text-xl font-black text-[#16241B]">Customer Orders</h2>

                {orders.length === 0 ? (
                  <EmptyState
                    title="No Orders Placed"
                    description="When customers checkout in the pharmacy, orders will appear here."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-[#EAE3D2] text-[#88998C] font-black uppercase tracking-wider">
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Customer</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Update Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0EAE1]">
                        {orders.map((o) => (
                          <tr key={o.id} className="hover:bg-[#FAF6EE]/60 transition-colors">
                            <td className="py-3.5 px-4 font-black text-[#16241B]">ORD-{o.id}</td>
                            <td className="py-3.5 px-4 font-bold text-[#556658]">{o.customerName}</td>
                            <td className="py-3.5 px-4 font-black text-[#16241B]">
                              ₹{o.totalAmount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#E6F9EC] text-[#287A41]">
                                {o.orderStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={o.orderStatus}
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                className="px-3 py-1.5 rounded-xl border border-[#E5DFCE] bg-[#FAF6EE] text-xs font-bold focus:outline-hidden cursor-pointer"
                              >
                                <option value="PLACED">PLACED</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 4. APPOINTMENTS TAB */}
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-[28px] p-6 border border-[#EDE7D9] shadow-xs space-y-4">
                <h2 className="text-xl font-black text-[#16241B]">Clinic Appointments</h2>

                {appointments.length === 0 ? (
                  <EmptyState
                    title="No Appointments Booked"
                    description="When pet parents book appointments with vets, they will appear here."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-[#EAE3D2] text-[#88998C] font-black uppercase tracking-wider">
                          <th className="py-3 px-4">ID</th>
                          <th className="py-3 px-4">Pet</th>
                          <th className="py-3 px-4">Veterinarian</th>
                          <th className="py-3 px-4">Service</th>
                          <th className="py-3 px-4">Date & Time</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0EAE1]">
                        {appointments.map((apt) => (
                          <tr key={apt.id} className="hover:bg-[#FAF6EE]/60 transition-colors">
                            <td className="py-3.5 px-4 font-black text-[#16241B]">APT-{apt.id}</td>
                            <td className="py-3.5 px-4 font-bold text-[#16241B]">{apt.petName}</td>
                            <td className="py-3.5 px-4 font-bold text-[#556658]">{apt.vetName}</td>
                            <td className="py-3.5 px-4 text-xs font-semibold text-[#EF7C3C]">{apt.serviceName}</td>
                            <td className="py-3.5 px-4 text-xs text-[#556658]">{apt.dateTime}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#E6F9EC] text-[#287A41]">
                                {apt.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={apt.status}
                                onChange={(e) => handleUpdateAppointmentStatus(apt.id, e.target.value)}
                                className="px-3 py-1.5 rounded-xl border border-[#E5DFCE] bg-[#FAF6EE] text-xs font-bold focus:outline-hidden cursor-pointer"
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* New Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EDE7D9] shadow-2xl space-y-4">
            <h3 className="text-xl font-black text-[#16241B]">Add New Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black uppercase text-[#16241B] mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Royal Canin Adult Food"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6EE] border border-[#E5DFCE] text-sm focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-[#16241B] mb-1">
                    Category
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF6EE] border border-[#E5DFCE] text-xs font-bold"
                  >
                    <option value="FOOD & NUTRITION">FOOD & NUTRITION</option>
                    <option value="FLEA & TICK">FLEA & TICK</option>
                    <option value="SUPPLEMENTS">SUPPLEMENTS</option>
                    <option value="GROOMING">GROOMING</option>
                    <option value="MEDICATIONS">MEDICATIONS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#16241B] mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6EE] border border-[#E5DFCE] text-sm focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#16241B] mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={productForm.stockQuantity}
                  onChange={(e) => setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6EE] border border-[#E5DFCE] text-sm focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[#FAF6EE] text-[#16241B] font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#009E66] hover:bg-[#008757] text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboardPage;
