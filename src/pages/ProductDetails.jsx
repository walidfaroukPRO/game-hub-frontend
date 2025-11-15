import { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Share2, 
  Minus, 
  Plus, 
  Check, 
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  Award,
  Package,
  Clock,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  ZoomIn,
  X,
  ChevronDown,
  Info,
  TrendingUp,
  Users,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function ProductDetails({ product, onAddToCart, onAddToWishlist, relatedProducts = [] }) {
  const { language } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const imageRef = useRef(null);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product._id, quantity);
    toast.success(language === 'ar' ? 'تم الإضافة للسلة' : 'Added to cart!');
  };

  const handleAddToWishlist = () => {
    onAddToWishlist(product._id);
    setInWishlist(!inWishlist);
    toast.success(inWishlist 
      ? (language === 'ar' ? 'تم الإزالة من المفضلة' : 'Removed from wishlist')
      : (language === 'ar' ? 'تم الإضافة للمفضلة' : 'Added to wishlist')
    );
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
      toast.success(language === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard!');
    }
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (userRating === 0) {
      toast.error(language === 'ar' ? 'الرجاء اختيار تقييم' : 'Please select a rating');
      return;
    }
    // Here you would call your API to submit the review
    toast.success(language === 'ar' ? 'تم إضافة تقييمك' : 'Review submitted!');
    setUserRating(0);
    setReviewText('');
  };

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

  const tabs = [
    { id: 'description', label: language === 'ar' ? 'الوصف' : 'Description', icon: Info },
    { id: 'specifications', label: language === 'ar' ? 'المواصفات' : 'Specifications', icon: Package },
    { id: 'reviews', label: language === 'ar' ? 'التقييمات' : 'Reviews', icon: Star },
    { id: 'faq', label: language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ', icon: MessageCircle },
  ];

  const faqs = [
    {
      q: language === 'ar' ? 'ما هي مدة التوصيل؟' : 'What is the delivery time?',
      a: language === 'ar' ? 'يتم التوصيل خلال 2-3 أيام عمل في القاهرة والجيزة، و4-5 أيام للمحافظات الأخرى.' : 'Delivery takes 2-3 business days in Cairo and Giza, and 4-5 days for other governorates.'
    },
    {
      q: language === 'ar' ? 'هل يمكن استرجاع المنتج؟' : 'Can I return the product?',
      a: language === 'ar' ? 'نعم، يمكن الاسترجاع خلال 14 يوم من تاريخ الاستلام بشرط أن يكون المنتج في حالته الأصلية.' : 'Yes, you can return within 14 days of receipt, provided the product is in its original condition.'
    },
    {
      q: language === 'ar' ? 'هل المنتج أصلي؟' : 'Is the product original?',
      a: language === 'ar' ? 'جميع منتجاتنا أصلية 100% ومستوردة من الموزع الرسمي.' : 'All our products are 100% original and imported from official distributors.'
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link to="/products" className="text-gray-600 hover:text-blue-600 transition">
            {language === 'ar' ? 'المنتجات' : 'Products'}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold line-clamp-1">
            {language === 'ar' ? product.name : product.nameEn}
          </span>
        </nav>

        {/* Main Product Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Images Section */}
            <div>
              {/* Main Image with Zoom */}
              <div 
                ref={imageRef}
                className="relative mb-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl overflow-hidden group cursor-zoom-in"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}
                onClick={() => setShowZoom(!showZoom)}
              >
                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {product.discount > 0 && (
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl text-lg font-bold shadow-lg">
                      -{product.discount}%
                    </div>
                  )}
                  {product.isFeatured && (
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {language === 'ar' ? 'مميز' : 'Featured'}
                    </div>
                  )}
                  {product.isNew && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                      {language === 'ar' ? 'جديد' : 'New'}
                    </div>
                  )}
                </div>

                {/* Stock Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${
                    product.stock > 10 ? 'bg-green-500 text-white' :
                    product.stock > 0 ? 'bg-yellow-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {product.stock > 0 
                      ? `${product.stock} ${language === 'ar' ? 'متوفر' : 'in stock'}` 
                      : (language === 'ar' ? 'نفذت الكمية' : 'Out of stock')
                    }
                  </span>
                </div>
                
                <img
                  src={product.images?.[selectedImage]?.url || '/placeholder.jpg'}
                  alt={language === 'ar' ? product.name : product.nameEn}
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                  style={showZoom ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    transform: 'scale(2)'
                  } : {}}
                />

                {/* Zoom Icon */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg opacity-0 group-hover:opacity-100 transition">
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.images?.length > 1 && (
                <div className="relative">
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 border-3 rounded-xl overflow-hidden transition-all duration-300 ${
                          selectedImage === index 
                            ? 'border-blue-600 shadow-lg scale-105' 
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-20 h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Proof */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
                  <Eye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">1.2K+</p>
                  <p className="text-xs text-gray-600">{language === 'ar' ? 'مشاهدة' : 'Views'}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
                  <ShoppingCart className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">350+</p>
                  <p className="text-xs text-gray-600">{language === 'ar' ? 'مبيعات' : 'Sold'}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
                  <Heart className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">89</p>
                  <p className="text-xs text-gray-600">{language === 'ar' ? 'إعجاب' : 'Likes'}</p>
                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div>
              {/* Category */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-bold">
                  {product.category}
                </span>
                {product.brand && (
                  <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                    {product.brand}
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
                {language === 'ar' ? product.name : product.nameEn}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(product.rating?.average || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-xl text-gray-900">
                  {product.rating?.average?.toFixed(1) || '0.0'}
                </span>
                <span className="text-gray-500">
                  ({product.rating?.count || 0} {language === 'ar' ? 'تقييم' : 'reviews'})
                </span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {displayPrice}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-2xl text-gray-500 line-through">{originalPrice}</span>
                      <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-bold">
                        {language === 'ar' ? 'وفر' : 'Save'} {Math.round(price * product.discount / 100)} {language === 'ar' ? 'ج.م' : 'EGP'}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {language === 'ar' ? 'شامل ضريبة القيمة المضافة' : 'VAT included'}
                </p>
              </div>

              {/* Key Features - Quick View */}
              {product.features && product.features.length > 0 && (
                <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    {language === 'ar' ? 'المميزات الرئيسية' : 'Key Features'}
                  </h3>
                  <ul className="space-y-2">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block font-bold text-lg mb-3">
                  {language === 'ar' ? 'الكمية' : 'Quantity'}
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-4 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-8 font-bold text-xl">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="p-4 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {quantity === product.stock && (
                    <span className="text-sm text-orange-600 font-semibold flex items-center gap-1">
                      <Info className="w-4 h-4" />
                      {language === 'ar' ? 'الحد الأقصى المتاح' : 'Maximum available'}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-95"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleAddToWishlist}
                  className={`p-5 border-2 rounded-2xl transition shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ${
                    inWishlist
                      ? 'bg-red-50 border-red-500'
                      : 'border-gray-300 hover:border-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-5 border-2 border-gray-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <Share2 className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl">
                <div className="text-center">
                  <div className="bg-white p-3 rounded-xl inline-block mb-2 shadow-md">
                    <Truck className="w-6 h-6 text-blue-600 mx-auto" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    {language === 'ar' ? 'توصيل مجاني' : 'Free Shipping'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {language === 'ar' ? 'للطلبات فوق 1000 ج.م' : 'Orders over 1000 EGP'}
                  </p>
                </div>
                <div className="text-center border-x border-gray-200">
                  <div className="bg-white p-3 rounded-xl inline-block mb-2 shadow-md">
                    <Shield className="w-6 h-6 text-green-600 mx-auto" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    {language === 'ar' ? 'ضمان الجودة' : 'Quality Guarantee'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {language === 'ar' ? '100% أصلي' : '100% Original'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-white p-3 rounded-xl inline-block mb-2 shadow-md">
                    <RotateCcw className="w-6 h-6 text-purple-600 mx-auto" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    {language === 'ar' ? 'سياسة الاسترجاع' : 'Return Policy'}
                  </p>
                  <p className="text-xs text-gray-500">
                    14 {language === 'ar' ? 'يوم' : 'days'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-gray-100">
          {/* Tabs Header */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-8 py-5 font-semibold transition relative ${
                    activeTab === tab.id
                      ? 'text-blue-600 bg-white'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs Content */}
          <div className="p-8">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    {language === 'ar' ? 'وصف المنتج' : 'Product Description'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {language === 'ar' ? product.description : product.descriptionEn}
                  </p>
                </div>

                {product.features && product.features.length > 0 && (
                  <div className="pt-6 border-t">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Award className="w-6 h-6 text-blue-600" />
                      {language === 'ar' ? 'المميزات' : 'Features'}
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                          <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div className="animate-fadeIn">
                <h3 className="text-2xl font-bold mb-6">
                  {language === 'ar' ? 'المواصفات التقنية' : 'Technical Specifications'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">{language === 'ar' ? 'الفئة' : 'Category'}</p>
                    <p className="font-bold text-lg">{product.category}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">{language === 'ar' ? 'الحالة' : 'Condition'}</p>
                    <p className="font-bold text-lg">{language === 'ar' ? 'جديد' : 'New'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">{language === 'ar' ? 'الوزن' : 'Weight'}</p>
                    <p className="font-bold text-lg">500g</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">{language === 'ar' ? 'الأبعاد' : 'Dimensions'}</p>
                    <p className="font-bold text-lg">20 x 15 x 5 cm</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Reviews Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-yellow-600 mb-2">
                      {product.rating?.average?.toFixed(1) || '0.0'}
                    </div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${
                            i < Math.floor(product.rating?.average || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">
                      {product.rating?.count || 0} {language === 'ar' ? 'تقييم' : 'reviews'}
                    </p>
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="text-sm font-semibold w-8">{stars}★</span>
                        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                            style={{ width: `${Math.random() * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {Math.floor(Math.random() * 50)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Review Form */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                  <h3 className="text-xl font-bold mb-4">
                    {language === 'ar' ? 'أضف تقييمك' : 'Add Your Review'}
                  </h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block font-semibold mb-2">
                        {language === 'ar' ? 'تقييمك' : 'Your Rating'}
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserRating(star)}
                            className="transition transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= userRating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block font-semibold mb-2">
                        {language === 'ar' ? 'تعليقك' : 'Your Review'}
                      </label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows="4"
                        placeholder={language === 'ar' ? 'اكتب تقييمك هنا...' : 'Write your review here...'}
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transition"
                    >
                      {language === 'ar' ? 'إرسال التقييم' : 'Submit Review'}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold mb-4">
                    {language === 'ar' ? 'آراء العملاء' : 'Customer Reviews'}
                  </h3>
                  {/* Sample Review */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 border-2 border-gray-100 rounded-2xl hover:border-blue-200 transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {String.fromCharCode(65 + i)}
                          </div>
                          <div>
                            <p className="font-bold">User {i}</p>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, j) => (
                                <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">2 {language === 'ar' ? 'أيام مضت' : 'days ago'}</p>
                      </div>
                      <p className="text-gray-700 mb-4">
                        {language === 'ar' 
                          ? 'منتج ممتاز وجودة عالية. أنصح بشدة بالشراء!'
                          : 'Excellent product and high quality. Highly recommend!'}
                      </p>
                      <div className="flex gap-4">
                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{language === 'ar' ? 'مفيد' : 'Helpful'} (12)</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition">
                          <ThumbsDown className="w-4 h-4" />
                          <span>(0)</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-2xl font-bold mb-6">
                  {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
                </h3>
                {faqs.map((faq, index) => (
                  <div key={index} className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-blue-200 transition">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition"
                    >
                      <span className="font-bold text-lg pr-4">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${expandedFAQ === index ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedFAQ === index && (
                      <div className="px-6 pb-6 text-gray-700 leading-relaxed animate-fadeIn">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {language === 'ar' ? 'منتجات ذات صلة' : 'Related Products'}
              </h2>
              <Link 
                to="/products" 
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
              >
                {language === 'ar' ? 'عرض الكل' : 'View All'}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/products/${relatedProduct._id}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-2"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={relatedProduct.images?.[0]?.url || '/placeholder.jpg'}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {relatedProduct.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                        -{relatedProduct.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                      {language === 'ar' ? relatedProduct.name : relatedProduct.nameEn}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-blue-600">
                        {language === 'ar' ? `${relatedProduct.price} ج.م` : `EGP ${relatedProduct.price}`}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{(relatedProduct.rating?.average || 0).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {showZoom && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowZoom(false)}>
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowZoom(false)}
              className="absolute -top-12 right-0 bg-white rounded-full p-2 hover:bg-gray-100 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={product.images?.[selectedImage]?.url || '/placeholder.jpg'}
              alt={product.name}
              className="w-full rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}