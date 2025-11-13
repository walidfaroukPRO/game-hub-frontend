import { useLanguage } from '../contexts/LanguageContext';
import { 
  Award, 
  Users, 
  Truck, 
  Shield, 
  Target, 
  Heart,
  Sparkles,
  Trophy,
  Clock,
  Star,
  CheckCircle,
  Gamepad2,
  Package,
  Zap
} from 'lucide-react';

export default function AboutPage() {
  const { language } = useLanguage();

  const stats = [
    { 
      icon: <Users className="w-8 h-8" />, 
      value: '10,000+', 
      label: language === 'ar' ? 'عميل سعيد' : 'Happy Customers',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: <Package className="w-8 h-8" />, 
      value: '500+', 
      label: language === 'ar' ? 'منتج' : 'Products',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      icon: <Award className="w-8 h-8" />, 
      value: '4.9/5', 
      label: language === 'ar' ? 'تقييم العملاء' : 'Customer Rating',
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      icon: <Trophy className="w-8 h-8" />, 
      value: '5+', 
      label: language === 'ar' ? 'سنوات خبرة' : 'Years Experience',
      color: 'from-green-500 to-emerald-500'
    },
  ];

  const values = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: language === 'ar' ? 'الجودة والأصالة' : 'Quality & Authenticity',
      desc: language === 'ar' 
        ? 'نضمن لك منتجات أصلية 100% من أفضل الموردين العالميين'
        : 'We guarantee 100% authentic products from the best global suppliers',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Truck className="w-12 h-12" />,
      title: language === 'ar' ? 'شحن سريع وآمن' : 'Fast & Safe Delivery',
      desc: language === 'ar' 
        ? 'توصيل سريع لجميع أنحاء مصر مع تتبع شحنتك لحظة بلحظة'
        : 'Fast delivery across Egypt with real-time tracking',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: language === 'ar' ? 'دعم عملاء 24/7' : '24/7 Customer Support',
      desc: language === 'ar' 
        ? 'فريق دعم محترف جاهز لمساعدتك في أي وقت'
        : 'Professional support team ready to help you anytime',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: language === 'ar' ? 'أفضل الأسعار' : 'Best Prices',
      desc: language === 'ar' 
        ? 'أسعار تنافسية مع عروض وخصومات حصرية دائمة'
        : 'Competitive prices with exclusive deals and discounts',
      color: 'from-yellow-500 to-orange-500'
    },
  ];

  const team = [
    {
      name: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed',
      role: language === 'ar' ? 'المؤسس والرئيس التنفيذي' : 'Founder & CEO',
      image: 'https://i.pravatar.cc/300?img=12',
      desc: language === 'ar' 
        ? 'خبرة 10+ سنوات في صناعة الألعاب'
        : '10+ years experience in gaming industry'
    },
    {
      name: language === 'ar' ? 'سارة علي' : 'Sara Ali',
      role: language === 'ar' ? 'مديرة العمليات' : 'Operations Manager',
      image: 'https://i.pravatar.cc/300?img=5',
      desc: language === 'ar' 
        ? 'متخصصة في تحسين تجربة العملاء'
        : 'Expert in customer experience optimization'
    },
    {
      name: language === 'ar' ? 'محمود حسن' : 'Mahmoud Hassan',
      role: language === 'ar' ? 'مدير التسويق' : 'Marketing Director',
      image: 'https://i.pravatar.cc/300?img=8',
      desc: language === 'ar' 
        ? 'استراتيجي تسويق رقمي محترف'
        : 'Professional digital marketing strategist'
    },
  ];

  const milestones = [
    {
      year: '2019',
      title: language === 'ar' ? 'التأسيس' : 'Founded',
      desc: language === 'ar' ? 'بدأنا رحلتنا بحلم كبير' : 'Started our journey with a big dream'
    },
    {
      year: '2020',
      title: language === 'ar' ? '1000 عميل' : '1000 Customers',
      desc: language === 'ar' ? 'وصلنا إلى أول 1000 عميل' : 'Reached our first 1000 customers'
    },
    {
      year: '2022',
      title: language === 'ar' ? 'توسع كبير' : 'Major Expansion',
      desc: language === 'ar' ? 'افتتحنا فروع جديدة' : 'Opened new branches'
    },
    {
      year: '2024',
      title: language === 'ar' ? 'قيادة السوق' : 'Market Leader',
      desc: language === 'ar' ? 'أصبحنا الأفضل في مصر' : 'Became #1 in Egypt'
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950 text-white py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden">
          {[Gamepad2, Trophy, Star, Zap].map((Icon, i) => (
            <Icon
              key={i}
              className="absolute text-white/10 animate-float"
              size={60}
              style={{
                left: `${20 + i * 25}%`,
                top: `${30 + i * 10}%`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold">
              {language === 'ar' ? 'قصة نجاحنا' : 'Our Success Story'}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6">
            {language === 'ar' ? (
              <>
                من نحن؟<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  شغفنا الألعاب
                </span>
              </>
            ) : (
              <>
                About Us<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Gaming is Our Passion
                </span>
              </>
            )}
          </h1>

          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8">
            {language === 'ar' 
              ? 'نحن أكثر من مجرد متجر - نحن مجتمع من عشاق الألعاب الذين يسعون لتوفير أفضل تجربة تسوق'
              : 'We are more than just a store - we are a community of gaming enthusiasts committed to delivering the best shopping experience'}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                {language === 'ar' ? 'قصتنا' : 'Our Story'}
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p className="text-lg leading-relaxed">
                  {language === 'ar' 
                    ? 'بدأت Game Hub في عام 2019 بحلم بسيط - جعل الألعاب في متناول الجميع في مصر. ما بدأ كمتجر صغير تحول إلى واحد من أكبر منصات الألعاب في المنطقة.'
                    : 'Game Hub started in 2019 with a simple dream - making gaming accessible to everyone in Egypt. What began as a small store has evolved into one of the largest gaming platforms in the region.'}
                </p>
                <p className="text-lg leading-relaxed">
                  {language === 'ar' 
                    ? 'نحن نؤمن بأن كل لاعب يستحق الحصول على أفضل المنتجات بأفضل الأسعار. لهذا السبب نعمل مباشرة مع الموردين العالميين لنقدم لك منتجات أصلية بأسعار تنافسية.'
                    : 'We believe every gamer deserves the best products at the best prices. That\'s why we work directly with global suppliers to bring you authentic products at competitive prices.'}
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  {[
                    { icon: <CheckCircle />, text: language === 'ar' ? 'منتجات أصلية 100%' : '100% Authentic' },
                    { icon: <CheckCircle />, text: language === 'ar' ? 'شحن مجاني +1000 ج.م' : 'Free Shipping 1000+ EGP' },
                    { icon: <CheckCircle />, text: language === 'ar' ? 'ضمان استرجاع' : 'Money Back Guarantee' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg">
                      {item.icon}
                      <span className="font-semibold text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl transform rotate-6 opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop"
                alt="Gaming Setup"
                className="relative rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {language === 'ar' ? 'قيمنا الأساسية' : 'Our Core Values'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {language === 'ar' ? 'ما يميزنا عن الآخرين' : 'What sets us apart from others'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <div key={i} className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:transform hover:-translate-y-2">
                <div className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-white`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {language === 'ar' ? 'رحلتنا' : 'Our Journey'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {language === 'ar' ? 'معالم مهمة في مسيرتنا' : 'Key milestones in our story'}
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 hidden md:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, i) => (
                <div key={i} className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="flex-1 text-right md:text-left">
                    {i % 2 === 0 && (
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{milestone.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{milestone.desc}</p>
                      </div>
                    )}
                  </div>

                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10 flex-shrink-0">
                    {i + 1}
                  </div>

                  <div className="flex-1">
                    {i % 2 !== 0 && (
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{milestone.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{milestone.desc}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {language === 'ar' ? 'فريقنا' : 'Our Team'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {language === 'ar' ? 'تعرف على الأشخاص وراء النجاح' : 'Meet the people behind our success'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={i} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="relative overflow-hidden">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                    <p className="text-yellow-400 font-semibold">{member.role}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-6 animate-spin" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {language === 'ar' ? 'جاهز للانضمام إلينا؟' : 'Ready to Join Us?'}
          </h2>
          <p className="text-xl mb-8 text-white/90">
            {language === 'ar' 
              ? 'كن جزءاً من مجتمعنا واستمتع بأفضل تجربة ألعاب'
              : 'Be part of our community and enjoy the best gaming experience'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
            </a>
            <a 
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
            >
              {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}