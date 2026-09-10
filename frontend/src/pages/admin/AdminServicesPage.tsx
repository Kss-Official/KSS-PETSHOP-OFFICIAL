import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Power, AlertCircle, Sparkles, Trash2 } from 'lucide-react';
import { AdminLayout, useAdminToast } from '../../components/admin/AdminLayout';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminStatusBadge } from '../../components/admin/AdminStatusBadge';
import { getCloudinaryImageUrl } from '../../lib/utils';
import api from '../../lib/axios';

interface ServiceItem {
  id: number;
  name: string;
  description: string;
  iconUrl?: string;
  isActive: boolean;
}

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useAdminToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    iconUrl: '',
    isActive: true,
  });

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/services');
      setServices(res.data || []);
    } catch (err) {
      console.error('Failed to fetch services', err);
      showToast('Failed to load services from database.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      description: '',
      iconUrl: '',
      isActive: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (svc: ServiceItem) => {
    setIsEditing(true);
    setCurrentId(svc.id);
    setFormData({
      name: svc.name,
      description: svc.description || '',
      iconUrl: svc.iconUrl || '',
      isActive: svc.isActive,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const res = await api.patch(`/admin/services/${id}/toggle-status`);
      const updatedActive = res.data?.isActive;
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: updatedActive ?? !s.isActive } : s))
      );
      showToast(res.data?.message || 'Service status updated successfully!');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to toggle service status.';
      showToast(msg, 'error');
    }
  };

  const openDeleteModal = (svc: ServiceItem) => {
    setServiceToDelete(svc);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/admin/services/${serviceToDelete.id}`);
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
      showToast(res.data?.message || `Service "${serviceToDelete.name}" deleted successfully.`);
      setDeleteModalOpen(false);
      setServiceToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete service', err);
      const msg = err.response?.data?.message || err.message || 'Failed to delete service.';
      showToast(msg, 'error');
      fetchServices();
      setDeleteModalOpen(false);
      setServiceToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        iconUrl: formData.iconUrl || null,
        isActive: formData.isActive,
      };

      if (isEditing && currentId) {
        await api.put(`/admin/services/${currentId}`, payload);
        showToast('Service updated successfully!');
      } else {
        await api.post('/admin/services', payload);
        showToast('New service registered successfully!');
      }

      setModalOpen(false);
      fetchServices();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<ServiceItem>[] = [
    {
      key: 'name',
      header: 'Service Offering',
      align: 'left',
      className: 'w-[65%]',
      render: (row) => {
        const imgUrl = getCloudinaryImageUrl(row.iconUrl || 'service_01_vet_care');
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F5] border border-[#EBEBE8] overflow-hidden flex items-center justify-center shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt={row.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <Sparkles className="w-4 h-4 text-[#3FA65C]" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#111827] text-sm truncate">{row.name}</p>
              <p className="text-xs text-[#6B7280] truncate max-w-[450px]">{row.description}</p>
            </div>
          </div>
        );
      },
      sortable: true,
    },
    {
      key: 'isActive',
      header: 'Status',
      align: 'center',
      sortable: true,
      className: 'w-[18%]',
      render: (row) => <AdminStatusBadge status={row.isActive ? 'Active' : 'Inactive'} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      className: 'w-[17%]',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => openEditModal(row)}
            className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors cursor-pointer shrink-0"
            title="Edit Service"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleToggleStatus(row.id)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer shrink-0 ${
              row.isActive
                ? 'text-[#6B7280] hover:text-[#C0392B] hover:bg-[#FDEDEC]'
                : 'text-[#6B7280] hover:text-[#3FA65C] hover:bg-[#EBF7EE]'
            }`}
            title={row.isActive ? 'Deactivate (Hide from customer portals)' : 'Reactivate'}
          >
            <Power className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-[#D0453C] hover:bg-[#FDEDEC] rounded-lg transition-colors cursor-pointer shrink-0"
            title="Delete Service"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Services Management">
      <DataTable
        columns={columns}
        data={services}
        isLoading={isLoading}
        searchPlaceholder="Search services by name..."
        searchKey="name"
        filterLabel="All Statuses"
        filterOptions={[
          { label: 'Active Only', value: 'TRUE' },
          { label: 'Inactive Only', value: 'FALSE' },
        ]}
        filterKey={(row) => String(row.isActive)}
        actions={
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#3FA65C] hover:bg-[#33894B] active:scale-[0.99] text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        }
      />

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Service' : 'Add New Service'}
        subtitle={isEditing ? 'Modify service offering' : 'Register a new clinical or grooming service'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-[#FDEDEC] border border-[#FADBD8] rounded-xl flex items-center gap-2 text-xs text-[#C0392B]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
              Service Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Comprehensive Health Checkup"
              className="w-full px-3 py-2 bg-[#F9FAF8] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/20 focus:border-[#3FA65C] transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
              Icon Key / Image URL
            </label>
            <input
              type="text"
              value={formData.iconUrl}
              onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
              placeholder="service_01_vet_care / https://..."
              className="w-full px-3 py-2 bg-[#F9FAF8] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/20 focus:border-[#3FA65C] transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Full physical examination and preventative assessment..."
              className="w-full px-3 py-2 bg-[#F9FAF8] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/20 focus:border-[#3FA65C] transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#F3F4F6]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#4B5563] hover:bg-[#F3F4F6] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-[#3FA65C] hover:bg-[#358E4E] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Service Confirmation Modal */}
      <AdminModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Service"
        subtitle="Permanent removal from clinical service catalog"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#4B5563]">
            Are you sure you want to permanently delete service{' '}
            <strong className="text-[#111827] font-semibold">{serviceToDelete?.name}</strong>?
            This action cannot be undone.
          </p>
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
              {deleting ? 'Deleting...' : 'Delete Service'}
            </button>
          </div>
        </div>
      </AdminModal>
    </AdminLayout>
  );
};
