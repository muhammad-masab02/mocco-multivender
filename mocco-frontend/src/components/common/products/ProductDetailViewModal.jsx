import React from "react";
import {
  X,
  Star,
  ShoppingCart,
  Store,
  MessageCircle,
  ShieldCheck,
  Truck,
  Sparkles,
  Plus,
  Minus,
  ExternalLink,
  RotateCcw,
  Flame,
} from "lucide-react";
import { Link } from "react-router-dom";

const ProductDetailViewModal = ({
  product,
  productImage,
  productPrice,
  originalPrice,
  rating = 0,
  reviewsCount = 0,
  stock = 0,
  maxQuantity = 10,
  productId,
  renderStars,
  addedDate,
  quantity = 1,
  onClose,
  onIncrease,
  onDecrease,
  onAddToCart,
  onNavigateToShop,
  onSendMessage,
}) => {
  const currentPrice = Number(productPrice || 0);
  const regularPrice = Number(originalPrice || productPrice || 0);
  const hasDiscount = regularPrice > currentPrice && currentPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100)
    : 0;

  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <div
      className="fixed inset-0 z-[999] bg-slate-950/60 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Sticky Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Quick View
            </span>
            {product?.category && (
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold capitalize">
                {product.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {productId && (
              <Link
                to={`/product-detail/${productId}`}
                onClick={onClose}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-red-600 px-3 py-1.5 rounded-xl hover:bg-red-50/50 transition-colors"
              >
                <span>Full Product Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}

            <button
              type="button"
              onClick={onClose}
              title="Close modal"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* LEFT COLUMN: Product Image & Seller Details */}
            <div className="lg:col-span-5 space-y-4">
              {/* Product Image Container */}
              <div className="group relative w-full aspect-square rounded-2xl bg-slate-50 border border-slate-200/80 p-4 flex items-center justify-center overflow-hidden">
                <img
                  src={productImage}
                  alt={product?.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Badges on Image */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                  {hasDiscount && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md shadow-red-600/30">
                      Save {discountPercent}%
                    </span>
                  )}
                  {isLowStock && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-sm">
                      Only {stock} left
                    </span>
                  )}
                </div>
              </div>

              {/* Seller / Store Information Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-xs">
                      <Store className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Sold by
                      </p>
                      <button
                        type="button"
                        onClick={onNavigateToShop}
                        className="text-xs sm:text-sm font-bold text-slate-900 hover:text-red-600 transition-colors truncate block text-left"
                      >
                        {product?.shop?.name || "Verified Merchant"}
                      </button>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSendMessage) {
                      onSendMessage(product?.shop);
                    }
                  }}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 hover:border-red-300 hover:text-red-600 bg-white font-bold text-xs text-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Message Seller</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Info & Purchase Controls */}
            <div className="lg:col-span-7 space-y-5">
              {/* Title & Ratings */}
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight">
                  {product?.name}
                </h3>

                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span className="text-amber-700">{Number(rating || 0).toFixed(1)}</span>
                    <span className="text-amber-600/80 font-normal">
                      ({reviewsCount} {reviewsCount === 1 ? "review" : "reviews"})
                    </span>
                  </div>

                  {product?.total_sell > 0 && (
                    <div className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-semibold">
                      <Flame size={12} className="text-red-500 fill-red-500" />
                      <span>{product.total_sell} sold</span>
                    </div>
                  )}

                  {/* Stock status indicator */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold ${
                      isOutOfStock
                        ? "bg-rose-50 text-rose-600"
                        : isLowStock
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isOutOfStock
                          ? "bg-rose-500"
                          : isLowStock
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                      }`}
                    />
                    <span>
                      {isOutOfStock
                        ? "Out of Stock"
                        : isLowStock
                          ? `Only ${stock} left`
                          : "In Stock"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-slate-50 to-red-50/30 border border-slate-200/80 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  ${currentPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-sm font-semibold text-slate-400 line-through">
                    ${regularPrice.toFixed(2)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="ml-auto text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    Save ${(regularPrice - currentPrice).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Description
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {product?.description || "No description available for this product."}
                </p>
              </div>

              {/* Quantity Stepper & Add to Cart Action */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Quantity:
                  </span>

                  <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-xs">
                    <button
                      type="button"
                      disabled={quantity <= 1 || isOutOfStock}
                      onClick={onDecrease}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= maxQuantity || isOutOfStock}
                      onClick={onIncrease}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <span className="text-[11px] font-medium text-slate-400">
                    Max: {maxQuantity}
                  </span>
                </div>

                {/* Primary Add to Cart Button */}
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={onAddToCart}
                  className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-red-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-slate-900/15 cursor-pointer active:scale-[0.98]"
                >
                  <ShoppingCart size={16} />
                  <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
                </button>
              </div>

              {/* Trust Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 rounded-xl bg-slate-50 text-[11px] font-semibold text-slate-600 flex flex-col items-center gap-1">
                  <Truck size={14} className="text-red-500" />
                  <span>Fast Shipping</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 text-[11px] font-semibold text-slate-600 flex flex-col items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>100% Secure</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 text-[11px] font-semibold text-slate-600 flex flex-col items-center gap-1">
                  <RotateCcw size={14} className="text-blue-500" />
                  <span>30-Day Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer / Direct Navigation Hint */}
        {productId && (
          <div className="bg-slate-50 px-5 sm:px-7 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Need more details, reviews or specifications?
            </span>
            <Link
              to={`/product-detail/${productId}`}
              onClick={onClose}
              className="font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1 hover:underline"
            >
              <span>View Full Details &rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailViewModal;
