import React from "react";
import { MessageSquareOff, PackageX, CalendarX2, ArrowRight } from "lucide-react";

const ShopEmptyState = ({
  title = "No items found",
  subtitle = "Nothing has been listed in this section yet.",
  iconType = "general",
  actionLabel,
  onAction,
}) => {
  const renderIcon = () => {
    switch (iconType) {
      case "products":
        return <PackageX className="w-10 h-10 text-slate-400" />;
      case "events":
        return <CalendarX2 className="w-10 h-10 text-slate-400" />;
      case "reviews":
        return <MessageSquareOff className="w-10 h-10 text-slate-400" />;
      default:
        return <PackageX className="w-10 h-10 text-slate-400" />;
    }
  };

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/80 p-8 sm:p-12 text-center shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        {renderIcon()}
      </div>
      <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
        {title}
      </h3>
      <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
        {subtitle}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ShopEmptyState;
