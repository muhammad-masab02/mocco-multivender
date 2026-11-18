import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ShopDashboardHeader from "../components/shopDashboard/ShopDashboardHeader";
import ShopDashboardSidebar from "../components/shopDashboard/ShopDashboardSidebar";
import { dashboardItems } from "../components/shopDashboard/constants/dashboardItems";
import { loadSeller, logoutSeller } from "../services/store/actions/seller";
import LogoutConfirmModal from "../components/common/LogoutConfirmModal";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SellerDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);

  const queryTab = new URLSearchParams(location.search).get("tab");

  // If the path contains /shop-dashboard/order/, we consider the active view to be "orders"
  const isOrderDetail = location.pathname.includes("/shop-dashboard/order/");

  const activeView = isOrderDetail
    ? "orders"
    : dashboardItems.some((item) => item.id === queryTab)
      ? queryTab
      : "dashboard";

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await dispatch(logoutSeller());
      setIsLogoutModalOpen(false);
      navigate("/shop-login", { replace: true });
    } catch {
      setIsLogoutModalOpen(false);
      navigate("/shop-login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleTabChange = (tabId) => {
    navigate(
      tabId === "dashboard"
        ? "/shop-dashboard"
        : `/shop-dashboard/?tab=${tabId}`,
      { replace: true },
    );
  };

  return (
    <section className="min-h-screen w-full bg-linear-to-b from-slate-100 via-slate-50 to-white text-slate-900">
      <ShopDashboardHeader
        activeView={activeView}
        onTabChange={handleTabChange}
        sellerId={seller?._id}
        sellerAvatar={seller?.avatar?.url}
        sellerName={seller?.name}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr]">
        <ShopDashboardSidebar
          items={dashboardItems}
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
        title="Log Out of Merchant Dashboard?"
        subtitle="Are you sure you want to log out of your merchant account? You will need to log in again to manage your store, inventory, and orders."
        confirmText="Yes, Log Out"
        cancelText="Stay on Dashboard"
      />
    </section>
  );
};

export default SellerDashboardLayout;
