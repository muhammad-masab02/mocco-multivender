import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ShoppingBag, Package, Tag, Users, Store, Wallet, ShieldAlert, Sparkles } from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";

const TopRightIcon = ({
  title,
  icon: IconComponent,
  colorClass = "text-slate-500",
  onClick,
  active = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={title}
      title={title}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl cursor-pointer transition-all duration-200 ${
        active
          ? "bg-slate-900 text-white shadow-xs"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      }`}
    >
      <IconComponent size={18} className={active ? "text-white" : colorClass} />
    </button>
  );
};

const topIcons = [
  {
    title: "Orders",
    icon: ShoppingBag,
    colorClass: "text-blue-600",
    tabId: "all-orders",
  },
  {
    title: "Users",
    icon: Users,
    colorClass: "text-emerald-600",
    tabId: "allUsers",
  },
  {
    title: "Sellers",
    icon: Store,
    colorClass: "text-orange-600",
    tabId: "allSellers",
  },
  {
    title: "Products",
    icon: Package,
    colorClass: "text-purple-600",
    tabId: "allProducts",
  },
  {
    title: "Events",
    icon: Tag,
    colorClass: "text-pink-600",
    tabId: "allEvents",
  },
  {
    title: "Withdraw",
    icon: Wallet,
    colorClass: "text-amber-600",
    tabId: "withdraw",
  },
];

const AdminDashboardHeader = ({ activeView, onTabChange }) => {
  const { user } = useSelector((state) => state.user);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-red-600 to-rose-700 flex items-center justify-center font-bold text-white text-base shadow-sm group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
                  Mocco Mart
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                Super Admin Headquarters
              </p>
            </div>
          </Link>
        </div>

        {/* Action icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200/60">
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
          </div>

          <Link
            to="/my-profile"
            aria-label="Admin profile"
            className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200/80 hover:border-red-300 bg-white hover:bg-slate-50 transition-all shadow-xs cursor-pointer group"
          >
            <span className="text-xs font-bold text-slate-700 hidden md:inline truncate max-w-[120px]">
              {user?.name || "Admin"}
            </span>
            <div className="relative">
              <img
                src={getImageUrl(user?.avatar?.url || user?.avatar, "https://dummyimage.com/100")}
                alt={user?.name || "Admin"}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 ring-2 ring-red-500/20"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-600 text-white flex items-center justify-center border-2 border-white">
                <ShieldAlert className="w-2 h-2" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AdminDashboardHeader;
