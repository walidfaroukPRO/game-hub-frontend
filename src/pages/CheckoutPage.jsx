import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { cartAPI, ordersAPI } from '../services/api';
import { CreditCard, Banknote, MapPin, Phone, Mail, Loader, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Egypt'
    },
    phone: user?.phone || '',
    email: user?.email || '',
    paymentMethod: 'cod',
    notes: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
      navigate('/login');
      return;
    }
    loadCart();
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      
      if (!response.data.cart?.items?.length) {
        toast.error(language === 'ar' ? 'السلة فارغة' : 'Your cart is empty');
        navigate('/cart');
        return;
      }
      
      setCart(response.data.cart);
    } catch (error) {
      console.error('Load cart error:', error);
      toast.error(language === 'ar' ? 'فشل في تحميل السلة' : 'Failed to load cart');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.shippingAddress.street || !formData.shippingAddress.city) {
      toast.error(language === 'ar' ? 'يرجى إدخال عنوان الشحن كاملاً' : 'Please enter complete shipping address');
      return;
    }

    if (!formData.phone) {
      toast.error(language === 'ar' ? 'يرجى إدخال رقم الهاتف' : 'Please enter phone number');
      return;
    }

    if (!formData.email) {
      toast.error(language === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter email');
      return;
    }

    setSubmitting(true);
    try {
      // Prepare order data
      const orderData = {
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress: {
          street: formData.shippingAddress.street,
          city: formData.shippingAddress.city,
          state: formData.shippingAddress.state || '',
          zipCode: formData.shippingAddress.zipCode || '',
          country: 'Egypt'
        },
        phone: formData.phone,
        email: formData.email,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || ''
      };

     // console.log('📦 Submitting order:', orderData);

      const response = await ordersAPI.create(orderData);
      
     //onsole.log('✅ Order created:', response.data);//
      
      toast.success(language === 'ar' ? 'تم إنشاء الطلب بنجاح!' : 'Order placed successfully!');
      navigate(`/orders/${response.data.order._id}`);
    } catch (error) {
      console.error('❌ Order creation error:', error);
      const message = error.response?.data?.message || 
        (language === 'ar' ? 'حدث خطأ في إنشاء الطلب' : 'Failed to place order');
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-xl text-gray-600 mb-4">
          {language === 'ar' ? 'السلة فارغة' : 'Your cart is empty'}
        </p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
        </button>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 1000 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {language === 'ar' ? 'إتمام الطلب' : 'Checkout'}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold">
                  {language === 'ar' ? 'عنوان الشحن' : 'Shipping Address'}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'عنوان الشارع' : 'Street Address'} *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.shippingAddress.street}
                    onChange={(e) => setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress, street: e.target.value }
                    })}
                    placeholder={language === 'ar' ? 'مثال: 123 شارع النصر' : 'e.g., 123 Main St'}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'ar' ? 'المدينة' : 'City'} *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.shippingAddress.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        shippingAddress: { ...formData.shippingAddress, city: e.target.value }
                      })}
                      placeholder={language === 'ar' ? 'مثال: القاهرة' : 'e.g., Cairo'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'ar' ? 'المحافظة' : 'State'}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.shippingAddress.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        shippingAddress: { ...formData.shippingAddress, state: e.target.value }
                      })}
                      placeholder={language === 'ar' ? 'اختياري' : 'Optional'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'ar' ? 'الرمز البريدي' : 'Zip Code'}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.shippingAddress.zipCode}
                      onChange={(e) => setFormData({
                        ...formData,
                        shippingAddress: { ...formData.shippingAddress, zipCode: e.target.value }
                      })}
                      placeholder={language === 'ar' ? 'اختياري' : 'Optional'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'ar' ? 'الدولة' : 'Country'}
                    </label>
                    <input
                      type="text"
                      value="Egypt"
                      disabled
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">
                {language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Phone className="inline w-4 h-4 mr-1" />
                    {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+20 123 456 7890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Mail className="inline w-4 h-4 mr-1" />
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'ملاحظات (اختياري)' : 'Notes (Optional)'}
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={language === 'ar' ? 'أي ملاحظات أو تعليمات خاصة...' : 'Any special notes or instructions...'}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">
                {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-blue-500 bg-blue-50 rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-4 h-4"
                  />
                  <Banknote className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <span className="font-medium">
                      {language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                    </span>
                    <p className="text-xs text-gray-600">
                      {language === 'ar' ? 'ادفع نقداً عند استلام الطلب' : 'Pay cash when you receive your order'}
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-not-allowed opacity-50 bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    disabled
                    className="w-4 h-4"
                  />
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <span className="font-medium">
                      {language === 'ar' ? 'الدفع الإلكتروني' : 'Online Payment'}
                    </span>
                    <span className="text-xs ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      {language === 'ar' ? 'قريباً' : 'Coming Soon'}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">
                {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <img 
                      src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                      alt={language === 'ar' ? item.product?.name : item.product?.nameEn}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => { e.target.src = '/placeholder.jpg' }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm line-clamp-1">
                        {language === 'ar' ? item.product?.name : item.product?.nameEn}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × {language === 'ar' ? `${item.price} ج.م` : `EGP ${item.price}`}
                      </p>
                      <p className="text-sm font-semibold text-blue-600">
                        {language === 'ar' 
                          ? `${(item.price * item.quantity).toFixed(2)} ج.م` 
                          : `EGP ${(item.price * item.quantity).toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}
                  </span>
                  <span className="font-semibold">
                    {language === 'ar' ? `${subtotal.toFixed(2)} ج.م` : `EGP ${subtotal.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'ar' ? 'الشحن' : 'Shipping'}
                  </span>
                  <span className="font-semibold">
                    {shipping === 0 
                      ? (language === 'ar' ? 'مجاناً' : 'Free')
                      : language === 'ar' ? `${shipping} ج.م` : `EGP ${shipping}`}
                  </span>
                </div>

                {shipping === 0 && (
                  <p className="text-xs text-green-600">
                    {language === 'ar' 
                      ? '🎉 شحن مجاني للطلبات أكثر من 1000 ج.م' 
                      : '🎉 Free shipping on orders over EGP 1000'}
                  </p>
                )}

                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                  <span className="text-blue-600">
                    {language === 'ar' ? `${total.toFixed(2)} ج.م` : `EGP ${total.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2 transition shadow-lg hover:shadow-xl"
              >
                {submitting && <Loader className="w-5 h-5 animate-spin" />}
                {submitting 
                  ? (language === 'ar' ? 'جارٍ إنشاء الطلب...' : 'Placing Order...')
                  : (language === 'ar' ? 'تأكيد الطلب' : 'Place Order')}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                {language === 'ar' 
                  ? 'بالنقر على "تأكيد الطلب"، فإنك توافق على الشروط والأحكام'
                  : 'By clicking "Place Order", you agree to our terms and conditions'}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}