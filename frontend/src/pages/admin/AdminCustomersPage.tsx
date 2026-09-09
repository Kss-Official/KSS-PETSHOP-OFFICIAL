import React, { useState, useEffect } from 'react';
import { Eye, Power, Calendar, ShoppingBag, Heart, Trash2 } from 'lucide-react';
import { AdminLayout, useAdminToast } from '../../components/admin/AdminLayout';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminStatusBadge } from '../../components/admin/AdminStatusBadge';
import api from '../../lib/axios';

interface CustomerSummary {
  id: number;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  petsCount: number;
  ordersCount: number;
}

interface CustomerPet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
}

interface CustomerOrder {
  id: number;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

interface CustomerAppointment {
  id: number;
  petName: string;
  vetName: string;
  serviceName: string;
  dateTime: string;
  status: string;
}

interface CustomerDetail {
  id: number;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  pets: CustomerPet[];
  orders: CustomerOrder[];
  appointments: CustomerAppointment[];
}

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerSummary | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useAdminToast();

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/customers');
      setCustomers(res.data || []);
    } catch (err: any) {
      console.error('Failed to fetch customers', err);
      const msg = err.response?.data?.message || 'Failed to load customers from database.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openCustomerDetails = async (cust: CustomerSummary) => {
    try {
      setDetailLoading(true);
      setModalOpen(true);
      const res = await api.get(`/admin/customers/${cust.id}`);
      setSelectedCustomer(res.data);
    } catch (err: any) {
      console.error('Failed to load customer details', err);
      const msg = err.response?.data?.message || 'Failed to load customer details.';
      showToast(msg, 'error');
    } finally {
      setDetailLoading(false);
    }
  };



  const openDeleteModal = (cust: CustomerSummary) => {
    setCustomerToDelete(cust);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      setDeleting(true);
      const res = await api.delete(`/admin/customers/${customerToDelete.id}`);
      showToast(res.data?.message || `Customer "${customerToDelete.name}" deleted successfully.`);
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
      if (selectedCustomer && selectedCustomer.id === customerToDelete.id) {
        setModalOpen(false);
        setSelectedCustomer(null);
      }
      fetchCustomers();
    } catch (err: any) {
      console.error('Failed to delete customer', err);
      const msg = err.response?.data?.message || err.message || 'Failed to delete customer.';
      showToast(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const res = await api.patch(`/admin/customers/${id}/toggle-status`);
      const updatedActive = res.data?.isActive;
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: updatedActive ?? !c.isActive } : c))
      );
      if (selectedCustomer && selectedCustomer.id === id) {
        setSelectedCustomer({ ...selectedCustomer, isActive: updatedActive ?? !selectedCustomer.isActive });
      }
      showToast(res.data?.message || 'Customer account status updated successfully!');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to toggle customer status.';
      showToast(msg, 'error');
    }
  };

  const columns: Column<CustomerSummary>[] = [
    {
      key: 'name',
      header: 'Customer',
      className: 'w-[28%]',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#3FA65C] font-bold text-xs flex items-center justify-center border border-[#C3E8CC] shrink-0">
            {row.name ? row.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{row.name}</p>
            <p className="text-xs text-gray-500 truncate">{row.email}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'phone',
      header: 'Phone',
      className: 'w-[14%]',
      render: (row) => <span className="text-xs text-gray-600">{row.phone || '—'}</span>,
    },
    {
      key: 'petsCount',
      header: 'Pets Registered',
      sortable: true,
      className: 'w-[14%]',
      render: (row) => <span className="text-xs font-semibold text-gray-800">{row.petsCount} pets</span>,
    },
    {
      key: 'ordersCount',
      header: 'Total Orders',
      sortable: true,
      className: 'w-[14%]',
      render: (row) => <span className="text-xs font-semibold text-gray-800">{row.ordersCount} orders</span>,
    },
    {
      key: 'createdAt',
      header: 'Member Since',
      sortable: true,
      className: 'w-[14%]',
      render: (row) => (
        <span className="text-xs text-gray-500">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      sortable: true,
      className: 'w-[12%]',
      render: (row) => <AdminStatusBadge status={row.isActive ? 'Active' : 'Deactivated'} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-[14%] text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openCustomerDetails(row)}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleToggleStatus(row.id)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer shrink-0 ${
              row.isActive
                ? 'text-[#6B7280] hover:text-[#C0392B] hover:bg-[#FDEDEC]'
                : 'text-[#6B7280] hover:text-[#3FA65C] hover:bg-[#EBF7EE]'
            }`}
            title={row.isActive ? 'Deactivate Customer Account' : 'Reactivate Account'}
          >
            <Power className="w-4 h-4" />
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-[#D0453C] hover:bg-[#FDEDEC] rounded-lg transition-colors cursor-pointer shrink-0"
            title="Delete Customer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Customers Management">
      <DataTable
        columns={columns}
        data={customers}
        isLoading={isLoading}
        searchPlaceholder="Search customers by name, email, or phone..."
        searchKey={(row) => `${row.name} ${row.email} ${row.phone}`}
        filterLabel="All Statuses"
        filterOptions={[
          { label: 'Active', value: 'TRUE' },
          { label: 'Deactivated', value: 'FALSE' },
        ]}
        filterKey={(row) => String(row.isActive)}
      />

      {/* Customer Detail Modal (Read-Only) */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedCustomer ? `${selectedCustomer.name} Profile` : 'Customer Details'}
        subtitle="Customer records, registered pets, and booking history"
        maxWidth="2xl"
      >
        {detailLoading ? (
          <div className="py-12 text-center text-[#6B7280]">Loading customer history...</div>
        ) : selectedCustomer ? (
          <div className="space-y-6">
            {/* Overview Card */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-[#1B2B1E]">{selectedCustomer.name}</h4>
                  <AdminStatusBadge status={selectedCustomer.isActive ? 'Active' : 'Deactivated'} />
                </div>
                <p className="text-xs text-[#6B7280]">{selectedCustomer.email}</p>
                <p className="text-xs text-[#6B7280]">Phone: {selectedCustomer.phone || 'Not provided'}</p>
              </div>

              <div className="sm:text-right">
                <button
                  onClick={() => handleToggleStatus(selectedCustomer.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedCustomer.isActive
                      ? 'bg-[#FDEDEC] text-[#C0392B] hover:bg-[#FADBD8]'
                      : 'bg-[#EBF7EE] text-[#3FA65C] hover:bg-[#C3E8CC]'
                  }`}
                >
                  {selectedCustomer.isActive ? 'Deactivate Account' : 'Reactivate Account'}
                </button>
              </div>
            </div>

            {/* Pets Section */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#3FA65C]" />
                Registered Pets ({selectedCustomer.pets.length})
              </h5>
              {selectedCustomer.pets.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No pets registered yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedCustomer.pets.map((pet) => (
                    <div
                      key={pet.id}
                      className="p-3 bg-white border border-gray-200 rounded-lg text-xs space-y-1 shadow-2xs"
                    >
                      <p className="font-semibold text-gray-900">{pet.name}</p>
                      <p className="text-gray-500">
                        {pet.species} • {pet.breed || 'Mixed'} • {pet.age} yrs old
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Orders Section */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-[#3FA65C]" />
                Recent Orders ({selectedCustomer.orders.length})
              </h5>
              {selectedCustomer.orders.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No orders placed yet.</p>
              ) : (
                <div className="border border-gray-200 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
                  <table className="w-full text-left text-xs text-gray-600">
                    <thead className="bg-[#F7F7F5] font-semibold text-gray-700 uppercase">
                      <tr>
                        <th className="px-3 py-2">Order</th>
                        <th className="px-3 py-2">Amount</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedCustomer.orders.map((ord) => (
                        <tr key={ord.id}>
                          <td className="px-3 py-2 font-medium text-gray-900">#{ord.id}</td>
                          <td className="px-3 py-2 font-semibold text-gray-900">
                            ₹{ord.totalAmount?.toFixed(2)}
                          </td>
                          <td className="px-3 py-2">
                            <AdminStatusBadge status={ord.orderStatus} />
                          </td>
                          <td className="px-3 py-2 text-gray-500">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Appointments Section */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#3FA65C]" />
                Appointments History ({selectedCustomer.appointments.length})
              </h5>
              {selectedCustomer.appointments.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No appointments booked yet.</p>
              ) : (
                <div className="border border-gray-200 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
                  <table className="w-full text-left text-xs text-gray-600">
                    <thead className="bg-[#F7F7F5] font-semibold text-gray-700 uppercase">
                      <tr>
                        <th className="px-3 py-2">Pet</th>
                        <th className="px-3 py-2">Vet & Service</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedCustomer.appointments.map((apt) => (
                        <tr key={apt.id}>
                          <td className="px-3 py-2 font-medium text-gray-900">{apt.petName}</td>
                          <td className="px-3 py-2">
                            {apt.vetName} ({apt.serviceName})
                          </td>
                          <td className="px-3 py-2">
                            <AdminStatusBadge status={apt.status} />
                          </td>
                          <td className="px-3 py-2 text-gray-500">
                            {new Date(apt.dateTime).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </AdminModal>

      {/* Delete Customer Confirmation Modal */}
      <AdminModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Customer Account"
        subtitle="Permanent removal of customer account and all associated records"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#4B5563]">
            Are you sure you want to permanently delete customer{' '}
            <strong className="text-[#111827] font-semibold">{customerToDelete?.name}</strong>{' '}
            ({customerToDelete?.email})?
          </p>
          <div className="p-3 bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl text-xs text-[#991B1B] space-y-1">
            <p className="font-bold">⚠️ Warning: Cascading Action</p>
            <p>
              This will permanently delete the customer profile along with all their registered pets,
              order history, and appointment records from the database.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#F3F4F6]">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#4B5563] hover:bg-[#F3F4F6] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="px-4 py-2 bg-[#D0453C] hover:bg-[#b83c34] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {deleting ? 'Deleting...' : 'Delete Customer'}
            </button>
          </div>
        </div>
      </AdminModal>
    </AdminLayout>
  );
};
