import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Star, Heart, ShoppingCart, Share2, Minus, Plus, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetails({ product, onAddToCart, onAddToWishlist }) {
  const { language, t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product._id, quantity);
    toast.success(t('addedToCart') || 'Added to cart!');
  };

  const handleAddToWishlist = () => {
    onAddToWishlist(product._id);
    setInWishlist(!inWishlist);
    toast.success(inWishlist ? t('removedFromWishlist') : t('addedToWishlist'));
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
      toast.success(t('linkCopied') || 'Link copied to clipboard!');
    }
  };

  const price = language === 'ar' ? `${product.price} ج.م` : `EGP ${product.price}`;
  const finalPrice = product.discount > 0 
    ? product.price - (product.price * product.discount / 100) 
    : product.price;
  const displayPrice = language === 'ar' 
    ? `${Math.round(finalPrice)} ج.م` 
    : `EGP ${Math.round(finalPrice)}`;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
        {/* Images Section */}
        <div>
          {/* Main Image */}
          <div className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden">
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg text-lg font-bold z-10 shadow-lg">
                -{product.discount}%
              </span>
            )}
            
            <img
              src={product.images?.[selectedImage]?.url || '/placeholder.jpg'}
              alt={language === 'ar' ? product.name : product.nameEn}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Thumbnail Images */}
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
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div>
          {/* Category & Stock */}
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {product.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              product.stock > 10 ? 'bg-green-100 text-green-800' :
              product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} ${t('inStock')}` : t('outOfStock')}
            </span>
          </div>

          {/* Product Name */}
          <h1 className="text-3xl font-bold mb-4">
            {language === 'ar' ? product.name : product.nameEn}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center">
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
              {product.rating?.average?.toFixed(1) || '0.0'}
            </span>
            <span className="text-gray-500">
              ({product.rating?.count || 0} {t('reviews')})
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-blue-600">{displayPrice}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-xl text-gray-500 line-through">{price}</span>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-bold">
                    {t('save')} {Math.round(product.price * product.discount / 100)} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-2">{t('description')}</h3>
            <p className="text-gray-600 leading-relaxed">
              {language === 'ar' ? product.description : product.descriptionEn}
            </p>
          </div>

          {/* Features */}
          {product.features && (
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">{t('features') || 'Features'}</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block font-semibold mb-3">{t('quantity')}</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-6 font-bold text-xl">{quantity}</span>
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
                  {t('maxQuantity') || 'Maximum quantity reached'}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="w-6 h-6" />
              {t('addToCart')}
            </button>

            <button
              onClick={handleAddToWishlist}
              className={`p-4 border-2 rounded-lg transition shadow-lg hover:shadow-xl ${
                inWishlist
                  ? 'bg-red-50 border-red-500'
                  : 'border-gray-300 hover:border-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-6 h-6 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition shadow-lg hover:shadow-xl"
            >
              <Share2 className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">{t('freeShipping') || 'Free Shipping'}</p>
              <p className="text-xs text-gray-500">{t('ordersOver') || 'Orders over'} 1000 {language === 'ar' ? 'ج.م' : 'EGP'}</p>
            </div>
            <div className="text-center border-x">
              <p className="text-sm text-gray-600 mb-1">{t('fastDelivery') || 'Fast Delivery'}</p>
              <p className="text-xs text-gray-500">{t('within') || 'Within'} 2-3 {t('days') || 'days'}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">{t('returnPolicy') || 'Return Policy'}</p>
              <p className="text-xs text-gray-500">14 {t('days') || 'days'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}