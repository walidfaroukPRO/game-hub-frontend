import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { cartAPI, wishlistAPI } from '../../services/api';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { language, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  
  // Price calculations
  const price = language === 'ar' ? `${product.price} ج.م` : `EGP ${product.price}`;
  const finalPrice = product.discount > 0 
    ? product.price - (product.price * product.discount / 100) 
    : product.price;
  const displayPrice = language === 'ar' 
    ? `${Math.round(finalPrice)} ج.م` 
    : `EGP ${Math.round(finalPrice)}`;
  
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error(t('loginRequired') || 'Please login first');
      return;
    }
    
    if (product.stock === 0) {
      toast.error(t('outOfStock') || 'Product is out of stock');
      return;
    }
    
    setAddingToCart(true);
    try {
      await cartAPI.add(product._id, 1);
      toast.success(t('addedToCart') || 'Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || t('addToCartError') || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error(t('loginRequired') || 'Please login first');
      return;
    }
    
    setAddingToWishlist(true);
    try {
      if (inWishlist) {
        await wishlistAPI.remove(product._id);
        setInWishlist(false);
        toast.success(t('removedFromWishlist') || 'Removed from wishlist');
      } else {
        await wishlistAPI.add(product._id);
        setInWishlist(true);
        toast.success(t('addedToWishlist') || 'Added to wishlist!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('wishlistError') || 'Failed to update wishlist');
    } finally {
      setAddingToWishlist(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group">
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold z-10 shadow-lg">
            -{product.discount}%
          </span>
        )}
        
        {/* Stock Badge */}
        {product.stock === 0 && (
          <span className="absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-bold z-10">
            {t('outOfStock') || 'Out of Stock'}
          </span>
        )}

        {/* New Badge */}
        {product.isNew && (
          <span className="absolute top-12 left-2 bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold z-10">
            {t('new') || 'NEW'}
          </span>
        )}
        
        {/* Product Image */}
        <div className="relative overflow-hidden bg-gray-100">
          <img 
            src={product.images?.[0]?.url || '/placeholder.jpg'}
            alt={language === 'ar' ? product.name : product.nameEn}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
          
          {/* Quick View Button - Appears on Hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transform -translate-y-4 group-hover:translate-y-0 transition-transform">
              <Eye className="w-4 h-4" />
              {t('quickView') || 'Quick View'}
            </button>
          </div>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleAddToWishlist}
          disabled={addingToWishlist}
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              inWishlist || addingToWishlist 
                ? 'fill-red-500 text-red-500' 
                : 'text-red-500'
            }`} 
          />
        </button>
      </Link>
      
      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
          {product.category}
        </p>

        {/* Product Name */}
        <Link to={`/products/${product._id}`}>
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition h-14">
            {language === 'ar' ? product.name : product.nameEn}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating?.average || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold">{product.rating?.average?.toFixed(1) || '0.0'}</span>
          <span className="text-gray-500 text-sm">({product.rating?.count || 0})</span>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xl font-bold text-blue-600">{displayPrice}</span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through ml-2">{price}</span>
            )}
          </div>
          {product.discount > 0 && (
            <span className="text-sm text-green-600 font-semibold">
              {t('save') || 'Save'} {Math.round(product.price * product.discount / 100)} {language === 'ar' ? 'ج.م' : 'EGP'}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {product.stock > 0 && product.stock <= 10 && (
          <p className="text-xs text-orange-600 mb-3">
            {t('onlyLeft') || 'Only'} {product.stock} {t('left') || 'left in stock'}!
          </p>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link 
            to={`/products/${product._id}`}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center text-sm font-semibold"
          >
            {t('viewDetails') || 'View Details'}
          </Link>
          <button 
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock === 0}
            className="bg-gray-100 p-2 rounded-lg hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            title={t('addToCart') || 'Add to Cart'}
          >
            {addingToCart ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}