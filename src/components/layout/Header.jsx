import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Globe, Menu, X, LogOut, Package, Settings } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { t, toggleLanguage, language, isRTL } = useLanguage();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-red-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <Link to="/" className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition">
              {t('storeName') || 'Game Hub'}
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder') || 'Search for games, consoles...'}
                className={`w-full px-4 py-2 ${isRTL ? 'pr-10' : 'pl-10'} bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white/20 transition`}
              />
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-2.5 w-5 h-5 text-white/60`} />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1 p-2 hover:bg-white/10 rounded-lg transition"
              title={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-semibold hidden sm:inline">
                {language === 'ar' ? 'EN' : 'ع'}
              </span>
            </button>

            {isAuthenticated ? (
              <>
                {/* Wishlist */}
                <Link 
                  to="/wishlist" 
                  className="hidden sm:flex relative p-2 hover:bg-white/10 rounded-lg transition"
                  title={t('wishlist') || 'Wishlist'}
                >
                  <Heart className="w-5 h-5" />
                </Link>

                {/* Cart */}
                <Link 
                  to="/cart" 
                  className="relative p-2 hover:bg-white/10 rounded-lg transition"
                  title={t('cart') || 'Cart'}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    0
                  </span>
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                  </button>

                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl z-20 overflow-hidden animate-slide-down`}>
                        <div className="p-3 bg-gray-50 border-b">
                          <p className="font-semibold">{user?.name}</p>
                          <p className="text-xs text-gray-600">{user?.email}</p>
                        </div>
                        
                        <Link 
                          to="/profile" 
                          className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          {t('myProfile') || 'My Profile'}
                        </Link>
                        
                        <Link 
                          to="/orders" 
                          className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Package className="w-4 h-4" />
                          {t('myOrders') || 'My Orders'}
                        </Link>

                        <Link 
                          to="/wishlist" 
                          className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition sm:hidden"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Heart className="w-4 h-4" />
                          {t('wishlist') || 'Wishlist'}
                        </Link>
                        
                        {isAdmin && (
                          <>
                            <div className="border-t"></div>
                            <Link 
                              to="/admin" 
                              className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition text-purple-600"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Settings className="w-4 h-4" />
                              {t('adminDashboard') || 'Admin Dashboard'}
                            </Link>
                          </>
                        )}
                        
                        <div className="border-t"></div>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 text-red-600 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('logout') || 'Logout'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-purple-900 transition font-semibold text-sm"
                >
                  {t('login') || 'Login'}
                </Link>
                <Link 
                  to="/register" 
                  className="hidden sm:block px-4 py-2 bg-yellow-400 text-purple-900 rounded-lg hover:bg-yellow-500 transition font-semibold text-sm"
                >
                  {t('register') || 'Register'}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Navigation Links - Desktop */}
        <nav className="hidden lg:block border-t border-white/20 py-3">
          <div className="flex gap-6">
            <Link to="/" className="hover:text-yellow-400 transition font-medium">
              {t('home') || 'Home'}
            </Link>
            <Link to="/products?category=PS5" className="hover:text-yellow-400 transition font-medium">
              {t('ps5Games') || 'PS5 Games'}
            </Link>
            <Link to="/products?category=PS4" className="hover:text-yellow-400 transition font-medium">
              {t('ps4Games') || 'PS4 Games'}
            </Link>
            <Link to="/products?category=Console" className="hover:text-yellow-400 transition font-medium">
              {t('consoles') || 'Consoles'}
            </Link>
            <Link to="/products?category=Accessory" className="hover:text-yellow-400 transition font-medium">
              {t('accessories') || 'Accessories'}
            </Link>
          </div>
        </nav>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder') || 'Search...'}
              className={`w-full px-4 py-2 ${isRTL ? 'pr-10' : 'pl-10'} bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
            />
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-2.5 w-5 h-5 text-white/60`} />
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-purple-900/95 border-t border-white/20 animate-slide-down">
          <div className="px-4 py-3 space-y-2">
            <Link 
              to="/" 
              className="block py-2 hover:text-yellow-400 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('home') || 'Home'}
            </Link>
            <Link 
              to="/products?category=PS5" 
              className="block py-2 hover:text-yellow-400 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('ps5Games') || 'PS5 Games'}
            </Link>
            <Link 
              to="/products?category=PS4" 
              className="block py-2 hover:text-yellow-400 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('ps4Games') || 'PS4 Games'}
            </Link>
            <Link 
              to="/products?category=Console" 
              className="block py-2 hover:text-yellow-400 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('consoles') || 'Consoles'}
            </Link>
            <Link 
              to="/products?category=Accessory" 
              className="block py-2 hover:text-yellow-400 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('accessories') || 'Accessories'}
            </Link>
            {!isAuthenticated && (
              <Link 
                to="/register" 
                className="block py-2 hover:text-yellow-400 transition sm:hidden"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('register') || 'Register'}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}