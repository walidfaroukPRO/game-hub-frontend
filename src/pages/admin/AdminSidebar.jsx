import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Home,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export default function AdminSidebar({ onClose }) {
  const { t, isRTL } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

const menuItems = [
  { path: "/admin", icon: LayoutDashboard, label: t("dashboard") || "Dashboard", exact: true },
  { path: "/admin/products", icon: Package, label: t("products") || "Products" },
  { path: "/admin/orders", icon: ShoppingBag, label: t("orders") || "Orders" },
  { path: "/admin/users", icon: Users, label: t("users") || "Users" },
  { path: "/admin/settings", icon: Settings, label: t("settings") || "Settings" }, // ← جديد
];

  const isActive = (path, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="w-64 h-screen flex flex-col bg-gradient-to-b from-purple-900 to-purple-800 text-white shadow-xl">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link to="/admin" className="flex items-center gap-3" onClick={() => onClose?.()}>
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-purple-900" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-yellow-400">Admin Panel</h2>
            <p className="text-xs text-purple-200">{t("storeName") || "Game Hub"}</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center font-bold text-purple-900 text-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-purple-200 truncate">{user?.email || "admin@example.com"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.exact);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => onClose?.()}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                active
                  ? "bg-white text-purple-900 shadow-md scale-[1.02]"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "text-purple-900" : "text-white group-hover:text-yellow-400"}`} />
              <span className="flex-1 font-medium">{item.label}</span>
              {active && <ChevronIcon className="w-5 h-5" />}
            </Link>
          );
        })}

        <div className="border-t border-white/10 my-4"></div>

        {/* Back to Store */}
        <Link
          to="/"
          onClick={() => onClose?.()}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200 group text-white"
        >
          <Home className="w-5 h-5 group-hover:text-yellow-400" />
          <span className="flex-1 font-medium">{t("backToStore") || "Back to Store"}</span>
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500 text-white transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t("logout") || "Logout"}</span>
        </button>
      </div>
    </div>
  );
}
