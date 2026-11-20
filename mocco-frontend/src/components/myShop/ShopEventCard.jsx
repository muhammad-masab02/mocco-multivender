import React from "react";
import { toTitle } from "./utils";
import { Sparkles, Clock, Flame, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ShopEventCard = ({ event, isPast = false }) => {
  const navigate = useNavigate();
  const title = toTitle(event?.name || "Event");
  const imageUrl =
    event?.images?.[0]?.url ||
    "https://dummyimage.com/600x400/f1f5f9/94a3b8.png&text=Event";

  const endsOn = event?.endDate
    ? new Date(event.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Ongoing";

  const isExpired =
    isPast ||
    event?.status === "Ended" ||
    (event?.endDate && new Date(event.endDate).getTime() < Date.now());
  const status = isExpired ? "Ended" : event?.status || "Running";

  const price = Number(event?.discount_price || event?.price || 0);
  const originalPrice = Number(event?.price || 0);
  const hasDiscount =
    event?.discount_price && Number(event?.discount_price) < originalPrice;
  const discountPercent =
    hasDiscount && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const sold = Number(event?.total_sell || 0);
  const stock = Number(event?.stock || 0);
  const totalUnits = sold + stock;
  const soldPercent =
    totalUnits > 0 ? Math.min(100, Math.round((sold / totalUnits) * 100)) : 0;

  const handleCardClick = () => {
    if (event?._id) {
      navigate(`/product-detail/${event._id}`);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white hover:border-red-200/90 shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:shadow-[0_16px_36px_rgba(239,68,68,0.12)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer select-none"
    >
      {/* Top Image area */}
      <div className="relative h-52 sm:h-56 overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 z-10">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide backdrop-blur-md shadow-sm ${
              status === "Running"
                ? "bg-slate-900/85 text-white"
                : "bg-rose-500/90 text-white"
            }`}
          >
            {status === "Running" && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            )}
            {status}
          </span>

          {discountPercent > 0 && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              <Sparkles size={10} className="fill-white" />
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Date Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="inline-flex items-center gap-1.5 rounded-xl bg-white/90 backdrop-blur-md px-3 py-1 shadow-sm border border-white/60 text-slate-800">
            <Clock
              size={12}
              className={status === "Ended" ? "text-slate-400" : "text-red-500"}
            />
            <span className="text-[11px] font-bold">
              {status === "Ended" ? `Ended: ${endsOn}` : `Ends: ${endsOn}`}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-base sm:text-lg font-bold leading-snug text-slate-800 group-hover:text-red-600 transition-colors">
            {title}
          </h3>

          <p className="line-clamp-2 text-xs sm:text-sm leading-relaxed text-slate-500 font-light">
            {event?.description ||
              "Special limited-time promotional offer with verified inventory."}
          </p>
        </div>

        {/* Pricing & Progress Box */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900">
                ${price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {sold > 0 && (
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Flame size={12} className="text-orange-500 fill-orange-500" />
                {sold} claimed
              </span>
            )}
          </div>

          {totalUnits > 0 && (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-500"
                style={{ width: `${Math.max(8, soldPercent)}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ShopEventCard;
