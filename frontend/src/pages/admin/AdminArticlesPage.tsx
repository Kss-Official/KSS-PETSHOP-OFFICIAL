import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Power, Star, AlertCircle, BookOpen, Trash2 } from 'lucide-react';
import { AdminLayout, useAdminToast } from '../../components/admin/AdminLayout';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminStatusBadge } from '../../components/admin/AdminStatusBadge';
import { AdminImageUrlInput } from '../../components/admin/AdminImageUrlInput';
import { getArticleImageUrl } from '../../lib/utils';
import api from '../../lib/axios';

interface ArticleItem {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  petType: string;
  category?: string;
  isFeatured: boolean;
  isActive: boolean;
  publishedAt: string;
}

const resolveCategory = (title?: string, cat?: string): string => {
  if (cat && cat !== 'Preventive Care' && cat !== 'General' && cat !== 'Master') return cat;
  const t = (title || '').toLowerCase();
  if (t.includes('nutrition') || t.includes('food') || t.includes('diet')) return 'Nutrition';
  if (t.includes('vaccin') || t.includes('shot')) return 'Vaccination';
  if (t.includes('groom') || t.includes('bath') || t.includes('wash')) return 'Grooming';
  if (t.includes('sign') || t.includes('sick') || t.includes('emergenc')) return 'Emergency Care';
  if (t.includes('cat') || t.includes('indoor') || t.includes('play') || t.includes('behaviour')) return 'Behaviour';
  return cat || 'Preventive Care';
};

