import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCartItemQty,
  removeFromCart,
  updateGuestCartQtyAction,
  removeFromGuestCartAction,
} from "../../services/store/actions/cart";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl.js";
import { Trash2, Plus, Minus, Loader2, Package, Store } from "lucide-react";

const CartTable = ({ cartItems }) => {
  const dispatch = useDispatch();
  const { isUserAuthenticated } = useSelector((state) => state.user);
  const { isLoading } = useSelector((state) => state.cart);

  const handleRemove = (productId) => {
    if (isUserAuthenticated) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(removeFromGuestCartAction(productId));
    }
  };

  const handleQuantityChange = (productId, newQty, stock) => {
    const quantity = Math.max(1, Math.min(Number(newQty), stock || 999));
    if (isUserAuthenticated) {
      dispatch(updateCartItemQty(productId, quantity));
    } else {
      dispatch(updateGuestCartQtyAction(productId, quantity, stock));
    }
  };

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-20 flex flex-col items-center justify-center rounded-3xl">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin mb-2" />
          <p className="text-xs font-bold text-slate-600">Updating Cart...</p>
        </div>
      )}

      {/* DESKTOP TABLE VIEW (hidden on mobile) */}
      <div className="hidden md:block overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
        <div className="grid grid-cols-12 bg-slate-50/80 px-6 py-4 border-b border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-500">
          <div className="col-span-5">Product Details</div>
          <div className="col-span-2 text-center">Unit Price</div>
          <div className="col-span-2 text-center">Quantity</div>
          <div className="col-span-2 text-right">Subtotal</div>
          <div className="col-span-1 text-center">Remove</div>
        </div>

        <div className="divide-y divide-slate-100">
          {cartItems.map((item) => {
            const product = item.productId;
            if (!product) return null;

            const unitPrice = Number(product.discount_price || product.price || 0);
            const productId = product._id || product.id;
            const rawImg = product?.images?.[0]?.url || product?.images?.[0] || product?.image;
            const imgUrl = getImageUrl(rawImg);
            const stockLimit = product.stock || 99;

            return (
              <div
                key={productId}
                className="grid grid-cols-12 items-center px-6 py-5 transition-colors hover:bg-slate-50/40"
              >
                {/* Product Column */}
                <div className="col-span-5 flex items-center gap-4 min-w-0 pr-4">
                  <Link
                    to={`/product-detail/${productId}`}
                    className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 p-1.5 shrink-0 overflow-hidden flex items-center justify-center hover:border-red-200 transition-colors"
                  >
                    <img
                      src={imgUrl}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </Link>

                  <div className="min-w-0 flex-1 space-y-1">
                    <Link
                      to={`/product-detail/${productId}`}
                      className="text-sm font-bold text-slate-900 hover:text-red-600 transition-colors line-clamp-1 leading-snug"
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      {product.category && (
                        <span className="capitalize">{product.category}</span>
                      )}
                      {product.shop?.name && (
                        <>
                          <span>•</span>
                          <span className="truncate flex items-center gap-1">
                            <Store className="w-3 h-3" />
                            {product.shop.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Unit Price */}
                <div className="col-span-2 text-center">
                  <span className="text-sm font-extrabold text-slate-800">
                    ${unitPrice.toFixed(2)}
                  </span>
                </div>

                {/* Quantity Stepper */}
                <div className="col-span-2 flex justify-center">
                  <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs">
                    <button
                      type="button"
                      disabled={item.quantity <= 1 || isLoading}
                      onClick={() =>
                        handleQuantityChange(productId, item.quantity - 1, stockLimit)
                      }
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-9 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      disabled={item.quantity >= stockLimit || isLoading}
                      onClick={() =>
                        handleQuantityChange(productId, item.quantity + 1, stockLimit)
                      }
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="col-span-2 text-right">
                  <span className="text-base font-black text-slate-900">
                    ${(unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Remove Button */}
                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemove(productId)}
                    disabled={isLoading}
                    title="Remove item"
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE CARD VIEW (visible only on small screens) */}
      <div className="md:hidden space-y-3.5">
        {cartItems.map((item) => {
          const product = item.productId;
          if (!product) return null;

          const unitPrice = Number(product.discount_price || product.price || 0);
          const productId = product._id || product.id;
          const rawImg = product?.images?.[0]?.url || product?.images?.[0] || product?.image;
          const imgUrl = getImageUrl(rawImg);
          const stockLimit = product.stock || 99;

          return (
            <div
              key={productId}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3"
            >
              <div className="flex gap-3.5">
                <Link
                  to={`/product-detail/${productId}`}
                  className="w-18 h-18 rounded-xl bg-slate-50 border border-slate-100 p-1 shrink-0 overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={imgUrl}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </Link>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/product-detail/${productId}`}
                      className="text-xs sm:text-sm font-bold text-slate-900 hover:text-red-600 transition-colors line-clamp-2 leading-snug"
                    >
                      {product.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemove(productId)}
                      className="text-slate-400 hover:text-red-600 p-1 shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 capitalize">
                    {product.category || "Item"}
                  </p>
                  <p className="text-xs font-bold text-slate-800">
                    ${unitPrice.toFixed(2)} each
                  </p>
                </div>
              </div>

              {/* Bottom Row: Stepper and Total */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs">
                  <button
                    type="button"
                    disabled={item.quantity <= 1 || isLoading}
                    onClick={() =>
                      handleQuantityChange(productId, item.quantity - 1, stockLimit)
                    }
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    disabled={item.quantity >= stockLimit || isLoading}
                    onClick={() =>
                      handleQuantityChange(productId, item.quantity + 1, stockLimit)
                    }
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Subtotal</span>
                  <span className="text-sm font-black text-slate-900">
                    ${(unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartTable;
