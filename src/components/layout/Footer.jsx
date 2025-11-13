import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Footer() {
  const { t, language, isRTL } = useLanguage();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success(t('subscriptionSuccess') || 'Thank you for subscribing!');
      setEmail('');
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-yellow-400">
              {t('storeName') || 'Game Hub Store'}
            </h3>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              {t('footerAbout') || 'Your ultimate destination for the latest games, consoles, and gaming accessories. We offer the best prices and fastest delivery in Egypt.'}
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-pink-600 transition-all duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-blue-400 transition-all duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-yellow-400">
              {t('quickLinks') || 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/about" className="hover:text-white transition flex items-center gap-2">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                  {t('aboutUs') || 'About Us'}
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition flex items-center gap-2">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                  {t('products') || 'Products'}
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition flex items-center gap-2">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                  {t('myOrders') || 'My Orders'}
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition flex items-center gap-2">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                  {t('wishlist') || 'Wishlist'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition flex items-center gap-2">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                  {t('contactUs') || 'Contact Us'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-yellow-400">
              {t('customerService') || 'Customer Service'}
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/faq" className="hover:text-white transition flex items-center gap-2">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                  {t('faq') || 'FAQ'}
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition flex items-center gap-2">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                  {t('shippingInfo') || 'Shipping Information'}
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition flex items-center gap-2">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                  {t('returnPolicy') || 'Return Policy'}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition flex items-center gap-2">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                  {t('privacyPolicy') || 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition flex items-center gap-2">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                  {t('termsOfService') || 'Terms of Service'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info & Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-yellow-400">
              {t('contactInfo') || 'Contact Information'}
            </h4>
            <ul className="space-y-3 text-gray-400 mb-6">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-1 flex-shrink-0 text-yellow-400" />
                <div>
                  <p className="text-sm">+20 123 456 7890</p>
                  <p className="text-xs text-gray-500">{t('callUs') || 'Call us anytime'}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-1 flex-shrink-0 text-yellow-400" />
                <div>
                  <p className="text-sm">support@gamehub.com</p>
                  <p className="text-xs text-gray-500">{t('emailUs') || 'Email us'}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-yellow-400" />
                <div>
                  <p className="text-sm">Cairo, Egypt</p>
                  <p className="text-xs text-gray-500">{t('visitUs') || 'Visit our store'}</p>
                </div>
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold text-sm mb-3 text-yellow-400">
                {t('newsletter') || 'Subscribe to Newsletter'}
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input 
                  type="email" 
                  placeholder={t('enterEmail') || 'Enter your email'}
                  className={`flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${isRTL ? 'text-right' : 'text-left'}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button 
                  type="submit"
                  className="bg-yellow-400 text-gray-900 p-2 rounded-lg hover:bg-yellow-500 transition"
                  aria-label="Subscribe"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <p className="text-gray-400 text-sm">{t('weAccept') || 'We Accept'}:</p>
            <div className="flex gap-3">
              <div className="bg-white px-3 py-2 rounded">
                <span className="text-xs font-semibold text-gray-900">VISA</span>
              </div>
              <div className="bg-white px-3 py-2 rounded">
                <span className="text-xs font-semibold text-gray-900">Mastercard</span>
              </div>
              <div className="bg-white px-3 py-2 rounded">
                <span className="text-xs font-semibold text-gray-900">PayPal</span>
              </div>
              <div className="bg-white px-3 py-2 rounded">
                <span className="text-xs font-semibold text-gray-900">Cash</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} {t('storeName') || 'Game Hub Store'}. {t('allRightsReserved') || 'All rights reserved'}.
            </p>
            <p className="text-gray-400 text-sm">
              {t('madeWith') || 'Made with'} ❤️ {t('walid faroukh') || 'walid farouk'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}