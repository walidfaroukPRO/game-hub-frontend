import { useEffect, useState, useRef, useCallback } from 'react';
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
  X,
  ChevronRight,
  ChevronLeft,
  Eye,
  TrendingUp,
  Package,
  Search,
  ArrowUpDown,
  Sparkles,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import ProductQuickView from '../components/ProductQuickView';
import ProductSkeleton from '../components/ProductSkeleton';

export default function ProductsPage() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [addingToCart, setAddingToCart] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [compareProducts, setCompareProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 12;
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    rating: searchParams.get('rating') || '',
    inStock: searchParams.get('inStock') === 'true',
    onSale: searchParams.get('onSale') === 'true'
  });

  useEffect(() => {
    loadProducts();
    loadRecentlyViewed();
  }, [filters, page]);

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({
        ...filters,
        page,
        limit
      });
      setProducts(response.data.products || []);
      setTotalPages(response.data.pagination?.pages || 1);
      setTotalProducts(response.data.pagination?.total || 0);
      
      // Scroll to top on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const loadRecentlyViewed = () => {
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentlyViewed(viewed);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page
    
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
      sort: 'newest',
      rating: '',
      inStock: false,
      onSale: false
    });
    setPage(1);
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

  const handleToggleCompare = (productId) => {
    setCompareProducts(prev => {
      if (prev.includes(productId)) {
        toast.info(language === 'ar' ? 'تم الإزالة من المقارنة' : 'Removed from comparison');
        return prev.filter(id => id !== productId);
      } else if (prev.length >= 4) {
        toast.error(language === 'ar' ? 'يمكنك مقارنة 4 منتجات فقط' : 'You can compare up to 4 products');
        return prev;
      } else {
        toast.success(language === 'ar' ? 'تم الإضافة للمقارنة' : 'Added to comparison');
        return [...prev, productId];
      }
    });
  };

  const hasActiveFilters = filters.category || filters.search || filters.minPrice || 
                          filters.maxPrice || filters.rating || filters.inStock || filters.onSale;

  const activeFilterCount = [
    filters.category,
    filters.search,
    filters.minPrice,
    filters.maxPrice,
    filters.rating,
    filters.inStock,
    filters.onSale
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">
            {language === 'ar' ? 'المنتجات' : 'Products'}
          </span>
          {filters.category && (
            <>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{filters.category}</span>
            </>
          )}
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {language === 'ar' ? 'المنتجات' : 'Products'}
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  <span className="font-semibold">{totalProducts}</span>
                  {language === 'ar' ? 'منتج' : 'products found'}
                </>
              )}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-3">
            {/* Compare Button */}
            {compareProducts.length > 0 && (
              <Link 
                to={`/compare?products=${compareProducts.join(',')}`}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 shadow-lg"
              >
                <ArrowUpDown className="w-4 h-4" />
                {language === 'ar' ? 'مقارنة' : 'Compare'} ({compareProducts.length})
              </Link>
            )}
            
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Filter className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-bold text-xl">
                    {language === 'ar' ? 'الفلاتر' : 'Filters'}
                  </h2>
                  {activeFilterCount > 0 && (
                    <p className="text-sm text-gray-500">
                      {activeFilterCount} {language === 'ar' ? 'فلتر نشط' : 'active filters'}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 px-3 py-1.5 bg-red-50 rounded-lg hover:bg-red-100 transition"
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

            {/* Active Filters Badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b">
                {filters.category && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                    {filters.category}
                    <button onClick={() => handleFilterChange('category', '')} className="hover:bg-blue-200 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.search && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                    <Search className="w-3 h-3" />
                    {filters.search}
                    <button onClick={() => handleFilterChange('search', '')} className="hover:bg-green-200 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1">
                    {filters.minPrice && `${filters.minPrice}`}
                    {filters.minPrice && filters.maxPrice && ' - '}
                    {filters.maxPrice && `${filters.maxPrice}`}
                    {language === 'ar' ? ' ج.م' : ' EGP'}
                    <button onClick={() => {
                      handleFilterChange('minPrice', '');
                      handleFilterChange('maxPrice', '');
                    }} className="hover:bg-purple-200 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.rating && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500" />
                    {filters.rating}+
                    <button onClick={() => handleFilterChange('rating', '')} className="hover:bg-yellow-200 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.inStock && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {language === 'ar' ? 'متوفر' : 'In Stock'}
                    <button onClick={() => handleFilterChange('inStock', false)} className="hover:bg-green-200 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.onSale && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {language === 'ar' ? 'عروض' : 'On Sale'}
                    <button onClick={() => handleFilterChange('onSale', false)} className="hover:bg-red-200 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
              {/* Category Filter */}
              <select
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white hover:border-gray-300"
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
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white hover:border-gray-300"
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
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition hover:border-gray-300"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />

              {/* Max Price */}
              <input
                type="number"
                placeholder={language === 'ar' ? 'السعر إلى' : 'Max Price'}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition hover:border-gray-300"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />

              {/* Rating Filter */}
              <select
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white hover:border-gray-300"
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
              >
                <option value="">
                  {language === 'ar' ? 'كل التقييمات' : 'All Ratings'}
                </option>
                <option value="4">⭐ 4+</option>
                <option value="3">⭐ 3+</option>
                <option value="2">⭐ 2+</option>
              </select>

              {/* Search */}
              <input
                type="text"
                placeholder={language === 'ar' ? 'ابحث عن منتج...' : 'Search products...'}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition hover:border-gray-300"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-3 mt-4 pt-4 border-t">
              <button
                onClick={() => handleFilterChange('inStock', !filters.inStock)}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  filters.inStock 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Package className="w-4 h-4" />
                {language === 'ar' ? 'المتوفر فقط' : 'In Stock Only'}
              </button>
              
              <button
                onClick={() => handleFilterChange('onSale', !filters.onSale)}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  filters.onSale 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {language === 'ar' ? 'العروض فقط' : 'On Sale Only'}
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} viewMode={viewMode} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
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
                  onQuickView={setQuickViewProduct}
                  onToggleCompare={handleToggleCompare}
                  addingToCart={addingToCart}
                  inWishlist={wishlist.includes(product._id)}
                  inCompare={compareProducts.includes(product._id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        page === i + 1
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
            <div className="max-w-md mx-auto">
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {language === 'ar' ? 'لم نجد أي منتجات' : 'No products found'}
              </h3>
              <p className="text-gray-600 mb-8">
                {language === 'ar' 
                  ? 'جرب تغيير الفلاتر أو البحث بكلمات مختلفة'
                  : 'Try changing your filters or search terms'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl font-semibold"
                >
                  {language === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleToggleWishlist}
          inWishlist={wishlist.includes(quickViewProduct._id)}
        />
      )}
    </div>
  );
}