const categoryColorMap: Record<string, { bg: string; text: string; border: string }> = {
  Nutrition: { bg: 'bg-[#FEF9C3]', text: 'text-[#B45309]', border: 'border-[#FDE047]' },
  Vaccination: { bg: 'bg-[#E0F2FE]', text: 'text-[#0284C7]', border: 'border-[#BAE6FD]' },
  Grooming: { bg: 'bg-[#FFE4E6]', text: 'text-[#E11D48]', border: 'border-[#FECDD3]' },
  'Preventive Care': { bg: 'bg-[#F3E8FF]', text: 'text-[#7E22CE]', border: 'border-[#E9D5FF]' },
  Behaviour: { bg: 'bg-[#FFEDD5]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]' },
  'Senior Pet Care': { bg: 'bg-[#CCFBF1]', text: 'text-[#0F766E]', border: 'border-[#99F6E4]' },
  'Emergency Care': { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]', border: 'border-[#FECACA]' },
  'Puppy Care': { bg: 'bg-[#DCFCE7]', text: 'text-[#15803D]', border: 'border-[#BBF7D0]' },
};

export const AdminArticlesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'articles' | 'health-tips'>('articles');
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [healthTips, setHealthTips] = useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'article' | 'health-tip'>('article');
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
    category: 'Preventive Care',
    isFeatured: false,
    isActive: true,
  });

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      if (viewMode === 'articles') {
        const res = await api.get('/admin/articles');
        setArticles(res.data || []);
      } else {
        const res = await api.get('/admin/health-tips');
        setHealthTips(res.data || []);
      }
    } catch (err: any) {
      console.error(`Failed to fetch ${viewMode}`, err);
      const msg = err.response?.data?.message || `Failed to load ${viewMode} from database.`;
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [viewMode]);

  const openAddModal = (type: 'article' | 'health-tip' = 'article') => {
    setIsEditing(false);
    setCurrentId(null);
    setModalType(type);
    setFormData({
      title: '',
      content: '',
      imageUrl: '',
      petType: 'ALL',
      category: type === 'health-tip' ? 'Preventive Care' : 'General',
      isFeatured: false,
      isActive: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (item: ArticleItem, type: 'article' | 'health-tip' = viewMode === 'health-tips' ? 'health-tip' : 'article') => {
    setIsEditing(true);
    setCurrentId(item.id);
    setModalType(type);
    setFormData({
      title: item.title,
      content: item.content || '',
      imageUrl: item.imageUrl || '',
      petType: item.petType || 'ALL',
      category: item.category || (type === 'health-tip' ? 'Preventive Care' : 'General'),
      isFeatured: item.isFeatured || false,
      isActive: item.isActive !== false,
    });
    setError(null);
    setModalOpen(true);
  };

  const openDeleteModal = (item: ArticleItem) => {
    setArticleToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    setDeleting(true);
    const endpoint = viewMode === 'health-tips' ? `/admin/health-tips/${articleToDelete.id}` : `/admin/articles/${articleToDelete.id}`;
    try {
      const res = await api.delete(endpoint);
      if (viewMode === 'articles') {
        setArticles((prev) => prev.filter((a) => a.id !== articleToDelete.id));
      } else {
        setHealthTips((prev) => prev.filter((a) => a.id !== articleToDelete.id));
      }
      showToast(res.data?.message || `${viewMode === 'health-tips' ? 'Health tip' : 'Article'} "${articleToDelete.title}" deleted successfully.`);
      setDeleteModalOpen(false);
      setArticleToDelete(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete record.';
      showToast(msg, 'error');
      fetchItems();
      setDeleteModalOpen(false);
      setArticleToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const endpoint = viewMode === 'health-tips' ? `/admin/health-tips/${id}/toggle-status` : `/admin/articles/${id}/toggle-status`;
      const res = await api.patch(endpoint);
      const updatedActive = res.data?.isActive;
      if (viewMode === 'articles') {
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, isActive: updatedActive ?? !a.isActive } : a))
        );
      } else {
        setHealthTips((prev) =>
          prev.map((a) => (a.id === id ? { ...a, isActive: updatedActive ?? !a.isActive } : a))
        );
      }
      showToast(res.data?.message || 'Status updated successfully!');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to toggle status.';
      showToast(msg, 'error');
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      const endpoint = viewMode === 'health-tips' ? `/admin/health-tips/${id}/toggle-featured` : `/admin/articles/${id}/toggle-featured`;
      const res = await api.patch(endpoint);
      const updatedFeatured = res.data?.isFeatured;
      if (viewMode === 'articles') {
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, isFeatured: updatedFeatured ?? !a.isFeatured } : a))
        );
      } else {
        setHealthTips((prev) =>
          prev.map((a) => (a.id === id ? { ...a, isFeatured: updatedFeatured ?? !a.isFeatured } : a))
        );
      }
      showToast(res.data?.message || `${viewMode === 'health-tips' ? 'Health tip' : 'Article'} featured flag updated!`);
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
        category: formData.category,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
      };

      const targetEndpoint = modalType === 'health-tip' ? '/admin/health-tips' : '/admin/articles';

      if (isEditing && currentId) {
        await api.put(`${targetEndpoint}/${currentId}`, payload);
        showToast(modalType === 'health-tip' ? 'Health tip updated successfully!' : 'Article updated successfully!');
      } else {
        await api.post(targetEndpoint, payload);
        showToast(modalType === 'health-tip' ? 'New health tip published successfully!' : 'New article published successfully!');
      }

      setModalOpen(false);
      fetchItems();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to save item';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Columns for Articles View
  const articleColumns: Column<ArticleItem>[] = [
    {
      key: 'title',
      header: 'Article Title & Excerpt',
      align: 'left',
      className: 'w-[40%]',
      render: (row) => {
        const imgUrl = getArticleImageUrl(row.title, row.imageUrl);
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
      render: (row) => {
        const pet = (row.petType || 'ALL').trim();
        const upper = pet.toUpperCase();
        let displayLabel = pet;
        if (upper.includes('DOG')) displayLabel = 'Dogs';
        else if (upper.includes('CAT')) displayLabel = 'Cats';
        else if (upper.includes('RABBIT')) displayLabel = 'Rabbits';
        else if (upper.includes('BIRD')) displayLabel = 'Birds';
        else if (upper.includes('SMALL')) displayLabel = 'Small Pets';
        else if (upper.includes('REPTILE')) displayLabel = 'Reptiles';
        else if (upper.includes('FISH')) displayLabel = 'Fish';
        else if (upper === 'ALL') displayLabel = 'All Pets';

        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
            {displayLabel}
          </span>
        );
      },
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
            onClick={() => openEditModal(row, 'article')}
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

  // Columns for Health Tips View (Named Tips, Category, Published, Status, Actions)
  const healthTipColumns: Column<ArticleItem>[] = [
    {
      key: 'title',
      header: 'Named Tips',
      align: 'left',
      className: 'w-[40%]',
      render: (row) => {
        const imgUrl = getArticleImageUrl(row.title, row.imageUrl);
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
      key: 'category',
      header: 'Category',
      align: 'center',
      sortable: true,
      className: 'w-[16%]',
      render: (row) => {
        const cat = resolveCategory(row.title, row.category);
        const colors = categoryColorMap[cat] || {
          bg: 'bg-[#F3F4F6]',
          text: 'text-[#374151]',
          border: 'border-[#E5E7EB]',
        };
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${colors.bg} ${colors.text} border ${colors.border || 'border-transparent'}`}
          >
            {cat}
          </span>
        );
      },
    },
    {
      key: 'publishedAt',
      header: 'Published',
      align: 'center',
      sortable: true,
      className: 'w-[16%]',
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
      className: 'w-[14%]',
      render: (row) => <AdminStatusBadge status={row.isActive ? 'Active' : 'Inactive'} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      className: 'w-[14%]',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => openEditModal(row, 'health-tip')}
            className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors cursor-pointer shrink-0"
            title="Edit Health Tip"
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
            title={row.isActive ? 'Deactivate (Hide)' : 'Activate (Show)'}
          >
            <Power className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-[#D0453C] hover:bg-[#FDEDEC] rounded-lg transition-colors cursor-pointer shrink-0"
            title="Delete Health Tip"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const viewSwitcherNode = (
    <div className="relative shrink-0">
      <select
        value={viewMode}
        onChange={(e) => setViewMode(e.target.value as 'articles' | 'health-tips')}
        className="px-3 py-2 text-xs font-bold text-[#16241B] bg-[#F9FAF8] border border-[#E5E7EB] hover:border-[#3FA65C] focus:border-[#3FA65C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/20 transition-all cursor-pointer shadow-2xs"
        aria-label="Select management view"
      >
        <option value="articles">Articles</option>
        <option value="health-tips">Health Tips</option>
      </select>
    </div>
  );

  return (
    <AdminLayout title="Health Tips & Articles Management">
      {viewMode === 'articles' ? (
        <DataTable
          columns={articleColumns}
          data={articles}
          isLoading={isLoading}
          beforeSearch={viewSwitcherNode}
          searchPlaceholder="Search articles by title..."
          searchKey="title"
          filterLabel="All Pet Types"
          filterOptions={[
            { label: 'All Pets', value: 'ALL' },
            { label: 'Dogs', value: 'Dogs' },
            { label: 'Cats', value: 'Cats' },
            { label: 'Rabbits', value: 'Rabbits' },
            { label: 'Birds', value: 'Birds' },
            { label: 'Small Pets', value: 'Small Pets' },
            { label: 'Reptiles', value: 'Reptiles' },
            { label: 'Fish', value: 'Fish' },
          ]}
          filterKey={(row) => {
            const pet = (row.petType || 'ALL').trim().toUpperCase();
            if (pet.includes('DOG')) return 'Dogs';
            if (pet.includes('CAT')) return 'Cats';
            if (pet.includes('RABBIT')) return 'Rabbits';
            if (pet.includes('BIRD')) return 'Birds';
            if (pet.includes('SMALL')) return 'Small Pets';
            if (pet.includes('REPTILE')) return 'Reptiles';
            if (pet.includes('FISH')) return 'Fish';
            if (pet === 'ALL' || pet === 'ALL PETS') return 'ALL';
            return row.petType;
          }}
          actions={
            <button
              onClick={() => openAddModal('article')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#3FA65C] hover:bg-[#33894B] active:scale-[0.99] text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Article
            </button>
          }
        />
      ) : (
        <DataTable
          columns={healthTipColumns}
          data={healthTips}
          isLoading={isLoading}
          beforeSearch={viewSwitcherNode}
          searchPlaceholder="Search health tips by name..."
          searchKey="title"
          filterOptions={undefined}
          actions={
            <button
              onClick={() => openAddModal('health-tip')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#3FA65C] hover:bg-[#33894B] active:scale-[0.99] text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Health Tip
            </button>
          }
        />
      )}

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          isEditing
            ? modalType === 'health-tip'
              ? 'Edit Health Tip'
              : 'Edit Article'
            : modalType === 'health-tip'
              ? 'Create Health Tip'
              : 'Create Articles'
        }
        subtitle={
          isEditing
            ? modalType === 'health-tip'
              ? 'Update published veterinary health tip'
              : 'Update published guidance'
            : modalType === 'health-tip'
              ? 'Publish veterinary care advice'
              : 'Publish veterinary health advice'
        }
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
              {modalType === 'health-tip' ? 'Tip Name / Title *' : 'Article Title *'}
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={
                modalType === 'health-tip'
                  ? 'e.g. Essential Pet Vaccination & Immunization Guide'
                  : 'e.g. 5 Essential Summer Care Tips for Golden Retrievers'
              }
              className="w-full px-3 py-2 bg-[#F9FAF8] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/20 focus:border-[#3FA65C] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {modalType === 'article' ? (
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
                  <option value="Dogs">Dogs</option>
                  <option value="Cats">Cats</option>
                  <option value="Rabbits">Rabbits</option>
                  <option value="Birds">Birds</option>
                  <option value="Small Pets">Small Pets</option>
                  <option value="Reptiles">Reptiles</option>
                  <option value="Fish">Fish</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                  Tip Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F9FAF8] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/20 focus:border-[#3FA65C] transition-all"
                >
                  <option value="Health Tip">Health Tip</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="Grooming">Grooming</option>
                  <option value="Preventive Care">Preventive Care</option>
                  <option value="Behaviour">Behaviour</option>
                  <option value="Senior Pet Care">Senior Pet Care</option>
                  <option value="Emergency Care">Emergency Care</option>
                </select>
              </div>
            )}
          </div>

          <AdminImageUrlInput
            label={modalType === 'health-tip' ? 'Tip Image URL' : 'Article Image URL'}
            value={formData.imageUrl || ''}
            onChange={(val) => setFormData({ ...formData, imageUrl: val })}
            placeholder="https://images.unsplash.com/... or https://..."
            entityName={formData.title || 'Article'}
            helperText="Provide a direct URL to an article illustration or photo (starts with http:// or https://, max 512 chars)."
          />

          <div>
            <label className="block text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
              {modalType === 'health-tip' ? 'Tip Content & Guidelines *' : 'Article Content *'}
            </label>
            <textarea
              rows={6}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder={
                modalType === 'health-tip'
                  ? 'Write detailed health tip recommendations, dosage guidance, or veterinary instructions...'
                  : 'Write veterinary tips and pet health guidance...'
              }
              className="w-full px-3 py-2 bg-[#F9FAF8] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/20 focus:border-[#3FA65C] transition-all"
            />
          </div>

          {modalType === 'article' && (
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
          )}

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
              {submitting
                ? 'Saving...'
                : isEditing
                  ? modalType === 'health-tip'
                    ? 'Update Health Tip'
                    : 'Update Article'
                  : modalType === 'health-tip'
                    ? 'Publish Health Tip'
                    : 'Publish Article'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={modalType === 'health-tip' ? 'Delete Health Tip' : 'Delete Article'}
        subtitle="Permanent removal from published tips directory"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#4B5563]">
            Are you sure you want to permanently delete{' '}
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
              {deleting ? 'Deleting...' : modalType === 'health-tip' ? 'Delete Health Tip' : 'Delete Article'}
            </button>
          </div>
        </div>
      </AdminModal>
    </AdminLayout>
  );
};
