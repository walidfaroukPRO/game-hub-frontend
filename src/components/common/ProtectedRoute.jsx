import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  // إذا لم يكن هناك مستخدم → نعيد توجيهه إلى صفحة الدخول
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // إذا كان المسار إداريًا والمستخدم ليس أدمن
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
