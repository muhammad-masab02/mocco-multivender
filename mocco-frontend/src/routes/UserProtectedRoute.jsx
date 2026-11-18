import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AppLoader from "../layouts/AppLoader";

export function UserProtectedRoute({ children }) {
  const { isLoading: isUserLoading, isUserAuthenticated } = useSelector(
    (state) => state.user,
  );

  if (isUserLoading) {
    return <AppLoader />;
  }

  if (!isUserAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function AuthRoute({ children }) {
  const { isLoading: isUserLoading, isUserAuthenticated } = useSelector(
    (state) => state.user,
  );

  if (isUserLoading) {
    return <AppLoader />;
  }

  if (isUserAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
