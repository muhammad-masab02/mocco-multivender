import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl.js";
import {
  Zap,
  Clock,
  Flame,
  ArrowRight,
  Eye,
  Store,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

const formatMoney = (value) => {
  const numberValue = Number(value || 0);
  if (!Number.isFinite(numberValue)) return "$0.00";
  return `$${numberValue.toFixed(2)}`;
};

const getCountdownParts = (endDate, nowTime = Date.now()) => {
  const endTime = new Date(endDate).getTime();

  if (!Number.isFinite(endTime)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const diff = Math.max(0, endTime - nowTime);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: diff <= 0,
  };
};

const formatCountdownValue = (value) => String(value).padStart(2, "0");

const getCardData = (eventProduct = {}) => {
  const rawImg =
    eventProduct?.images?.[0]?.url ||
    eventProduct?.image_Url?.[0]?.url ||
    eventProduct?.images?.[0];

  const imageUrl = getImageUrl(
    rawImg,
    "https://dummyimage.com/600x600/f1f5f9/94a3b8.png&text=Event",
  );

  const secondaryRaw =
    eventProduct?.images?.[1]?.url ||
    eventProduct?.image_Url?.[1]?.url ||
    eventProduct?.images?.[1];
  const secondaryImage = secondaryRaw ? getImageUrl(secondaryRaw) : null;

  const title = eventProduct?.name || "Event Product";
  const category =
    eventProduct?.category ||
    eventProduct?.subCategory ||
    eventProduct?.mainCategory ||
    "Special Offer";
  const shortDescription =
    eventProduct?.description?.slice(0, 140) ||
    "Limited-time promotional event with exclusive savings and verified stock.";

  const originalPrice = Number(eventProduct?.price || 0);
  const discountPrice = Number(eventProduct?.discount_price || originalPrice);
  const stock = Number(eventProduct?.stock || 0);
  const sold = Number(eventProduct?.total_sell || 0);
  const totalUnits = stock + sold;
  const soldPercent =
    totalUnits > 0 ? Math.min(100, Math.round((sold / totalUnits) * 100)) : 0;
  const discountPercent =
    originalPrice > 0
      ? Math.max(
          0,
          Math.round(((originalPrice - discountPrice) / originalPrice) * 100),
        )
      : 0;

  return {
    imageUrl,
    secondaryImage,
    title,
    category,
    shortDescription,
    originalPrice,
    discountPrice,
    stock,
    sold,
    totalUnits,
    soldPercent,
    discountPercent,
  };
};

const EventCard = ({
  eventProduct,
  variant = "hero",
  className = "",
  showMoreCta = false,
}) => {
  const navigate = useNavigate();
  const [clockTick, setClockTick] = useState(0);

  const {
    imageUrl,
    secondaryImage,
    title,
    category,
    shortDescription,
    originalPrice,
    discountPrice,
    stock,
    sold,
    totalUnits,
    soldPercent,
    discountPercent,
  } = getCardData(eventProduct);

  const countdownReady = clockTick > 0;
  const countdown = countdownReady
    ? getCountdownParts(eventProduct?.endDate, clockTick)
    : null;

  const isSoldOut = stock <= 0;
  const productId = eventProduct?._id || eventProduct?.id;

  useEffect(() => {
    const syncClock = () => setClockTick(Date.now());
    const initialTimer = window.setTimeout(syncClock, 0);
    const timer = setInterval(() => {
      setClockTick(Date.now());
    }, 1000);

    return () => {
      window.clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, []);

  const handleSeeDetails = (e) => {
    e?.stopPropagation();
    if (!productId) return;
    navigate(`/product-detail/${productId}`);
  };

  const handleBuyNow = (e) => {
    e?.stopPropagation();
    if (productId) {
      navigate(`/product-detail/${productId}`);
    } else {
      navigate("/checkout");
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // COMPACT VARIANT (Grid event card used in secondary displays)
  // ───────────────────────────────────────────────────────────────────────────
  if (variant === "compact") {
    return (
      <article
        onClick={handleSeeDetails}
        className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white hover:border-red-200/90 shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:shadow-[0_16px_36px_rgba(239,68,68,0.12)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer select-none ${className}`}
      >
        {/* Media Container */}
        <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-100/90 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className={`h-full w-full object-cover object-center transition-all duration-500 ease-out ${
              secondaryImage
                ? "group-hover:opacity-0 group-hover:scale-105"
                : "group-hover:scale-108"
            }`}
          />
          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-105"
            />
          )}

          {/* Top Left Badges: Live beacon + Discount */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/85 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Live
            </span>

            {discountPercent > 0 && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-md shadow-red-500/20">
                <Sparkles size={11} className="fill-white" />
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Top Right Quick View */}
          <button
            type="button"
            onClick={handleSeeDetails}
            className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-red-600 border border-white/60 shadow-md backdrop-blur-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
            title="View details"
          >
            <Eye size={15} />
          </button>

          {/* Bottom Floating Countdown Ticker */}
          <div className="absolute inset-x-3 bottom-3 z-10">
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-semibold shadow-lg">
              <span className="flex items-center gap-1 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                <Clock size={12} />
                Time Left
              </span>
              <span className="font-mono text-xs font-bold tracking-tight text-white">
                {countdown?.isExpired
                  ? "Ended"
                  : countdownReady
                    ? `${countdown.days}d ${formatCountdownValue(
                        countdown.hours,
                      )}h ${formatCountdownValue(countdown.minutes)}m`
                    : "--:--"}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 space-y-3">
          <div className="space-y-1.5">
            {/* Category tag */}
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate">
              {category}
            </span>

            {/* Title */}
            <h3
              className="font-semibold text-slate-800 group-hover:text-red-600 transition-colors line-clamp-2 text-xs sm:text-sm leading-snug min-h-[2.4rem]"
              title={title}
            >
              {title}
            </h3>
          </div>

          {/* Pricing & Claim Bar */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {/* Price Row */}
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-extrabold text-slate-900">
                  {formatMoney(discountPrice)}
                </span>
                {originalPrice > discountPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatMoney(originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {soldPercent}% claimed
              </span>
            </div>

            {/* Stock Progress Bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-500"
                style={{ width: `${Math.max(8, soldPercent)}%` }}
              />
            </div>
          </div>
        </div>
      </article>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // HERO VARIANT (Grand showcase banner used on Home and Events page)
  // ───────────────────────────────────────────────────────────────────────────
  const saveAmount = Math.max(0, originalPrice - discountPrice);

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* ── Left Column: Media Showcase (5 cols) ─────────────────────────── */}
        <div className="relative lg:col-span-5 bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-100/90 p-6 sm:p-8 flex flex-col justify-between items-center border-b lg:border-b-0 lg:border-r border-slate-100 overflow-hidden">
          {/* Top Badges */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-sm uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              {isSoldOut ? "Sold Out" : "Flash Event"}
            </span>

            {discountPercent > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-red-600 to-rose-500 px-3 py-1 text-xs font-bold text-white shadow-md shadow-red-500/20">
                <Sparkles size={12} className="fill-white" />
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Product Image Frame */}
          <div className="relative my-6 w-full aspect-square max-w-[340px] flex items-center justify-center">
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              className={`max-h-full max-w-full object-contain drop-shadow-md transition-all duration-500 ease-out ${
                secondaryImage
                  ? "group-hover:opacity-0 group-hover:scale-105"
                  : "group-hover:scale-105"
              }`}
            />
            {secondaryImage && (
              <img
                src={secondaryImage}
                alt={title}
                loading="lazy"
                className="absolute inset-0 m-auto max-h-full max-w-full object-contain opacity-0 drop-shadow-md transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-105"
              />
            )}
          </div>

          {/* Real-time Units Sold & Claimed Bar */}
          <div className="w-full rounded-2xl bg-white/90 border border-slate-200/80 p-4 shadow-sm backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Flame size={14} className="text-orange-500 fill-orange-500" />
                <span>{sold} claimed</span>
              </span>
              <span className="text-slate-500">
                {stock > 0 ? `${stock} remaining` : "Out of stock"}
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 transition-all duration-700 ease-out"
                style={{ width: `${Math.max(8, soldPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Right Column: Info & Action Section (7 cols) ─────────────────── */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category / Event Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                <Zap size={12} className="fill-red-600" />
                {category}
              </span>
              {eventProduct?.shop?.name && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                  <Store size={12} className="text-slate-400" />
                  {eventProduct.shop.name}
                </span>
              )}
            </div>

            {/* Headline Title */}
            <h2
              onClick={handleSeeDetails}
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug hover:text-red-600 transition-colors cursor-pointer"
            >
              {title}
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light line-clamp-3">
              {shortDescription}
            </p>

            {/* ── Animated Countdown Clock ───────────────────────────────── */}
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Clock size={13} className="text-red-500" />
                  {countdown?.isExpired
                    ? "Event Expired"
                    : "Limited Time Remaining"}
                </span>
                <span className="text-xs font-semibold text-red-600">
                  {countdown?.isExpired ? "Deals ended" : "Ending soon"}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                {[
                  { label: "Days", value: countdown?.days ?? "--" },
                  { label: "Hours", value: countdown?.hours ?? "--" },
                  { label: "Minutes", value: countdown?.minutes ?? "--" },
                  { label: "Seconds", value: countdown?.seconds ?? "--" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs group-hover:border-red-200 transition-colors"
                  >
                    <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                      {typeof item.value === "number"
                        ? formatCountdownValue(item.value)
                        : item.value}
                    </span>
                    <span className="mt-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Pricing Block ──────────────────────────────────────────── */}
            <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between flex-wrap gap-2">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {formatMoney(discountPrice)}
                </span>
                {originalPrice > discountPrice && (
                  <span className="text-sm sm:text-base text-slate-400 line-through">
                    {formatMoney(originalPrice)}
                  </span>
                )}
              </div>

              {saveAmount > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 shadow-xs">
                  Save {formatMoney(saveAmount)}
                </span>
              )}
            </div>
          </div>

          {/* ── Action Buttons ─────────────────────────────────────────────── */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isSoldOut}
              className={`w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer ${
                isSoldOut
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-red-600 hover:bg-red-700 active:scale-98 text-white shadow-red-600/25 hover:shadow-red-600/35"
              }`}
            >
              <ShoppingBag size={16} />
              <span>{isSoldOut ? "Sold Out" : "Claim Deal Now"}</span>
            </button>

            <button
              type="button"
              onClick={handleSeeDetails}
              className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800 transition-all duration-200 cursor-pointer shadow-xs active:scale-98"
            >
              <span>View Product Details</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {showMoreCta && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/events")}
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 transition"
              >
                <span>Browse All Active Events</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default EventCard;
