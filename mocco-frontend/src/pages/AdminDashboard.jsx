import { useLocation } from "react-router-dom";
import AdminOverviewTab from "../components/adminDashboard/tabs/AdminOverviewTab";
import AdminOrdersTab from "../components/adminDashboard/tabs/AdminOrdersTab";
import AdminUsersTab from "../components/adminDashboard/tabs/AdminUsersTab";
import AdminSellersTab from "../components/adminDashboard/tabs/AdminSellersTab";
import AdminProductsTab from "../components/adminDashboard/tabs/AdminProductsTab";
import AdminEventsTab from "../components/adminDashboard/tabs/AdminEventsTab";
import AdminWithdrawTab from "../components/adminDashboard/tabs/AdminWithdrawTab";

const AdminDashboard = () => {
  const location = useLocation();
  const tab = new URLSearchParams(location.search).get("tab");

  const renderTab = () => {
    switch (tab) {
      case "all-orders":
        return <AdminOrdersTab />;
      case "allUsers":
        return <AdminUsersTab />;
      case "allSellers":
        return <AdminSellersTab />;
      case "allProducts":
        return <AdminProductsTab />;
      case "allEvents":
        return <AdminEventsTab />;
      case "withdraw":
        return <AdminWithdrawTab />;
      default:
        return <AdminOverviewTab />;
    }
  };

  return <>{renderTab()}</>;
};

export default AdminDashboard;
