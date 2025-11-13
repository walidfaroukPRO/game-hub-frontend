import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { productsAPI } from '../../services/api';
import { Save, ArrowLeft, Loader, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProductForm() {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
    price: '',
    discount: 0,
    category: 'PS5',
    platform: 'PS5',
    genre: [],
    publisher: '',
    developer: '',
    stock: '',
    images: [{ url: '', alt: '', isPrimary: true }],
    isFeatured: false,
    isActive: true,
    tags: [],
    ageRating: 'T',
    language: ['Arabic', 'English']
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    if (id) {
      loadProduct();
    }
  }, [id, isAdmin]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setFormData(response.data.product);
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      // Ensure language is always an array of strings
const submitData = {
  ...formData,
  price: Number(formData.price),
  discount: Number(formData.discount),
  stock: Number(formData.stock),
  language: Array.isArray(formData.language)
    ? formData.language.map(String)
    : ['Arabic', 'English']
};

      if (id) {
        await productsAPI.update(id, submitData);
        toast.success(language === 'ar' ? 'تم تحديث المنتج بنجاح' : 'Product updated successfully');
      } else {
        await productsAPI.create(submitData);
        toast.success(language === 'ar' ? 'تم إضافة المنتج بنجاح' : 'Product created successfully');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (index, field, value) => {
    const newImages = [...formData.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setFormData({ ...formData, images: newImages });
  };

  const addImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { url: '', alt: '', isPrimary: false }]
    });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const genres = ['Action', 'Adventure', 'RPG', 'Sports', 'Racing', 'Fighting', 'Shooter', 'Horror', 'Strategy'];
  const categories = ['PS5', 'PS4', 'Console', 'Accessory', 'Gift Card'];
  const platforms = ['PS5', 'PS4', 'Both'];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          {language === 'ar' ? 'العودة للمنتجات' : 'Back to Products'}
        </button>
        <h1 className="text-3xl font-bold">
          {id 
            ? (language === 'ar' ? 'تعديل المنتج' : 'Edit Product')
            : (language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product')}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">
            {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'ar' ? 'الاسم بالعربية' : 'Name (Arabic)'} *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="سبايدر مان 2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'ar' ? 'الاسم بالإنجليزية' : 'Name (English)'}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="Spider-Man 2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                {language === 'ar' ? 'الوصف بالعربية' : 'Description (Arabic)'} *
              </label>
              <textarea
                required
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="وصف المنتج بالعربية..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                {language === 'ar' ? 'الوصف بالإنجليزية' : 'Description (English)'}
              </label>
              <textarea
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                placeholder="Product description in English..."
              />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">
            {language === 'ar' ? 'السعر والمخزون' : 'Pricing & Inventory'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'ar' ? 'السعر (ج.م)' : 'Price (EGP)'} *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="2500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'ar' ? 'الخصم (%)' : 'Discount (%)'}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'ar' ? 'الكمية المتاحة' : 'Stock'} *
              </label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="50"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">
            {language === 'ar' ? 'التصنيفات' : 'Categories'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'ar' ? 'الفئة' : 'Category'} *
              </label>
              <select
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'ar' ? 'المنصة' : 'Platform'}
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              >
                {platforms.map(plat => (
                  <option key={plat} value={plat}>{plat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'ar' ? 'التصنيف العمري' : 'Age Rating'}
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.ageRating}
                onChange={(e) => setFormData({ ...formData, ageRating: e.target.value })}
              >
                <option value="E">E (Everyone)</option>
                <option value="E10+">E10+</option>
                <option value="T">T (Teen)</option>
                <option value="M">M (Mature)</option>
                <option value="AO">AO (Adults Only)</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              {language === 'ar' ? 'النوع' : 'Genres'}
            </label>
            <div className="flex flex-wrap gap-2">
              {genres.map(genre => (
                <label key={genre} className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.genre?.includes(genre)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, genre: [...(formData.genre || []), genre] });
                      } else {
                        setFormData({ ...formData, genre: formData.genre.filter(g => g !== genre) });
                      }
                    }}
                  />
                  <span className="text-sm">{genre}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {language === 'ar' ? 'الصور' : 'Images'}
            </h2>
            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload className="w-4 h-4" />
              {language === 'ar' ? 'إضافة صورة' : 'Add Image'}
            </button>
          </div>

          <div className="space-y-4">
            {formData.images?.map((image, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {language === 'ar' ? 'رابط الصورة' : 'Image URL'}
                    </label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={image.url}
                      onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {language === 'ar' ? 'النص البديل' : 'Alt Text'}
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={image.alt}
                      onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                      placeholder="Product image"
                    />
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={image.isPrimary}
                      onChange={(e) => handleImageChange(index, 'isPrimary', e.target.checked)}
                    />
                    <span className="text-sm">
                      {language === 'ar' ? 'صورة رئيسية' : 'Primary Image'}
                    </span>
                  </label>
                </div>

                {image.url && (
                  <img 
                    src={image.url} 
                    alt={image.alt}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}

                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">
            {language === 'ar' ? 'معلومات إضافية' : 'Additional Information'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'ar' ? 'الناشر' : 'Publisher'}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                placeholder="Sony Interactive Entertainment"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'ar' ? 'المطور' : 'Developer'}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.developer}
                onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                placeholder="Insomniac Games"
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              />
              <span className="text-sm font-medium">
                {language === 'ar' ? 'منتج مميز' : 'Featured Product'}
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <span className="text-sm font-medium">
                {language === 'ar' ? 'نشط' : 'Active'}
              </span>
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 border rounded-lg hover:bg-gray-50"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && <Loader className="w-5 h-5 animate-spin" />}
            <Save className="w-5 h-5" />
            {submitting 
              ? (language === 'ar' ? 'جارٍ الحفظ...' : 'Saving...')
              : (language === 'ar' ? 'حفظ' : 'Save')}
          </button>
        </div>
      </form>
    </div>
  );
}
