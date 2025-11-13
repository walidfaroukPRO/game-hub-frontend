import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { productsAPI } from '../../services/api';
import { Plus, Edit, Trash2, Search, Filter, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminProducts() {
  const { t, language } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // عدد المنتجات في الصفحة الواحدة

  // Load products
  useEffect(() => {
    if (!isAdmin) {
      toast.error('Unauthorized access');
      navigate('/');
      return;
    }
    loadProducts();
  }, [isAdmin]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({});
      // تأكد من طباعة طول المنتجات اللي جايه
      console.log('عدد المنتجات من السيرفر:', response.data.products.length);
      setProducts(response.data.products || []);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return products.filter(p => {
      const name = (language === 'ar' ? p.name : p.nameEn)?.toLowerCase();
      const matchSearch = name.includes(query);
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, categoryFilter, language]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await productsAPI.delete(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('✅ Product deleted');
    } catch {
      toast.error('❌ Failed to delete');
    } finally {
      setDeleting(null);
      setShowDeleteModal(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-3 p-8 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('manageProducts') || 'Manage Products'}</h1>
          <p className="text-gray-500">
            {filteredProducts.length} / {products.length} {t('productsFound') || 'Products found'}
          </p>
        </div>

        <motion.button
          onClick={() => navigate('/admin/products/new')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t('addProduct') || 'Add Product'}
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchProducts') || 'Search products...'}
              className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">{t('allCategories') || 'All Categories'}</option>
              {Array.from(new Set(products.map(p => p.category))).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                {['Image', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h, i) => (
                  <th key={i} className="text-left py-4 px-6 font-semibold">{t(h.toLowerCase()) || h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map(product => (
                    <motion.tr
                      key={product._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="py-4 px-6">
                        <img
                          src={product.images?.[0]?.url || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-800">
                          {language === 'ar' ? product.name : product.nameEn}
                        </p>
                        <p className="text-xs text-gray-500">#{product._id.slice(-6).toUpperCase()}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-800">
                        {language === 'ar' ? `${product.price} ج.م` : `EGP ${product.price}`}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-semibold ${
                          product.stock > 10 ? 'text-green-600' :
                          product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.stock > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock > 0 ? t('inStock') : t('outOfStock')}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(product)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            disabled={deleting === product._id}
                          >
                            {deleting === product._id ? (
                              <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-gray-500">
                      {t('noProductsFound') || 'No products found'}
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-lg ${currentPage === i+1 ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-xl font-bold mb-2 text-gray-800">{t('confirmDelete') || 'Confirm Deletion'}</h2>
              <p className="text-gray-600 mb-6">
                {t('deleteConfirmMsg') || 'Are you sure you want to delete this product?'}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  {t('cancel') || 'Cancel'}
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  {t('delete') || 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
