import React, { useEffect, useState, useRef } from "react";
import ProductDetailInfo from "../components/common/products/ProductDetailInfo";
import { getImageUrl } from "../utils/imageUrl.js";
import { useNavigate, useParams, Link } from "react-router-dom";
import ProductCard from "../components/common/products/ProductCard";
import { ProductCardSkeleton } from "../components/common/skeletons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addToGuestWishlistAction,
  addToWishlist,
  removeFromGuestWishlistAction,
  removeFromWishlist,
} from "../services/store/actions/wishlist";
import toast from "react-hot-toast";
import {
  addToCart,
  addToGuestCartAction,
} from "../services/store/actions/cart";
import { createConversation } from "../services/store/actions/conversation.js";
import {
  ChevronRight,
  Home as HomeIcon,
  Star,
  Store,
  FileText,
  MessageCircle,
  CheckCircle2,
  Package,
  Truck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const ProductDetail = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const navigate = useNavigate();
  const reviewsRef = useRef(null);

  const { isUserAuthenticated, user } = useSelector((state) => state.user);
  const { isLoading: isCartLoading } = useSelector((state) => state.cart);
  const { ids: wishlistIds } = useSelector((state) => state.wishlist);

  const isWishlisted = wishlistIds.includes(productId);

  const [quantity, setQuantity] = useState(1);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details"); // 'details', 'reviews', 'seller'
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Fetch single product dynamically
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${backendUrl}/product/detail/${productId}`,
        );
        setCurrentProduct(data?.product);
        setRelatedProducts(data?.relatedProducts || []);
        setSelectedImageIndex(0);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setCurrentProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [productId]);

  const handleWishlistToggle = async (e) => {
    e?.stopPropagation?.();
    if (!productId) return;
    if (isWishlistLoading) return;

    if (isUserAuthenticated) {
      try {
        setIsWishlistLoading(true);
        if (isWishlisted) {
          await dispatch(removeFromWishlist(productId));
          toast.success("Removed from wishlist");
        } else {
          await dispatch(addToWishlist(productId));
          toast.success("Added to wishlist");
        }
      } catch (err) {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to update wishlist",
        );
      } finally {
        setIsWishlistLoading(false);
      }
    } else {
      if (isWishlisted) {
        dispatch(removeFromGuestWishlistAction(productId));
        toast.success("Removed from local wishlist");
      } else {
        dispatch(addToGuestWishlistAction(productId));
        toast.success("Added to local wishlist (Login to sync)");
      }
    }
  };

  const handleAddToCart = async (e) => {
    e?.stopPropagation?.();
    if (isCartLoading) return;

    if (isUserAuthenticated) {
      try {
        await dispatch(addToCart(productId, quantity));
        toast.success("Added to cart");
      } catch (err) {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to add to cart",
        );
        console.error("Add to cart error:", err);
      }
    } else {
      const productObj = {
        _id: currentProduct?._id || productId,
        productId,
        name: currentProduct?.name,
        price: currentProduct?.price,
        discount_price: currentProduct?.discount_price,
        images: currentProduct?.images,
        stock: currentProduct?.stock ?? 99,
        category: currentProduct?.category,
        shop: currentProduct?.shop,
      };

      dispatch(addToGuestCartAction(productObj, quantity));
      toast.success("Added to cart");
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/checkout");
  };

  const handleRelatedProductClick = (nextProductId) => {
    navigate(`/product-detail/${nextProductId}`);
  };

  const handleScrollToReviews = () => {
    setActiveTab("reviews");
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSendMessageToSeller = async () => {
    if (!isUserAuthenticated || !user?._id) {
      toast.error("Please login to send a message!");
      navigate("/signin");
      return;
    }
    const shopId = currentProduct?.shop?._id;
    if (!shopId) {
      toast.error("Seller contact is unavailable for this product.");
      return;
    }
    toast.loading("Connecting with seller...", { id: "conv-toast" });
    const res = await dispatch(
      createConversation({
        userId: user._id,
        sellerId: shopId,
        groupTitle: `Product_${currentProduct?._id || Date.now()}`,
      }),
    );
    if (res?.success && res?.conversation) {
      toast.success("Conversation opened!", { id: "conv-toast" });
      navigate(`/my-profile?tab=inbox&conversationId=${res.conversation._id}`);
    } else {
      toast.error(res?.message || "Failed to open conversation.", {
        id: "conv-toast",
      });
    }
  };

  if (!productId) return null;

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Breadcrumb Skeleton */}
        <div className="h-5 w-72 bg-slate-200 rounded-md animate-pulse" />

        {/* Main Product Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14">
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
            <div className="flex gap-3">
              <div className="h-20 w-20 rounded-2xl bg-slate-100 animate-pulse" />
              <div className="h-20 w-20 rounded-2xl bg-slate-100 animate-pulse" />
              <div className="h-20 w-20 rounded-2xl bg-slate-100 animate-pulse" />
            </div>
          </div>
          <div className="space-y-6 py-2">
            <div className="flex gap-2">
              <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
              <div className="h-6 w-32 bg-slate-200 rounded-full animate-pulse" />
            </div>
            <div className="h-10 w-4/5 bg-slate-200 rounded-xl animate-pulse" />
            <div className="h-6 w-40 bg-slate-200 rounded-full animate-pulse" />
            <div className="h-24 w-full bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-16 w-full bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-12 w-full bg-slate-200 rounded-2xl animate-pulse" />
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="space-y-6 pt-12 border-t border-slate-100">
          <div className="h-7 w-52 bg-slate-200 rounded-lg animate-pulse mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductCardSkeleton count={4} />
          </div>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5">
          <Package className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Product Not Found
        </h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
          The product you are looking for may have been removed, sold out, or the link is expired.
        </p>
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          <span>Explore All Products</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    );
  }

  // Process Images
  const rawImages = currentProduct?.images || [];
  const imageList = Array.isArray(rawImages) && rawImages.length > 0
    ? rawImages.map((img) => getImageUrl(img?.url || img))
    : [
        getImageUrl(
          currentProduct?.image_Url?.[0]?.url || currentProduct?.image_Url,
          "https://dummyimage.com/600x600/f1f5f9/94a3b8.png&text=Product",
        ),
      ];

  const currentDisplayImage =
    imageList[selectedImageIndex] || imageList[0];

  // Pricing calculations
  const regularPrice = Number(currentProduct?.price || 0);
  const salePrice = Number(currentProduct?.discount_price || regularPrice);
  const hasDiscount = regularPrice > salePrice && salePrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
    : 0;

  // Reviews summary calculation
  const productReviews = Array.isArray(currentProduct?.reviews)
    ? currentProduct.reviews
    : [];
  const totalReviewsCount = productReviews.length;
  const averageRating = totalReviewsCount > 0
    ? (
        productReviews.reduce((acc, r) => acc + Number(r?.rating || 0), 0) /
        totalReviewsCount
      ).toFixed(1)
    : Number(currentProduct?.rating || 0).toFixed(1);

  // Review breakdown distribution
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  productReviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(Number(r?.rating || 5))));
    ratingCounts[star] = (ratingCounts[star] || 0) + 1;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb Navigation Bar */}
      <nav
        aria-label="Breadcrumb"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2"
      >
        <ol className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-slate-500 font-medium">
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
              Products
            </Link>
          </li>
          {currentProduct?.category && (
            <>
              <li className="text-slate-300">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li>
                <Link
                  to={`/products?category=${currentProduct.category.toLowerCase()}`}
                  className="hover:text-red-600 transition-colors capitalize"
                >
                  {currentProduct.category}
                </Link>
              </li>
            </>
          )}
          <li className="text-slate-300">
            <ChevronRight className="w-3.5 h-3.5" />
          </li>
          <li className="text-slate-900 font-semibold truncate max-w-xs sm:max-w-md">
            {currentProduct?.name}
          </li>
        </ol>
      </nav>

      {/* Main Product Showcase Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* LEFT: Product Image Gallery */}
          <div className="w-full flex flex-col gap-4">
            {/* Primary Image Container */}
            <div className="group relative w-full aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-200/80 shadow-xs flex items-center justify-center">
              <img
                src={currentDisplayImage}
                alt={currentProduct?.name}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Badges on Top of Image */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                {hasDiscount && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-red-600/30">
                    <Sparkles className="w-3 h-3" />
                    Save {discountPercent}%
                  </span>
                )}
                {currentProduct?.stock > 0 && currentProduct?.stock <= 10 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-md">
                    Low Stock
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Selector Strip */}
            {imageList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-1 scrollbar-thin">
                {imageList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden bg-slate-50 border p-1.5 shrink-0 transition-all duration-200 cursor-pointer ${
                      selectedImageIndex === idx
                        ? "border-red-600 ring-2 ring-red-500/30 shadow-md scale-102"
                        : "border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details Info */}
          <ProductDetailInfo
            {...currentProduct}
            quantity={quantity}
            setQuantity={setQuantity}
            isWishlisted={isWishlisted}
            isCartLoading={isCartLoading}
            isWishlistLoading={isWishlistLoading}
            onWishlistToggle={handleWishlistToggle}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onScrollToReviews={handleScrollToReviews}
          />
        </div>
      </section>

      {/* Tabs Section */}
      <section
        ref={reviewsRef}
        className="w-full bg-slate-50/70 border-y border-slate-200/70 py-12 sm:py-16 mt-8"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation Header */}
          <div className="flex justify-center border-b border-slate-200">
            <nav className="-mb-px flex space-x-4 sm:space-x-8">
              {[
                { id: "details", label: "Product Details", icon: FileText },
                {
                  id: "reviews",
                  label: `Customer Reviews (${totalReviewsCount})`,
                  icon: Star,
                },
                { id: "seller", label: "Seller Information", icon: Store },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      inline-flex items-center gap-2 py-4 px-2 sm:px-4 border-b-2 font-bold text-xs sm:text-sm transition-all cursor-pointer
                      ${
                        isActive
                          ? "border-red-600 text-red-600"
                          : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                      }
                    `}
                  >
                    <TabIcon
                      className={`w-4 h-4 ${
                        isActive ? "text-red-600" : "text-slate-400"
                      }`}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Panels */}
          <div className="mt-8 sm:mt-10 min-h-[300px]">
            {/* DETAILS TAB */}
            {activeTab === "details" && (
              <div className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
                {/* Description Text */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Product Description
                  </h3>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm sm:text-base">
                    <p>
                      {currentProduct?.description ||
                        "No detailed description provided for this product."}
                    </p>
                  </div>
                </div>

                {/* Product Specifications Table */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm">
                      <span className="text-slate-500 font-medium">Category</span>
                      <span className="font-bold text-slate-800 capitalize">
                        {currentProduct?.category || "Standard"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm">
                      <span className="text-slate-500 font-medium">Stock Status</span>
                      <span className="font-bold text-slate-800">
                        {currentProduct?.stock > 0
                          ? `${currentProduct.stock} available units`
                          : "Out of Stock"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm">
                      <span className="text-slate-500 font-medium">Total Sold</span>
                      <span className="font-bold text-slate-800">
                        {currentProduct?.total_sell || 0} items
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm">
                      <span className="text-slate-500 font-medium">Estimated Delivery</span>
                      <span className="font-bold text-emerald-600">
                        2 - 4 Business Days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {currentProduct?.tags && currentProduct.tags.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-700">
                      Product Tags & Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentProduct.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold uppercase tracking-wider"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Rating Breakdown Header Card */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-8">
                  {/* Left: Overall Score */}
                  <div className="text-center md:text-left space-y-2 md:border-r md:border-slate-200/80 md:pr-8">
                    <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
                      {averageRating}
                    </span>
                    <div className="flex items-center justify-center md:justify-start text-amber-400 gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={18}
                          className={
                            s <= Math.round(Number(averageRating))
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Based on {totalReviewsCount} {totalReviewsCount === 1 ? "rating" : "ratings"}
                    </p>
                  </div>

                  {/* Right: Progress bars */}
                  <div className="flex-1 w-full space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = ratingCounts[stars] || 0;
                      const pct =
                        totalReviewsCount > 0
                          ? Math.round((count / totalReviewsCount) * 100)
                          : 0;

                      return (
                        <div key={stars} className="flex items-center gap-3 text-xs">
                          <span className="w-10 font-bold text-slate-600 flex items-center gap-1">
                            {stars} <Star size={12} className="fill-amber-400 text-amber-400" />
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-right font-medium text-slate-400">
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-4">
                  {productReviews.length > 0 ? (
                    productReviews.map((review, idx) => {
                      const avatarUrl =
                        review?.user?.avatar?.url || review?.user?.avatar;
                      const userName = review?.user?.name || "Verified Buyer";
                      const formattedDate = review?.createdAt
                        ? new Date(review.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Recently";

                      return (
                        <div
                          key={idx}
                          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-4"
                        >
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center text-slate-700 font-bold text-base shadow-inner">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt={userName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              userName[0]?.toUpperCase() || "U"
                            )}
                          </div>

                          <div className="flex-1 space-y-1.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                                  {userName}
                                </h4>
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Verified Purchase
                                </span>
                              </div>
                              <span className="text-xs text-slate-400">
                                {formattedDate}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-amber-400">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={14}
                                  className={
                                    s <= Math.round(Number(review?.rating || 5))
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-slate-200"
                                  }
                                />
                              ))}
                            </div>

                            <p className="text-slate-600 text-sm leading-relaxed pt-1">
                              {review?.comment || "No comment provided."}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
                      <Star className="w-10 h-10 text-slate-300 mx-auto" />
                      <h4 className="font-bold text-slate-800 text-base">
                        No customer reviews yet
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                        Be the first to share your thoughts and help others make informed choices!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SELLER TAB */}
            {activeTab === "seller" && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                <div className="w-24 h-24 shrink-0 rounded-2xl border border-slate-200 shadow-xs overflow-hidden bg-slate-50 flex items-center justify-center p-2">
                  <img
                    src={
                      currentProduct?.shop?.avatar?.url ||
                      currentProduct?.shop?.avatar ||
                      "https://dummyimage.com/150x150/e2e8f0/64748b.png&text=Shop"
                    }
                    alt={currentProduct?.shop?.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Merchant
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      {currentProduct?.shop?.name || "Unknown Seller"}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                    {currentProduct?.shop?.description ||
                      "A trusted vendor providing authenticated high-quality items on Mocco Mart."}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                    {currentProduct?.shop?._id && (
                      <Link
                        to={`/shop/${currentProduct.shop._id}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-sm"
                      >
                        <Store className="w-4 h-4" />
                        <span>Visit Full Shop</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleSendMessageToSeller}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:border-red-300 hover:text-red-600 bg-white font-bold text-xs sm:text-sm text-slate-700 transition-all shadow-xs cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Message Seller</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-2 mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Hand-Picked Picks
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Related <span className="text-red-600">Products</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Customers who viewed this item also explored these recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product?._id || product?.id}
                product={product}
                handleClick={handleRelatedProductClick}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
