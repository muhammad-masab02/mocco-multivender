import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShieldCheck, ArrowRight, Tag, Truck, X, Loader2, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { validateCoupon } from "../../services/store/actions/checkout";
import {
  setCouponCode,
  removeCoupon,
  updateTotals,
} from "../../services/store/slices/checkoutSlice";

const CartSummaryBox = ({ subtotal = 0, shipping = "Free", total = 0, onCheckout }) => {
  const dispatch = useDispatch();

  const { cartItems = [] } = useSelector((state) => state.cart);
  const { isUserAuthenticated } = useSelector((state) => state.user);
  const {
    couponCode = "",
    appliedCoupon = null,
    couponLoading = false,
    discountAmount = 0,
  } = useSelector((state) => state.checkout);

  const [inputCode, setInputCode] = useState(couponCode);

  const numSubtotal = Number(subtotal || 0);
  const numTotal = Number(total || 0);

  const handleApply = async (e) => {
    e.preventDefault();
    const trimmed = inputCode.trim();
    if (!trimmed) {
      toast.error("Please enter a coupon code");
      return;
    }

    if (!isUserAuthenticated) {
      toast.error("Please sign in to apply store coupon codes");
      return;
    }

    dispatch(setCouponCode(trimmed));
    const res = await dispatch(validateCoupon(trimmed, numSubtotal, cartItems));
    if (res?.success) {
      toast.success(res.message || "Coupon applied successfully!");
    } else {
      toast.error(res?.message || "Invalid coupon code");
    }
  };

  const handleRemove = () => {
    dispatch(removeCoupon());
    dispatch(updateTotals({ subtotal: numSubtotal, cartItems }));
    setInputCode("");
    toast.success("Coupon removed");
  };

  // If a valid coupon is applied via checkoutSlice
  const finalDiscount = Number(discountAmount || 0);
  const finalTotal = Math.max(0, numTotal - finalDiscount);

  return (
    <div className="w-full rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-lg font-black text-slate-900 tracking-tight">
          Order Summary
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          Taxes calculated at checkout
        </span>
      </div>

      {/* Breakdown Items */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-bold text-slate-900">
            ${numSubtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-slate-400" />
            <span>Standard Shipping</span>
          </span>
          <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-xs">
            {shipping}
          </span>
        </div>

        {appliedCoupon && finalDiscount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 text-xs font-bold bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
            <span className="flex items-center gap-1.5 truncate">
              <Tag className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {appliedCoupon.code?.toUpperCase()} ({appliedCoupon.value}% OFF)
              </span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span>-${finalDiscount.toFixed(2)}</span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-slate-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                title="Remove coupon"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Coupon Code Form */}
      {!appliedCoupon ? (
        <form onSubmit={handleApply} className="pt-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Coupon code"
                disabled={couponLoading}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium uppercase outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 placeholder:normal-case disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={couponLoading || !inputCode.trim()}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all flex items-center justify-center min-w-[70px] cursor-pointer"
            >
              {couponLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "Apply"
              )}
            </button>
          </div>
          {!isUserAuthenticated && (
            <p className="text-[11px] text-amber-600 mt-1.5">
              Sign in required to apply shop coupons.
            </p>
          )}
        </form>
      ) : (
        <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
          <span>Coupon active: <strong className="text-slate-800 font-semibold">{appliedCoupon.code?.toUpperCase()}</strong></span>
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-600 hover:underline font-semibold cursor-pointer"
          >
            Remove
          </button>
        </div>
      )}

      {/* Total Row */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-base font-bold text-slate-900">Total</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ${finalTotal.toFixed(2)}
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          Estimated final amount in USD.
        </p>
      </div>

      {/* Checkout Button */}
      <button
        type="button"
        onClick={onCheckout}
        className="w-full py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/25 hover:-translate-y-0.5 cursor-pointer"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Trust & Guarantee Perks */}
      <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>30-Day Money-Back Guarantee</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummaryBox;
