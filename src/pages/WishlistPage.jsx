import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { wishlistAPI, cartAPI } from '../services/api';
import { Heart, ShoppingCart, Trash2, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadWishlist();
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.get();
      setWishlist(response.data.wishlist || []);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    setActionLoading(prev => ({ ...prev, [productId]: 'remove' }));
    try {
      await wishlistAPI.remove(productId);
      setWishlist(prev => prev.filter(item => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setActionLoading(prev => ({ ...prev, [productId]: null }));
    }
  };

  const handleAddToCart = async (product) => {
    setActionLoading(prev => ({ ...prev, [product._id]: 'cart' }));
    try {
      await cartAPI.add(product._id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setActionLoading(prev => ({ ...prev, [product._id]: null }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Heart className="w-24 h-24 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-4">{t('emptyWishlist') || 'Your wishlist is empty'}</h2>
        <p className="text-gray-600 mb-6">{t('emptyWishlistDesc') || 'Add products you love to your wishlist'}</p>
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t('myWishlist') || 'My Wishlist'}</h1>
        <p className="text-gray-600">
          {wishlist.length} {wishlist.length === 1 ? t('item') : t('items')} 
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => {
          const price = language === 'ar' ? `${product.price} ج.م` : `EGP ${product.price}`;
          const finalPrice = product.discount > 0 
            ? product.price - (product.price * product.discount / 100) 
            : product.price;
          const displayPrice = language === 'ar' 
            ? `${Math.round(finalPrice)} ج.م` 
            : `EGP ${Math.round(finalPrice)}`;

          return (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
              <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
                {product.discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold z-10">
                    -{product.discount}%
                  </span>
                )}
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove(product._id);
                  }}
                  disabled={actionLoading[product._id] === 'remove'}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition z-10"
                >
                  {actionLoading[product._id] === 'remove' ? (
                    <Loader className="w-5 h-5 animate-spin text-red-500" />
                  ) : (
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  )}
                </button>

                <img 
                  src={product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={language === 'ar' ? product.name : product.nameEn}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </Link>
              
              <div className="p-4">
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                    {language === 'ar' ? product.name : product.nameEn}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xl font-bold text-blue-600">{displayPrice}</span>
                    {product.discount > 0 && (
                      <span className="text-sm text-gray-500 line-through ml-2">{price}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={actionLoading[product._id] === 'cart' || product.stock === 0}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {actionLoading[product._id] === 'cart' ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="w-4 h-4" />
                    )}
                    {product.stock === 0 ? t('outOfStock') : t('addToCart')}
                  </button>
                  
                  <button
                    onClick={() => handleRemove(product._id)}
                    disabled={actionLoading[product._id] === 'remove'}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}