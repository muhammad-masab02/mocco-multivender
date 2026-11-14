import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Flame, ShoppingBag } from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";

const NewArrivalProducts = ({ productLoading, newArrivalProducts }) => {
  const navigate = useNavigate();

  const largeItem = newArrivalProducts?.[0];
  const mediumItem = newArrivalProducts?.[1];
  const smallItems = newArrivalProducts?.slice(2, 4);

  const getProductImage = (product) => {
    const raw =
      product?.images?.[0]?.url ||
      product?.image_Url?.[0]?.url ||
      product?.image_Url ||
      product?.images?.[0] ||
      product?.image;
    return getImageUrl(
      raw,
      "https://dummyimage.com/600x600/f1f5f9/94a3b8.png&text=New+Arrival",
    );
  };

  const handleProductClick = (product) => {
    const id = product?._id || product?.id;
    if (id) {
      navigate(`/product-detail/${id}`);
    } else {
      navigate("/products");
    }
  };

  if (productLoading) {
    return (
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-slate-200 rounded-full animate-pulse" />
            <div className="h-9 w-64 bg-slate-200 rounded-xl animate-pulse" />
          </div>
          <div className="h-10 w-36 bg-slate-200 rounded-full animate-pulse hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Large Card Skeleton */}
          <div className="lg:col-span-7 h-[420px] sm:h-[480px] lg:h-[520px] rounded-3xl bg-slate-100 animate-pulse relative overflow-hidden flex items-end p-6 border border-slate-200/80">
            <div className="h-28 w-full bg-white/80 backdrop-blur-xs rounded-2xl p-4 space-y-3" />
          </div>

          {/* Right Column Skeletons */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="h-[200px] sm:h-[240px] rounded-2xl bg-slate-100 animate-pulse p-5 flex items-end border border-slate-200/80">
              <div className="h-20 w-3/4 bg-white/80 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-[190px] sm:h-[240px] rounded-2xl bg-slate-100 animate-pulse border border-slate-200/80" />
              <div className="h-[190px] sm:h-[240px] rounded-2xl bg-slate-100 animate-pulse border border-slate-200/80" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Fresh Drops
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            New Arrival <span className="text-red-600">Products</span>
          </h2>
          <p className="mt-1 text-slate-500 text-sm sm:text-base">
            Discover the latest trends and freshest vendor arrivals today
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/products")}
          className="group inline-flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-sm font-bold text-slate-700 hover:text-red-600 transition-all duration-200 shadow-xs hover:shadow-sm"
        >
          <span>View all arrivals</span>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {!newArrivalProducts || newArrivalProducts.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center text-slate-500 shadow-xs">
          No new arrival products available right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LARGE HERO CARD (Left Column) */}
          {largeItem && (
            <article
              onClick={() => handleProductClick(largeItem)}
              className="group relative lg:col-span-7 h-[420px] sm:h-[480px] lg:h-[520px] rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-950 shadow-sm hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 cursor-pointer flex flex-col justify-between p-6 sm:p-8"
            >
              {/* Product Background Image */}
              <img
                src={getProductImage(largeItem)}
                alt={largeItem?.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Ambient High-Contrast Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-black/20 group-hover:via-slate-950/50 transition-colors duration-500" />

              {/* Top Row Badges */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  New Arrival
                </span>

                {largeItem?.category && (
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-semibold capitalize">
                    {largeItem.category}
                  </span>
                )}
              </div>

              {/* Bottom Floating Glass Card */}
              <div className="relative z-10 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/15 p-5 sm:p-6 transition-all duration-300 group-hover:bg-slate-900/90 group-hover:border-red-500/40 group-hover:shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                      {largeItem?.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                      {largeItem?.description || "Experience top tier quality crafted to exceed your everyday expectations."}
                    </p>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-lg sm:text-xl font-extrabold text-white">
                        ${Number(largeItem?.discount_price || largeItem?.price || 0).toFixed(2)}
                      </span>
                      {largeItem?.discount_price && largeItem?.price > largeItem.discount_price && (
                        <span className="text-xs sm:text-sm text-slate-400 line-through">
                          ${Number(largeItem?.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/30 transition-all duration-200 group-hover:scale-105"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Shop Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* RIGHT COLUMN (Medium + 2 Small Cards) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* MEDIUM ITEM (Right Top) */}
            {mediumItem && (
              <article
                onClick={() => handleProductClick(mediumItem)}
                className="group relative h-[200px] sm:h-[240px] rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-950 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col justify-between p-5 sm:p-6"
              >
                <img
                  src={getProductImage(mediumItem)}
                  alt={mediumItem?.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-black/20" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wide">
                    <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                    Hot Pick
                  </span>

                  <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-red-600 group-hover:scale-110 transition-all duration-300">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>

                <div className="relative z-10 space-y-1">
                  <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                    {mediumItem?.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-white">
                      ${Number(mediumItem?.discount_price || mediumItem?.price || 0).toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                      Explore Product &rarr;
                    </span>
                  </div>
                </div>
              </article>
            )}

            {/* TWO SMALL ITEMS (Right Bottom Grid) */}
            <div className="grid grid-cols-2 gap-4">
              {smallItems?.map((item, idx) => (
                <article
                  key={item?._id || item?.id || idx}
                  onClick={() => handleProductClick(item)}
                  className="group relative h-[190px] sm:h-[240px] rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-950 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col justify-between p-4 sm:p-5"
                >
                  <img
                    src={getProductImage(item)}
                    alt={item?.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/20" />

                  <div className="relative z-10 flex justify-end">
                    <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-red-600 group-hover:scale-110 transition-all duration-300">
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>

                  <div className="relative z-10 space-y-1">
                    <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                      {item?.name}
                    </h5>
                    <p className="text-xs sm:text-sm font-black text-white">
                      ${Number(item?.discount_price || item?.price || 0).toFixed(2)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewArrivalProducts;
