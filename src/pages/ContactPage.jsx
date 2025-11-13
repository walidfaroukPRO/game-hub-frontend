import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Sparkles,
  CheckCircle,
  Loader,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success(language === 'ar' ? 'تم إرسال رسالتك بنجاح! 🎉' : 'Message sent successfully! 🎉');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: language === 'ar' ? 'العنوان' : 'Address',
      details: language === 'ar' ? 'القاهرة، مصر' : 'Cairo, Egypt',
      subdetails: language === 'ar' ? 'شارع الجامعة، المعادي' : 'University Street, Maadi',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: language === 'ar' ? 'الهاتف' : 'Phone',
      details: '+20 123 456 7890',
      subdetails: language === 'ar' ? 'متاح من 9 ص - 10 م' : 'Available 9 AM - 10 PM',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: language === 'ar' ? 'البريد الإلكتروني' : 'Email',
      details: 'info@gamehub.com',
      subdetails: language === 'ar' ? 'نرد خلال 24 ساعة' : 'Reply within 24 hours',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: language === 'ar' ? 'ساعات العمل' : 'Working Hours',
      details: language === 'ar' ? 'السبت - الخميس' : 'Saturday - Thursday',
      subdetails: '9:00 AM - 10:00 PM',
      color: 'from-green-500 to-emerald-500'
    },
  ];

  const socialMedia = [
    { icon: <Facebook className="w-6 h-6" />, name: 'Facebook', link: '#', color: 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20' },
    { icon: <Instagram className="w-6 h-6" />, name: 'Instagram', link: '#', color: 'hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20' },
    { icon: <Twitter className="w-6 h-6" />, name: 'Twitter', link: '#', color: 'hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20' },
    { icon: <Youtube className="w-6 h-6" />, name: 'Youtube', link: '#', color: 'hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' },
    { icon: <Linkedin className="w-6 h-6" />, name: 'LinkedIn', link: '#', color: 'hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20' },
  ];

  const faqs = [
    {
      q: language === 'ar' ? 'كيف يمكنني تتبع طلبي؟' : 'How can I track my order?',
      a: language === 'ar' 
        ? 'يمكنك تتبع طلبك من خلال صفحة "طلباتي" أو عبر رابط التتبع المرسل إلى بريدك الإلكتروني'
        : 'You can track your order through "My Orders" page or via the tracking link sent to your email'
    },
    {
      q: language === 'ar' ? 'ما هي طرق الدفع المتاحة؟' : 'What payment methods are available?',
      a: language === 'ar' 
        ? 'نقبل الدفع نقداً عند الاستلام، بطاقات الائتمان، والمحافظ الإلكترونية'
        : 'We accept Cash on Delivery, Credit Cards, and E-Wallets'
    },
    {
      q: language === 'ar' ? 'هل يمكنني إرجاع المنتج؟' : 'Can I return a product?',
      a: language === 'ar' 
        ? 'نعم، يمكنك إرجاع المنتج خلال 14 يوم من تاريخ الاستلام'
        : 'Yes, you can return products within 14 days of delivery'
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
        </div>
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
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
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6 animate-slide-down">
            <MessageCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold">{language === 'ar' ? 'نحن هنا لمساعدتك' : 'We\'re Here to Help'}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 animate-slide-up">
            {language === 'ar' ? (
              <>
                تواصل معنا<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 animate-glow">نحن بانتظارك</span>
              </>
            ) : (
              <>
                Contact Us<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 animate-glow">We're Waiting</span>
              </>
            )}
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto animate-slide-up">
            {language === 'ar' ? 'هل لديك سؤال أو استفسار؟ فريقنا جاهز لمساعدتك على مدار الساعة' : 'Have a question or inquiry? Our team is ready to help you 24/7'}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactInfo.map((info, i) => (
              <div 
                key={i} 
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:transform hover:-translate-y-2"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-white shadow-lg`}>
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{info.title}</h3>
                <p className="text-gray-900 dark:text-white font-semibold mb-1">{info.details}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{info.subdetails}</p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
              {language === 'ar' ? 'أرسل لنا رسالة' : 'Send Us a Message'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder={language === 'ar' ? 'الاسم' : 'Name'}
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                />
                <input
                  type="email"
                  name="email"
                  placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder={language === 'ar' ? 'الموضوع' : 'Subject'}
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              />
              <textarea
                name="message"
                placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message here...'}
                value={formData.message}
                onChange={handleChange}
                rows={6}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {language === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto flex justify-center gap-6">
          {socialMedia.map((social, i) => (
            <a 
              key={i} 
              href={social.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`w-12 h-12 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 transition ${social.color} bg-white dark:bg-gray-800 shadow hover:shadow-lg`}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900 dark:text-white">
            {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <button
                key={i}
                onClick={() => setSelectedFaq(faq)}
                className="w-full text-left bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <span className="font-semibold text-gray-900 dark:text-white">{faq.q}</span>
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Modal */}
      {selectedFaq && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-xl w-full p-6 relative shadow-2xl animate-slide-up">
            <button
              onClick={() => setSelectedFaq(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{selectedFaq.q}</h3>
            <p className="text-gray-700 dark:text-gray-300">{selectedFaq.a}</p>
          </div>
        </div>
      )}
    </div>
  );
}
