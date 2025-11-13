import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { productsAPI, cartAPI, wishlistAPI } from '../services/api';
import { 
  Filter, 
  Loader, 
  Star, 
  ShoppingCart, 
  Heart,
  Grid3x3,
  List,
  SlidersHorizontal,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [addingToCart, setAddingToCart] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest'
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll(filters);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error(language === 'ar' ? 'فشل في تحميل المنتجات' : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    try {
      const response = await wishlistAPI.get();
      const wishlistIds = response.data.wishlist.map(item => 
        typeof item === 'string' ? item : item._id
      );
      setWishlist(wishlistIds);
    } catch (error) {
      console.error('Load wishlist error:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    });
    setSearchParams({});
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
      navigate('/login');
      return;
    }

    setAddingToCart(productId);
    try {
      await cartAPI.add(productId, 1);
      toast.success(language === 'ar' ? 'تم الإضافة للسلة' : 'Added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const handleToggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
      navigate('/login');
      return;
    }

    try {
      const isInWishlist = wishlist.includes(productId);
      
      if (isInWishlist) {
        await wishlistAPI.remove(productId);
        setWishlist(prev => prev.filter(id => id !== productId));
        toast.success(language === 'ar' ? 'تم الإزالة من المفضلة' : 'Removed from wishlist');
      } else {
        await wishlistAPI.add(productId);
        setWishlist(prev => [...prev, productId]);
        toast.success(language === 'ar' ? 'تم الإضافة للمفضلة' : 'Added to wishlist');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const hasActiveFilters = filters.category || filters.search || filters.minPrice || filters.maxPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {language === 'ar' ? 'المنتجات' : 'Products'}
          </h1>
          <p className="text-gray-600">
            {loading ? '...' : `${products.length} ${language === 'ar' ? 'منتج' : 'products'}`}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition ${
              viewMode === 'grid' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition ${
              viewMode === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-lg">
                {language === 'ar' ? 'الفلاتر' : 'Filters'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  {language === 'ar' ? 'مسح الكل' : 'Clear All'}
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
            {/* Category Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">
                {language === 'ar' ? 'كل الفئات' : 'All Categories'}
              </option>
              <option value="PS5">
                PS5 {language === 'ar' ? 'ألعاب' : 'Games'}
              </option>
              <option value="PS4">
                PS4 {language === 'ar' ? 'ألعاب' : 'Games'}
              </option>
              <option value="Console">
                {language === 'ar' ? 'أجهزة الألعاب' : 'Consoles'}
              </option>
              <option value="Accessory">
                {language === 'ar' ? 'إكسسوارات' : 'Accessories'}
              </option>
            </select>

            {/* Sort Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="newest">
                {language === 'ar' ? 'الأحدث' : 'Newest'}
              </option>
              <option value="price-low">
                {language === 'ar' ? 'السعر: الأقل أولاً' : 'Price: Low to High'}
              </option>
              <option value="price-high">
                {language === 'ar' ? 'السعر: الأعلى أولاً' : 'Price: High to Low'}
              </option>
              <option value="rating">
                {language === 'ar' ? 'الأعلى تقييماً' : 'Top Rated'}
              </option>
              <option value="popular">
                {language === 'ar' ? 'الأكثر مبيعاً' : 'Best Selling'}
              </option>
            </select>

            {/* Min Price */}
            <input
              type="number"
              placeholder={language === 'ar' ? 'السعر من' : 'Min Price'}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />

            {/* Max Price */}
            <input
              type="number"
              placeholder={language === 'ar' ? 'السعر إلى' : 'Max Price'}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />

            {/* Search */}
            <input
              type="text"
              placeholder={language === 'ar' ? 'ابحث عن منتج...' : 'Search products...'}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">
              {language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
            </p>
          </div>
        </div>
      ) : products.length > 0 ? (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {products.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              viewMode={viewMode}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              addingToCart={addingToCart}
              inWishlist={wishlist.includes(product._id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? 'لم نجد أي منتجات' : 'No products found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'ar' 
                ? 'جرب تغيير الفلاتر أو البحث بكلمات مختلفة'
                : 'Try changing your filters or search terms'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {language === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Product Card Component
function ProductCard({ product, viewMode, onAddToCart, onToggleWishlist, addingToCart, inWishlist }) {
  const { language } = useLanguage();
  
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

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="flex gap-4 p-4">
          <Link to={`/products/${product._id}`} className="relative flex-shrink-0 w-48 h-48 overflow-hidden rounded-lg">
            {product.discount > 0 && (
              <span className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold z-10">
                -{product.discount}%
              </span>
            )}
            <img 
              src={product.images?.[0]?.url || '/placeholder.jpg'}
              alt={language === 'ar' ? product.name : product.nameEn}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </Link>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <Link to={`/products/${product._id}`}>
                <h3 className="font-bold text-xl mb-2 hover:text-blue-600 transition">
                  {language === 'ar' ? product.name : product.nameEn}
                </h3>
              </Link>

              <div className="flex items-center gap-2 mb-3">
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
                <span className="text-sm font-semibold">{(product.rating?.average || 0).toFixed(1)}</span>
                <span className="text-gray-500 text-sm">({product.rating?.count || 0})</span>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {language === 'ar' ? product.description : product.descriptionEn}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-blue-600">{displayPrice}</span>
                {product.discount > 0 && (
                  <span className="text-sm text-gray-500 line-through ml-2">{originalPrice}</span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onAddToCart(product._id)}
                  disabled={addingToCart === product._id || product.stock === 0}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {addingToCart === product._id ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                    </>
                  )}
                </button>

                <button
                  onClick={() => onToggleWishlist(product._id)}
                  className={`p-2 rounded-lg transition ${
                    inWishlist ? 'bg-red-50 border-2 border-red-500' : 'bg-gray-100 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-lg text-sm font-bold z-10 shadow-lg">
            -{product.discount}%
          </span>
        )}

        <div className="relative bg-gray-50 h-64">
          <img 
            src={product.images?.[0]?.url || '/placeholder.jpg'}
            alt={language === 'ar' ? product.name : product.nameEn}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleWishlist(product._id);
          }}
          className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all group/heart"
        >
          <Heart 
            className={`w-5 h-5 transition-all ${
              inWishlist 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-600 group-hover/heart:text-red-500'
            }`}
          />
        </button>
      </Link>

      <div className="p-5">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition min-h-[3.5rem]">
            {language === 'ar' ? product.name : product.nameEn}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
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
          <span className="text-sm font-semibold text-gray-700">
            {(product.rating?.average || 0).toFixed(1)}
          </span>
          <span className="text-xs text-gray-500">
            ({product.rating?.count || 0})
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {displayPrice}
            </div>
            {product.discount > 0 && (
              <div className="text-sm text-gray-500 line-through">
                {originalPrice}
              </div>
            )}
          </div>
          {product.discount > 0 && (
            <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
              {language === 'ar' ? 'وفر' : 'Save'} {Math.round(price - finalPrice)} {language === 'ar' ? 'ج.م' : 'EGP'}
            </div>
          )}
        </div>

        <button
          onClick={() => onAddToCart(product._id)}
          disabled={addingToCart === product._id || product.stock === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          {addingToCart === product._id ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}