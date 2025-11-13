import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { productsAPI, cartAPI, wishlistAPI } from '../services/api';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Minus, 
  Plus, 
  Loader, 
  Package, 
  Truck, 
  Shield,
  Check,
  Share2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    loadProduct();
    if (isAuthenticated) {
      checkWishlist();
    }
  }, [id, isAuthenticated]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Load product error:', error);
      toast.error(language === 'ar' ? 'فشل في تحميل المنتج' : 'Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    try {
      const response = await wishlistAPI.get();
      const wishlistIds = response.data.wishlist.map(item => 
        typeof item === 'string' ? item : item._id
      );
      setInWishlist(wishlistIds.includes(id));
    } catch (error) {
      console.error('Check wishlist error:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
      navigate('/login');
      return;
    }
    
    setAddingToCart(true);
    try {
      await cartAPI.add(product._id, quantity);
      toast.success(language === 'ar' ? 'تم الإضافة للسلة' : 'Added to cart!');
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
      navigate('/login');
      return;
    }
    
    setAddingToWishlist(true);
    try {
      if (inWishlist) {
        await wishlistAPI.remove(product._id);
        toast.success(language === 'ar' ? 'تم الإزالة من المفضلة' : 'Removed from wishlist');
        setInWishlist(false);
      } else {
        await wishlistAPI.add(product._id);
        toast.success(language === 'ar' ? 'تم الإضافة للمفضلة' : 'Added to wishlist');
        setInWishlist(true);
      }
    } catch (error) {
      console.error('Toggle wishlist error:', error);
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setAddingToWishlist(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: language === 'ar' ? product.name : product.nameEn,
          text: language === 'ar' ? product.description : product.descriptionEn,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(language === 'ar' ? 'تم نسخ الرابط' : 'Link copied!');
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleImageChange = (direction) => {
    if (direction === 'prev') {
      setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1);
    } else {
      setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">{language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <Package className="w-20 h-20 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 text-xl mb-4">
          {language === 'ar' ? 'المنتج غير موجود' : 'Product not found'}
        </p>
        <Link 
          to="/products"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          {language === 'ar' ? 'العودة للمنتجات' : 'Back to Products'}
        </Link>
      </div>
    );
  }

  const price = product.price;
  const finalPrice = product.discount > 0 
    ? price - (price * product.discount / 100) 
    : price;
  const displayPrice = language === 'ar' 
    ? `${Math.round(finalPrice)} ج.م` 
    : `EGP ${Math.round(finalPrice)}`;
  const originalPrice = language === 'ar' 
    ? `${Math.round(price)} ج.م` 
    : `EGP ${Math.round(price)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm">
        <Link to="/" className="text-gray-600 hover:text-blue-600">
          {language === 'ar' ? 'الرئيسية' : 'Home'}
        </Link>
        <span className="text-gray-400">/</span>
        <Link to="/products" className="text-gray-600 hover:text-blue-600">
          {language === 'ar' ? 'المنتجات' : 'Products'}
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium truncate">
          {language === 'ar' ? product.name : product.nameEn}
        </span>
      </nav>

      {/* Product Content */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
          {/* Images Section */}
          <div>
            {/* Main Image */}
            <div className="relative mb-4 bg-gray-50 rounded-xl overflow-hidden group">
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-lg">
                    -{product.discount}%
                  </span>
                </div>
              )}

              {product.stock < 10 && product.stock > 0 && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-lg">
                    {language === 'ar' ? `متبقي ${product.stock} فقط!` : `Only ${product.stock} left!`}
                  </span>
                </div>
              )}

              <img
                src={product.images?.[selectedImage]?.url || '/placeholder.jpg'}
                alt={language === 'ar' ? product.name : product.nameEn}
                className="w-full h-96 lg:h-[500px] object-cover"
              />

              {/* Image Navigation Arrows */}
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageChange('prev')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleImageChange('next')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden hover:border-blue-500 transition ${
                      selectedImage === index ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${language === 'ar' ? 'صورة' : 'Image'} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div>
            {/* Category & Stock Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                {product.category}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                product.stock > 10 ? 'bg-green-100 text-green-800' :
                product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {product.stock > 0 
                  ? `${product.stock} ${language === 'ar' ? 'متوفر' : 'In Stock'}`
                  : (language === 'ar' ? 'غير متوفر' : 'Out of Stock')}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              {language === 'ar' ? product.name : product.nameEn}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating?.average || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-lg">
                {(product.rating?.average || 0).toFixed(1)}
              </span>
              <span className="text-gray-500">
                ({product.rating?.count || 0} {language === 'ar' ? 'تقييم' : 'reviews'})
              </span>
            </div>

            {/* Price */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl font-bold text-blue-600">{displayPrice}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">{originalPrice}</span>
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-bold">
                      {language === 'ar' ? 'وفر' : 'Save'} {Math.round(price * product.discount / 100)} {language === 'ar' ? 'ج.م' : 'EGP'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">
                {language === 'ar' ? 'الوصف' : 'Description'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {language === 'ar' ? product.description : product.descriptionEn}
              </p>
            </div>

            {/* Product Details */}
            {(product.platform || product.genre?.length > 0 || product.publisher) && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-lg mb-3">
                  {language === 'ar' ? 'تفاصيل المنتج' : 'Product Details'}
                </h3>
                <div className="space-y-2">
                  {product.platform && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">
                        {language === 'ar' ? 'المنصة:' : 'Platform:'}
                      </span>
                      <span className="text-gray-900">{product.platform}</span>
                    </div>
                  )}
                  {product.genre?.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-600 font-medium">
                        {language === 'ar' ? 'النوع:' : 'Genre:'}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {product.genre.map((g, i) => (
                          <span key={i} className="px-2 py-1 bg-white rounded-lg text-sm">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.publisher && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">
                        {language === 'ar' ? 'الناشر:' : 'Publisher:'}
                      </span>
                      <span className="text-gray-900">{product.publisher}</span>
                    </div>
                  )}
                  {product.developer && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">
                        {language === 'ar' ? 'المطور:' : 'Developer:'}
                      </span>
                      <span className="text-gray-900">{product.developer}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block font-semibold mb-3 text-lg">
                {language === 'ar' ? 'الكمية' : 'Quantity'}
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 font-bold text-xl min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {quantity === product.stock && (
                  <span className="text-sm text-orange-600 font-semibold">
                    {language === 'ar' ? 'الحد الأقصى' : 'Maximum quantity'}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {addingToCart ? (
                  <Loader className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                  </>
                )}
              </button>

              <button
                onClick={handleToggleWishlist}
                disabled={addingToWishlist}
                className={`p-4 border-2 rounded-xl transition shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  inWishlist
                    ? 'bg-red-50 border-red-500'
                    : 'border-gray-300 hover:border-red-500 hover:bg-red-50'
                }`}
              >
                {addingToWishlist ? (
                  <Loader className="w-6 h-6 animate-spin" />
                ) : (
                  <Heart 
                    className={`w-6 h-6 ${
                      inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`}
                  />
                )}
              </button>

              <button
                onClick={handleShare}
                className="p-4 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <div className="text-center p-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  {language === 'ar' ? 'شحن مجاني' : 'Free Shipping'}
                </p>
                <p className="text-xs text-gray-600">
                  {language === 'ar' ? 'للطلبات أكثر من 1000 ج.م' : 'Orders over EGP 1000'}
                </p>
              </div>

              <div className="text-center p-3 border-x border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  {language === 'ar' ? 'توصيل سريع' : 'Fast Delivery'}
                </p>
                <p className="text-xs text-gray-600">
                  {language === 'ar' ? 'خلال 2-3 أيام' : 'Within 2-3 days'}
                </p>
              </div>

              <div className="text-center p-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  {language === 'ar' ? 'ضمان الإرجاع' : 'Return Policy'}
                </p>
                <p className="text-xs text-gray-600">
                  {language === 'ar' ? '14 يوم' : '14 days'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}