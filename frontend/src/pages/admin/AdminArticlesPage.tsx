import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Power, Star, AlertCircle, BookOpen, Trash2 } from 'lucide-react';
import { AdminLayout, useAdminToast } from '../../components/admin/AdminLayout';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminStatusBadge } from '../../components/admin/AdminStatusBadge';
import { getCloudinaryImageUrl } from '../../lib/utils';
import api from '../../lib/axios';

interface ArticleItem {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  petType: string;
  isFeatured: boolean;
  isActive: boolean;
  publishedAt: string;
}

export const AdminArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<ArticleItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useAdminToast();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    petType: 'ALL',
    isFeatured: false,
    isActive: true,
  });

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/articles');
      setArticles(res.data || []);
    } catch (err: any) {
      console.error('Failed to fetch articles', err);
      const msg = err.response?.data?.message || 'Failed to load articles from database.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      title: '',
      content: '',
      imageUrl: '',
      petType: 'ALL',
      isFeatured: false,
      isActive: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (article: ArticleItem) => {
    setIsEditing(true);
    setCurrentId(article.id);
    setFormData({
      title: article.title,
      content: article.content || '',
      imageUrl: article.imageUrl || '',
      petType: article.petType || 'ALL',
      isFeatured: article.isFeatured || false,
      isActive: article.isActive !== false,
    });
    setError(null);
    setModalOpen(true);
  };

  const openDeleteModal = (article: ArticleItem) => {
    setArticleToDelete(article);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/admin/articles/${articleToDelete.id}`);
      setArticles((prev) => prev.filter((a) => a.id !== articleToDelete.id));
      showToast(res.data?.message || `Article "${articleToDelete.title}" deleted successfully.`);
      setDeleteModalOpen(false);
      setArticleToDelete(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete article.';
      showToast(msg, 'error');
      fetchArticles();
      setDeleteModalOpen(false);
      setArticleToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const res = await api.patch(`/admin/articles/${id}/toggle-status`);
      const updatedActive = res.data?.isActive;
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isActive: updatedActive ?? !a.isActive } : a))
      );
      showToast(res.data?.message || 'Article status updated successfully!');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to toggle article status.';
      showToast(msg, 'error');
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      const res = await api.patch(`/admin/articles/${id}/toggle-featured`);
      const updatedFeatured = res.data?.isFeatured;
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isFeatured: updatedFeatured ?? !a.isFeatured } : a))
      );
      showToast(res.data?.message || 'Article featured flag updated!');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to toggle featured flag.';
      showToast(msg, 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        imageUrl: formData.imageUrl,
        petType: formData.petType,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
      };

      if (isEditing && currentId) {
        await api.put(`/admin/articles/${currentId}`, payload);
        showToast('Article updated successfully!');
      } else {
        await api.post('/admin/articles', payload);
        showToast('New article published successfully!');
      }

      setModalOpen(false);
      fetchArticles();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to save article';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<ArticleItem>[] = [
    {
      key: 'title',
      header: 'Article Title & Excerpt',
      align: 'left',
      className: 'w-[40%]',
      render: (row) => {
        const imgUrl = getCloudinaryImageUrl(row.imageUrl || 'hero_dog_cat_green_bg');
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F5] border border-[#EBEBE8] overflow-hidden flex items-center justify-center shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt={row.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <BookOpen className="w-4 h-4 text-[#9CA3AF]" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#111827] text-sm truncate">{row.title}</p>
              <p className="text-xs text-[#6B7280] truncate max-w-[320px]">{row.content}</p>
            </div>
          </div>
        );
      },
      sortable: true,
    },
    {
      key: 'petType',
      header: 'Pet Target',
      align: 'left',
      sortable: true,
      className: 'w-[14%]',
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
          {row.petType || 'ALL'}
        </span>
      ),
    },
    {
      key: 'isFeatured',
      header: 'Featured',
      align: 'center',
      sortable: true,
      className: 'w-[14%]',
      render: (row) => (
        <button
          onClick={() => handleToggleFeatured(row.id)}
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
            row.isFeatured
              ? 'bg-[#FEF9C3] text-[#B45309] border-[#FDE047]'
              : 'bg-[#F9FAF8] text-[#6B7280] border-[#E5E7EB] hover:text-[#111827]'
          }`}
          title="Toggle Featured"
        >
          <Star className={`w-3 h-3 ${row.isFeatured ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#9CA3AF]'}`} />
          {row.isFeatured ? 'Featured' : 'Standard'}
        </button>
      ),
    },
    {
      key: 'publishedAt',
      header: 'Published',
      align: 'center',
      sortable: true,
      className: 'w-[12%]',
      render: (row) => (
        <span className="text-xs text-[#6B7280] font-mono">
          {row.publishedAt ? new Date(row.publishedAt).toLocaleDateString() : 'Draft'}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      align: 'center',
      sortable: true,
      className: 'w-[10%]',
      render: (row) => <AdminStatusBadge status={row.isActive ? 'Active' : 'Inactive'} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      className: 'w-[10%]',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => openEditModal(row)}
            className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors cursor-pointer shrink-0"
            title="Edit Article"
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
            title={row.isActive ? 'Deactivate (Hide from Customer Tips)' : 'Activate (Show on Customer Tips)'}
          >
            <Power className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-[#D0453C] hover:bg-[#FDEDEC] rounded-lg transition-colors cursor-pointer shrink-0"
            title="Delete Article"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Health Tips & Articles Management">
      <DataTable
        columns={columns}
        data={articles}
        isLoading={isLoading}
        searchPlaceholder="Search articles by title..."
        searchKey="title"
        filterLabel="All Pet Types"
        filterOptions={[
          { label: 'All Pets', value: 'ALL' },
          { label: 'Dogs', value: 'DOG' },
          { label: 'Cats', value: 'CAT' },
        ]}
        filterKey="petType"
        actions={
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#3FA65C] hover:bg-[#33894B] active:scale-[0.99] text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Article
          </button>
        }
      />

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Health Article' : 'Create Health Article'}
        subtitle={isEditing ? 'Update published guidance' : 'Publish veterinary health advice'}
        maxWidth="xl"
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
              Article Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 5 Essential Summer Care Tips for Golden Retrievers"
              className="w-full px-3 py-2 bg-[#F9FAF8] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/20 focus:border-[#3FA65C] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                Target Pet Type
              </label>
              <select
                value={formData.petType}
                onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
                className="w-full px-3 py-2 bg-[#F9FAF8] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/20 focus:border-[#3FA65C] transition-all"
              >
                <option value="ALL">All Pets</option>
                <option value="DOG">Dogs</option>
                <option value="CAT">Cats</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                Thumbnail Key / Image URL
              </label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="service_02_pet_food_rabbit_bowl / https://..."
                className="w-full px-3 py-2 bg-[#F9FAF8] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/20 focus:border-[#3FA65C] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
              Article Content *
            </label>
            <textarea
              rows={6}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write veterinary tips and pet health guidance..."
              className="w-full px-3 py-2 bg-[#F9FAF8] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/20 focus:border-[#3FA65C] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 text-[#3FA65C] focus:ring-[#3FA65C] border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="isFeatured" className="text-xs font-medium text-[#4B5563] select-none cursor-pointer">
              Feature this article on customer home and health-tips pages
            </label>
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
              {submitting ? 'Saving...' : isEditing ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Article Confirmation Modal */}
      <AdminModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Article"
        subtitle="Permanent removal from published tips directory"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#4B5563]">
            Are you sure you want to permanently delete the article{' '}
            <strong className="text-[#111827] font-semibold">{articleToDelete?.title}</strong>?
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
              {deleting ? 'Deleting...' : 'Delete Article'}
            </button>
          </div>
        </div>
      </AdminModal>


    </AdminLayout>
  );
};
