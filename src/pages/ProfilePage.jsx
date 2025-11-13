import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { User, Mail, Phone, MapPin, Lock, Save, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Egypt'
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authAPI.updateProfile(profileData);
      updateUser(response.data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('myProfile') || 'My Profile'}</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'profile'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t('profileInfo') || 'Profile Information'}
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'password'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t('changePassword') || 'Change Password'}
        </button>
      </div>

      {/* Profile Information Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Personal Info */}
            <div>
              <h2 className="text-xl font-bold mb-4">{t('personalInfo') || 'Personal Information'}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    {t('fullName') || 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Mail className="inline w-4 h-4 mr-1" />
                    {t('email') || 'Email'}
                  </label>
                  <input
                    type="email"
                    required
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                    value={profileData.email}
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('emailCannotChange') || 'Email cannot be changed'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Phone className="inline w-4 h-4 mr-1" />
                    {t('phone') || 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="text-xl font-bold mb-4">
                <MapPin className="inline w-5 h-5 mr-1" />
                {t('shippingAddress') || 'Shipping Address'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('street') || 'Street Address'}</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={profileData.address.street}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      address: { ...profileData.address, street: e.target.value }
                    })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('city') || 'City'}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={profileData.address.city}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, city: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t('state') || 'State'}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={profileData.address.state}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, state: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t('zipCode') || 'Zip Code'}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={profileData.address.zipCode}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, zipCode: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {loading ? t('saving') || 'Saving...' : t('saveChanges') || 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
            <div>
              <h2 className="text-xl font-bold mb-4">
                <Lock className="inline w-5 h-5 mr-1" />
                {t('changePassword') || 'Change Password'}
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                {t('changePasswordDesc') || 'Make sure your password is at least 6 characters long'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('currentPassword') || 'Current Password'}</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('newPassword') || 'New Password'}</label>
              <input
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('confirmPassword') || 'Confirm New Password'}</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-5 h-5 animate-spin" />}
              {loading ? t('changing') || 'Changing...' : t('changePassword') || 'Change Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}