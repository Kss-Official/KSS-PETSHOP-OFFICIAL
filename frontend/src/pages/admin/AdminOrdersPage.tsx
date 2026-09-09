import React, { useState, useEffect } from 'react';
import { Eye, AlertCircle } from 'lucide-react';
import { AdminLayout, useAdminToast } from '../../components/admin/AdminLayout';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminStatusBadge } from '../../components/admin/AdminStatusBadge';
import api from '../../lib/axios';

interface OrderItemDetail {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface OrderDetail {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  pickupCode: string;
  notes: string;
  createdAt: string;
  itemCount: number;
  items?: OrderItemDetail[];
}

export const AdminOrdersPage: React.FC = () => {
  const { showToast } = useAdminToast();
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Status update select states inside modal
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/orders');
      setOrders(res.data || []);
    } catch (err: any) {
      console.error('Failed to fetch orders', err);
      const msg = err.response?.data?.message || 'Failed to load orders from database.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openOrderDetail = async (order: OrderDetail) => {
    try {
      setStatusError(null);
      const res = await api.get(`/admin/orders/${order.id}`);
      setSelectedOrder(res.data);
      setNewOrderStatus(res.data.orderStatus);
      setNewPaymentStatus(res.data.paymentStatus);
      setModalOpen(true);
    } catch (err: any) {
      console.error('Failed to load order details', err);
      const msg = err.response?.data?.message || 'Failed to load order details.';
      showToast(msg, 'error');
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    setStatusError(null);

    try {
      await api.patch(`/admin/orders/${selectedOrder.id}/order-status`, {
        orderStatus: newOrderStatus,
      });

      // Update local state and list
      setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newOrderStatus } : null));
      showToast('Order status updated successfully!');
      fetchOrders();
    } catch (err: any) {
      setStatusError(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePaymentStatus = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    setStatusError(null);

    try {
      await api.patch(`/admin/orders/${selectedOrder.id}/payment-status`, {
        paymentStatus: newPaymentStatus,
      });

      setSelectedOrder((prev) => (prev ? { ...prev, paymentStatus: newPaymentStatus } : null));
      showToast('Payment status updated successfully!');
      fetchOrders();
    } catch (err: any) {
      setStatusError(err.response?.data?.message || 'Failed to update payment status');
    } finally {
      setUpdating(false);
    }
  };

  const handleInlineOrderStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await api.patch(`/admin/orders/${orderId}/order-status`, {
        orderStatus: newStatus,
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      showToast(res.data?.message || `Order #${orderId} status updated to ${newStatus}`);
    } catch (err: any) {
      console.error('Failed to update order status', err);
      const msg = err.response?.data?.message || err.message || 'Failed to update order status.';
      showToast(msg, 'error');
      fetchOrders();
    }
  };

  const handleInlinePaymentStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await api.patch(`/admin/orders/${orderId}/payment-status`, {
        paymentStatus: newStatus,
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: newStatus } : o))
      );
      showToast(res.data?.message || `Order #${orderId} payment status updated to ${newStatus}`);
    } catch (err: any) {
      console.error('Failed to update payment status', err);
      const msg = err.response?.data?.message || err.message || 'Failed to update payment status.';
      showToast(msg, 'error');
      fetchOrders();
    }
  };

  const columns: Column<OrderDetail>[] = [
    {
      key: 'id',
      header: 'Order ID',
      render: (row) => <span className="font-bold text-gray-900">#{row.id}</span>,
      sortable: true,
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.customerName}</p>
          <p className="text-xs text-gray-500">{row.customerEmail}</p>
        </div>
      ),
    },
    {
      key: 'itemCount',
      header: 'Items',
      sortable: true,
      render: (row) => <span className="text-xs text-gray-600 font-medium">{row.itemCount} items</span>,
    },
    {
      key: 'totalAmount',
      header: 'Total',
      sortable: true,
      render: (row) => <span className="font-bold text-gray-900">₹{row.totalAmount?.toFixed(2)}</span>,
    },
    {
      key: 'orderStatus',
      header: 'Pickup Status',
      sortable: true,
      render: (row) => {
        if (row.orderStatus === 'COMPLETED' || row.orderStatus === 'CANCELLED') {
          return <AdminStatusBadge status={row.orderStatus} />;
        }
        if (row.orderStatus === 'READY_FOR_PICKUP') {
          return (
            <select
              value={row.orderStatus}
              onChange={(e) => handleInlineOrderStatusChange(row.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-200 bg-white hover:border-[#3FA65C] focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/20 transition-all cursor-pointer shadow-2xs text-gray-800"
            >
              <option value="READY_FOR_PICKUP">Ready for Pickup</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          );
        }
        return (
          <select
            value={row.orderStatus}
            onChange={(e) => handleInlineOrderStatusChange(row.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-200 bg-white hover:border-[#3FA65C] focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/20 transition-all cursor-pointer shadow-2xs text-gray-800"
          >
            <option value="PLACED">Placed</option>
            <option value="READY_FOR_PICKUP">Ready for Pickup</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        );
      },
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      sortable: true,
      render: (row) =>
        row.paymentStatus === 'PAID' ? (
          <AdminStatusBadge status="PAID" />
        ) : (
          <select
            value={row.paymentStatus}
            onChange={(e) => handleInlinePaymentStatusChange(row.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-200 bg-white hover:border-[#3FA65C] focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/20 transition-all cursor-pointer shadow-2xs text-gray-800"
          >
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
          </select>
        ),
    },
    {
      key: 'createdAt',
      header: 'Placed Date',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-gray-500">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openOrderDetail(row)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            title="View order details and edit status"
          >
            <Eye className="w-3.5 h-3.5 text-gray-500" />
            <span>View</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Orders Management (In-Store Pickup)">
      <DataTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        searchPlaceholder="Search by customer name, email, or order ID..."
        searchKey={(row) => `${row.id} ${row.customerName} ${row.customerEmail}`}
        filterLabel="All Pickup Statuses"
        filterOptions={[
          { label: 'Placed', value: 'PLACED' },
          { label: 'Ready for Pickup', value: 'READY_FOR_PICKUP' },
          { label: 'Completed', value: 'COMPLETED' },
          { label: 'Cancelled', value: 'CANCELLED' },
        ]}
        filterKey="orderStatus"
      />

      {/* Order Detail & Pickup Status Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedOrder ? `Order #${selectedOrder.id} Details` : 'Order Details'}
        subtitle="Manage customer order and in-store pickup progress"
        maxWidth="2xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {statusError && (
              <div className="p-3 bg-[#FDEDEC] border border-[#FADBD8] rounded-lg flex items-center gap-2 text-xs text-[#C0392B]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{statusError}</span>
              </div>
            )}

            {/* Top Status & Customer Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Customer Information
                </span>
                <p className="text-sm font-semibold text-gray-900">{selectedOrder.customerName}</p>
                <p className="text-xs text-gray-600">{selectedOrder.customerEmail}</p>
                {selectedOrder.customerPhone && (
                  <p className="text-xs text-gray-600">{selectedOrder.customerPhone}</p>
                )}
              </div>

              <div className="space-y-1 flex flex-col justify-center bg-white p-3 rounded-lg border border-gray-200 text-center shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Pickup Code
                </span>
                <p className="text-base font-black font-mono tracking-widest text-[#3FA65C]">
                  {selectedOrder.pickupCode?.trim() || '—'}
                </p>
              </div>

              <div className="space-y-1 sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Pickup & Order Meta
                </span>
                <p className="text-xs text-gray-600">
                  Placed: {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
                <div className="flex items-center gap-2 sm:justify-end mt-1">
                  <AdminStatusBadge status={selectedOrder.orderStatus} />
                  <AdminStatusBadge status={selectedOrder.paymentStatus} />
                </div>
              </div>
            </div>

            {/* Customer Notes */}
            {selectedOrder.notes && selectedOrder.notes.trim() !== '' && (
              <div className="p-3.5 bg-[#FAF7F0] border border-[#E9E0CE] rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7550] block">
                  Customer Notes
                </span>
                <p className="text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selectedOrder.notes}
                </p>
              </div>
            )}

            {/* Pickup Status Control */}
            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Update Order & Payment Workflow
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pickup Order Status */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">
                    In-Store Pickup Status
                  </label>
                  {selectedOrder.orderStatus === 'COMPLETED' || selectedOrder.orderStatus === 'CANCELLED' ? (
                    <div className="flex items-center gap-2 py-1">
                      <AdminStatusBadge status={selectedOrder.orderStatus} />
                      <span className="text-[11px] text-gray-400 font-medium">Status finalized</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        value={newOrderStatus}
                        onChange={(e) => setNewOrderStatus(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/30"
                      >
                        {selectedOrder.orderStatus === 'PLACED' && (
                          <>
                            <option value="PLACED">Placed (Awaiting Prep)</option>
                            <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                            <option value="CANCELLED">Cancelled</option>
                          </>
                        )}
                        {selectedOrder.orderStatus === 'READY_FOR_PICKUP' && (
                          <>
                            <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                            <option value="COMPLETED">Completed (Picked Up)</option>
                            <option value="CANCELLED">Cancelled</option>
                          </>
                        )}
                      </select>
                      <button
                        onClick={handleUpdateOrderStatus}
                        disabled={updating || newOrderStatus === selectedOrder.orderStatus}
                        className="px-3 py-2 bg-[#3FA65C] hover:bg-[#358E4E] disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
                      >
                        Update
                      </button>
                    </div>
                  )}
                </div>

                {/* Payment Status */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">
                    Payment Status
                  </label>
                  {selectedOrder.paymentStatus === 'PAID' ? (
                    <div className="flex items-center gap-2 py-1">
                      <AdminStatusBadge status="PAID" />
                      <span className="text-[11px] text-gray-400 font-medium">Payment finalized</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        value={newPaymentStatus}
                        onChange={(e) => setNewPaymentStatus(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/30"
                      >
                        <option value="PENDING">Pending (Pay at counter)</option>
                        <option value="PAID">Paid</option>
                        <option value="FAILED">Failed</option>
                      </select>
                      <button
                        onClick={handleUpdatePaymentStatus}
                        disabled={updating || newPaymentStatus === selectedOrder.paymentStatus}
                        className="px-3 py-2 bg-[#3FA65C] hover:bg-[#358E4E] disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
                      >
                        Update
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Order Line Items
              </h4>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-[#F7F7F5] font-semibold text-gray-700 uppercase border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2.5">Item</th>
                      <th className="px-4 py-2.5 text-center">Qty</th>
                      <th className="px-4 py-2.5 text-right">Unit Price</th>
                      <th className="px-4 py-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-gray-900">{item.productName}</p>
                          </td>
                          <td className="px-4 py-3 text-center font-medium text-gray-800">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-600">
                            ₹{item.unitPrice?.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900">
                            ₹{item.subtotal?.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-4 text-center text-gray-400">
                          {selectedOrder.itemCount} items listed
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t border-gray-200">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 font-bold text-gray-900 text-right">
                        Total Amount:
                      </td>
                      <td className="px-4 py-3 font-bold text-[#3FA65C] text-right text-sm">
                        ₹{selectedOrder.totalAmount?.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </AdminLayout>
  );
};