// Enhanced Product Card Component
function ProductCard({ 
  product, 
  viewMode, 
  onAddToCart, 
  onToggleWishlist, 
  onQuickView,
  onToggleCompare,
  addingToCart, 
  inWishlist,
  inCompare
}) {
  const { language } = useLanguage();
  const [imageError, setImageError] = useState(false);
  
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

  const saveToRecentlyViewed = () => {
    const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const updated = [product._id, ...recent.filter(id => id !== product._id)].slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  };

  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200">
        <div className="flex gap-6 p-6">
          <Link 
            to={`/products/${product._id}`} 
            onClick={saveToRecentlyViewed}
            className="relative flex-shrink-0 w-64 h-64 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-50"
          >
            {product.discount > 0 && (
              <div className="absolute top-3 left-3 z-10">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  -{product.discount}%
                </div>
              </div>
            )}
            
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                <span className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold">
                  {language === 'ar' ? 'نفذت الكمية' : 'Out of Stock'}
                </span>
              </div>
            )}

            <img 
              src={imageError ? '/placeholder.jpg' : (product.images?.[0]?.url || '/placeholder.jpg')}
              alt={language === 'ar' ? product.name : product.nameEn}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <Link 
                to={`/products/${product._id}`}
                onClick={saveToRecentlyViewed}
              >
                <h3 className="font-bold text-2xl mb-3 group-hover:text-blue-600 transition line-clamp-2">
                  {language === 'ar' ? product.name : product.nameEn}
                </h3>
              </Link>

              {/* Category & Stock */}
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                  {product.category}
                </span>
                <span className={`px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1 ${
                  product.stock > 10 ? 'bg-green-100 text-green-700' :
                  product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  <Package className="w-3 h-3" />
                  {product.stock > 0 ? 
                    `${product.stock} ${language === 'ar' ? 'متوفر' : 'in stock'}` : 
                    (language === 'ar' ? 'نفذت الكمية' : 'Out of stock')
                  }
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
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
                <span className="text-lg font-bold text-gray-700">
                  {(product.rating?.average || 0).toFixed(1)}
                </span>
                <span className="text-gray-500">
                  ({product.rating?.count || 0} {language === 'ar' ? 'تقييم' : 'reviews'})
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                {language === 'ar' ? product.description : product.descriptionEn}
              </p>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {displayPrice}
                </div>
                {product.discount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-500 line-through">{originalPrice}</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold">
                      {language === 'ar' ? 'وفر' : 'Save'} {Math.round(price - finalPrice)} {language === 'ar' ? 'ج.م' : 'EGP'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onQuickView(product)}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition group/btn"
                  title={language === 'ar' ? 'عرض سريع' : 'Quick View'}
                >
                  <Eye className="w-5 h-5 text-gray-600 group-hover/btn:text-blue-600" />
                </button>

                <button
                  onClick={() => onToggleCompare(product._id)}
                  className={`p-3 rounded-xl transition ${
                    inCompare 
                      ? 'bg-purple-100 border-2 border-purple-500' 
                      : 'bg-gray-100 hover:bg-purple-50'
                  }`}
                  title={language === 'ar' ? 'مقارنة' : 'Compare'}
                >
                  <ArrowUpDown className={`w-5 h-5 ${inCompare ? 'text-purple-600' : 'text-gray-600'}`} />
                </button>

                <button
                  onClick={() => onToggleWishlist(product._id)}
                  className={`p-3 rounded-xl transition ${
                    inWishlist 
                      ? 'bg-red-50 border-2 border-red-500' 
                      : 'bg-gray-100 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>

                <button
                  onClick={() => onAddToCart(product._id)}
                  disabled={addingToCart === product._id || product.stock === 0}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition flex items-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl font-semibold"
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
          </div>
        </div>
      </div>
    );
  }

  // Grid View - Enhanced
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
      <Link 
        to={`/products/${product._id}`}
        onClick={saveToRecentlyViewed}
        className="block relative overflow-hidden"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.discount > 0 && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              -{product.discount}%
            </div>
          )}
          {product.isFeatured && (
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {language === 'ar' ? 'مميز' : 'Featured'}
            </div>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <span className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg">
              {language === 'ar' ? 'نفذت الكمية' : 'Out of Stock'}
            </span>
          </div>
        )}

        {/* Image */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-72">
          <img 
            src={imageError ? '/placeholder.jpg' : (product.images?.[0]?.url || '/placeholder.jpg')}
            alt={language === 'ar' ? product.name : product.nameEn}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
            className="bg-white/95 backdrop-blur-sm p-2.5 rounded-xl shadow-lg hover:bg-white transition group/btn"
            title={language === 'ar' ? 'عرض سريع' : 'Quick View'}
          >
            <Eye className="w-5 h-5 text-gray-600 group-hover/btn:text-blue-600 transition" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleCompare(product._id);
            }}
            className={`backdrop-blur-sm p-2.5 rounded-xl shadow-lg hover:bg-white transition ${
              inCompare ? 'bg-purple-100 border-2 border-purple-500' : 'bg-white/95'
            }`}
            title={language === 'ar' ? 'مقارنة' : 'Compare'}
          >
            <ArrowUpDown className={`w-5 h-5 ${inCompare ? 'text-purple-600' : 'text-gray-600'}`} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist(product._id);
            }}
            className={`backdrop-blur-sm p-2.5 rounded-xl shadow-lg transition ${
              inWishlist 
                ? 'bg-red-50 border-2 border-red-500' 
                : 'bg-white/95 hover:bg-white'
            }`}
          >
            <Heart 
              className={`w-5 h-5 transition ${
                inWishlist 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-600 group-hover:text-red-500'
              }`}
            />
          </button>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5">
        {/* Category */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
            {product.category}
          </span>
          {product.stock > 0 && product.stock <= 5 && (
            <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {language === 'ar' ? 'كمية محدودة' : 'Limited'}
            </span>
          )}
        </div>

        {/* Product Name */}
        <Link 
          to={`/products/${product._id}`}
          onClick={saveToRecentlyViewed}
        >
          <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition min-h-[3.5rem]">
            {language === 'ar' ? product.name : product.nameEn}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5">
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
          <span className="text-sm font-bold text-gray-700">
            {(product.rating?.average || 0).toFixed(1)}
          </span>
          <span className="text-xs text-gray-500">
            ({product.rating?.count || 0})
          </span>
        </div>

        {/* Price */}
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
            <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              {language === 'ar' ? 'وفر' : 'Save'}<br/>
              {Math.round(price - finalPrice)} {language === 'ar' ? 'ج.م' : 'EGP'}
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product._id)}
          disabled={addingToCart === product._id || product.stock === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95"
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