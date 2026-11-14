import React from "react";

/**
 * ProductCardSkeleton
 * Matches the platform's ProductCard dimensions and visual hierarchy,
 * including top image area, category/shop label, title lines, and
 * the signature Mocco Mart tinted bottom bar shown in the design specification.
 *
 * Props:
 *  - count: number (optional, defaults to 1). If > 1, returns an array of skeleton cards.
 *  - className: string (optional additional classes for the card container).
 */
export const ProductCardSkeleton = ({ count = 1, className = "" }) => {
  const cards = Array.from({ length: count });

  const renderSingleCard = (key) => (
    <div
      key={key}
      className={`relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all ${className}`}
    >
      {/* Image Area Skeleton */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 animate-pulse flex items-center justify-center">
        {/* Subtle camera/image icon placeholder */}
        <div className="h-10 w-10 rounded-full bg-slate-200/60" />

        {/* Top-right action icon placeholder (simulates wishlist button) */}
        <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-slate-200/70" />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 space-y-3">
        <div className="space-y-2">
          {/* Shop / Category Line */}
          <div className="h-3 w-24 rounded-full bg-slate-200/80 animate-pulse" />

          {/* Product Title Line 1 */}
          <div className="h-4 w-full rounded-full bg-slate-200/80 animate-pulse" />

          {/* Product Title Line 2 */}
          <div className="h-4 w-3/4 rounded-full bg-slate-200/80 animate-pulse" />
        </div>

        {/* Price & Sales Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="h-4 w-14 rounded-full bg-slate-200/80 animate-pulse" />
            <div className="h-3.5 w-10 rounded-full bg-slate-100 animate-pulse" />
          </div>
          <div className="h-3.5 w-12 rounded-full bg-slate-100 animate-pulse" />
        </div>

        {/* Mocco Mart Signature Tinted Bottom Bar (as shown in design spec) */}
        <div className="h-8 w-full rounded-lg bg-red-500/10 animate-pulse" />
      </div>
    </div>
  );

  if (count === 1) {
    return renderSingleCard(0);
  }

  return (
    <>
      {cards.map((_, index) => renderSingleCard(index))}
    </>
  );
};

export default ProductCardSkeleton;
