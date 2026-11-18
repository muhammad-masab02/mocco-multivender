import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import AdminDashboardHeader from "../components/adminDashboard/AdminDashboardHeader";
import AdminDashboardSidebar from "../components/adminDashboard/AdminDashboardSidebar";
import { adminDashboardItems } from "../components/adminDashboard/constants/adminDashboardItems";
import { logoutAdmin } from "../services/store/actions/admin";
import LogoutConfirmModal from "../components/common/LogoutConfirmModal";

const AdminDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const queryTab = new URLSearchParams(location.search).get("tab");
  const activeView = adminDashboardItems.some((item) => item.id === queryTab)
    ? queryTab
    : "overview";

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await dispatch(logoutAdmin());
      setIsLogoutModalOpen(false);
      navigate("/admin/login", { replace: true });
    } catch {
      setIsLogoutModalOpen(false);
      navigate("/admin/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleTabChange = (tabId) => {
    navigate(tabId === "overview" ? "/admin" : `/admin?tab=${tabId}`, {
      replace: true,
    });
    // Settings → redirect to user profile
    if (tabId === "settings") {
      navigate("/my-profile", { replace: true });
    }
  };

  return (
    <section className="min-h-screen w-full bg-linear-to-b from-slate-100 via-slate-50 to-white text-slate-900">
      <AdminDashboardHeader
        activeView={activeView}
        onTabChange={handleTabChange}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr]">
        <AdminDashboardSidebar
          items={adminDashboardItems}
          activeView={activeView}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
        />

        <main className="p-4 sm:p-6 lg:p-8 xl:p-10">
          <Outlet />
        </main>
      </div>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => !isLoggingOut && setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
        title="Terminate Administrator Session?"
        subtitle="Are you sure you want to log out of the Super Admin Command Center? System controls and user management will require re-authentication."
        confirmText="Terminate Session"
        cancelText="Stay Logged In"
      />
    </section>
  );
};

export default AdminDashboardLayout;
