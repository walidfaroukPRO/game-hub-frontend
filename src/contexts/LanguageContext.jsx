import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation Dictionary
const translations = {
  en: {
    // General
    storeName: 'Game Hub Store',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    
    // Navigation
    home: 'Home',
    products: 'Products',
    categories: 'Categories',
    cart: 'Cart',
    wishlist: 'Wishlist',
    orders: 'Orders',
    profile: 'Profile',
    
    // Auth
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    loginTitle: 'Welcome Back',
    registerTitle: 'Create Account',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Name',
    phone: 'Phone Number',
    rememberMe: 'Remember Me',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    
    // Products
    ps5Games: 'PS5 Games',
    ps4Games: 'PS4 Games',
    consoles: 'Consoles',
    accessories: 'Accessories',
    viewDetails: 'View Details',
    addToCart: 'Add to Cart',
    addToWishlist: 'Add to Wishlist',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    price: 'Price',
    discount: 'Discount',
    rating: 'Rating',
    reviews: 'Reviews',
    
    // Categories
    allCategories: 'All Categories',
    
    // Filters
    filters: 'Filters',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    newest: 'Newest',
    priceLowToHigh: 'Price: Low to High',
    priceHighToLow: 'Price: High to Low',
    topRated: 'Top Rated',
    
    // Cart
    shoppingCart: 'Shopping Cart',
    emptyCart: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    total: 'Total',
    proceedToCheckout: 'Proceed to Checkout',
    quantity: 'Quantity',
    remove: 'Remove',
    
    // Checkout
    checkout: 'Checkout',
    shippingAddress: 'Shipping Address',
    paymentMethod: 'Payment Method',
    placeOrder: 'Place Order',
    orderSummary: 'Order Summary',
    
    // Orders
    myOrders: 'My Orders',
    orderNumber: 'Order',
    orderDetails: 'Order Details',
    orderStatus: 'Order Status',
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    
    // Profile
    myProfile: 'My Profile',
    profileInfo: 'Profile Information',
    changePassword: 'Change Password',
    
    // Admin
    adminDashboard: 'Admin Dashboard',
    manageProducts: 'Manage Products',
    manageOrders: 'Manage Orders',
    manageUsers: 'Manage Users',
    
    // Messages
    success: 'Success',
    error: 'Error',
    loginRequired: 'Please login first',
    addedToCart: 'Added to cart!',
    addedToWishlist: 'Added to wishlist!',
    
    // Footer
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    allRightsReserved: 'All rights reserved',
  },
  ar: {
    // General
    storeName: 'متجر جيم هاب',
    loading: 'جاري التحميل...',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    view: 'عرض',
    search: 'بحث',
    filter: 'تصفية',
    sort: 'ترتيب',
    
    // Navigation
    home: 'الرئيسية',
    products: 'المنتجات',
    categories: 'الفئات',
    cart: 'السلة',
    wishlist: 'المفضلة',
    orders: 'الطلبات',
    profile: 'الملف الشخصي',
    
    // Auth
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    loginTitle: 'مرحباً بعودتك',
    registerTitle: 'إنشاء حساب جديد',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    name: 'الاسم',
    phone: 'رقم الهاتف',
    rememberMe: 'تذكرني',
    forgotPassword: 'نسيت كلمة المرور؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    
    // Products
    ps5Games: 'ألعاب PS5',
    ps4Games: 'ألعاب PS4',
    consoles: 'أجهزة الألعاب',
    accessories: 'الإكسسوارات',
    viewDetails: 'عرض التفاصيل',
    addToCart: 'أضف للسلة',
    addToWishlist: 'أضف للمفضلة',
    inStock: 'متوفر',
    outOfStock: 'غير متوفر',
    price: 'السعر',
    discount: 'الخصم',
    rating: 'التقييم',
    reviews: 'المراجعات',
    
    // Categories
    allCategories: 'جميع الفئات',
    
    // Filters
    filters: 'الفلاتر',
    minPrice: 'أقل سعر',
    maxPrice: 'أعلى سعر',
    newest: 'الأحدث',
    priceLowToHigh: 'السعر: من الأقل للأعلى',
    priceHighToLow: 'السعر: من الأعلى للأقل',
    topRated: 'الأعلى تقييماً',
    
    // Cart
    shoppingCart: 'سلة التسوق',
    emptyCart: 'سلتك فارغة',
    continueShopping: 'متابعة التسوق',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    total: 'الإجمالي',
    proceedToCheckout: 'إتمام الطلب',
    quantity: 'الكمية',
    remove: 'إزالة',
    
    // Checkout
    checkout: 'الدفع',
    shippingAddress: 'عنوان الشحن',
    paymentMethod: 'طريقة الدفع',
    placeOrder: 'تأكيد الطلب',
    orderSummary: 'ملخص الطلب',
    
    // Orders
    myOrders: 'طلباتي',
    orderNumber: 'طلب رقم',
    orderDetails: 'تفاصيل الطلب',
    orderStatus: 'حالة الطلب',
    pending: 'قيد الانتظار',
    processing: 'قيد المعالجة',
    shipped: 'تم الشحن',
    delivered: 'تم التوصيل',
    cancelled: 'ملغي',
    
    // Profile
    myProfile: 'ملفي الشخصي',
    profileInfo: 'معلومات الملف الشخصي',
    changePassword: 'تغيير كلمة المرور',
    
    // Admin
    adminDashboard: 'لوحة التحكم',
    manageProducts: 'إدارة المنتجات',
    manageOrders: 'إدارة الطلبات',
    manageUsers: 'إدارة المستخدمين',
    
    // Messages
    success: 'نجح',
    error: 'خطأ',
    loginRequired: 'يرجى تسجيل الدخول أولاً',
    addedToCart: 'تمت الإضافة للسلة!',
    addedToWishlist: 'تمت الإضافة للمفضلة!',
    
    // Footer
    aboutUs: 'من نحن',
    contactUs: 'اتصل بنا',
    privacyPolicy: 'سياسة الخصوصية',
    termsOfService: 'شروط الخدمة',
    allRightsReserved: 'جميع الحقوق محفوظة',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isRTL
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};