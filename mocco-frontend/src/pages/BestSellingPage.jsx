import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getBestSellingProducts } from "../services/store/actions/product";
import { ProductCardSkeleton } from "../components/common/skeletons";
import ProductCard from "../components/common/products/ProductCard";
import {
  Flame,
  Sparkles,
  ChevronRight,
  Home as HomeIcon,
  ShieldCheck,
  Truck,
  Award,
  ArrowRight,
} from "lucide-react";

const BestSellingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bestSellingProducts = [], isBestSellingLoading: isLoading } =
    useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getBestSellingProducts());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [dispatch]);

  const handleClick = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2"
      >
        <ol className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
          <li>
            <Link
              to="/"
              className="inline-flex items-center gap-1 hover:text-red-600 transition-colors"
            >
              <HomeIcon className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </li>
          <li className="text-slate-300">
            <ChevronRight className="w-3.5 h-3.5" />
          </li>
          <li className="text-slate-900 font-semibold">Best Selling</li>
        </ol>
      </nav>

      {/* Page Hero Header */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-red-950 p-8 sm:p-12 text-white shadow-xl">
          {/* Ambient Decorative Glows */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-red-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-black tracking-wider uppercase backdrop-blur-md">
              <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500 animate-pulse" />
              Customer Favorites & Top Performers
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Best Selling <span className="text-red-500">Products</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore the most-ordered, highly rated products chosen by thousands
              of happy shoppers across Mocco Mart.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 text-xs sm:text-sm text-slate-300 font-semibold">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Verified Quality</span>
              </div>
              <span className="hidden sm:inline text-slate-600">•</span>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-red-400" />
                <span>Priority Dispatch</span>
              </div>
              <span className="hidden sm:inline text-slate-600">•</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Buyer Protected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Products Grid */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Trending Top Sellers
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {!isLoading && `${bestSellingProducts.length} items`}
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <ProductCardSkeleton count={8} />
          </div>
        ) : Array.isArray(bestSellingProducts) && bestSellingProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {bestSellingProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                handleClick={handleClick}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center text-slate-500 shadow-xs space-y-4">
            <p className="text-base font-semibold text-slate-700">
              No best-selling products found at this moment.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Check back soon or explore our extensive collection of latest arrivals and multi-vendor items.
            </p>
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-red-600 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <span>Browse All Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BestSellingPage;
