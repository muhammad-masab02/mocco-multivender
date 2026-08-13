import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ShoppingBag, Package, Tag, Users, Store, Wallet } from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";

const TopRightIcon = ({
  title,
  icon,
  colorClass = "text-slate-500",
  onClick,
  active = false,
}) => {
  const IconComponent = icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={title}
      title={title}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg cursor-pointer border transition ${
        active
          ? "border-slate-200 bg-slate-50"
          : "border-transparent hover:border-slate-200 hover:bg-slate-50"
      }`}
    >
      <IconComponent size={20} className={colorClass} />
    </button>
  );
};

const topIcons = [
  {
    title: "Orders",
    icon: ShoppingBag,
    colorClass: "text-cyan-500",
    tabId: "all-orders",
  },
  {
    title: "Users",
    icon: Users,
    colorClass: "text-emerald-500",
    tabId: "all-users",
  },
  {
    title: "Sellers",
    icon: Store,
    colorClass: "text-orange-500",
    tabId: "all-sellers",
  },
  {
    title: "Products",
    icon: Package,
    colorClass: "text-purple-500",
    tabId: "all-products",
  },
  {
    title: "Events",
    icon: Tag,
    colorClass: "text-pink-500",
    tabId: "all-events",
  },
  {
    title: "Withdraw",
    icon: Wallet,
    colorClass: "text-amber-500",
    tabId: "withdraw-requests",
  },
];

const AdminDashboardHeader = ({ activeView, onTabChange }) => {
  const { user } = useSelector((state) => state.user);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img
            src={"/mocco-favicon.png"}
            alt="Admin"
            className="h-9 w-9 object-cover"
          />
          <div>
            <p className="text-xl font-bold leading-none text-slate-800">
              Mocco Mart
            </p>
            <p className="text-xs text-slate-500">Admin Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {topIcons.map((item) => (
            <TopRightIcon
              key={item.tabId}
              title={item.title}
              icon={item.icon}
              colorClass={item.colorClass}
              onClick={() => onTabChange(item.tabId)}
              active={activeView === item.tabId}
            />
          ))}

          <Link
            to="/my-profile"
            aria-label="Admin profile"
            className="cursor-pointer"
          >
            <img
              src={getImageUrl(user?.avatar)}
              alt="Admin profile"
              className="ml-2 h-10 w-10 rounded-full border border-slate-200 object-cover shadow-sm transition hover:scale-105"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AdminDashboardHeader;
