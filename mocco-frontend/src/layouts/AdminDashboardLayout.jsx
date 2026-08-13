import { useDispatch } from "react-redux";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import AdminDashboardHeader from "../components/adminDashboard/AdminDashboardHeader";
import AdminDashboardSidebar from "../components/adminDashboard/AdminDashboardSidebar";
import { adminDashboardItems } from "../components/adminDashboard/constants/adminDashboardItems";
import { loadUser } from "../services/store/actions/user";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AdminDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const queryTab = new URLSearchParams(location.search).get("tab");
  const activeView = adminDashboardItems.some((item) => item.id === queryTab)
    ? queryTab
    : "overview";

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/user/logout`, {
        withCredentials: true,
      });
      if (data?.success) {
        dispatch(loadUser());
        navigate("/login", { replace: true });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to logout right now.";
      window.alert(message);
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
    </section>
  );
};

export default AdminDashboardLayout;
