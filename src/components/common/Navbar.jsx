import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Search,
  Globe,
  Heart,
  Package,
  Settings,
  Sparkles,
  ChevronDown,
  Bell,
  TrendingUp,
  Gamepad2,
  Laptop,
  Headphones,
  Zap,
  Clock,
  Star,
  Moon,
  Sun
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Get real counts from contexts
  const cartCount = cart?.items?.length || 0;
  const wishlistCount = wishlist?.items?.length || 0;
  const notificationCount = 2; // TODO: Get from notifications context/API

  // Handle scroll for sticky navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const categories = [
    { 
      name: language === 'ar' ? 'ألعاب PS5' : 'PS5 Games', 
      path: '/products?category=PS5',
      icon: Gamepad2,
      color: 'from-blue-500 to-cyan-500',
      badge: 'new'
    },
    { 
      name: language === 'ar' ? 'ألعاب PS4' : 'PS4 Games', 
      path: '/products?category=PS4',
      icon: Gamepad2,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      name: language === 'ar' ? 'أجهزة الألعاب' : 'Consoles', 
      path: '/products?category=Console',
      icon: Laptop,
      color: 'from-orange-500 to-red-500',
      badge: 'hot'
    },
    { 
      name: language === 'ar' ? 'الإكسسوارات' : 'Accessories', 
      path: '/products?category=Accessory',
      icon: Headphones,
      color: 'from-green-500 to-emerald-500'
    },
  ];

  const navLinks = [
    { path: '/', label: language === 'ar' ? 'الرئيسية' : 'Home' },
    { path: '/products', label: language === 'ar' ? 'المنتجات' : 'Products' },
    { path: '/about', label: language === 'ar' ? 'من نحن' : 'About' },
    { path: '/contact', label: language === 'ar' ? 'اتصل بنا' : 'Contact' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-2 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span className="font-semibold">
                {language === 'ar' ? 'توصيل مجاني للطلبات فوق 1000 ج.م' : 'Free shipping on orders over 1000 EGP'}
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/orders" className="hover:text-yellow-300 transition flex items-center gap-1">
              <Package className="w-3 h-3" />
              {language === 'ar' ? 'تتبع طلبك' : 'Track Order'}
            </Link>
            <span>|</span>
            <Link to="/contact" className="hover:text-yellow-300 transition">
              {language === 'ar' ? 'تواصل معنا' : 'Contact'}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 bg-white dark:bg-gray-900 backdrop-blur-lg border-b transition-all duration-300 ${
        isScrolled ? 'shadow-xl border-gray-200 dark:border-gray-700' : 'border-gray-100 dark:border-gray-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {language === 'ar' ? 'جيم هاب' : 'Game Hub'}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                  {language === 'ar' ? 'متجر الألعاب الأول' : '#1 Gaming Store'}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowCategoriesMenu(true)}
                  onMouseLeave={() => setShowCategoriesMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-all"
                >
                  {language === 'ar' ? 'الفئات' : 'Categories'}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showCategoriesMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega Menu */}
                {showCategoriesMenu && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 animate-slide-down"
                    onMouseEnter={() => setShowCategoriesMenu(true)}
                    onMouseLeave={() => setShowCategoriesMenu(false)}
                  >
                    <div className="grid gap-2">
                      {categories.map((category) => (
                        <Link
                          key={category.path}
                          to={category.path}
                          className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-700 transition-all"
                          onClick={() => setShowCategoriesMenu(false)}
                        >
                          <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                            <category.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                {category.name}
                              </span>
                              {category.badge && (
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                  category.badge === 'new' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                }`}>
                                  {category.badge === 'new' ? (language === 'ar' ? 'جديد' : 'NEW') : (language === 'ar' ? 'عرض' : 'HOT')}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {language === 'ar' ? 'تصفح المنتجات' : 'Browse products'}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ar' ? 'ابحث عن الألعاب...' : 'Search for games...'}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-700 transition-all"
                />
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="relative w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center group"
                title={theme === 'dark' ? (language === 'ar' ? 'الوضع النهاري' : 'Light Mode') : (language === 'ar' ? 'الوضع الليلي' : 'Dark Mode')}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-90 transition-transform duration-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700 group-hover:-rotate-12 transition-transform duration-300" />
                )}
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="relative w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center group"
                title={language === 'ar' ? 'English' : 'العربية'}
              >
                <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:rotate-12 transition-transform" />
                <span className="absolute -top-1 -right-1 text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white px-1.5 py-0.5 rounded-full">
                  {language === 'ar' ? 'ع' : 'EN'}
                </span>
              </button>

              {user && (
                <>
                  {/* Notifications */}
                  <Link
                    to="/notifications"
                    className="relative w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center group"
                    title={language === 'ar' ? 'الإشعارات' : 'Notifications'}
                  >
                    <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:rotate-12 transition-transform" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                        {notificationCount}
                      </span>
                    )}
                  </Link>

                  {/* Wishlist */}
                  <Link
                    to="/wishlist"
                    className="relative w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center group"
                    title={language === 'ar' ? 'المفضلة' : 'Wishlist'}
                  >
                    <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* Cart */}
                  <Link
                    to="/cart"
                    className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center group shadow-lg hover:shadow-xl transform hover:scale-105"
                    title={language === 'ar' ? 'السلة' : 'Cart'}
                  >
                    <ShoppingCart className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {/* User Menu / Auth Buttons */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl group"
                  >
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center font-bold backdrop-blur-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block font-semibold max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowUserMenu(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-slide-down">
                        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 rounded-t-2xl">
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>

                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold">{language === 'ar' ? 'الملف الشخصي' : 'Profile'}</span>
                        </Link>

                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Package className="w-5 h-5 text-green-600" />
                          <span className="font-semibold">{language === 'ar' ? 'طلباتي' : 'My Orders'}</span>
                        </Link>

                        <Link
                          to="/wishlist"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors md:hidden"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Heart className="w-5 h-5 text-red-600" />
                          <span className="font-semibold">{language === 'ar' ? 'المفضلة' : 'Wishlist'}</span>
                        </Link>

                        {isAdmin && (
                          <>
                            <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>
                            <Link
                              to="/admin"
                              className="flex items-center gap-3 px-4 py-3 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Settings className="w-5 h-5" />
                              <span className="font-semibold">{language === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}</span>
                            </Link>
                          </>
                        )}

                        <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors w-full"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="font-semibold">{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-all"
                  >
                    {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {language === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden pb-4 animate-slide-down border-t dark:border-gray-700">
              <div className="flex flex-col gap-2 pt-4">
                {/* Search Bar - Mobile */}
                <form onSubmit={handleSearch} className="relative mb-2">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'ar' ? 'ابحث...' : 'Search...'}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </form>

                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Categories - Mobile */}
                <div className="border-t dark:border-gray-700 pt-2 mt-2">
                  <p className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                    {language === 'ar' ? 'الفئات' : 'Categories'}
                  </p>
                  {categories.map((category) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-xl transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center`}>
                        <category.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold">{category.name}</span>
                    </Link>
                  ))}
                </div>

                {!user && (
                  <>
                    <div className="border-t dark:border-gray-700 pt-2 mt-2"></div>
                    <Link
                      to="/login"
                      className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-all text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl transition-all text-center shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {language === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}