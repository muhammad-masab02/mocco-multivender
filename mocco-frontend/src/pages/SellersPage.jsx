import React, { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Store,
  Search,
  X,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  ShieldCheck,
  Package,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { getAllSellers } from "../services/store/actions/seller";
import { SellerCard, SellerCardSkeleton } from "../components/sellers/SellerCard";

const SellersPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { allSellers, allSellersLoading, allSellersError } = useSelector(
    (state) => state.seller
  );

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "default");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [activeFilterTab, setActiveFilterTab] = useState("all"); // 'all' | 'top-rated' | 'with-products' | 'with-events'

  // Fetch sellers on initial mount
  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  // Sync search query from URL if changed externally
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch !== null && urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Filter and sort sellers locally for instant responsive UI
  const filteredSellers = useMemo(() => {
    let list = Array.isArray(allSellers) ? [...allSellers] : [];

    // Filter by search query (name, description, address)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((s) => {
        const name = (s.name || "").toLowerCase();
        const desc = (s.description || "").toLowerCase();
        const addr = (s.addresses || "").toLowerCase();
        return name.includes(q) || desc.includes(q) || addr.includes(q);
      });
    }

    // Filter by active quick tab
    if (activeFilterTab === "top-rated") {
      list = list.filter((s) => Number(s.ratings || 0) >= 4.0);
    } else if (activeFilterTab === "with-products") {
      list = list.filter((s) => Number(s.productCount || 0) > 0);
    } else if (activeFilterTab === "with-events") {
      list = list.filter((s) => Number(s.eventCount || 0) > 0);
    }

    // Sort sellers
    switch (sortBy) {
      case "products-desc":
        list.sort((a, b) => (b.productCount || 0) - (a.productCount || 0));
        break;
      case "rating-desc":
        list.sort((a, b) => Number(b.ratings || 0) - Number(a.ratings || 0));
        break;
      case "sales-desc":
        list.sort((a, b) => (b.totalSell || 0) - (a.totalSell || 0));
        break;
      case "name-asc":
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "newest":
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        // Default: sort by top rated / products count combination
        list.sort((a, b) => {
          const scoreB = (b.productCount || 0) + Number(b.ratings || 0) * 5;
          const scoreA = (a.productCount || 0) + Number(a.ratings || 0) * 5;
          return scoreB - scoreA;
        });
        break;
    }

    return list;
  }, [allSellers, searchQuery, activeFilterTab, sortBy]);

  // Total products across all sellers
  const totalMarketplaceProducts = useMemo(() => {
    if (!Array.isArray(allSellers)) return 0;
    return allSellers.reduce((sum, s) => sum + (s.productCount || 0), 0);
  }, [allSellers]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSortBy("default");
    setActiveFilterTab("all");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-6 sm:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ── Hero / Header Banner ───────────────────────────────────────────── */}
        <div className="relative rounded-3xl bg-linear-to-r from-slate-950 via-slate-900 to-red-950 text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fb7185_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-red-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Merchant Directory</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Discover Trusted <span className="text-red-500">Marketplace</span> Sellers
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
              Explore independent boutiques, authorized distributors, and top-rated merchants. Shop directly from creators and vetted brands with secure checkout.
            </p>

            {/* Quick Metrics Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-200">
              <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-xs border border-white/10">
                <Store className="w-4 h-4 text-red-400" />
                <span>
                  <strong>{allSellers?.length || 0}</strong> Active Stores
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-xs border border-white/10">
                <Package className="w-4 h-4 text-amber-400" />
                <span>
                  <strong>{totalMarketplaceProducts}</strong> Products Listed
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-xs border border-white/10">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Buyer Protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Filter Tabs & Controls Bar ───────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "All Sellers", count: allSellers?.length || 0 },
              { id: "top-rated", label: "Top Rated (4.0+ ★)" },
              { id: "with-products", label: "Has Products" },
              { id: "with-events", label: "Active Events" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilterTab(tab.id)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                  activeFilterTab === tab.id
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[11px] ${
                      activeFilterTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Main Controls: Search, Sort & View Mode */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 text-slate-400 top-1/2 -translate-y-1/2"
              />
              <input
                type="text"
                placeholder="Search sellers by store name, bio, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-red-500 focus:bg-white transition text-slate-800 placeholder:text-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Right Tools: Sort, View Toggle & Count */}
            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
              {/* Sort Selector */}
              <div className="relative flex items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-2xl pl-3.5 pr-8 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 outline-none focus:border-red-500 focus:bg-white transition cursor-pointer"
                  aria-label="Sort sellers"
                >
                  <option value="default">Sort: Recommended</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="products-desc">Most Products</option>
                  <option value="sales-desc">Top Selling</option>
                  <option value="name-asc">Store Name (A-Z)</option>
                  <option value="newest">Newest Merchants</option>
                  <option value="oldest">Established First</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  ▼
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  className={`p-1.5 rounded-xl transition ${
                    viewMode === "grid"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  className={`p-1.5 rounded-xl transition ${
                    viewMode === "list"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                  title="List View"
                >
                  <List size={17} />
                </button>
              </div>
            </div>
          </div>

          {/* Results count indicator */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-900 font-bold">{filteredSellers.length}</strong> of{" "}
              {allSellers?.length || 0} registered merchants
            </span>

            {(searchQuery || activeFilterTab !== "all" || sortBy !== "default") && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold hover:underline cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Sellers Catalog Grid / List ───────────────────────────────────────── */}
        {allSellersLoading ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {[...Array(8)].map((_, i) => (
              <SellerCardSkeleton key={i} viewMode={viewMode} />
            ))}
          </div>
        ) : filteredSellers.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredSellers.map((seller) => (
              <SellerCard
                key={seller._id || seller.id}
                seller={seller}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="rounded-3xl bg-white border border-slate-200 p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <Store className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                No Sellers Found
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {searchQuery
                  ? `No stores match "${searchQuery}". Try checking for spelling errors or searching with broader keywords.`
                  : "There are currently no merchants matching the selected criteria."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-red-600 text-white text-xs sm:text-sm font-bold transition shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Clear Search & Filters</span>
            </button>
          </div>
        )}

        {/* ── Bottom Call-to-Action: Become a Seller ─────────────────────────── */}
        <div className="rounded-3xl bg-linear-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 sm:p-10 lg:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="inline-block text-xs uppercase tracking-widest font-black bg-white/20 px-3 py-1 rounded-full text-white">
              Merchant Opportunity
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Ready to sell your products on Mocco Mart?
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Join our fast-growing multi-vendor marketplace. Set up your storefront, list products, host promotional events, and reach thousands of shoppers worldwide.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              to="/shop-create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-extrabold tracking-wide transition shadow-lg shadow-black/10 active:scale-95"
            >
              <Store className="w-4 h-4 text-red-600" />
              <span>Open Your Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/shop-login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold transition active:scale-95"
            >
              <span>Seller Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellersPage;
