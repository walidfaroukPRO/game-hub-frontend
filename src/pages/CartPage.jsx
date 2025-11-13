import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { cartAPI } from '../services/api';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Loader,
  AlertCircle,
  Tag,
  Truck,
  ArrowRight,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);

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
      setCart(response.data.cart);
    } catch (error) {
      console.error('Load cart error:', error);
      toast.error(language === 'ar' ? 'فشل في تحميل السلة' : 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    try {
      const response = await cartAPI.update(itemId, newQuantity);
      setCart(response.data.cart);
      toast.success(language === 'ar' ? 'تم التحديث' : 'Cart updated');
    } catch (error) {
      console.error('Update quantity error:', error);
      toast.error(error.response?.data?.message || 'Failed to update cart');
      await loadCart(); // Reload to get correct state
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId) => {
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    try {
      const response = await cartAPI.remove(itemId);
      setCart(response.data.cart);
      toast.success(language === 'ar' ? 'تم الإزالة من السلة' : 'Item removed');
    } catch (error) {
      console.error('Remove item error:', error);
      toast.error(language === 'ar' ? 'فشل في الإزالة' : 'Failed to remove item');
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleClearCart = async () => {
    try {
      await cartAPI.clear();
      setCart({ ...cart, items: [] });
      setShowClearConfirm(false);
      toast.success(language === 'ar' ? 'تم تفريغ السلة' : 'Cart cleared');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل في تفريغ السلة' : 'Failed to clear cart');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {language === 'ar' ? 'جارٍ تحميل السلة...' : 'Loading cart...'}
          </p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            {language === 'ar' ? 'السلة فارغة' : 'Your cart is empty'}
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            {language === 'ar' 
              ? 'أضف بعض المنتجات المميزة لتبدأ التسوق'
              : 'Add some amazing products to get started'}
          </p>
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            {language === 'ar' ? 'تسوق الآن' : 'Start Shopping'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => {
    const itemTotal = (item.price || 0) * (item.quantity || 0);
    return sum + itemTotal;
  }, 0);
  
  const shipping = subtotal >= 1000 ? 0 : 50;
  const total = subtotal + shipping;
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
          </h1>
          <p className="text-gray-600">
            {totalItems} {language === 'ar' ? 'منتج' : 'items'}
          </p>
        </div>

        {cart.items.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
          >
            <Trash2 className="w-5 h-5" />
            {language === 'ar' ? 'تفريغ السلة' : 'Clear Cart'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const product = item.product;
            if (!product) return null;

            const itemTotal = (item.price || 0) * (item.quantity || 0);
            const originalPrice = product.price;
            const hasDiscount = product.discount > 0;

            return (
              <div key={item._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="flex gap-4 p-4">
                  {/* Product Image */}
                  <Link 
                    to={`/products/${product._id}`}
                    className="relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden group"
                  >
                    <img 
                      src={product.images?.[0]?.url || '/placeholder.jpg'}
                      alt={language === 'ar' ? product.name : product.nameEn}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => { e.target.src = '/placeholder.jpg' }}
                    />
                    {hasDiscount && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        -{product.discount}%
                      </div>
                    )}
                  </Link>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/products/${product._id}`}
                      className="font-bold text-lg hover:text-blue-600 transition line-clamp-2"
                    >
                      {language === 'ar' ? product.name : product.nameEn}
                    </Link>
                    
                    {/* Price */}
                    <div className="mt-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xl font-bold text-blue-600">
                          {language === 'ar' ? `${item.price} ج.م` : `EGP ${item.price}`}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-gray-500 line-through">
                            {language === 'ar' ? `${originalPrice} ج.م` : `EGP ${originalPrice}`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stock Warning */}
                    {product.stock < 10 && product.stock > 0 && (
                      <div className="flex items-center gap-1 text-orange-600 text-sm mt-2">
                        <AlertCircle className="w-4 h-4" />
                        {language === 'ar' ? `متبقي ${product.stock} فقط` : `Only ${product.stock} left`}
                      </div>
                    )}

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={updating[item._id] || item.quantity <= 1}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-bold min-w-[3rem] text-center">
                          {updating[item._id] ? (
                            <Loader className="w-4 h-4 animate-spin mx-auto" />
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={updating[item._id] || item.quantity >= product.stock}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item._id)}
                        disabled={updating[item._id]}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50 flex items-center gap-1 font-medium transition"
                      >
                        {updating[item._id] ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">
                              {language === 'ar' ? 'إزالة' : 'Remove'}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Item Total - Desktop */}
                  <div className="hidden sm:block text-right">
                    <p className="text-xs text-gray-500 mb-1">
                      {language === 'ar' ? 'المجموع' : 'Total'}
                    </p>
                    <p className="font-bold text-xl text-blue-600">
                      {language === 'ar' 
                        ? `${itemTotal.toFixed(2)} ج.م` 
                        : `EGP ${itemTotal.toFixed(2)}`
                      }
                    </p>
                  </div>
                </div>

                {/* Item Total - Mobile */}
                <div className="sm:hidden border-t px-4 py-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'ar' ? 'المجموع:' : 'Total:'}
                    </span>
                    <span className="font-bold text-lg text-blue-600">
                      {language === 'ar' 
                        ? `${itemTotal.toFixed(2)} ج.م` 
                        : `EGP ${itemTotal.toFixed(2)}`
                      }
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <h2 className="text-2xl font-bold mb-6">
              {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span className="font-semibold">
                  {language === 'ar' ? `${subtotal.toFixed(2)} ج.م` : `EGP ${subtotal.toFixed(2)}`}
                </span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  {language === 'ar' ? 'الشحن' : 'Shipping'}
                </span>
                <span className="font-semibold">
                  {shipping === 0 
                    ? (
                      <span className="text-green-600 font-bold">
                        {language === 'ar' ? 'مجاناً' : 'Free'}
                      </span>
                    )
                    : language === 'ar' ? `${shipping} ج.م` : `EGP ${shipping}`
                  }
                </span>
              </div>

              {/* Free Shipping Progress */}
              {subtotal > 0 && subtotal < 1000 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <Tag className="w-4 h-4 text-blue-600 mt-0.5" />
                    <p className="text-xs text-blue-800">
                      {language === 'ar' 
                        ? `أضف ${(1000 - subtotal).toFixed(2)} ج.م أخرى للحصول على شحن مجاني!`
                        : `Add EGP ${(1000 - subtotal).toFixed(2)} more for free shipping!`
                      }
                    </p>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((subtotal / 1000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {shipping === 0 && subtotal >= 1000 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-green-800 font-semibold">
                    🎉 {language === 'ar' ? 'شحن مجاني!' : 'Free shipping applied!'}
                  </p>
                </div>
              )}
              
              <div className="border-t pt-4 flex justify-between text-xl font-bold">
                <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                <span className="text-blue-600">
                  {language === 'ar' ? `${total.toFixed(2)} ج.م` : `EGP ${total.toFixed(2)}`}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-4 rounded-xl font-bold text-lg hover:shadow-xl transition transform hover:scale-[1.02] mb-3"
            >
              {language === 'ar' ? 'إتمام الطلب' : 'Proceed to Checkout'}
            </Link>

            <Link
              to="/products"
              className="block w-full border-2 border-gray-300 text-gray-700 text-center py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
            </Link>
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold">
                {language === 'ar' ? 'تأكيد التفريغ' : 'Confirm Clear'}
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              {language === 'ar' 
                ? 'هل أنت متأكد من تفريغ السلة؟ سيتم حذف جميع المنتجات.'
                : 'Are you sure you want to clear your cart? All items will be removed.'}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleClearCart}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                {language === 'ar' ? 'تفريغ' : 'Clear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}