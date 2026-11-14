import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  MessageCircle,
  Package,
  Store,
  LayoutDashboard,
  Home as HomeIcon,
  Sparkles,
} from "lucide-react";
import { toTitle } from "./utils";

const TabButton = ({ icon: IconComponent, label, count, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
        active
          ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
          : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80"
      }`}
    >
      <IconComponent className={`w-4 h-4 ${active ? "text-red-400" : "text-slate-400"}`} />
      <span>{label}</span>
      <span
        className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold ${
          active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
        }`}
      >
        {count}
      </span>
    </button>
  );
};

const MyShopHeader = ({
  displayShop,
  totalProducts = 0,
  totalEvents = 0,
  totalReviews = 0,
  activeTab = "products",
  onTabChange,
  isOwner = false,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Storefront Catalog</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            {toTitle(displayShop.name)}
          </h1>
          {displayShop.description && (
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-2xl line-clamp-2">
              {displayShop.description}
            </p>
          )}
        </div>

        {isOwner && (
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <Link
              to="/shop-dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/20 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Seller Dashboard</span>
            </Link>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="pt-5 flex flex-wrap items-center gap-2.5">
        <TabButton
          icon={Package}
          label="Products"
          count={totalProducts}
          active={activeTab === "products"}
          onClick={() => onTabChange("products")}
        />
        <TabButton
          icon={CalendarDays}
          label="Events"
          count={totalEvents}
          active={activeTab === "events"}
          onClick={() => onTabChange("events")}
        />
        <TabButton
          icon={MessageCircle}
          label="Reviews"
          count={totalReviews}
          active={activeTab === "reviews"}
          onClick={() => onTabChange("reviews")}
        />
      </div>
    </div>
  );
};

export default MyShopHeader;
