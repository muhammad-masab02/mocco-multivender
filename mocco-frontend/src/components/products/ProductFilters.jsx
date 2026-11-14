import React, { useState } from "react";
import { Star, RotateCcw, Check, Sparkles, Tag, DollarSign, Layers } from "lucide-react";

/**
 * ProductFilters component
 * Provides accessible, clean filter controls for Categories, Price Range,
 * Customer Rating, In Stock availability, and On Sale discounts.
 */
const ProductFilters = ({
  categories = [],
  selectedCategory = "all",
  onSelectCategory,
  minPrice = "",
  maxPrice = "",
  onPriceChange,
  minRating = 0,
  onRatingChange,
  inStockOnly = false,
  onInStockChange,
  onSaleOnly = false,
  onSaleChange,
  onResetFilters,
  hasActiveFilters = false,
  totalMatching = 0,
}) => {
  // Local state for price inputs
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  const handleApplyPrice = (e) => {
    e?.preventDefault();
    onPriceChange({ min: localMin, max: localMax });
  };

  const handleQuickPrice = (min, max) => {
    setLocalMin(min);
    setLocalMax(max);
    onPriceChange({ min, max });
  };

  const pricePresets = [
    { label: "Under $50", min: "", max: "50" },
    { label: "$50 - $100", min: "50", max: "100" },
    { label: "$100 - $250", min: "100", max: "250" },
    { label: "$250+", min: "250", max: "" },
  ];

  const ratingOptions = [4, 3, 2, 1];

  return (
    <div className="space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-red-600" />
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Filters
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setLocalMin("");
              setLocalMax("");
              onResetFilters();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 transition cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Categories
        </h4>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
          <button
            type="button"
            onClick={() => onSelectCategory("all")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
              selectedCategory === "all"
                ? "bg-red-50 text-red-600 font-semibold shadow-xs"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === "all" && <Check size={14} className="text-red-600" />}
          </button>

          {categories.map((cat) => {
            const isSelected =
              selectedCategory.toLowerCase() === cat.title.toLowerCase();
            return (
              <button
                key={cat.id || cat.title}
                type="button"
                onClick={() => onSelectCategory(cat.title)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer capitalize ${
                  isSelected
                    ? "bg-red-50 text-red-600 font-semibold shadow-xs"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="truncate">{cat.title}</span>
                <span className="text-[11px] font-semibold text-slate-400 ml-2">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Price Range
          </h4>
        </div>

        {/* Min / Max inputs */}
        <form onSubmit={handleApplyPrice} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative flex items-center">
              <span className="absolute left-2.5 text-xs text-slate-400 font-medium">
                $
              </span>
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-red-400 focus:bg-white transition text-slate-800"
              />
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-2.5 text-xs text-slate-400 font-medium">
                $
              </span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-red-400 focus:bg-white transition text-slate-800"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-red-600 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            Apply Price
          </button>
        </form>

        {/* Quick price presets */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {pricePresets.map((preset) => {
            const isActive =
              String(minPrice) === preset.min && String(maxPrice) === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleQuickPrice(preset.min, preset.max)}
                className={`px-2.5 py-1 text-[11px] rounded-full border transition cursor-pointer font-medium ${
                  isActive
                    ? "bg-red-600 text-white border-red-600 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Customer Rating Filter */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Rating
        </h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onRatingChange(0)}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              minRating === 0
                ? "bg-red-50 text-red-600 font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>All Ratings</span>
            {minRating === 0 && <Check size={14} className="text-red-600" />}
          </button>

          {ratingOptions.map((rating) => {
            const isSelected = minRating === rating;
            return (
              <button
                key={rating}
                type="button"
                onClick={() => onRatingChange(rating)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? "bg-red-50 text-red-600 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={
                          i < rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200 fill-slate-100"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-slate-700 text-xs ml-1">
                    {rating}★ & above
                  </span>
                </div>
                {isSelected && <Check size={14} className="text-red-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability & Deals */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Deals & Availability
        </h4>
        <div className="space-y-2">
          {/* In Stock Only */}
          <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 hover:bg-slate-50 cursor-pointer transition select-none">
            <span className="text-xs font-medium text-slate-700">
              In Stock Only
            </span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onInStockChange(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
            />
          </label>

          {/* On Sale / Discount Only */}
          <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 hover:bg-slate-50 cursor-pointer transition select-none">
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-red-500" />
              <span className="text-xs font-medium text-slate-700">
                On Sale / Discounted
              </span>
            </div>
            <input
              type="checkbox"
              checked={onSaleOnly}
              onChange={(e) => onSaleChange(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
