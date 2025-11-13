import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';
import { TrendingUp, Users, ShoppingBag, DollarSign, Package, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { t, language } = useLanguage();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ تحميل البيانات والتحقق من الصلاحيات
  useEffect(() => {
    if (!isAdmin) {
      toast.error(t('unauthorized') || 'Unauthorized access');
      navigate('/');
      return;
    }
    fetchStats();
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await adminAPI.getStats();
      setStats(data.stats);
    } catch (error) {
      console.error(error);
      toast.error(t('loadStatsError') || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  // ✅ مكون تحميل أنيق
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        {t('noData') || 'No data available.'}
      </div>
    );
  }

  // ✅ بيانات البطاقات الديناميكية
  const statsCards = [
    {
      title: t('totalRevenue') || 'Total Revenue',
      value: language === 'ar' ? `${stats.totalRevenue || 0} ج.م` : `EGP ${stats.totalRevenue || 0}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12.5%'
    },
    {
      title: t('totalOrders') || 'Total Orders',
      value: stats.totalOrders || 0,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      change: '+8.2%'
    },
    {
      title: t('totalUsers') || 'Total Users',
      value: stats.totalUsers || 0,
      icon: Users,
      color: 'bg-purple-500',
      change: '+15.3%'
    },
    {
      title: t('totalProducts') || 'Total Products',
      value: stats.totalProducts || 0,
      icon: Package,
      color: 'bg-orange-500',
      change: '+5.1%'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-1">
          {t('adminDashboard') || 'Admin Dashboard'}
        </h1>
        <p className="text-gray-600">
          {t('welcomeBack') || 'Welcome back'}, <span className="font-semibold">{user?.name}</span> 👋
        </p>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsCards.map(({ title, value, icon: Icon, color, change }, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-transform duration-200 hover:-translate-y-1 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </section>

      {/* Recent Orders */}
      <section className="bg-white rounded-2xl shadow-sm p-6 mb-10">
        <h2 className="text-xl font-bold mb-4">{t('recentOrders') || 'Recent Orders'}</h2>

        {stats.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['orderID', 'customer', 'date', 'status', 'amount'].map((key) => (
                    <th key={key} className="text-left py-3 px-4 font-semibold text-gray-700">
                      {t(key) || key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="py-3 px-4">{order.user?.name}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {t(order.status) || order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {language === 'ar'
                        ? `${order.totalAmount} ج.م`
                        : `EGP ${order.totalAmount}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-6">
            {t('noRecentOrders') || 'No recent orders'}
          </p>
        )}
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Package,
            title: t('manageProducts') || 'Manage Products',
            desc: t('manageProductsDesc') || 'Add, edit, or remove products',
            color: 'text-blue-600',
            path: '/admin/products'
          },
          {
            icon: ShoppingBag,
            title: t('manageOrders') || 'Manage Orders',
            desc: t('manageOrdersDesc') || 'View and update order status',
            color: 'text-green-600',
            path: '/admin/orders'
          },
          {
            icon: Users,
            title: t('manageUsers') || 'Manage Users',
            desc: t('manageUsersDesc') || 'View and manage user accounts',
            color: 'text-purple-600',
            path: '/admin/users'
          }
        ].map(({ icon: Icon, title, desc, color, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-transform duration-200 hover:-translate-y-1 text-left p-6"
          >
            <Icon className={`w-10 h-10 ${color} mb-4`} />
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p className="text-gray-600 text-sm">{desc}</p>
          </button>
        ))}
      </section>
    </div>
  );
}
