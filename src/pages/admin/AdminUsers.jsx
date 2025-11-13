import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';
import { 
  Search, Shield, UserX, UserCheck, Mail, 
  Phone, Calendar, Loader, Download, Users, Zap 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const { t, language } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      toast.error('🚫 Unauthorized access');
      navigate('/');
      return;
    }
    loadUsers();
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error('❌ Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    if (!confirm('Are you sure you want to change this user\'s role?')) return;

    setUpdating(userId);
    try {
      await adminAPI.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success('✅ Role updated');
    } catch {
      toast.error('⚠️ Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    setUpdating(userId);
    try {
      await adminAPI.toggleUserStatus(userId, !isActive);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: !isActive } : u));
      toast.success(isActive ? '🛑 User deactivated' : '✅ User activated');
    } catch {
      toast.error('⚠️ Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const exportCSV = () => {
    const csv = [
      ['Name', 'Email', 'Role', 'Active', 'Joined'],
      ...users.map(u => [u.name, u.email, u.role, u.isActive ? 'Yes' : 'No', new Date(u.createdAt).toLocaleDateString()])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'users.csv';
    link.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('manageUsers') || 'Manage Users'}
          </h1>
          <p className="text-gray-500 mt-1">
            {users.length} {t('usersTotal') || 'users total'}
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <motion.div 
        className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-5 border border-gray-100 mb-6"
        whileHover={{ scale: 1.01 }}
      >
        <div className="grid md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchUsers') || 'Search by name or email...'}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Shield className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
              <tr>
                {['User', 'Contact', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-4 px-6 font-semibold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <motion.tr 
                    key={user._id} 
                    className="border-t hover:bg-blue-50/40 transition"
                    whileHover={{ scale: 1.005 }}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-xs text-gray-500">#{user._id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-700">
                      <p className="flex items-center gap-1"><Mail className="w-4 h-4 text-gray-400" />{user.email}</p>
                      {user.phone && (
                        <p className="flex items-center gap-1"><Phone className="w-4 h-4 text-gray-400" />{user.phone}</p>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {updating === user._id ? (
                        <Loader className="w-5 h-5 animate-spin text-blue-600" />
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                          className={`px-3 py-1 text-xs rounded-full font-semibold border-0 cursor-pointer ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>

                    <td className="py-4 px-6 text-gray-600">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isActive !== false 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive !== false ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleStatus(user._id, user.isActive !== false)}
                        disabled={updating === user._id}
                        className={`p-2 rounded-lg transition ${
                          user.isActive !== false
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {user.isActive !== false ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <motion.div 
        className="grid md:grid-cols-3 gap-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <StatCard 
          icon={<Users className="w-6 h-6 text-blue-600" />} 
          title="Total Users" 
          value={users.filter(u => u.role === 'user').length} 
          gradient="from-blue-400 to-indigo-600"
        />
        <StatCard 
          icon={<Shield className="w-6 h-6 text-purple-600" />} 
          title="Total Admins" 
          value={users.filter(u => u.role === 'admin').length} 
          gradient="from-purple-400 to-fuchsia-600"
        />
        <StatCard 
          icon={<Zap className="w-6 h-6 text-green-600" />} 
          title="Active Users" 
          value={users.filter(u => u.isActive !== false).length} 
          gradient="from-green-400 to-emerald-600"
        />
      </motion.div>
    </motion.div>
  );
}

function StatCard({ icon, title, value, gradient }) {
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between"
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-center gap-3">
        <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl text-white`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </motion.div>
  );
}
