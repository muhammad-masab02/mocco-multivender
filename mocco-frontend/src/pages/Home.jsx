import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeroSection from "../components/home/HeroSection";
import FlashSales from "../components/home/FlashSales";
import BestSelling from "../components/home/BestSelling";
import FeatureSection from "../components/home/FeatureSection";
import NewArrivalProducts from "../components/home/NewArrivalProducts";
import { useNavigate } from "react-router-dom";
import CategoriesGrid from "../components/home/CategoriesGrid";
// import { productData } from "../static/data.jsx";
import { getAllEvents } from "../services/store/actions/event";
import {
  // getAllProducts,
  getFeaturedProducts,
  getBestSellingProducts,
} from "../services/store/actions/product";
import FeatureProducts from "../components/home/FeatureProducts.jsx";
import SponsoredBrands from "../components/home/SponsoredBrands.jsx";
import EventCard from "../components/home/EventCard.jsx";
import {
  ProductCardSkeleton,
  EventCardSkeleton,
} from "../components/common/skeletons";
import {
  Zap,
  ArrowRight,
  Sparkles,
  Timer,
  TrendingUp,
  Tag,
} from "lucide-react";

const MAX_HOME_EVENT_PRODUCTS = 6;
const HOME_EVENT_SECONDARY_LIMIT = 4;
const MOBILE_VISIBLE_SECONDARY_EVENTS = 2;

