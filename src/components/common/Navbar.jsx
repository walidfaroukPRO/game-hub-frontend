import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // ✅ تم التصحيح
import { useLanguage } from '../../contexts/LanguageContext'; // ✅ تم التصحيح
import { useTheme } from '../../contexts/ThemeContext'; // ✅ تم التصحيح
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
  Moon,
  Sun,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const navLinks = [
    { path: '/', label: language === 'ar' ? 'الرئيسية' : 'Home' },
    { path: '/products', label: language === 'ar' ? 'المنتجات' : 'Products' },
    { path: '/about', label: language === 'ar' ? 'من نحن' : 'About' },
    { path: '/contact', label: language === 'ar' ? 'اتصل بنا' : 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {language === 'ar' ? 'جيم هاب' : 'Game Hub'}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {language === 'ar' ? 'متجر الألعاب' : 'Gaming Store'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button 
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              onClick={() => navigate('/products')}
            >
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">
                {language === 'ar' ? 'بحث...' : 'Search...'}
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="relative w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center group overflow-hidden"
              title={isDark ? (language === 'ar' ? 'الوضع النهاري' : 'Light Mode') : (language === 'ar' ? 'الوضع الليلي' : 'Dark Mode')}
            >
              <div className="relative w-5 h-5">
                <Sun className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-300 ${
                  isDark 
                    ? 'rotate-90 scale-0 opacity-0' 
                    : 'rotate-0 scale-100 opacity-100'
                }`} />
                <Moon className={`absolute inset-0 w-5 h-5 text-blue-500 transition-all duration-300 ${
                  isDark 
                    ? 'rotate-0 scale-100 opacity-100' 
                    : '-rotate-90 scale-0 opacity-0'
                }`} />
              </div>
              {/* Glow Effect */}
              <div className={`absolute inset-0 rounded-lg transition-opacity ${
                isDark 
                  ? 'bg-blue-500/20 opacity-100' 
                  : 'bg-yellow-500/20 opacity-0 group-hover:opacity-100'
              }`}></div>
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="relative w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center group"
              title={language === 'ar' ? 'English' : 'العربية'}
            >
              <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white px-1.5 py-0.5 rounded">
                {language === 'ar' ? 'ع' : 'EN'}
              </span>
            </button>

            {/* Wishlist (for logged in users) */}
            {user && (
              <Link
                to="/wishlist"
                className="relative w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center group"
                title={language === 'ar' ? 'المفضلة' : 'Wishlist'}
              >
                <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>
            )}

            {/* Cart */}
            {user && (
              <Link
                to="/cart"
                className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center group shadow-lg hover:shadow-xl transform hover:scale-105"
                title={language === 'ar' ? 'السلة' : 'Cart'}
              >
                <ShoppingCart className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  0
                </span>
              </Link>
            )}

            {/* User Menu / Auth Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl group"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold backdrop-blur-sm">
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
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-slide-down">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span className="font-medium">{language === 'ar' ? 'الملف الشخصي' : 'Profile'}</span>
                      </Link>

                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Package className="w-4 h-4" />
                        <span className="font-medium">{language === 'ar' ? 'طلباتي' : 'My Orders'}</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span className="font-medium">{language === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}</span>
                        </Link>
                      )}

                      <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium">{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-all"
                >
                  {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {language === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            <div className="flex flex-col gap-2">
              {/* Search Bar - Mobile */}
              <div className="relative mb-2">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                  onClick={() => {
                    navigate('/products');
                    setIsMenuOpen(false);
                  }}
                />
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {!user && (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all text-center shadow-lg"
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
  );
}
