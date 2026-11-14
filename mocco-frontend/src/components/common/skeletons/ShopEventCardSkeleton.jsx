import React from "react";

/**
 * ShopEventCardSkeleton
 * Matches the layout and rounded-3xl styling of ShopEventCard.
 */
export const ShopEventCardSkeleton = ({ count = 1 }) => {
  const items = Array.from({ length: count });

  const renderCard = (key) => (
    <article
      key={key}
      className="relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm"
    >
      {/* Image Area */}
      <div className="relative h-48 sm:h-56 bg-slate-100 animate-pulse flex items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-slate-200/60" />
        <div className="absolute left-4 top-4 h-5 w-18 rounded-full bg-emerald-500/20" />
        <div className="absolute bottom-4 left-4 h-10 w-24 rounded-xl bg-white/80" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 space-y-3">
        <div className="h-6 w-3/4 rounded-md bg-slate-200/80 animate-pulse" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-full rounded-full bg-slate-100 animate-pulse" />
          <div className="h-3.5 w-2/3 rounded-full bg-slate-100 animate-pulse" />
        </div>
        <div className="mt-auto pt-4">
          <div className="h-10 w-full rounded-2xl bg-slate-200/80 animate-pulse" />
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

export default ShopEventCardSkeleton;
