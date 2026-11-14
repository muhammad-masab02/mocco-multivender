import React from "react";
import { toTitle } from "./utils";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingBag, Eye, Sparkles } from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";

const ShopProductCard = ({ product }) => {
  const navigate = useNavigate();
  const title = toTitle(product?.name);
  const price = Number(product?.discount_price ?? product?.price ?? 0);
  const oldPrice = product?.discount_price ? Number(product?.price) : null;
  const rating = Number(product?.rating || 0);
  const category = toTitle(product?.category || "General");

  const imageUrl = getImageUrl(
    product?.images?.[0]?.url || product?.image_Url?.[0]?.url || product?.images?.[0],
    "https://dummyimage.com/600x600/f1f5f9/94a3b8.png&text=Product"
  );

  const discountPercent =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null;

  return (
    <article
      onClick={() => navigate(`/product-detail/${product._id}`)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white hover:border-red-200/90 shadow-xs hover:shadow-[0_16px_36px_rgba(239,68,68,0.12)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer select-none"
    >
      {/* Top Image area */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Ambient Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Pill */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-bold tracking-wide text-slate-700 shadow-xs border border-slate-200/60">
          {category}
        </span>

        {/* Discount Badge */}
        {discountPercent && (
          <span className="absolute right-3 top-3 rounded-full bg-red-600 text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-sm">
            -{discountPercent}%
          </span>
        )}

        {/* Quick View Pill on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <div className="w-full py-2 rounded-2xl bg-white/95 backdrop-blur-xs text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md">
            <Eye className="w-3.5 h-3.5 text-red-600" />
            <span>View Details</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 justify-between space-y-3">
        <div>
          <h3 className="line-clamp-2 text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-red-600 transition-colors">
            {title}
          </h3>

          <div className="mt-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{rating > 0 ? rating.toFixed(1) : "New"}</span>
            </div>
            <span className={`text-[11px] font-bold ${product?.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
              {product?.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>

        {/* Pricing Row */}
        <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-black text-slate-900">
              ${price.toFixed(2)}
            </span>
            {oldPrice && (
              <span className="text-xs font-semibold text-slate-400 line-through">
                ${oldPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            {product?.total_sell || 0} sold
          </span>
        </div>
      </div>
    </article>
  );
};

export default ShopProductCard;
