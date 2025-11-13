import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import { Package, MapPin, CreditCard, Truck, CheckCircle, Clock, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadOrder();
  }, [id, isAuthenticated]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getById(id);
      setOrder(response.data.order);
    } catch (error) {
      toast.error('Failed to load order');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm(t('confirmCancelOrder') || 'Are you sure you want to cancel this order?')) {
      return;
    }

    setCancelling(true);
    try {
      await ordersAPI.cancel(id);
      toast.success('Order cancelled successfully');
      loadOrder();
    } catch (error) {
      toast.error('Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', label: t('pending') || 'Pending', icon: Clock },
      { key: 'processing', label: t('processing') || 'Processing', icon: Package },
      { key: 'shipped', label: t('shipped') || 'Shipped', icon: Truck },
      { key: 'delivered', label: t('delivered') || 'Delivered', icon: CheckCircle }
    ];

    const currentIndex = steps.findIndex(step => step.key === order?.status);
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">{t('orderNotFound') || 'Order not found'}</p>
      </div>
    );
  }

  const statusSteps = getStatusSteps();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('orderDetails') || 'Order Details'}
        </h1>
        <p className="text-gray-600">
          {t('orderNumber') || 'Order #'}{order._id.slice(-8).toUpperCase()} - {formatDate(order.createdAt)}
        </p>
      </div>

      {/* Order Status Timeline */}
      {order.status !== 'cancelled' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-6">{t('orderStatus') || 'Order Status'}</h2>
          
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className={`mt-2 text-sm font-semibold ${
                      step.completed ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                  
                  {index < statusSteps.length - 1 && (
                    <div className={`flex-1 h-1 ${
                      step.completed ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {order.status === 'cancelled' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-semibold">
            {t('orderCancelled') || 'This order has been cancelled'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">{t('orderItems') || 'Order Items'}</h2>
            
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <img 
                    src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                    alt={language === 'ar' ? item.product?.name : item.product?.nameEn}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <Link 
                      to={`/products/${item.product?._id}`}
                      className="font-bold hover:text-blue-600 transition"
                    >
                      {language === 'ar' ? item.product?.name : item.product?.nameEn}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('quantity') || 'Quantity'}: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t('price') || 'Price'}: {language === 'ar' ? `${item.price} ج.م` : `EGP ${item.price}`}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg text-blue-600">
                      {language === 'ar' 
                        ? `${item.price * item.quantity} ج.م` 
                        : `EGP ${item.price * item.quantity}`
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold">{t('shippingAddress') || 'Shipping Address'}</h2>
            </div>
            
            <div className="text-gray-600">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-2">
                <strong>{t('phone') || 'Phone'}:</strong> {order.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">{t('orderSummary') || 'Order Summary'}</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('subtotal') || 'Subtotal'}</span>
                <span className="font-semibold">
                  {language === 'ar' ? `${order.totalAmount} ج.م` : `EGP ${order.totalAmount}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">{t('shipping') || 'Shipping'}</span>
                <span className="font-semibold">{t('free') || 'Free'}</span>
              </div>

              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>{t('total') || 'Total'}</span>
                <span className="text-blue-600">
                  {language === 'ar' ? `${order.totalAmount} ج.م` : `EGP ${order.totalAmount}`}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold">{t('paymentMethod') || 'Payment Method'}</h2>
            </div>
            
            <p className="text-gray-600">
              {order.paymentMethod === 'cash' 
                ? t('cashOnDelivery') || 'Cash on Delivery'
                : t('creditCard') || 'Credit Card'
              }
            </p>

            <p className="text-sm text-gray-500 mt-2">
              {t('paymentStatus') || 'Payment Status'}: {' '}
              <span className={`font-semibold ${
                order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {t(order.paymentStatus) || order.paymentStatus}
              </span>
            </p>
          </div>

          {/* Actions */}
          {order.status === 'pending' && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {cancelling && <Loader className="w-5 h-5 animate-spin" />}
              {t('cancelOrder') || 'Cancel Order'}
            </button>
          )}

          <Link
            to="/orders"
            className="block w-full border-2 border-gray-300 text-gray-700 text-center py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            {t('backToOrders') || 'Back to Orders'}
          </Link>
        </div>
      </div>
    </div>
  );
}