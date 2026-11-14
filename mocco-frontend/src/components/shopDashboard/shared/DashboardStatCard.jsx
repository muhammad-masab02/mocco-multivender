import React from "react";

const DashboardStatCard = ({
  title,
  value,
  subtitle,
  icon: IconComponent,
  iconWrapClass = "bg-red-50 text-red-600",
  iconClass = "text-red-600",
  trend,
  trendLabel,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs hover:shadow-[0_16px_36px_rgba(239,68,68,0.08)] hover:border-red-200/80 transition-all duration-300 hover:-translate-y-1 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {value}
          </p>
        </div>

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 ${iconWrapClass}`}
        >
          <IconComponent className={`w-5 h-5 ${iconClass}`} />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-slate-500 font-medium truncate">
              {subtitle}
            </span>
          )}
          {trend && (
            <span
              className={`font-bold ml-auto ${
                trend > 0 ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              {trendLabel || (trend > 0 ? `+${trend}%` : `${trend}%`)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardStatCard;
