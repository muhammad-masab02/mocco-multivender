import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/common/products/ProductCard";
import { ProductCardSkeleton } from "../components/common/skeletons";
import ProductFilters from "../components/products/ProductFilters";
import {
  getAllProducts,
  getFeaturedProducts,
} from "../services/store/actions/product";
import {
  SlidersHorizontal,
  X,
  Search,
  ArrowUpDown,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { categoriesData } from "../static/data";

const Products = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const urlFilter = searchParams.get("filter");
  const urlCategory = searchParams.get("category");
  const isFeaturedFilter = urlFilter === "featured";

  const {
    products: storeProducts,
    featuredProducts,
    isLoading: productLoading,
  } = useSelector((state) => state.product);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Mobile Drawer State
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Sync category from URL search parameters on navigation
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    } else {
      setSelectedCategory("all");
    }
  }, [urlCategory]);

  // Initial fetch
  useEffect(() => {
    dispatch(getAllProducts());
    if (
      isFeaturedFilter &&
      (!featuredProducts || featuredProducts.length === 0)
    ) {
      dispatch(getFeaturedProducts());
    }
  }, [dispatch, isFeaturedFilter, featuredProducts?.length]);

  // Source list of products
  const baseProducts = useMemo(() => {
    if (isFeaturedFilter) {
      return Array.isArray(featuredProducts) ? featuredProducts : [];
    }
    return Array.isArray(storeProducts) ? storeProducts : [];
  }, [isFeaturedFilter, featuredProducts, storeProducts]);

  // Dynamically compute categories and counts from available products
  const dynamicCategories = useMemo(() => {
    const counts = {};
    baseProducts.forEach((p) => {
      const cat = p.category ? p.category.trim() : "Uncategorized";
      const key = cat.toLowerCase();
      if (!counts[key]) {
        counts[key] = { title: cat, count: 0 };
      }
      counts[key].count += 1;
    });

    // Also include categoriesData titles if missing
    categoriesData.forEach((c) => {
      const key = c.title.toLowerCase();
      if (!counts[key]) {
        counts[key] = { title: c.title, count: 0 };
      }
    });

    return Object.values(counts).sort((a, b) => b.count - a.count);
  }, [baseProducts]);

  // Handle Category selection
  const handleSelectCategory = (categoryTitle) => {
    if (categoryTitle === "all") {
      setSelectedCategory("all");
      searchParams.delete("category");
    } else {
      setSelectedCategory(categoryTitle);
      searchParams.set("category", categoryTitle.toLowerCase());
    }
    const newSearch = searchParams.toString();
    navigate(newSearch ? `/products?${newSearch}` : "/products", {
      replace: true,
    });
  };

  // Price range handler
  const handlePriceChange = ({ min, max }) => {
    setPriceRange({ min, max });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory("all");
    setPriceRange({ min: "", max: "" });
    setMinRating(0);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSearchQuery("");
    setSortBy("default");

    if (urlCategory) {
      navigate(isFeaturedFilter ? "/products?filter=featured" : "/products", {
        replace: true,
      });
    }
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      selectedCategory !== "all" ||
      priceRange.min !== "" ||
      priceRange.max !== "" ||
      minRating > 0 ||
      inStockOnly ||
      onSaleOnly ||
      searchQuery.trim() !== "" ||
      sortBy !== "default"
    );
  }, [
    selectedCategory,
    priceRange,
    minRating,
    inStockOnly,
    onSaleOnly,
    searchQuery,
    sortBy,
  ]);

  // Count active filters (for badge on mobile button)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (priceRange.min !== "" || priceRange.max !== "") count++;
    if (minRating > 0) count++;
    if (inStockOnly) count++;
    if (onSaleOnly) count++;
    if (searchQuery.trim() !== "") count++;
    return count;
  }, [
    selectedCategory,
    priceRange,
    minRating,
    inStockOnly,
    onSaleOnly,
    searchQuery,
  ]);

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    return baseProducts
      .filter((product) => {
        // 1. Category Filter
        if (selectedCategory !== "all") {
          const productCat = (product.category || "").toLowerCase();
          if (productCat !== selectedCategory.toLowerCase()) {
            return false;
          }
        }

        // 2. Price Filter
        const effectivePrice = Number(
          product.discount_price ?? product.price ?? 0,
        );
        if (priceRange.min !== "" && effectivePrice < Number(priceRange.min)) {
          return false;
        }
        if (priceRange.max !== "" && effectivePrice > Number(priceRange.max)) {
          return false;
        }

        // 3. Rating Filter
        if (minRating > 0) {
          const rating = Number(product.rating || product.shop?.ratings || 0);
          if (rating < minRating) {
            return false;
          }
        }

        // 4. In Stock Filter
        if (inStockOnly && Number(product.stock || 0) <= 0) {
          return false;
        }

        // 5. On Sale / Discount Filter
        if (onSaleOnly) {
          const hasDiscount =
            (product.discount_price &&
              Number(product.discount_price) < Number(product.price)) ||
            Boolean(product.discount);
          if (!hasDiscount) return false;
        }

        // 6. Search Query Filter
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matchName = (product.name || "").toLowerCase().includes(q);
          const matchDesc = (product.description || "")
            .toLowerCase()
            .includes(q);
          const matchShop = (product.shop?.name || "").toLowerCase().includes(q);
          const matchCat = (product.category || "").toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchShop && !matchCat) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // Sort Options
        const priceA = Number(a.discount_price ?? a.price ?? 0);
        const priceB = Number(b.discount_price ?? b.price ?? 0);

        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;

        if (sortBy === "rating-desc") {
          const ratingA = Number(a.rating || a.shop?.ratings || 0);
          const ratingB = Number(b.rating || b.shop?.ratings || 0);
          return ratingB - ratingA;
        }

        if (sortBy === "best-selling") {
          return Number(b.total_sell || 0) - Number(a.total_sell || 0);
        }

        if (sortBy === "newest") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }

        // Default: preserved order / ID
        return 0;
      });
  }, [
    baseProducts,
    selectedCategory,
    priceRange,
    minRating,
    inStockOnly,
    onSaleOnly,
    searchQuery,
    sortBy,
  ]);

  const pageTitle = isFeaturedFilter
    ? "Featured Products"
    : selectedCategory !== "all"
      ? selectedCategory
      : "All Products";

  const pageDescription = isFeaturedFilter
    ? "Discover the most loved products promoted by our trusted sellers."
    : selectedCategory !== "all"
      ? `Browse curated ${selectedCategory.toLowerCase()} products from verified sellers.`
      : "Explore our complete collection across all categories and find the perfect match for your needs.";

  const handleClick = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ── Page Header ──────────────────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
            {isFeaturedFilter ? "Curated Picks" : "Marketplace Catalog"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 capitalize">
            {pageTitle}
          </h1>
          <div className="w-14 h-1 bg-red-500 mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            {pageDescription}
          </p>
        </div>

        {/* ── Top Controls Bar: Search, Filters Trigger & Sorting ──────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Left: Mobile Filter Button & Results Count */}
          <div className="flex items-center justify-between md:justify-start gap-3">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-red-600 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              <SlidersHorizontal size={15} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center leading-none">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <span className="text-xs sm:text-sm font-medium text-slate-500">
              Showing{" "}
              <strong className="text-slate-900 font-bold">
                {productLoading ? "..." : filteredProducts.length}
              </strong>{" "}
              of {baseProducts.length} items
            </span>
          </div>

          {/* Right: Search in Catalog & Sort By Dropdown */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Catalog Search input */}
            <div className="relative flex-1 md:w-56 lg:w-64">
              <Search
                size={15}
                className="absolute left-3 text-slate-400 top-1/2 -translate-y-1/2"
              />
              <input
                type="text"
                placeholder="Search within results..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-7 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-red-400 focus:bg-white transition text-slate-800 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-red-400 focus:bg-white transition cursor-pointer"
                aria-label="Sort products"
              >
                <option value="default">Sort: Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="best-selling">Best Selling</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              <ArrowUpDown
                size={13}
                className="absolute right-2.5 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* ── Active Filters Chips Bar ────────────────────────────────────────── */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
              Active:
            </span>

            {/* Category Chip */}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-800 shadow-xs capitalize">
                <span>Category: {selectedCategory}</span>
                <button
                  type="button"
                  onClick={() => handleSelectCategory("all")}
                  className="text-slate-400 hover:text-red-600 cursor-pointer"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {/* Price Chip */}
            {(priceRange.min !== "" || priceRange.max !== "") && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-800 shadow-xs">
                <span>
                  Price: {priceRange.min ? `$${priceRange.min}` : "$0"} -{" "}
                  {priceRange.max ? `$${priceRange.max}` : "Any"}
                </span>
                <button
                  type="button"
                  onClick={() => setPriceRange({ min: "", max: "" })}
                  className="text-slate-400 hover:text-red-600 cursor-pointer"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {/* Rating Chip */}
            {minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-800 shadow-xs">
                <span>Rating: {minRating}★ & above</span>
                <button
                  type="button"
                  onClick={() => setMinRating(0)}
                  className="text-slate-400 hover:text-red-600 cursor-pointer"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {/* In Stock Chip */}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-800 shadow-xs">
                <span>In Stock Only</span>
                <button
                  type="button"
                  onClick={() => setInStockOnly(false)}
                  className="text-slate-400 hover:text-red-600 cursor-pointer"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {/* On Sale Chip */}
            {onSaleOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-800 shadow-xs">
                <span>On Sale Only</span>
                <button
                  type="button"
                  onClick={() => setOnSaleOnly(false)}
                  className="text-slate-400 hover:text-red-600 cursor-pointer"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {/* Search Query Chip */}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-800 shadow-xs">
                <span>Query: "{searchQuery}"</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-red-600 cursor-pointer"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {/* Clear All Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-red-600 hover:text-red-700 underline underline-offset-2 ml-1 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* ── Main Layout: Desktop Sidebar + Product Grid ──────────────────────── */}
        <div className="flex items-start gap-6 lg:gap-8">
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-28 bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
            <ProductFilters
              categories={dynamicCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              minPrice={priceRange.min}
              maxPrice={priceRange.max}
              onPriceChange={handlePriceChange}
              minRating={minRating}
              onRatingChange={setMinRating}
              inStockOnly={inStockOnly}
              onInStockChange={setInStockOnly}
              onSaleOnly={onSaleOnly}
              onSaleChange={setOnSaleOnly}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
              totalMatching={filteredProducts.length}
            />
          </aside>

          {/* Right Product Grid Section */}
          <main className="flex-1 min-w-0">
            {productLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-5">
                <ProductCardSkeleton count={9} />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    handleClick={handleClick}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl border border-slate-100 p-10 sm:p-14 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-xs">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  No products match your criteria
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  We couldn't find any products matching your active filters. Try
                  adjusting your price range, clearing specific filters, or
                  resetting everything.
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-red-600 text-white text-xs font-semibold uppercase tracking-wider transition cursor-pointer shadow-sm"
                  >
                    <RotateCcw size={14} />
                    <span>Reset All Filters</span>
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ─────────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        sx={{
          display: { lg: "none" },
          "& .MuiDrawer-paper": {
            width: "85%",
            maxWidth: 360,
            boxSizing: "border-box",
          },
        }}
      >
        <div className="flex h-full flex-col bg-white">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-red-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </h3>
            </div>
            <IconButton
              onClick={() => setMobileDrawerOpen(false)}
              aria-label="Close filters"
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <ProductFilters
              categories={dynamicCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                handleSelectCategory(cat);
              }}
              minPrice={priceRange.min}
              maxPrice={priceRange.max}
              onPriceChange={handlePriceChange}
              minRating={minRating}
              onRatingChange={setMinRating}
              inStockOnly={inStockOnly}
              onInStockChange={setInStockOnly}
              onSaleOnly={onSaleOnly}
              onSaleChange={setOnSaleOnly}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
              totalMatching={filteredProducts.length}
            />
          </div>

          {/* Drawer Footer: Apply & View Results */}
          <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold transition hover:bg-slate-100 cursor-pointer"
              >
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="flex-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-sm text-center"
            >
              Show {filteredProducts.length} Products
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Products;
