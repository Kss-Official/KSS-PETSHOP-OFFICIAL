import React, { useState, useEffect } from 'react';
import { Download, Mail, Trash2, Copy, Check, CheckCircle2 } from 'lucide-react';
import { AdminLayout, useAdminToast } from '../../components/admin/AdminLayout';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { AdminModal } from '../../components/admin/AdminModal';
import api from '../../lib/axios';

interface Subscriber {
  id: number;
  email: string;
  subscribedAt: string;
}

export const AdminNewsletterPage: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { showToast } = useAdminToast();

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/newsletter');
      setSubscribers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch subscribers', err);
      showToast('Failed to load newsletter subscribers.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleCopyEmail = (sub: Subscriber) => {
    navigator.clipboard.writeText(sub.email);
    setCopiedId(sub.id);
    showToast(`Copied ${sub.email} to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openDeleteModal = (sub: Subscriber) => {
    setSubscriberToDelete(sub);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!subscriberToDelete) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/admin/newsletter/${subscriberToDelete.id}`);
      setSubscribers((prev) => prev.filter((s) => s.id !== subscriberToDelete.id));
      showToast(res.data?.message || `Subscriber ${subscriberToDelete.email} removed successfully.`);
      setDeleteModalOpen(false);
      setSubscriberToDelete(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to remove subscriber.';
      showToast(msg, 'error');
      fetchSubscribers();
      setDeleteModalOpen(false);
      setSubscriberToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      const response = await api.get('/admin/newsletter/export', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast('Newsletter subscribers exported to CSV successfully!');
    } catch (err) {
      console.error('Failed to export CSV', err);
      showToast('Failed to export CSV. Please try again.', 'error');
    } finally {
      setExporting(false);
    }
  };

  const columns: Column<Subscriber>[] = [
    {
      key: 'email',
      header: 'Subscriber Email',
      className: 'w-[45%]',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <span className="font-semibold text-gray-900 truncate">{row.email}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'subscribedAt',
      header: 'Subscription Date',
      sortable: true,
      className: 'w-[25%]',
      render: (row) => (
        <span className="text-xs text-gray-600">
          {row.subscribedAt ? new Date(row.subscribedAt).toLocaleString() : '-'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      className: 'w-[15%]',
      render: () => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#3FA65C] bg-[#EBF7EE] border border-[#C3E8CC] px-2.5 py-0.5 rounded-full">
          <CheckCircle2 className="w-3 h-3" />
          Active Subscriber
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-[15%] text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleCopyEmail(row)}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Copy Email Address"
          >
            {copiedId === row.id ? <Check className="w-4 h-4 text-[#3FA65C]" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Unsubscribe / Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Newsletter Subscribers">
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={subscribers}
          isLoading={isLoading}
          searchPlaceholder="Search subscribers by email..."
          searchKey="email"
          actions={
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                Total: <strong className="text-gray-900">{subscribers.length}</strong>
              </span>
              <button
                onClick={handleExportCsv}
                disabled={exporting || subscribers.length === 0}
                className="flex items-center gap-2 px-3.5 py-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {exporting ? 'Exporting...' : 'Export CSV'}
              </button>
            </div>
          }
        />
      </div>

      {/* Delete Subscriber Confirmation Modal */}
      <AdminModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Unsubscribe / Remove Subscriber"
        subtitle="Permanent removal from mailing database"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to remove{' '}
            <strong className="text-gray-900 font-semibold">{subscriberToDelete?.email}</strong> from the newsletter
            subscriber list?
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {deleting ? 'Removing...' : 'Remove Subscriber'}
            </button>
          </div>
        </div>
      </AdminModal>


    </AdminLayout>
  );
};
