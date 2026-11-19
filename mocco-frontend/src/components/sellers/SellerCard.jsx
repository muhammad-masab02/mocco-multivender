import React from "react";
import { Link } from "react-router-dom";
import {
  Store,
  Package,
  Star,
  MapPin,
  Calendar,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Tag,
} from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";

const FALLBACK_AVATAR =
  "https://dummyimage.com/240x240/e2e8f0/64748b.png&text=Shop";

const formatJoinedDate = (dateString) => {
  if (!dateString) return "Merchant";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Merchant";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const toTitle = (value) => {
  if (!value) return "Mocco Merchant";
  return String(value)
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const SellerCard = ({ seller, viewMode = "grid" }) => {
  const sellerId = seller?._id || seller?.id;
  const storeUrl = `/shop/${sellerId}`;
  const avatarUrl = getImageUrl(seller?.avatar?.url || seller?.avatar, FALLBACK_AVATAR);
  const ratingValue = Number(seller?.ratings || 0).toFixed(1);
  const productCount = Number(seller?.productCount || 0);
  const totalSell = Number(seller?.totalSell || 0);
  const eventCount = Number(seller?.eventCount || 0);
  const joinedDate = formatJoinedDate(seller?.createdAt);
  const storeName = toTitle(seller?.name);

  if (viewMode === "list") {
    return (
      <article className="group relative bg-white border border-slate-200/90 hover:border-red-300 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4 sm:gap-5 flex-1 min-w-0">
          <Link
            to={storeUrl}
            className="relative shrink-0 block group-hover:scale-105 transition-transform duration-300"
          >
            <img
              src={avatarUrl}
              alt={storeName}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_AVATAR;
              }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-slate-100"
            />
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs"
              title="Verified Merchant"
            >
              <ShieldCheck className="w-3 h-3" />
            </span>
          </Link>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={storeUrl}
                className="text-base sm:text-lg font-black text-slate-900 group-hover:text-red-600 transition-colors tracking-tight truncate"
              >
                {storeName}
              </Link>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{ratingValue > 0 ? ratingValue : "New"}</span>
              </span>
            </div>

            {seller?.description && (
              <p className="text-xs sm:text-sm text-slate-500 line-clamp-1 max-w-2xl">
                {seller.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
              {seller?.addresses && (
                <span className="inline-flex items-center gap-1 text-slate-500 truncate max-w-xs">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{seller.addresses}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Joined {joinedDate}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
          <div className="flex items-center gap-4 text-center">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="block text-xs text-slate-400 font-medium">Products</span>
              <span className="text-sm font-bold text-slate-900">{productCount}</span>
            </div>
            {totalSell > 0 && (
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-xs text-slate-400 font-medium">Sold</span>
                <span className="text-sm font-bold text-slate-900">{totalSell}</span>
              </div>
            )}
          </div>

          <Link
            to={storeUrl}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-red-600 text-white text-xs sm:text-sm font-bold transition-all duration-200 shadow-sm active:scale-95"
          >
            <span>Visit Shop</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </article>
    );
  }

  // Grid Mode Card
  return (
    <article className="group relative bg-white border border-slate-200/90 hover:border-red-300 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      {/* Decorative Store Top Cover */}
      <div className="h-28 w-full bg-linear-to-r from-slate-900 via-slate-800 to-red-950 relative overflow-hidden p-4">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fb7185_1px,transparent_1px)] [background-size:14px_14px]" />
        
        {/* Rating Badge Top Right */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-xs text-xs font-bold text-slate-800">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{ratingValue > 0 ? ratingValue : "New"}</span>
        </div>

        {/* Event indicator if active */}
        {eventCount > 0 && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
            <Tag className="w-3 h-3" />
            <span>{eventCount} Event{eventCount > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Store Info Content */}
      <div className="p-5 sm:p-6 pt-0 flex-1 flex flex-col justify-between">
        {/* Avatar - Elevated & Overlapping Header */}
        <div className="-mt-12 mb-3.5 flex items-end justify-between">
          <Link
            to={storeUrl}
            className="relative block rounded-2xl p-1 bg-white shadow-md ring-2 ring-slate-100 group-hover:scale-105 transition-transform duration-300 shrink-0"
          >
            <img
              src={avatarUrl}
              alt={storeName}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_AVATAR;
              }}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-100"
            />
            <span
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs"
              title="Verified Merchant"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </Link>

          <span className="text-[11px] font-semibold text-slate-400 inline-flex items-center gap-1 mb-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Since {joinedDate}</span>
          </span>
        </div>

        {/* Name & Bio */}
        <div className="space-y-1.5 mb-4">
          <Link
            to={storeUrl}
            className="block text-lg font-black text-slate-900 group-hover:text-red-600 transition-colors tracking-tight line-clamp-1"
          >
            {storeName}
          </Link>

          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {seller?.description || "Welcome to our store! Browse our featured products and special deals."}
          </p>

          {seller?.addresses && (
            <div className="flex items-center gap-1 text-xs text-slate-400 font-medium pt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{seller.addresses}</span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 mb-5 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-semibold mb-0.5">
              <Package className="w-3 h-3 text-slate-400" />
              <span>Products</span>
            </div>
            <p className="text-sm font-extrabold text-slate-900">
              {productCount}
            </p>
          </div>

          <div className="border-l border-slate-200/80">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-semibold mb-0.5">
              <TrendingUp className="w-3 h-3 text-slate-400" />
              <span>Total Sold</span>
            </div>
            <p className="text-sm font-extrabold text-slate-900">
              {totalSell}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={storeUrl}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-red-600 active:scale-[0.98] text-white text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shadow-md shadow-slate-900/10 group-hover:shadow-red-600/20"
        >
          <Store className="w-4 h-4" />
          <span>Explore Store</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export const SellerCardSkeleton = ({ viewMode = "grid" }) => {
  if (viewMode === "list") {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs animate-pulse flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 w-full">
          <div className="w-18 h-18 rounded-2xl bg-slate-200 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-slate-200 rounded-md w-48" />
            <div className="h-3.5 bg-slate-200 rounded-md w-3/4" />
            <div className="h-3 bg-slate-200 rounded-md w-32" />
          </div>
        </div>
        <div className="w-32 h-10 bg-slate-200 rounded-2xl shrink-0" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs animate-pulse">
      <div className="h-28 bg-slate-200" />
      <div className="p-5 sm:p-6 pt-0 space-y-4">
        <div className="-mt-10 w-20 h-20 rounded-2xl bg-slate-300 border-4 border-white" />
        <div className="space-y-2">
          <div className="h-5 bg-slate-200 rounded-md w-3/4" />
          <div className="h-3.5 bg-slate-200 rounded-md w-full" />
          <div className="h-3.5 bg-slate-200 rounded-md w-2/3" />
        </div>
        <div className="h-14 bg-slate-100 rounded-2xl" />
        <div className="h-11 bg-slate-200 rounded-2xl" />
      </div>
    </div>
  );
};

export default SellerCard;
