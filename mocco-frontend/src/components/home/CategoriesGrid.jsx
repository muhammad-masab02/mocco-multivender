import React from "react";
import { useSelector } from "react-redux";
import {
  Truck,
  Flame,
  BadgePercent,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { brandingData, categoriesData } from "../../static/data";

const BRAND_ICON_MAP = {
  1: Truck,
  2: Flame,
  4: BadgePercent,
  5: ShieldCheck,
};

const CategoriesGrid = ({ handleCategoryClick }) => {
  const { categoriesTree } = useSelector((state) => state.category || {});

  // Use dynamic tree from Redux, fallback to categoriesData
  const displayCategories = categoriesTree?.length
    ? categoriesTree.map((cat, idx) => ({
        id: cat._id || idx + 1,
        title: cat.name,
        subTitle: cat.description || "",
        image_Url:
          cat.image?.url ||
          categoriesData[idx]?.image_Url ||
          "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80",
        subcategoriesCount: cat.children?.length || 0,
      }))
    : categoriesData;

  return (
    <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Branding Data Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
        {brandingData?.map((brand) => {
          const LucideIcon = BRAND_ICON_MAP[brand.id];

          return (
            <article
              key={brand.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_16px_36px_rgba(239,68,68,0.08)]"
            >
              {/* Subtle ambient accent background glow on hover */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-red-100/50 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

              <div className="relative flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center transition-all duration-300 group-hover:bg-red-600 group-hover:text-white group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-red-500/25">
                  {LucideIcon ? (
                    <LucideIcon className="w-6 h-6 sm:w-7 sm:h-7 transition-colors" />
                  ) : (
                    <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_path]:stroke-current">
                      {brand.icon}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-snug truncate">
                    {brand.title}
                  </h3>
                  <p className="mt-0.5 text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-1">
                    {brand.Description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Categories Header */}
      <div className="text-center mb-8 sm:mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Featured Collections
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore by <span className="text-red-600">Category</span>
        </h2>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
          Find exactly what you need from our hand-picked multi-vendor categories
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5">
        {displayCategories?.map((category) => (
          <article
            key={category.id}
            onClick={() => handleCategoryClick(category.title)}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-red-300 hover:shadow-[0_16px_36px_rgba(239,68,68,0.12)] flex flex-col items-center justify-between"
          >
            {/* Top right subtle micro badge */}
            <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-red-50 text-slate-400 group-hover:text-red-600 transition-all duration-200">
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>

            {/* Category Image Circle/Container */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 p-2.5 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:border-red-100 group-hover:bg-red-50/40 transition-all duration-300">
              <img
                src={category.image_Url}
                alt={category.title}
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Title & Explore hint */}
            <div className="mt-3.5 w-full">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-red-600 transition-colors line-clamp-1 leading-snug">
                {category.title}
              </h3>
              <p className="mt-1 text-[11px] font-medium text-slate-400 group-hover:text-red-500 transition-colors hidden sm:block">
                Shop Now &rarr;
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CategoriesGrid;
