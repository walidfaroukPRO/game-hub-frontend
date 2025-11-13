import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { productsAPI, cartAPI } from '../services/api';
import { 
  ArrowRight, 
  Star, 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Heart,
  Zap,
  Shield,
  Truck,
  Clock,
  Award,
  Sparkles,
  ChevronRight,
  Gamepad2,
  Loader,
  Moon,
  Sun,
  Users,
  Gift,
  Timer,
  DollarSign,
  CheckCircle,
  Play,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Percent,
  TrendingDown
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function HomePage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [countdown, setCountdown] = useState({
    days: 2,
    hours: 14,
    minutes: 30,
    seconds: 0
  });

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  // Countdown Timer for Flash Sale
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getFeatured();
      setFeaturedProducts(response.data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
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

  const categories = [
    { 
      id: 'PS5', 
      name: language === 'ar' ? 'ألعاب بلايستيشن 5' : 'PS5 Games', 
      icon: <Gamepad2 className="w-12 h-12" />, 
      gradient: 'from-blue-500 to-purple-600',
      count: 150
    },
    { 
      id: 'PS4', 
      name: language === 'ar' ? 'ألعاب بلايستيشن 4' : 'PS4 Games', 
      icon: <Gamepad2 className="w-12 h-12" />, 
      gradient: 'from-purple-500 to-pink-600',
      count: 200
    },
    { 
      id: 'Console', 
      name: language === 'ar' ? 'أجهزة الألعاب' : 'Consoles', 
      icon: <Package className="w-12 h-12" />, 
      gradient: 'from-pink-500 to-red-600',
      count: 50
    },
    { 
      id: 'Accessory', 
      name: language === 'ar' ? 'الإكسسوارات' : 'Accessories', 
      icon: <Zap className="w-12 h-12" />, 
      gradient: 'from-orange-500 to-yellow-500',
      count: 100
    },
  ];

  const features = [
    {
      icon: <Truck className="w-10 h-10" />,
      title: language === 'ar' ? 'شحن سريع' : 'Fast Shipping',
      desc: language === 'ar' ? 'توصيل خلال 2-3 أيام' : 'Delivery within 2-3 days',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: language === 'ar' ? 'دفع آمن' : 'Secure Payment',
      desc: language === 'ar' ? '100% آمن ومضمون' : '100% secure transactions',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: language === 'ar' ? 'ضمان الجودة' : 'Quality Guarantee',
      desc: language === 'ar' ? 'منتجات أصلية 100%' : '100% authentic products',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Clock className="w-10 h-10" />,
      title: language === 'ar' ? 'دعم 24/7' : '24/7 Support',
      desc: language === 'ar' ? 'خدمة عملاء دائمة' : 'Always here to help',
      color: 'from-orange-500 to-red-500'
    },
  ];

  const testimonials = [
    {
      name: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed',
      role: language === 'ar' ? 'عميل' : 'Customer',
      comment: language === 'ar' ? 'أفضل متجر ألعاب في مصر! منتجات أصلية وخدمة ممتازة' : 'Best gaming store in Egypt! Authentic products and excellent service',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=1'
    },
    {
      name: language === 'ar' ? 'سارة علي' : 'Sara Ali',
      role: language === 'ar' ? 'عميلة' : 'Customer',
      comment: language === 'ar' ? 'توصيل سريع وأسعار منافسة. أنصح به بشدة!' : 'Fast delivery and competitive prices. Highly recommended!',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=5'
    },
    {
      name: language === 'ar' ? 'محمود حسن' : 'Mahmoud Hassan',
      role: language === 'ar' ? 'عميل' : 'Customer',
      comment: language === 'ar' ? 'تجربة تسوق رائعة ودعم عملاء ممتاز' : 'Amazing shopping experience and excellent customer support',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=3'
    },
  ];

  const stats = [
    { icon: <Users />, value: '10,000+', label: language === 'ar' ? 'عميل سعيد' : 'Happy Customers' },
    { icon: <Package />, value: '500+', label: language === 'ar' ? 'منتج' : 'Products' },
    { icon: <Award />, value: '4.9★', label: language === 'ar' ? 'تقييم' : 'Rating' },
    { icon: <Truck />, value: '99%', label: language === 'ar' ? 'توصيل ناجح' : 'Delivery Success' },
  ];

  return (
    <div className={`overflow-hidden ${isDark ? 'dark' : ''}`}>
      {/* Hero Section - Enhanced with Video Background */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950 text-white py-20 md:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 animate-glow">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
                <span className="text-sm font-semibold">
                  {language === 'ar' ? '🔥 عروض حصرية - وفر حتى 50%!' : '🔥 Exclusive Deals - Save up to 50%!'}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                {language === 'ar' ? (
                  <>
                    عالم الألعاب<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-glow">
                      في متناول يدك
                    </span>
                  </>
                ) : (
                  <>
                    Gaming World<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-glow">
                      At Your Fingertips
                    </span>
                  </>
                )}
              </h1>

              <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
                {language === 'ar' 
                  ? 'اكتشف أحدث الألعاب والأجهزة والإكسسوارات بأفضل الأسعار مع توصيل مجاني للطلبات فوق 1000 جنيه'
                  : 'Discover the latest games, consoles, and accessories at unbeatable prices with free delivery on orders over 1000 EGP'}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/products" 
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link 
                  to="/products?category=PS5" 
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 border-2 border-white/20 transition-all duration-300"
                >
                  <TrendingUp className="w-5 h-5" />
                  {language === 'ar' ? 'المنتجات المميزة' : 'Featured Products'}
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 pt-8">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="flex justify-center mb-1">{stat.icon}</div>
                    <div className="text-2xl font-bold text-yellow-400">{stat.value}</div>
                    <div className="text-xs text-white/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden md:block animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl transform rotate-6 opacity-20 animate-pulse"></div>
                <img 
                  src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop"
                  alt="Gaming"
                  className="relative rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl animate-slide-up">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{language === 'ar' ? 'منتجات أصلية' : 'Authentic'}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">100% {language === 'ar' ? 'ضمان' : 'Guaranteed'}</div>
                    </div>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute -top-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-2xl animate-slide-down">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">4.9/5</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">10k+ {language === 'ar' ? 'تقييم' : 'Reviews'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Timer */}
      <section className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 dark:from-red-900 dark:via-orange-900 dark:to-yellow-900 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">{language === 'ar' ? '⚡ عرض سريع!' : '⚡ Flash Sale!'}</h3>
                <p className="text-white/80 text-sm">{language === 'ar' ? 'خصومات تصل إلى 70%' : 'Up to 70% OFF'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-white font-semibold">{language === 'ar' ? 'ينتهي خلال:' : 'Ends in:'}</span>
              {['days', 'hours', 'minutes', 'seconds'].map((unit, i) => (
                <div key={unit} className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 min-w-[70px]">
                    <div className="text-2xl font-bold text-white">{String(countdown[unit]).padStart(2, '0')}</div>
                    <div className="text-xs text-white/80">{language === 'ar' ? 
                      ['يوم', 'ساعة', 'دقيقة', 'ثانية'][i] : 
                      [unit.charAt(0).toUpperCase() + unit.slice(1)]
                    }</div>
                  </div>
                </div>
              ))}
            </div>

            <Link 
              to="/products?sale=true"
              className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition"
            >
              {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {language === 'ar' ? 'تصفح حسب الفئة' : 'Browse by Category'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {language === 'ar' ? 'اختر الفئة المناسبة لك' : 'Find what you are looking for'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className={`group relative bg-gradient-to-br ${category.gradient} text-white rounded-2xl p-8 text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                <div className="relative z-10">
                  <div className="mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 flex justify-center">
                    {category.icon}
                  </div>
                  <p className="font-bold text-xl mb-2">{category.name}</p>
                  <p className="text-sm opacity-80 mb-3">{category.count}+ {language === 'ar' ? 'منتج' : 'Products'}</p>
                  <div className="flex items-center justify-center gap-1 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{language === 'ar' ? 'استكشف' : 'Explore'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-white w-6 h-6" />
                </div>
                {language === 'ar' ? 'المنتجات المميزة' : 'Featured Products'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'أفضل العروض والمنتجات الأكثر مبيعاً' : 'Best deals and top-selling products'}
              </p>
            </div>
            
            <Link 
              to="/products" 
              className="group hidden md:flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-lg"
            >
              {language === 'ar' ? 'عرض الكل' : 'View All'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-56 rounded-xl mb-4"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-6 rounded mb-3"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-6 rounded w-2/3 mb-3"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-10 rounded"></div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product}
                  onAddToCart={handleAddToCart}
                  addingToCart={addingToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <Package className="w-20 h-20 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-xl font-semibold">
                {language === 'ar' ? 'لا توجد منتجات متاحة حالياً' : 'No products available'}
              </p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              {language === 'ar' ? 'عرض جميع المنتجات' : 'View All Products'}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {language === 'ar' ? 'ماذا يقول عملاؤنا' : 'What Our Customers Say'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {language === 'ar' ? 'آراء عملائنا السعداء' : 'Reviews from our happy customers'}
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 md:p-12 shadow-2xl">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`${index === activeTestimonial ? 'block' : 'hidden'} animate-slide-up`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-600 shadow-lg"
                    />
                    <div>
                      <h4 className="font-bold text-xl text-gray-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed italic mb-6">
                    "{testimonial.comment}"
                  </p>

                  <MessageCircle className="w-12 h-12 text-blue-500 opacity-20" />
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeTestimonial 
                      ? 'bg-blue-600 w-8' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              {language === 'ar' ? 'لماذا تختارنا؟' : 'Why Choose Us?'}
            </h2>
            <p className="text-gray-400 text-lg">
              {language === 'ar' ? 'نقدم أفضل تجربة تسوق في العالم' : 'We provide the best shopping experience'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Gift className="w-16 h-16 mx-auto mb-6 text-white" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {language === 'ar' ? 'احصل على خصم 10%' : 'Get 10% OFF'}
          </h2>
          <p className="text-xl mb-8 text-white/90">
            {language === 'ar' 
              ? 'اشترك في النشرة الإخبارية واحصل على خصم فوري!'
              : 'Subscribe to our newsletter and get instant discount!'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email"
              placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Your Email'}
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-transparent focus:border-yellow-400 transition"
            />
            <button className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-yellow-500 transition whitespace-nowrap">
              {language === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-2">{language === 'ar' ? 'تابعنا على' : 'Follow us on'}</p>
              <div className="flex gap-4 justify-center">
                {[
                  { icon: <Facebook />, color: 'hover:text-blue-600' },
                  { icon: <Instagram />, color: 'hover:text-pink-600' },
                  { icon: <Twitter />, color: 'hover:text-blue-400' },
                  { icon: <Youtube />, color: 'hover:text-red-600' }
                ].map((social, i) => (
                  <button key={i} className={`w-12 h-12 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 ${social.color} transition shadow-md hover:shadow-lg`}>
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-6 animate-spin" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {language === 'ar' ? 'جاهز للبدء؟' : 'Ready to Get Started?'}
          </h2>
          <p className="text-xl mb-8 text-white/90">
            {language === 'ar' 
              ? 'انضم إلى آلاف العملاء السعداء واحصل على أفضل العروض'
              : 'Join thousands of happy customers and get the best deals'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              {language === 'ar' ? 'سجل الآن مجاناً' : 'Sign Up for Free'}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/products" 
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
            >
              {language === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Enhanced Product Card (نفس الكود السابق مع إضافة Dark Mode)
function ProductCard({ product, onAddToCart, addingToCart }) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [isWished, setIsWished] = useState(false);
  
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

  const handleWishlist = () => {
    if (!user) {
      toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
      return;
    }
    setIsWished(!isWished);
    toast.success(isWished 
      ? (language === 'ar' ? 'تم الإزالة من المفضلة' : 'Removed from wishlist')
      : (language === 'ar' ? 'تم الإضافة للمفضلة' : 'Added to wishlist')
    );
  };
  
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500">
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.discount > 0 && (
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
              -{product.discount}%
            </span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-lg">
              {language === 'ar' ? 'آخر قطعة!' : 'Last one!'}
            </span>
          )}
        </div>

        <div className="relative bg-gray-50 dark:bg-gray-700 h-64">
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
            handleWishlist();
          }}
          className="absolute top-3 right-3 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all group/heart"
        >
          <Heart 
            className={`w-5 h-5 transition-all ${
              isWished 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-600 dark:text-gray-400 group-hover/heart:text-red-500'
            }`}
          />
        </button>
      </Link>
      
      <div className="p-5">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition min-h-[3.5rem] text-gray-900 dark:text-white">
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
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {(product.rating?.average || 0).toFixed(1)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({product.rating?.count || 0})
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {displayPrice}
            </div>
            {product.discount > 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {originalPrice}
              </div>
            )}
          </div>
          {product.discount > 0 && (
            <div className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
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