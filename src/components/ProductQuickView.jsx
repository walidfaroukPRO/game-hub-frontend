// src/components/ProductQuickView.jsx
import { useState } from 'react';
import { X, Star, ShoppingCart, Heart, Minus, Plus, Share2, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

export default function ProductQuickView({ product, onClose, onAddToCart, onAddToWishlist, inWishlist }) {
  const { language } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
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

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold">
            {language === 'ar' ? 'عرض سريع' : 'Quick View'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="relative mb-4 bg-gray-100 rounded-xl overflow-hidden aspect-square">
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold z-10">
                  -{product.discount}%
                </div>
              )}
              <img
                src={product.images?.[selectedImage]?.url || '/placeholder.jpg'}
                alt={language === 'ar' ? product.name : product.nameEn}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden hover:border-blue-500 transition ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category & Stock */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                {product.category}
              </span>
              <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                product.stock > 10 ? 'bg-green-100 text-green-700' :
                product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {product.stock > 0 
                  ? `${product.stock} ${language === 'ar' ? 'متوفر' : 'in stock'}` 
                  : language === 'ar' ? 'نفذت الكمية' : 'Out of stock'
                }
              </span>
            </div>

            {/* Name */}
            <h3 className="text-2xl font-bold mb-3">
              {language === 'ar' ? product.name : product.nameEn}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
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
              <span className="font-semibold">{(product.rating?.average || 0).toFixed(1)}</span>
              <span className="text-gray-500 text-sm">({product.rating?.count || 0})</span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-blue-600">{displayPrice}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-lg text-gray-500 line-through">{originalPrice}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold">
                      {language === 'ar' ? 'وفر' : 'Save'} {Math.round(price - finalPrice)} {language === 'ar' ? 'ج.م' : 'EGP'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
              {language === 'ar' ? product.description : product.descriptionEn}
            </p>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">
                {language === 'ar' ? 'الكمية' : 'Quantity'}
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 transition"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 font-bold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => {
                  onAddToCart(product._id, quantity);
                  onClose();
                }}
                disabled={product.stock === 0}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
              </button>

              <button
                onClick={() => onAddToWishlist(product._id)}
                className={`p-3 border-2 rounded-xl transition ${
                  inWishlist
                    ? 'bg-red-50 border-red-500'
                    : 'border-gray-300 hover:border-red-500'
                }`}
              >
                <Heart className={`w-6 h-6 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* View Full Details */}
            <Link
              to={`/products/${product._id}`}
              onClick={onClose}
              className="block text-center py-3 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition font-semibold flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              {language === 'ar' ? 'عرض التفاصيل الكاملة' : 'View Full Details'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}