const scoreEventProduct = (product) => {
  const price = Number(product?.price || 0);
  const discountPrice = Number(product?.discount_price || price);
  const totalSell = Number(product?.total_sell || 0);
  const rating = Number(product?.rating || 0);

  const discountStrength =
    price > 0 ? Math.max(0, ((price - discountPrice) / price) * 100) : 0;

  return discountStrength * 0.45 + totalSell * 0.4 + rating * 0.15;
};

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { events: storeEvents, isLoading: isEventsLoading } = useSelector(
    (state) => state.event,
  );
  const {
    products: allProducts,
    featuredProducts,
    bestSellingProducts,
    isLoading: productLoading,
    isFeaturedLoading,
    isBestSellingLoading,
  } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getAllEvents());
    dispatch(getFeaturedProducts());
    dispatch(getBestSellingProducts());
  }, [dispatch]);

  const sourceEvents =
    Array.isArray(storeEvents) && storeEvents.length > 0 ? storeEvents : [];

  const rankedEventProducts = sourceEvents
    .filter((product) => Number(product?.stock || 0) > 0)
    .sort((a, b) => scoreEventProduct(b) - scoreEventProduct(a))
    .slice(0, MAX_HOME_EVENT_PRODUCTS);

  const heroEventProduct = rankedEventProducts?.[0] || null;
  const secondaryEventProducts = rankedEventProducts.slice(
    1,
    1 + HOME_EVENT_SECONDARY_LIMIT,
  );

  const hasActiveEvents = rankedEventProducts.length > 0;

  // Compute max discount across events for the promo banner
  const maxDiscount = useMemo(() => {
    let max = 0;
    rankedEventProducts.forEach((p) => {
      const price = Number(p?.price || 0);
      const dp = Number(p?.discount_price || price);
      if (price > dp && price > 0) {
        const pct = Math.round(((price - dp) / price) * 100);
        if (pct > max) max = pct;
      }
    });
    return max;
  }, [rankedEventProducts]);

  // Total items claimed across events
  const totalClaimed = useMemo(
    () =>
      rankedEventProducts.reduce(
        (acc, p) => acc + Number(p?.total_sell || 0),
        0,
      ),
    [rankedEventProducts],
  );

  // handle category click and navigate
  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category.toLowerCase())}`);
  };

  const handleClick = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  return (
    <div className="w-full flex flex-col">
      <HeroSection handleCategoryClick={handleCategoryClick} />

      <div className="w-full flex flex-col items-center">
        <CategoriesGrid handleCategoryClick={handleCategoryClick} />

      <section className="w-full max-w-7xl px-5 py-8 space-y-20">
        {/* <FlashSales
          products={productData}
          limit={8}
          handleClick={handleClick}
        /> */}
        {isBestSellingLoading ? (
          <div className="space-y-4">
            <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <ProductCardSkeleton count={8} />
            </div>
          </div>
        ) : bestSellingProducts?.length > 0 ? (
          <BestSelling
            products={bestSellingProducts}
            limit={8}
            handleClick={handleClick}
          />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400 shadow-sm">
            No products available yet — check back soon!
          </div>
        )}
      </section>

      {/* ═══════════════════════ EVENTS SECTION ═══════════════════════
           Hidden entirely when no active events & finished loading      */}
      {(isEventsLoading || hasActiveEvents) && (
        <section className="w-full py-12 px-5 relative overflow-hidden">
          {/* Decorative background layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 -z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(239,68,68,0.15),transparent_55%)] -z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(251,146,60,0.1),transparent_55%)] -z-10" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

          <div className="max-w-7xl mx-auto relative">
            {/* ── Top Promo Banner Bar ─────────────────────────────────── */}
            <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                {/* Animated event badge */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-500/30 px-3.5 py-1.5 text-xs font-bold text-red-400 uppercase tracking-widest">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                    Live Flash Events
                  </span>

                  {maxDiscount > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-extrabold text-white shadow-lg shadow-amber-500/25">
                      <Sparkles size={12} className="fill-white" />
                      Up to {maxDiscount}% Off
                    </span>
                  )}
                </div>

                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  Exclusive Limited-Time{" "}
                  <span className="bg-gradient-to-r from-red-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                    Flash Deals
                  </span>
                </h3>

                <p className="max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
                  Curated time-limited offers from verified Mocco sellers.
                  Real-time stock, verified discounts — grab them before they're gone.
                </p>

                {/* Quick stats pills */}
                {hasActiveEvents && (
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                      <Zap size={12} className="text-amber-400 fill-amber-400" />
                      {rankedEventProducts.length} Active{" "}
                      {rankedEventProducts.length === 1 ? "Deal" : "Deals"}
                    </span>

                    {totalClaimed > 0 && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                        <TrendingUp size={12} className="text-emerald-400" />
                        {totalClaimed.toLocaleString()} Claimed
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                      <Timer size={12} className="text-red-400" />
                      Ending Soon
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => navigate("/events")}
                className="group w-fit flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white hover:text-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:shadow-lg hover:shadow-white/10 cursor-pointer"
              >
                <Tag size={14} />
                <span>View All Events</span>
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </div>

            {/* ── Event Cards ──────────────────────────────────────────── */}
            {isEventsLoading && !heroEventProduct ? (
              <div className="space-y-5">
                <EventCardSkeleton variant="hero" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <EventCardSkeleton variant="compact" count={4} />
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <EventCard eventProduct={heroEventProduct} showMoreCta={false} />

                {secondaryEventProducts.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {secondaryEventProducts.map((eventProduct, index) => {
                      const productId =
                        eventProduct?._id || eventProduct?.id || index;
                      const hideOnMobile =
                        index >= MOBILE_VISIBLE_SECONDARY_EVENTS;

                      return (
                        <EventCard
                          key={productId}
                          eventProduct={eventProduct}
                          variant="compact"
                          className={hideOnMobile ? "hidden sm:block" : ""}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Bottom browse-more bar */}
                <div className="flex items-center justify-center pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/events")}
                    className="group inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <span>Browse All Active Events</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="w-full max-w-7xl px-5 py-8 space-y-8 sm:space-y-12">
        {isFeaturedLoading ? (
          <div className="space-y-6">
            <div className="text-center mb-8 space-y-2">
              <div className="h-3.5 w-32 bg-slate-200 rounded-full animate-pulse mx-auto" />
              <div className="h-8 w-60 bg-slate-200 rounded-lg animate-pulse mx-auto" />
              <div className="w-16 h-1 bg-red-500/40 rounded-full mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <ProductCardSkeleton count={8} />
            </div>
          </div>
        ) : (
          <FeatureProducts
            products={featuredProducts}
            limit={8}
            handleClick={handleClick}
          />
        )}
      </section>

      <section className="w-full max-w-7xl py-10 space-y-8">
        <NewArrivalProducts
          productLoading={productLoading}
          newArrivalProducts={allProducts}
        />
      </section>

      <section className="w-full max-w-7xl py-4 sm:py-10 md:py-20">
        <FeatureSection />
      </section>

      <SponsoredBrands />
      </div>
    </div>
  );
}

export default Home;
