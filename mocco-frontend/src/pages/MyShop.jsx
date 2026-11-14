import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { loadSeller } from "../services/store/actions/seller";
import { getProducts } from "../services/store/actions/product";
import { getEvents } from "../services/store/actions/event";
import MyShopSidebar from "../components/myShop/MyShopSidebar";
import MyShopHeader from "../components/myShop/MyShopHeader";
import ShopProductCard from "../components/myShop/ShopProductCard";
import ShopEventCard from "../components/myShop/ShopEventCard";
import {
  ShopProductCardSkeleton,
  ShopEventCardSkeleton,
} from "../components/common/skeletons";
import ShopEmptyState from "../components/myShop/ShopEmptyState";
import { backendUrl, initialFormState } from "../components/myShop/utils";
import {
  Home as HomeIcon,
  ChevronRight,
  Store,
  Star,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import toast from "react-hot-toast";

const MyShop = () => {
  const { sellerId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { seller } = useSelector((state) => state.seller);
  const { products: storeProducts, isLoading: isProductsLoading } = useSelector(
    (state) => state.product,
  );
  const { events: storeEvents, isLoading: isEventsLoading } = useSelector(
    (state) => state.event,
  );

  const [activeTab, setActiveTab] = useState("products");
  const [shopView, setShopView] = useState(() => initialFormState({}));
  const [isShopLoading, setIsShopLoading] = useState(true);
  const [shopError, setShopError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const isOwner = seller?._id === sellerId;

  // Load shop products and events on mount
  useEffect(() => {
    if (sellerId) {
      dispatch(getProducts(sellerId));
      dispatch(getEvents(sellerId));
    }
  }, [dispatch, sellerId]);

  const [shopReviews, setShopReviews] = useState([]);

  // Fetch shop profile and aggregated reviews from API with error handling
  const fetchShopInfo = async () => {
    if (!sellerId) return;
    try {
      setIsShopLoading(true);
      setShopError(null);
      const { data } = await axios.get(`${backendUrl}/shop/info/${sellerId}`);
      if (data?.shop) {
        setShopView(initialFormState(data.shop));
      }
      if (Array.isArray(data?.reviews)) {
        setShopReviews(data.reviews);
      }
    } catch (error) {
      console.error("Failed to fetch shop details", error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load shop details. The seller may not exist or has been removed.";
      setShopError(msg);
    } finally {
      setIsShopLoading(false);
    }
  };

  useEffect(() => {
    fetchShopInfo();
  }, [sellerId]);

  const sellerProducts = useMemo(() => {
    let prods = Array.isArray(storeProducts) ? [...storeProducts] : [];

    // Filter by search query if typed
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      prods = prods.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }

    // Sort
    if (sortBy === "price-low") {
      prods.sort((a, b) => {
        const pA = a.discount_price || a.price || 0;
        const pB = b.discount_price || b.price || 0;
        return pA - pB;
      });
    } else if (sortBy === "price-high") {
      prods.sort((a, b) => {
        const pA = a.discount_price || a.price || 0;
        const pB = b.discount_price || b.price || 0;
        return pB - pA;
      });
    } else if (sortBy === "rating") {
      prods.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "popular") {
      prods.sort((a, b) => (b.total_sell || 0) - (a.total_sell || 0));
    }

    return prods;
  }, [storeProducts, searchQuery, sortBy]);

  const eventItems = useMemo(() => {
    return Array.isArray(storeEvents) ? storeEvents : [];
  }, [storeEvents]);

  const reviewItems = useMemo(() => {
    if (shopReviews.length > 0) return shopReviews;

    // Fallback: local extraction if needed
    const rawProds = Array.isArray(storeProducts) ? storeProducts : [];
    return rawProds.flatMap((product) => {
      const reviews = Array.isArray(product?.reviews) ? product.reviews : [];
      return reviews.map((review, index) => ({
        _id: `${product?._id || index}-review-${index}`,
        itemName: product?.name || "Product",
        itemType: "product",
        comment: review?.comment || "No comment",
        rating: Number(review?.rating || 0),
        user: review?.user,
        createdAt: review?.createdAt,
      }));
    });
  }, [shopReviews, storeProducts]);

  const totalProducts = Array.isArray(storeProducts) ? storeProducts.length : 0;
  const totalEvents = eventItems.length;
  const totalReviews = reviewItems.length;

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/shop/logout`, {
        withCredentials: true,
      });

      if (data?.success) {
        toast.success("Logged out successfully");
        dispatch(loadSeller());
        navigate("/shop-login", { replace: true });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to logout right now.";
      toast.error(message);
    }
  };

  const handleEditClick = () => {
    navigate("/shop-dashboard/?tab=settings");
  };

  // 1. Loading State (Full Page Skeleton)
  if (isShopLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 pb-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          <div className="h-6 w-48 bg-slate-200 rounded-md animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-24 h-24 rounded-full bg-slate-200 animate-pulse mx-auto" />
              <div className="h-6 w-32 bg-slate-200 rounded-md animate-pulse mx-auto" />
              <div className="space-y-2 pt-4">
                <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="lg:col-span-8 space-y-6">
              <div className="h-28 rounded-3xl bg-white border border-slate-200/80 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <ShopProductCardSkeleton count={6} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Error / Shop Not Found State
  if (shopError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-slate-50/50">
        <div className="max-w-md w-full rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Store Unavailable
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {shopError}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={fetchShopInfo}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md shadow-red-600/20"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <li>
            <Link
              to="/products"
              className="hover:text-red-600 transition-colors"
            >
              Shops
            </Link>
          </li>
          <li className="text-slate-300">
            <ChevronRight className="w-3.5 h-3.5" />
          </li>
          <li className="text-slate-900 font-semibold truncate max-w-[200px]">
            {shopView.name || "Storefront"}
          </li>
        </ol>
      </nav>

      {/* Main Grid Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Store Profile Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <MyShopSidebar
              displayShop={shopView}
              totalProducts={totalProducts}
              sellerCreatedAt={shopView?.createdAt}
              onEditClick={handleEditClick}
              onLogout={handleLogout}
              isOwner={isOwner}
            />
          </div>

          {/* Right Column: Catalog Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header + Tabs */}
            <MyShopHeader
              displayShop={shopView}
              totalProducts={totalProducts}
              totalEvents={totalEvents}
              totalReviews={totalReviews}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isOwner={isOwner}
            />

            {/* Sub-toolbar (Search + Filter) for Products */}
            {activeTab === "products" && totalProducts > 0 && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                {/* Search inside shop */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${shopView.name || "shop"} products...`}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="default">Default Sorting</option>
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB: PRODUCTS */}
            {activeTab === "products" && (
              <div>
                {isProductsLoading && totalProducts === 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    <ShopProductCardSkeleton count={6} />
                  </div>
                ) : sellerProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {sellerProducts.map((product) => (
                      <ShopProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <ShopEmptyState
                    iconType="products"
                    title={searchQuery ? "No matching products" : "No products listed"}
                    subtitle={
                      searchQuery
                        ? `No products found matching "${searchQuery}". Try a different keyword.`
                        : "This store hasn't published any products yet. Check back soon!"
                    }
                    actionLabel={searchQuery ? "Clear Search" : (isOwner ? "Add Products in Dashboard" : "Browse All Products")}
                    onAction={() => {
                      if (searchQuery) setSearchQuery("");
                      else if (isOwner) navigate("/shop-dashboard/?tab=createProduct");
                      else navigate("/products");
                    }}
                  />
                )}
              </div>
            )}

            {/* TAB: EVENTS */}
            {activeTab === "events" && (
              <div>
                {isEventsLoading && totalEvents === 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    <ShopEventCardSkeleton count={6} />
                  </div>
                ) : eventItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {eventItems.map((event) => (
                      <ShopEventCard key={event._id} event={event} />
                    ))}
                  </div>
                ) : (
                  <ShopEmptyState
                    iconType="events"
                    title="No active sale events"
                    subtitle="This store doesn't have any ongoing promotional sale events right now."
                    actionLabel={isOwner ? "Create Event in Dashboard" : "View Platform Events"}
                    onAction={() => {
                      if (isOwner) navigate("/shop-dashboard/?tab=createEvent");
                      else navigate("/events");
                    }}
                  />
                )}
              </div>
            )}

            {/* TAB: REVIEWS */}
            {activeTab === "reviews" && (
              <div>
                {reviewItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {reviewItems.map((review, i) => {
                      const userName = review?.user?.name || "Verified Customer";
                      const userAvatar =
                        review?.user?.avatar?.url || review?.user?.avatar;
                      const formattedDate = review?.createdAt
                        ? new Date(review.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Recently";

                      return (
                        <article
                          key={review._id || review.id || i}
                          className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between gap-4"
                        >
                          <div className="space-y-3">
                            {/* Product/Event info badge */}
                            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                              <div className="flex items-center gap-2 min-w-0">
                                {review.itemImage && (
                                  <img
                                    src={review.itemImage}
                                    alt={review.itemName}
                                    className="h-8 w-8 rounded-lg object-cover border border-slate-200 shrink-0"
                                  />
                                )}
                                <div className="min-w-0">
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 mr-1.5">
                                    {review.itemType === "event" ? "Event" : "Product"}
                                  </span>
                                  <span className="text-xs font-semibold text-slate-700 truncate inline-block max-w-[160px] align-bottom">
                                    {review.itemName || "Item"}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[11px] text-slate-400 shrink-0">
                                {formattedDate}
                              </span>
                            </div>

                            {/* Rating and Stars */}
                            <div className="flex items-center gap-1.5 text-amber-500">
                              <div className="flex text-amber-400 text-xs">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <span
                                    key={s}
                                    className={
                                      s <= Math.round(review.rating || 5)
                                        ? "text-amber-400"
                                        : "text-slate-200"
                                    }
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs font-bold text-slate-700 ml-1">
                                {Number(review.rating || 5).toFixed(1)}
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                              "{review.comment}"
                            </p>
                          </div>

                          {/* Reviewer info */}
                          <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                            <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-600">
                              {userAvatar ? (
                                <img
                                  src={userAvatar}
                                  alt={userName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                userName[0]?.toUpperCase() || "U"
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">
                                {userName}
                              </p>
                              <p className="text-[10px] text-emerald-600 font-semibold">
                                Verified Buyer
                              </p>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <ShopEmptyState
                    iconType="reviews"
                    title="No reviews yet"
                    subtitle="This store hasn't received customer reviews yet. Be the first to purchase and review!"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyShop;
