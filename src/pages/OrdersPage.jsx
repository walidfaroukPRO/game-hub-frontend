import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import { Package, Clock, CheckCircle, XCircle, Truck, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      setOrders(response.data.orders || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Package className="w-24 h-24 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-4">{t('noOrders') || 'No orders yet'}</h2>
        <p className="text-gray-600 mb-6">{t('noOrdersDesc') || 'Start shopping to create your first order'}</p>
        <Link 
          to="/products"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          {t('startShopping') || 'Start Shopping'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('myOrders') || 'My Orders'}</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    {t('orderNumber') || 'Order #'}{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t('placedOn') || 'Placed on'} {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {t(order.status) || order.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('totalAmount') || 'Total Amount'}</p>
                  <p className="text-xl font-bold text-blue-600">
                    {language === 'ar' ? `${order.totalAmount} ج.م` : `EGP ${order.totalAmount}`}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('paymentMethod') || 'Payment Method'}</p>
                  <p className="font-semibold">
                    {order.paymentMethod === 'cash' ? t('cashOnDelivery') || 'Cash on Delivery' : t('creditCard') || 'Credit Card'}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex flex-wrap gap-3">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <img 
                        src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                        alt={language === 'ar' ? item.product?.name : item.product?.nameEn}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span className="text-sm text-gray-600">×{item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded text-sm font-semibold text-gray-600">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Link
                  to={`/orders/${order._id}`}
                  className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  {t('viewDetails') || 'View Details'}
                </Link>

                {order.status === 'pending' && (
                  <button
                    className="px-6 py-2 border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition"
                  >
                    {t('cancelOrder') || 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}