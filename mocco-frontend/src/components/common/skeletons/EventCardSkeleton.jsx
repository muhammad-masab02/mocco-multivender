import React from "react";

/**
 * EventCardSkeleton
 * Provides loading skeletons for both "hero" and "compact" event card layouts.
 * Matches EventCard's dimensions, countdown boxes, progress bar, and badges.
 *
 * Props:
 *  - variant: 'hero' | 'compact' (default 'hero')
 *  - count: number (default 1)
 *  - className: string (optional)
 */
export const EventCardSkeleton = ({
  variant = "hero",
  count = 1,
  className = "",
}) => {
  const items = Array.from({ length: count });

  const renderSingleHero = (key) => (
    <div
      key={key}
      className={`overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md ${className}`}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left: Image Placeholder */}
        <div className="relative h-64 sm:h-80 lg:h-auto lg:w-1/2 min-h-[300px] bg-slate-100 animate-pulse flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-slate-200/60" />
          {/* Badge Placeholder */}
          <div className="absolute top-4 left-4 h-6 w-20 rounded-full bg-red-500/20" />
        </div>

        {/* Right: Info Section */}
        <div className="flex flex-1 flex-col justify-between p-6 sm:p-8 lg:p-10 space-y-6">
          <div className="space-y-4">
            {/* Category / Shop Tag */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-28 rounded-full bg-slate-200/80 animate-pulse" />
              <div className="h-4 w-16 rounded-full bg-slate-100 animate-pulse" />
            </div>

            {/* Title */}
            <div className="h-8 w-4/5 rounded-lg bg-slate-200/80 animate-pulse" />

            {/* Short Description */}
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded-full bg-slate-100 animate-pulse" />
              <div className="h-3.5 w-5/6 rounded-full bg-slate-100 animate-pulse" />
            </div>

            {/* Price & Discount */}
            <div className="flex items-center gap-3 pt-2">
              <div className="h-7 w-24 rounded-lg bg-slate-200/80 animate-pulse" />
              <div className="h-5 w-16 rounded-md bg-slate-100 animate-pulse" />
              <div className="h-5 w-14 rounded-full bg-red-500/10 animate-pulse" />
            </div>

            {/* Progress Bar Placeholder */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between">
                <div className="h-3 w-20 rounded-full bg-slate-200/80 animate-pulse" />
                <div className="h-3 w-16 rounded-full bg-slate-200/80 animate-pulse" />
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 animate-pulse" />
            </div>
          </div>

          {/* Countdown timer placeholder boxes */}
          <div className="space-y-2">
            <div className="h-3 w-28 rounded-full bg-slate-200/80 animate-pulse" />
            <div className="flex items-center gap-2 sm:gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-14 w-14 sm:h-16 sm:w-16 flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50 animate-pulse"
                >
                  <div className="h-5 w-6 rounded bg-slate-200" />
                  <div className="mt-1 h-2 w-8 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-11 w-32 rounded-full bg-slate-200/80 animate-pulse" />
            <div className="h-11 w-28 rounded-full bg-red-500/20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSingleCompact = (key) => (
    <div
      key={key}
      className={`relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {/* Top Image */}
      <div className="relative h-48 w-full bg-slate-100 animate-pulse flex items-center justify-center">
        <div className="h-10 w-10 rounded-full bg-slate-200/60" />
        <div className="absolute top-3 left-3 h-5 w-14 rounded-full bg-red-500/20" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-3 w-20 rounded-full bg-slate-200/80 animate-pulse" />
          <div className="h-4 w-full rounded-full bg-slate-200/80 animate-pulse" />
          <div className="h-4 w-2/3 rounded-full bg-slate-200/80 animate-pulse" />
        </div>

        {/* Price & Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-5 w-16 rounded-md bg-slate-200/80 animate-pulse" />
            <div className="h-3.5 w-12 rounded-full bg-slate-100 animate-pulse" />
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 animate-pulse" />
        </div>

        {/* Bottom Button / Bar */}
        <div className="h-8 w-full rounded-lg bg-red-500/10 animate-pulse" />
      </div>
    </div>
  );

  if (variant === "compact") {
    if (count === 1) return renderSingleCompact(0);
    return (
      <>
        {items.map((_, i) => renderSingleCompact(i))}
      </>
    );
  }

  if (count === 1) return renderSingleHero(0);
  return (
    <>
      {items.map((_, i) => renderSingleHero(i))}
    </>
  );
};

export default EventCardSkeleton;
