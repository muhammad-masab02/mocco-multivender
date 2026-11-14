import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AppLoader from "../layouts/AppLoader";

export function AdminProtectedRoute({ children }) {
  const {
    user,
    isLoading: isUserLoading,
    isUserAuthenticated,
  } = useSelector((state) => state.user);

  if (isUserLoading) {
    return <AppLoader />;
  }

  if (!isUserAuthenticated || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  const role = String(user?.role || "").toLowerCase();
  if (role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
