import React, { useState } from "react";
import {
  Heart,
  Eye,
  ShoppingCart,
  Star,
  Check,
  Flame,
  Store,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  addToWishlist,
  removeFromWishlist,
  addToGuestWishlistAction,
  removeFromGuestWishlistAction,
} from "../../../services/store/actions/wishlist.js";
import {
  addToCart,
  addToGuestCartAction,
} from "../../../services/store/actions/cart.js";
import ProductDetailViewModal from "./ProductDetailViewModal.jsx";
import { createConversation } from "../../../services/store/actions/conversation.js";
import { getImageUrl } from "../../../utils/imageUrl.js";

const ProductCard = ({ product, handleClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isUserAuthenticated, user } = useSelector((state) => state.user);
  const { ids: wishlistIds } = useSelector((state) => state.wishlist);

  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [productDetailView, setProductDetailView] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Images
  const rawImg =
    product?.images?.[0]?.url ||
    product?.image_Url?.[0]?.url ||
    product?.image_Url ||
    product?.images?.[0];
  const productImage = getImageUrl(
    rawImg,
    "https://dummyimage.com/400x400/f1f5f9/94a3b8.png&text=Product",
  );

  const secondaryRaw =
    product?.images?.[1]?.url ||
    product?.image_Url?.[1]?.url ||
    product?.images?.[1];
  const secondaryImage = secondaryRaw ? getImageUrl(secondaryRaw) : null;

  // Pricing & Metrics
  const productPrice = Number(product?.discount_price || product?.price || 0);
  const originalPrice = Number(product?.price || 0);
  const hasDiscount =
    product?.discount_price &&
    Number(product?.discount_price) < Number(product?.price);
  const discountPercent =
    product?.discount ||
    (hasDiscount && originalPrice > 0
      ? Math.round(((originalPrice - productPrice) / originalPrice) * 100)
      : 0);

  const rating = Number(product?.rating || product?.shop?.ratings || 0);
  const reviewsCount = product?.reviews?.length || 0;
  const stock = Number(product?.stock || 0);
  const maxQuantity = stock > 0 ? stock : 1;
  const productId = product?._id || product?.id || "N/A";
  const addedDate = product?.createdAt
    ? new Date(product.createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();

  const isWishlisted = wishlistIds.includes(productId);

  // Toggle Wishlist
  const handleWishlistToggle = async (e) => {
    e.stopPropagation();

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

  // Add to Cart
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (stock <= 0) {
      toast.error("This item is currently out of stock");
      return;
    }

    if (isUserAuthenticated) {
      try {
        await dispatch(addToCart(productId, 1));
        setIsAddedToCart(true);
        toast.success("Added to cart");
        setTimeout(() => setIsAddedToCart(false), 1600);
      } catch (err) {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to add to cart",
        );
      }
    } else {
      dispatch(addToGuestCartAction(product, 1));
      setIsAddedToCart(true);
      toast.success("Added to local cart (Login to sync)");
      setTimeout(() => setIsAddedToCart(false), 1600);
    }
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => (prev < maxQuantity ? prev + 1 : maxQuantity));
  };

  const handleModalToggle = (e) => {
    e.stopPropagation();
    setProductDetailView((prev) => !prev);
  };

  const closeModal = (e) => {
    e?.stopPropagation();
    setProductDetailView(false);
  };

  const renderStars = (value) => {
    const fullStars = Math.round(value);
    return "★".repeat(fullStars) + "☆".repeat(Math.max(0, 5 - fullStars));
  };

  const handleNavigateToShop = (e) => {
    e.stopPropagation();
    if (product?.shop?._id) {
      navigate(`/shop/${product.shop._id}`);
    }
  };

  const handleSendMessageToSeller = async (shop) => {
    if (!user?._id) {
      toast.error("Please login to send a message!");
      return;
    }
    const shopId = shop?._id || product?.shop?._id;
    if (!shopId) {
      toast.error("Seller information is unavailable.");
      return;
    }
    toast.loading("Opening conversation...", { id: "conv-toast" });
    const res = await dispatch(
      createConversation({
        userId: user._id,
        sellerId: shopId,
        groupTitle: `Product_${product?._id || Date.now()}`,
      }),
    );
    if (res?.success && res?.conversation) {
      toast.success("Conversation opened!", { id: "conv-toast" });
      setProductDetailView(false);
      navigate(`/my-profile?tab=inbox&conversationId=${res.conversation._id}`);
    } else {
      toast.error(res?.message || "Failed to open conversation.", {
        id: "conv-toast",
      });
    }
  };

  return (
    <>
      <div
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200/80 hover:border-red-200/90 shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:shadow-[0_16px_36px_rgba(239,68,68,0.12)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer select-none"
        onClick={() => handleClick(product?._id || product?.id)}
      >
        {/* ── Top Media Container ────────────────────────────────────────────── */}
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-100/90 flex items-center justify-center">
          {/* Primary Product Image */}
          <img
            src={productImage}
            alt={product?.name || "Product image"}
            loading="lazy"
            className={`h-full w-full object-cover object-center transition-all duration-500 ease-out ${
              secondaryImage
                ? "group-hover:opacity-0 group-hover:scale-105"
                : "group-hover:scale-108"
            }`}
          />

          {/* Secondary Image on Hover (if available) */}
          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={product?.name || "Product alternate view"}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-105"
            />
          )}

          {/* Ambient Vignette Overlay on Hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top Left Badges: Discount & Top Pick */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
            {discountPercent > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-red-600 to-rose-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-md shadow-red-500/20 tracking-wide">
                <Sparkles size={11} className="fill-white" />
                -{discountPercent}%
              </span>
            )}

            {product?.total_sell >= 50 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/85 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-amber-300 shadow-sm uppercase tracking-wider">
                <Flame size={10} className="fill-amber-400 text-amber-400" />
                Hot
              </span>
            )}
          </div>

          {/* Top Right Floating Actions Hub (Wishlist & Quick View) */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 transition-all duration-200">
            {/* Wishlist Button */}
            <button
              type="button"
              onClick={handleWishlistToggle}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              disabled={isWishlistLoading}
              className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md backdrop-blur-md border ${
                isWishlisted
                  ? "bg-red-50 text-red-600 border-red-200 hover:scale-110 active:scale-95"
                  : "bg-white/90 text-slate-600 border-white/60 hover:bg-white hover:text-red-600 hover:scale-110 active:scale-95"
              }`}
            >
              {isWishlistLoading ? (
                <Loader2 size={14} className="animate-spin text-slate-400" />
              ) : (
                <Heart
                  size={15}
                  className={`transition-all duration-200 ${
                    isWishlisted ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              )}
            </button>

            {/* Quick View Button */}
            <button
              type="button"
              onClick={handleModalToggle}
              title="Quick view"
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-white/60 shadow-md backdrop-blur-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer lg:opacity-0 lg:group-hover:opacity-100 lg:translate-x-1 lg:group-hover:translate-x-0"
            >
              <Eye size={15} />
            </button>
          </div>

          {/* Desktop Hover Floating "Add to Cart" Pill */}
          <div className="absolute inset-x-3 bottom-3 z-20 hidden lg:block opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl backdrop-blur-md transition-all duration-200 cursor-pointer ${
                isAddedToCart
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900/90 hover:bg-red-600 active:scale-98 text-white"
              }`}
            >
              {isAddedToCart ? (
                <>
                  <Check size={14} />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={14} />
                  <span>Quick Add</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Product Info Section ─────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 space-y-2.5">
          <div className="space-y-1.5">
            {/* Shop & Category Header */}
            <div className="flex items-center justify-between gap-2">
              {product?.shop?.name ? (
                <button
                  type="button"
                  onClick={handleNavigateToShop}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-red-600 transition truncate max-w-[70%]"
                  title={product.shop.name}
                >
                  <Store size={11} className="text-slate-400 shrink-0" />
                  <span className="truncate">{product.shop.name}</span>
                </button>
              ) : (
                <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 truncate">
                  {product?.category || "General"}
                </span>
              )}

              {/* Rating stars */}
              {rating > 0 && (
                <div className="flex items-center gap-1 shrink-0">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="text-[11px] font-bold text-slate-700">
                    {rating.toFixed(1)}
                  </span>
                  {reviewsCount > 0 && (
                    <span className="text-[10px] text-slate-400">
                      ({reviewsCount})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Product Title */}
            <h3
              className="font-semibold text-slate-800 group-hover:text-red-600 transition-colors line-clamp-2 text-xs sm:text-sm leading-snug min-h-[2.4rem]"
              title={product?.name}
            >
              {product?.name}
            </h3>
          </div>

          {/* Pricing & Cart Action Row */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            {/* Prices */}
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  ${productPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-slate-400 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Sold Count or Low Stock indicator */}
              {stock > 0 && stock <= 5 ? (
                <span className="text-[10px] font-semibold text-amber-600">
                  Only {stock} left
                </span>
              ) : product?.total_sell > 0 ? (
                <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                  <Flame size={10} className="text-orange-500 fill-orange-400" />
                  {product.total_sell} sold
                </span>
              ) : null}
            </div>

            {/* Mobile / Inline Quick Add Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              title="Add to cart"
              className={`lg:hidden h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs ${
                isAddedToCart
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900 hover:bg-red-600 active:scale-95 text-white"
              }`}
            >
              {isAddedToCart ? <Check size={14} /> : <ShoppingCart size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Product Detail Quick-View Modal ─────────────────────────────────── */}
      {productDetailView && (
        <ProductDetailViewModal
          product={product}
          productImage={productImage}
          productPrice={productPrice}
          originalPrice={originalPrice}
          rating={rating}
          reviewsCount={reviewsCount}
          stock={stock}
          maxQuantity={maxQuantity}
          productId={productId}
          renderStars={renderStars}
          addedDate={addedDate}
          quantity={quantity}
          onClose={closeModal}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onAddToCart={handleAddToCart}
          onNavigateToShop={handleNavigateToShop}
          onSendMessage={handleSendMessageToSeller}
        />
      )}
    </>
  );
};

export default ProductCard;
