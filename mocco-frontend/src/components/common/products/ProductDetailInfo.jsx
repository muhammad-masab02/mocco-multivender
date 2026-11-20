import React, { useState } from "react";
import {
  Plus,
  Minus,
  Star,
  ShieldCheck,
  Truck,
  Heart,
  ShoppingCart,
  ShoppingBag,
  RotateCcw,
  Lock,
  Flame,
  Store,
  Check,
  Share2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ProductDetailInfo = ({
  name,
  rating = 0,
  reviews = [],
  description,
  price,
  discount_price,
  stock = 100,
  total_sell = 0,
  category,
  shop,
  startDate,
  endDate,
  status,

  quantity,
  setQuantity,

  isWishlisted,
  isCartLoading,
  isWishlistLoading,
  onWishlistToggle,
  onAddToCart,
  onBuyNow,
  onScrollToReviews,
}) => {
  const [copied, setCopied] = useState(false);

  const reviewsCount = Array.isArray(reviews) ? reviews.length : 0;
  const displayRating = Number(rating || 0).toFixed(1);

  const isEvent = Boolean(endDate);
  const isExpired =
    isEvent &&
    (status === "Ended" || new Date(endDate).getTime() < Date.now());

  const regularPrice = Number(price || 0);
  const salePrice = Number(discount_price || price || 0);
  const hasDiscount = regularPrice > salePrice && salePrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
    : 0;

  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 10;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: name,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Product link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // User cancelled share
    }
  };

  return (
    <div className="w-full space-y-6 flex flex-col justify-center">
      {/* Category & Shop Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider">
              {category}
            </span>
          )}

          {shop?.name && (
            <Link
              to={`/shop/${shop?._id || shop?.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors bg-slate-50 hover:bg-red-50/50 px-3 py-1 rounded-full border border-slate-200/80"
            >
              <Store className="w-3.5 h-3.5 text-slate-400" />
              <span>{shop.name}</span>
            </Link>
          )}
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
          title="Share product"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
        </button>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight">
          {name}
        </h1>

        {/* Rating, Reviews & Sells Badge Bar */}
        <div className="mt-3.5 flex flex-wrap items-center gap-3 text-sm">
          {/* Star Rating Chip */}
          <button
            type="button"
            onClick={onScrollToReviews}
            className="group flex items-center gap-1.5 text-amber-500 bg-amber-50/80 hover:bg-amber-100/80 px-3 py-1 rounded-full transition-colors cursor-pointer"
          >
            <Star size={15} className="fill-amber-400 text-amber-400" />
            <span className="font-bold text-amber-700 text-xs sm:text-sm">
              {displayRating}
            </span>
            <span className="text-amber-600/80 text-xs">
              ({reviewsCount} {reviewsCount === 1 ? "review" : "reviews"})
            </span>
          </button>

          <span className="h-3.5 w-px bg-slate-200" />

          {/* Sold count badge */}
          {total_sell > 0 && (
            <>
              <div className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                <span>{total_sell}+ sold</span>
              </div>
              <span className="h-3.5 w-px bg-slate-200" />
            </>
          )}

          {/* Stock Status Badge with Animated Beacon */}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
              isOutOfStock
                ? "bg-rose-50 text-rose-600 border border-rose-200"
                : isLowStock
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            <span className="relative flex h-2 w-2">
              {!isOutOfStock && (
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isLowStock ? "bg-amber-400" : "bg-emerald-400"
                  }`}
                />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isOutOfStock
                    ? "bg-rose-500"
                    : isLowStock
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
              />
            </span>
            <span>
              {isOutOfStock
                ? "Out of Stock"
                : isLowStock
                  ? `Only ${stock} left in stock!`
                  : "In Stock - Ready to Ship"}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-slate-50 to-red-50/30 border border-slate-200/80 space-y-2">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            ${salePrice.toFixed(2)}
          </span>

          {hasDiscount && (
            <>
              <span className="text-lg sm:text-xl font-medium text-slate-400 line-through">
                ${regularPrice.toFixed(2)}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wide shadow-sm shadow-red-500/20">
                Save {discountPercent}%
              </span>
            </>
          )}
        </div>

        <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium pt-1">
          <Sparkles className="w-3.5 h-3.5 text-red-500" />
          <span>Free delivery on orders over $100 • 30-Day Money-Back Guarantee</span>
        </p>
      </div>

      {/* Short Description */}
      {description && (
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal line-clamp-3">
          {description}
        </p>
      )}

      {/* Event Ended Notice Banner */}
      {isExpired && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800">
          <div className="h-9 w-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-600 font-extrabold text-base">
            !
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-bold text-rose-900">
              Promotional Event Concluded
            </p>
            <p className="text-xs text-rose-700">
              This promotional sale ended on{" "}
              {endDate
                ? new Date(endDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "the scheduled date"}
              . This item is no longer available for purchase.
            </p>
          </div>
        </div>
      )}

      {/* Quantity & Actions Bar */}
      <div className="pt-2 space-y-4">
        <div className="flex items-center justify-between sm:justify-start gap-5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Quantity:
          </span>

          {/* Stepper */}
          <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-xs">
            <button
              type="button"
              disabled={quantity <= 1 || isOutOfStock || isExpired}
              onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>

            <span className="w-12 text-center text-sm font-bold text-slate-900">
              {quantity}
            </span>

            <button
              type="button"
              disabled={quantity >= stock || isOutOfStock || isExpired}
              onClick={() => setQuantity(quantity < stock ? quantity + 1 : stock)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          <span className="text-xs text-slate-400">
            {isExpired
              ? "Event concluded"
              : stock > 0
              ? `Max: ${stock} items`
              : "Unavailable"}
          </span>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
          {/* Add to Cart */}
          <button
            type="button"
            onClick={onAddToCart}
            disabled={isCartLoading || isOutOfStock || isExpired}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-slate-900/15 cursor-pointer active:scale-[0.98]"
          >
            {isCartLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Adding to Cart...</span>
              </>
            ) : isExpired ? (
              <span>Event Concluded</span>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>Add To Cart</span>
              </>
            )}
          </button>

          {/* Buy Now */}
          <button
            type="button"
            onClick={onBuyNow}
            disabled={isOutOfStock || isExpired}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-red-600/25 cursor-pointer active:scale-[0.98]"
          >
            {isExpired ? (
              <span>Offer Ended</span>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>Buy Now</span>
              </>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={onWishlistToggle}
            disabled={isWishlistLoading}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`w-14 h-14 shrink-0 rounded-2xl border flex items-center justify-center transition-all duration-200 cursor-pointer ${
              isWishlisted
                ? "bg-red-50 border-red-200 text-red-600 shadow-sm"
                : "bg-white border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50/30"
            }`}
          >
            {isWishlistLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-red-500" />
            ) : (
              <Heart
                size={22}
                className={`transition-transform duration-200 hover:scale-110 ${
                  isWishlisted ? "fill-red-600 text-red-600" : ""
                }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Trust & Guarantee Grid */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 text-slate-700 text-xs font-semibold">
          <Truck className="w-4 h-4 text-red-600 shrink-0" />
          <span>Express Delivery</span>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 text-slate-700 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>100% Genuine</span>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 text-slate-700 text-xs font-semibold">
          <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
          <span>30-Day Easy Return</span>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 text-slate-700 text-xs font-semibold">
          <Lock className="w-4 h-4 text-purple-600 shrink-0" />
          <span>Secure Checkout</span>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailInfo;
