import React from "react";
import ProductCard from "../common/products/ProductCard";
import { ProductCardSkeleton } from "../common/skeletons";
import { useNavigate } from "react-router-dom";
import { Flame, ArrowRight, Sparkles } from "lucide-react";

const BestSelling = ({
  products = [],
  limit = 4,
  isFullPage = false,
  handleClick,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const productList = Array.isArray(products) ? products : [];

  const bestSellingProducts =
    typeof limit === "number" && isFinite(limit)
      ? productList.slice(0, limit)
      : productList;

  return (
    <div>
      {/* Section Header — only shown when embedded on Home page */}
      {!isFullPage && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              Top Performers
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Best <span className="text-red-600">Selling</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate("/best-selling")}
            className="group hidden md:inline-flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-sm font-bold text-slate-700 hover:text-red-600 transition-all duration-200 shadow-xs"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {isLoading ? (
          <ProductCardSkeleton count={typeof limit === "number" ? limit : 8} />
        ) : Array.isArray(bestSellingProducts) && bestSellingProducts.length > 0 ? (
          bestSellingProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              handleClick={handleClick}
            />
          ))
        ) : (
          <p className="text-slate-500 col-span-4 text-sm text-center py-8">
            No best-selling products available.
          </p>
        )}
      </div>

      {/* Mobile "View All" Button */}
      {!isFullPage && (
        <div className="flex justify-center mt-8 md:hidden">
          <button
            type="button"
            onClick={() => navigate("/best-selling")}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-sm font-bold text-slate-700 hover:text-red-600 transition-all"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BestSelling;
