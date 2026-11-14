import React, { useEffect, useState } from "react";
import ProductCard from "../components/common/products/ProductCard";
import { ProductCardSkeleton } from "../components/common/skeletons";
import { useSelector, useDispatch } from "react-redux";
import {
  clearGuestWishlistAction,
  getGuestWishlist,
  clearWishlist,
} from "../services/store/actions/wishlist.js";
import { useNavigate, Link } from "react-router-dom";
import {
  Heart,
  HeartCrack,
  Trash2,
  Sparkles,
  ChevronRight,
  Home as HomeIcon,
  ArrowRight,
  ShoppingBag,
  Flame,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isUserAuthenticated } = useSelector((state) => state.user);
  const { items: authWishlistItems, isLoading: isAuthLoading } = useSelector(
    (state) => state.wishlist,
  );
  const { ids: wishlistIds } = useSelector((state) => state.wishlist);
  const { products } = useSelector((state) => state.product);

  // Guest State
  const [guestItems, setGuestItems] = useState([]);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    const fetchGuestProducts = async () => {
      if (isUserAuthenticated) return;

      const guestIds = getGuestWishlist();
      if (guestIds.length === 0) {
        setGuestItems([]);
        return;
      }

      setIsGuestLoading(true);
      try {
        const allProducts = products || [];
        const matchedProducts = allProducts.filter((p) =>
          guestIds.includes(p._id),
        );

        const mappedGuestItems = matchedProducts.map((p) => ({
          _id: `guest_${p._id}`,
          productId: p,
        }));

        setGuestItems(mappedGuestItems);
      } catch (error) {
        console.error("Failed to fetch guest products", error);
        toast.error("Failed to load local wishlist items");
      } finally {
        setIsGuestLoading(false);
      }
    };

    fetchGuestProducts();
  }, [isUserAuthenticated, dispatch, products, wishlistIds]);

  const isLoading = isUserAuthenticated ? isAuthLoading : isGuestLoading;

  const displayItems = isUserAuthenticated
    ? authWishlistItems || []
    : guestItems;

  const handleClearWishlist = async () => {
    if (isUserAuthenticated) {
      try {
        setIsClearing(true);
        await dispatch(clearWishlist());
        toast.success("Wishlist cleared");
      } catch (err) {
        toast.error(err?.message || "Failed to clear wishlist");
      } finally {
        setIsClearing(false);
      }
    } else {
      dispatch(clearGuestWishlistAction());
      toast.success("Local wishlist cleared");
    }
  };

  const handleProductClick = (id) => {
    navigate(`/product-detail/${id}`);
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
          <li className="text-slate-900 font-semibold">Wishlist</li>
        </ol>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Guest Warning Banner if not authenticated */}
        {!isUserAuthenticated && displayItems.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900 text-xs sm:text-sm shadow-xs">
            <div className="flex items-center gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                You are managing a <strong>guest wishlist</strong> saved on this device. Sign in to sync your saved items anywhere!
              </span>
            </div>
            <Link
              to="/signin"
              className="font-bold text-amber-800 hover:text-amber-950 underline shrink-0"
            >
              Sign In to Sync &rarr;
            </Link>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Saved Favorites
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                My <span className="text-red-600">Wishlist</span>
              </h1>
              {!isLoading && (
                <span className="px-3 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
                  {displayItems.length} {displayItems.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>
          </div>

          {displayItems.length > 0 && (
            <button
              type="button"
              onClick={handleClearWishlist}
              disabled={isClearing}
              className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isClearing ? "Clearing..." : "Clear Wishlist"}</span>
            </button>
          )}
        </div>

        {/* State: Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <ProductCardSkeleton count={8} />
          </div>
        )}

        {/* State: Empty */}
        {!isLoading && displayItems.length === 0 && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-12 sm:p-16 flex flex-col items-center justify-center text-center shadow-xs space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mb-2 shadow-inner">
              <HeartCrack className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Your wishlist is empty
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Explore our wide assortment of categories, trending deals, and new arrivals to curate your personal dream collection.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-red-600/30 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Products</span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/best-selling")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <Flame className="w-4 h-4 text-amber-500" />
                <span>View Best Sellers</span>
              </button>
            </div>
          </div>
        )}

        {/* State: Has Items */}
        {!isLoading && displayItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {displayItems.map((item) => {
              const product = item.productId;
              if (!product) return null;
              return (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  handleClick={handleProductClick}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
