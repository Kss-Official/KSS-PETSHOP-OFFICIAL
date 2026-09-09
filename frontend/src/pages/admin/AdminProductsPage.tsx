import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Power, AlertCircle, Trash2 } from 'lucide-react';
import { AdminLayout, useAdminToast } from '../../components/admin/AdminLayout';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminStatusBadge } from '../../components/admin/AdminStatusBadge';
import api from '../../lib/axios';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  imageUrl: string;
  isActive: boolean;
}

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { showToast } = useAdminToast();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'FOOD',
    stockQuantity: '',
    imageUrl: '',
    isActive: true,
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/products');
      setProducts(res.data || []);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to load products from database.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'FOOD',
      stockQuantity: '',
      imageUrl: '',
      isActive: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      category: product.category || 'FOOD',
      stockQuantity: String(product.stockQuantity),
      imageUrl: product.imageUrl || '',
      isActive: product.isActive,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const res = await api.patch(`/admin/products/${id}/toggle-status`);
      const updatedActive = res.data?.isActive;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: updatedActive ?? !p.isActive } : p))
      );
      showToast(res.data?.message || 'Product status updated successfully!');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to toggle product status.';
      showToast(msg, 'error');
    }
  };

  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/admin/products/${productToDelete.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      showToast(res.data?.message || `Product "${productToDelete.name}" deleted successfully.`);
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete product', err);
      const msg = err.response?.data?.message || err.message || 'Failed to delete product.';
      showToast(msg, 'error');
      fetchProducts();
      setDeleteModalOpen(false);
      setProductToDelete(null);
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
        price: parseFloat(formData.price),
        category: formData.category,
        stockQuantity: parseInt(formData.stockQuantity, 10),
        imageUrl: formData.imageUrl,
        isActive: formData.isActive,
      };

      if (isEditing && currentId) {
        await api.put(`/admin/products/${currentId}`, payload);
        showToast('Product updated successfully!');
      } else {
        await api.post('/admin/products', payload);
        showToast('Product created successfully and saved to database!');
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<Product>[] = [
    {
      key: 'imageUrl',
      header: 'Product',
      className: 'w-[32%]',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
            {row.imageUrl ? (
              <img src={row.imageUrl} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-gray-400 font-bold">{row.name.charAt(0)}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{row.name}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      className: 'w-[15%]',
      render: (row) => <span className="text-xs font-medium text-gray-700">{row.category}</span>,
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      className: 'w-[12%]',
      render: (row) => <span className="font-semibold text-gray-900">${row.price?.toFixed(2)}</span>,
    },
    {
      key: 'stockQuantity',
      header: 'Stock',
      sortable: true,
      className: 'w-[15%]',
      render: (row) => {
        const isOutOfStock = row.stockQuantity === 0;
        const isLowStock = row.stockQuantity > 0 && row.stockQuantity < 10;
        return (
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                isOutOfStock
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : isLowStock
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {(isOutOfStock || isLowStock) && <AlertCircle className="w-3 h-3 shrink-0" />}
              {row.stockQuantity} units
              {isOutOfStock && ' (Out of Stock)'}
              {isLowStock && ' (Low Stock)'}
            </span>
          </div>
        );
      },
    },
    {
      key: 'isActive',
      header: 'Status',
      sortable: true,
      className: 'w-[14%]',
      render: (row) => <AdminStatusBadge status={row.isActive ? 'Active' : 'Inactive'} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-[14%] text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openEditModal(row)}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Edit Product"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleToggleStatus(row.id)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer shrink-0 ${row.isActive
                ? 'text-[#6B7280] hover:text-[#C0392B] hover:bg-[#FDEDEC]'
                : 'text-[#6B7280] hover:text-[#3FA65C] hover:bg-[#EBF7EE]'
              }`}
            title={row.isActive ? 'Deactivate (Hide from Customer Pharmacy)' : 'Activate (Show on Customer Pharmacy)'}
          >
            <Power className="w-4 h-4" />
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-[#D0453C] hover:bg-[#FDEDEC] rounded-lg transition-colors cursor-pointer shrink-0"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Products Management">

      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        searchPlaceholder="Search products by name..."
        searchKey="name"
        filterLabel="All Categories"
        filterOptions={[
          { label: 'Food', value: 'FOOD' },
          { label: 'Toys', value: 'TOYS' },
          { label: 'Accessories', value: 'ACCESSORIES' },
          { label: 'Medicines', value: 'MEDICINE' },
          { label: 'Grooming', value: 'GROOMING' },
        ]}
        filterKey="category"
        actions={
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#3FA65C] hover:bg-[#33894B] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        }
      />

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Product' : 'Add New Product'}
        subtitle={isEditing ? 'Modify catalog item details' : 'Create a new catalog item'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-[#FDEDEC] border border-[#FADBD8] rounded-lg flex items-center gap-2 text-xs text-[#C0392B]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Premium Organic Puppy Kibble"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/30 focus:border-[#3FA65C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/30 focus:border-[#3FA65C]"
              >
                <option value="FOOD">Food</option>
                <option value="TOYS">Toys</option>
                <option value="ACCESSORIES">Accessories</option>
                <option value="MEDICINE">Medicine</option>
                <option value="GROOMING">Grooming</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="29.99"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/30 focus:border-[#3FA65C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                placeholder="50"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/30 focus:border-[#3FA65C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Image URL (Cloudinary)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://res.cloudinary.com/..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/30 focus:border-[#3FA65C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="High quality nutrition for growing pups..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/30 focus:border-[#3FA65C]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-[#3FA65C] hover:bg-[#358E4E] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Product Confirmation Modal */}
      <AdminModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Product"
        subtitle="Permanent removal from product catalog"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#4B5563]">
            Are you sure you want to permanently delete product{' '}
            <strong className="text-[#111827] font-semibold">{productToDelete?.name}</strong>?
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
              {deleting ? 'Deleting...' : 'Delete Product'}
            </button>
          </div>
        </div>
      </AdminModal>
    </AdminLayout>
  );
};
