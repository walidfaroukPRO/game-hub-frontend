import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';
import {
  Search,
  Filter,
  Eye,
  Loader,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const { t, language } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Unauthorized access');
      navigate('/');
      return;
    }
    loadOrders();
  }, [isAdmin]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(order => (order._id === orderId ? { ...order, status: newStatus } : order))
      );
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setUpdating(null);
    }
  };

const handleDeleteOrder = async (orderId) => {
  if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;

  try {
    setUpdating(orderId); // تظهر أيقونة Loader أثناء العملية
    await adminAPI.deleteOrder(orderId);
    setOrders(prev => prev.filter(order => order._id !== orderId));
    toast.success('تم حذف الطلب بنجاح');
  } catch (error) {
    toast.error('فشل حذف الطلب');
  } finally {
    setUpdating(null);
  }
};

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('manageOrders') || 'Manage Orders'}</h1>
        <p className="text-gray-600">{orders.length} {t('ordersTotal') || 'orders total'}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchOrders') || 'Search by Order ID or Customer...'}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">{t('allStatuses') || 'All Statuses'}</option>
              <option value="pending">{t('pending') || 'Pending'}</option>
              <option value="processing">{t('processing') || 'Processing'}</option>
              <option value="shipped">{t('shipped') || 'Shipped'}</option>
              <option value="delivered">{t('delivered') || 'Delivered'}</option>
              <option value="cancelled">{t('cancelled') || 'Cancelled'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold">{t('orderID') || 'Order ID'}</th>
                <th className="text-left py-4 px-6 font-semibold">{t('customer') || 'Customer'}</th>
                <th className="text-left py-4 px-6 font-semibold">{t('date') || 'Date'}</th>
                <th className="text-left py-4 px-6 font-semibold">{t('items') || 'Items'}</th>
                <th className="text-left py-4 px-6 font-semibold">{t('amount') || 'Amount'}</th>
                <th className="text-left py-4 px-6 font-semibold">{t('status') || 'Status'}</th>
                <th className="text-right py-4 px-6 font-semibold">{t('actions') || 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <p className="font-mono text-sm font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold">{order.user?.name || 'N/A'}</p>
                      <p className="text-sm text-gray-600">{order.user?.email}</p>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">{order.items?.length || 0} items</span>
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      {language === 'ar' ? `${order.totalAmount} ج.م` : `EGP ${order.totalAmount}`}
                    </td>
                    <td className="py-4 px-6">
                      {updating === order._id ? (
                        <Loader className="w-5 h-5 animate-spin text-blue-600" />
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(order.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/orders/${order._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title={t('viewDetails') || 'View Details'}
                        >
                          <Eye className="w-5 h-5" />
                        </Link>

                        {deleting === order._id ? (
                          <Loader className="w-5 h-5 animate-spin text-red-600" />
                        ) : (
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title={t('deleteOrder') || 'Delete Order'}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-600">
                    {searchQuery || statusFilter !== 'all'
                      ? t('noOrdersFound') || 'No orders found'
                      : t('noOrders') || 'No orders yet'
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => {
          const count = orders.filter(o => o.status === status).length;
          return (
            <div key={status} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                </div>
                <span className="text-2xl font-bold">{count}</span>
              </div>
              <p className="text-sm text-gray-600 capitalize">{t(status) || status}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
