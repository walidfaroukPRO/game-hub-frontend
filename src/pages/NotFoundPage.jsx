import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFoundPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {language === 'ar' ? 'الصفحة غير موجودة!' : 'Page Not Found!'}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'ar' 
                ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
                : 'Sorry, the page you are looking for does not exist or has been moved.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              {language === 'ar' ? 'العودة للخلف' : 'Go Back'}
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              <Home className="w-5 h-5" />
              {language === 'ar' ? 'الصفحة الرئيسية' : 'Go to Homepage'}
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-500 mb-4">
              {language === 'ar' ? 'أو جرب هذه الروابط المفيدة:' : 'Or try these helpful links:'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate('/products')}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                {language === 'ar' ? 'تسوق المنتجات' : 'Shop Products'}
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                {language === 'ar' ? 'السلة' : 'Cart'}
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                {language === 'ar' ? 'طلباتي' : 'My Orders'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-sm text-gray-500">
          {language === 'ar' 
            ? 'إذا كنت تعتقد أن هذا خطأ، يرجى الاتصال بالدعم.'
            : 'If you believe this is an error, please contact support.'}
        </p>
      </div>
    </div>
  );
}