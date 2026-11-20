import { LogOut, Store, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getImageUrl } from "../../utils/imageUrl";

const SELLER_FALLBACK =
  "https://dummyimage.com/120x120/e2e8f0/64748b.png&text=Seller";

const colorTokens = {
  blue: "border-blue-100 bg-blue-50 text-blue-600",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-600",
  lime: "border-lime-100 bg-lime-50 text-lime-600",
  orange: "border-orange-100 bg-orange-50 text-orange-600",
  sky: "border-sky-100 bg-sky-50 text-sky-600",
  pink: "border-pink-100 bg-pink-50 text-pink-600",
  indigo: "border-indigo-100 bg-indigo-50 text-indigo-600",
  cyan: "border-cyan-100 bg-cyan-50 text-cyan-600",
  red: "border-red-100 bg-red-50 text-red-600",
  amber: "border-amber-100 bg-amber-50 text-amber-600",
  teal: "border-teal-100 bg-teal-50 text-teal-600",
  purple: "border-purple-100 bg-purple-50 text-purple-600",

  // Fallbacks
  slate: "border-slate-100 bg-slate-50 text-slate-600",
};

const dotTokens = {
  blue: "bg-blue-600",
  emerald: "bg-emerald-600",
  lime: "bg-lime-600",
  orange: "bg-orange-600",
  sky: "bg-sky-600",
  pink: "bg-pink-600",
  indigo: "bg-indigo-600",
  cyan: "bg-cyan-600",
  red: "bg-red-600",
  amber: "bg-amber-600",
  teal: "bg-teal-600",
  purple: "bg-purple-600",

  // Fallback
  slate: "bg-slate-600",
};

const SidebarItem = ({ item, active, onClick }) => {
  const IconComponent = item.icon;
  const activeColor = colorTokens[item.color] || colorTokens.slate;
  const activeDot = dotTokens[item.color] || dotTokens.slate;

  return (
    <button
      type="button"
      onClick={() => onClick(item.id)}
      className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-base font-semibold transition-all duration-300 group ${
        active
          ? `${activeColor} shadow-[0_8px_20px_rgba(15,23,42,0.08)]`
          : "border-transparent text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span className="flex items-center gap-3 text-sm font-medium sm:text-[15px]">
        <IconComponent
          size={22}
          className={`transition-transform ${active ? "group-hover:rotate-12" : ""}`}
        />

        <span>{item.label}</span>
      </span>

      {active && (
        <span
          className={`flex h-2.5 w-2.5 justify-self-end rounded-full transition-all ${activeDot}`}
        />
      )}
    </button>
  );
};

const ShopDashboardSidebar = ({
  items,
  activeView,
  onTabChange,
  onLogout,
  seller: propSeller,
}) => {
  const { seller: reduxSeller } = useSelector((state) => state.seller);
  const seller = propSeller || reduxSeller;
  const sellerName = seller?.name;
  const sellerId = seller?._id;
  const avatarSrc = getImageUrl(seller?.avatar?.url, SELLER_FALLBACK);

  return (
    <aside className="z-20 h-fit pb-10 border-b border-slate-200 bg-white xl:sticky xl:top-20 xl:border-r xl:border-b-0">
      <div className="border-b border-slate-200 p-6 space-y-2">
        <div>
          <h2 className="text-lg font-bold pl-1 tracking-tight text-slate-900">
            Shop Dashboard
          </h2>
        </div>

        {sellerName && (
          <Link
            to={sellerId ? `/shop/${sellerId}` : "#"}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200/90 bg-slate-50/80 p-2.5 transition hover:bg-slate-100 hover:border-slate-300 group shadow-2xs"
            title="View public storefront"
          >
            <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={avatarSrc}
                alt={sellerName}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = SELLER_FALLBACK;
                }}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <Store size={12} className="text-red-500 shrink-0" />
                <p className="text-xs font-bold text-slate-900 truncate group-hover:text-red-600 transition-colors">
                  {sellerName}
                </p>
              </div>
              <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                <span>Live Storefront</span>
                <ExternalLink
                  size={10}
                  className="text-slate-400 group-hover:text-red-500"
                />
              </p>
            </div>
          </Link>
        )}
      </div>

      <nav className="space-y-2 p-4">
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            active={activeView === item.id}
            onClick={onTabChange}
          />
        ))}

        <button
          type="button"
          onClick={onLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl cursor-pointer bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:text-base"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </nav>
    </aside>
  );
};

export default ShopDashboardSidebar;
