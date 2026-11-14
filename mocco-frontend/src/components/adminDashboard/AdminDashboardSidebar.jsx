import React from "react";
import { LogOut, ShieldAlert } from "lucide-react";

const colorTokens = {
  blue: "border-blue-100 bg-blue-50 text-blue-700",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
  lime: "border-lime-100 bg-lime-50 text-lime-700",
  orange: "border-orange-100 bg-orange-50 text-orange-700",
  sky: "border-sky-100 bg-sky-50 text-sky-700",
  pink: "border-pink-100 bg-pink-50 text-pink-700",
  indigo: "border-indigo-100 bg-indigo-50 text-indigo-700",
  cyan: "border-cyan-100 bg-cyan-50 text-cyan-700",
  red: "border-red-100 bg-red-50 text-red-700",
  amber: "border-amber-100 bg-amber-50 text-amber-700",
  teal: "border-teal-100 bg-teal-50 text-teal-700",
  purple: "border-purple-100 bg-purple-50 text-purple-700",
  slate: "border-slate-100 bg-slate-50 text-slate-700",
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
      className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200 group ${
        active
          ? `${activeColor} font-bold shadow-xs border-transparent`
          : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
      }`}
    >
      <span className="flex items-center gap-3 text-xs sm:text-sm">
        <IconComponent
          size={18}
          className={`shrink-0 transition-transform ${active ? "scale-110" : "text-slate-400 group-hover:text-slate-600"}`}
        />
        <span>{item.label}</span>
      </span>

      {active && (
        <span
          className={`flex h-2 w-2 rounded-full shrink-0 ${activeDot}`}
        />
      )}
    </button>
  );
};

const AdminDashboardSidebar = ({
  items,
  activeView,
  onTabChange,
  onLogout,
}) => {
  return (
    <aside className="z-20 h-fit pb-10 border-b border-slate-200/80 bg-white xl:sticky xl:top-16 xl:border-r xl:border-b-0 shadow-xs">
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider mb-2">
          <ShieldAlert className="w-3 h-3" />
          <span>Management</span>
        </div>
        <h2 className="text-lg font-black tracking-tight text-slate-900">
          Admin Portal
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Control center for marketplace</p>
      </div>

      <nav className="space-y-1.5 p-4">
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            active={activeView === item.id}
            onClick={onTabChange}
          />
        ))}

        <div className="pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 text-xs sm:text-sm font-bold transition-all"
          >
            <LogOut size={16} />
            <span>Admin Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default AdminDashboardSidebar;
