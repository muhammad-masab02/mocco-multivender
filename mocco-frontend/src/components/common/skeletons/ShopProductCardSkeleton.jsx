import React from "react";

/**
 * ShopProductCardSkeleton
 * Matches the layout and rounded-3xl styling of ShopProductCard.
 */
export const ShopProductCardSkeleton = ({ count = 1 }) => {
  const items = Array.from({ length: count });

  const renderCard = (key) => (
    <article
      key={key}
      className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm"
    >
      {/* Top Image area */}
      <div className="relative h-56 bg-slate-100 animate-pulse flex items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-slate-200/60" />
        <div className="absolute left-3 top-3 h-5 w-20 rounded-full bg-slate-200" />
      </div>

      {/* Content */}
      <div className="space-y-3.5 p-5 sm:p-6">
        <div className="h-6 w-4/5 rounded-md bg-slate-200/80 animate-pulse" />

        {/* Rating and Stock Bar */}
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3.5 py-2.5">
          <div className="h-4 w-20 rounded bg-slate-200/80 animate-pulse" />
          <div className="h-4 w-16 rounded bg-slate-200/60 animate-pulse" />
        </div>

        {/* Price and Action Row */}
        <div className="flex items-end justify-between pt-1">
          <div className="h-7 w-20 rounded-md bg-slate-200/80 animate-pulse" />
          <div className="h-9 w-24 rounded-full bg-slate-200/80 animate-pulse" />
        </div>
      </div>
    </article>
  );

  if (count === 1) return renderCard(0);

  return (
    <>
      {items.map((_, i) => renderCard(i))}
    </>
  );
};

export default ShopProductCardSkeleton;
