import { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import AdminSidebar from '../pages/admin/AdminSidebar'; // ✅ المسار الصحيح
import { Toaster } from 'react-hot-toast';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const { language, isRTL } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            {language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`min-h-screen bg-gray-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      <ScrollToTop />

      <Toaster
        position={isRTL ? 'top-left' : 'top-right'}
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            direction: isRTL ? 'rtl' : 'ltr',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`lg:hidden fixed top-4 z-50 bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition ${
          isRTL ? 'right-4' : 'left-4'
        }`}
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 h-full bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
          isRTL ? 'right-0' : 'left-0'
        } ${
          sidebarOpen 
            ? 'translate-x-0' 
            : isRTL 
              ? 'translate-x-full lg:translate-x-0' 
              : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      <main className={`${isRTL ? 'lg:mr-64' : 'lg:ml-64'} transition-all duration-300 min-h-screen`}>
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="px-4 lg:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`${isRTL ? 'mr-12 lg:mr-0' : 'ml-12 lg:ml-0'}`}>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                  {language === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}
                </h1>
                <p className="text-xs lg:text-sm text-gray-500">
                  {language === 'ar' ? 'مرحباً' : 'Welcome'}, {user?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                <span className="font-medium">
                  {new Date().toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <Outlet />
        </div>

        <footer className="bg-white border-t py-4 text-center text-sm text-gray-600">
          <p>
            {language === 'ar' 
              ? `© ${new Date().getFullYear()} Game Hub Store. جميع الحقوق محفوظة.`
              : `© ${new Date().getFullYear()} Game Hub Store. All rights reserved.`}
          </p>
        </footer>
      </main>
    </div>
  );
}