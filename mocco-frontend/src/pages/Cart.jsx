import React, { useState } from "react";
import CartTable from "../components/cart/CartTable";
import CartSummaryBox from "../components/cart/CartSummaryBox";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  clearCart,
  clearGuestCartAction,
} from "../services/store/actions/cart";
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  ChevronRight,
  Home as HomeIcon,
  Sparkles,
  Truck,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

const FREE_SHIPPING_THRESHOLD = 100;

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isUserAuthenticated } = useSelector((state) => state.user);
  const { cartItems = [], isLoading } = useSelector((state) => state.cart);

  const [isClearing, setIsClearing] = useState(false);

  const subtotal =
    cartItems?.reduce((acc, item) => {
      const price =
        item.productId?.discount_price || item.productId?.price || 0;
      return acc + price * item.quantity;
    }, 0) || 0;

  const totalItems =
    cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const shippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleClearCart = async () => {
    if (isUserAuthenticated) {
      try {
        setIsClearing(true);
        await dispatch(clearCart());
        toast.success("Cart cleared");
      } catch (err) {
        toast.error(err?.message || "Failed to clear cart");
      } finally {
        setIsClearing(false);
      }
    } else {
      dispatch(clearGuestCartAction());
      toast.success("Cart cleared");
    }
  };

  if (isLoading && cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 space-y-3">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin" />
        <p className="text-sm font-semibold">Loading your cart...</p>
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
          <li className="text-slate-900 font-semibold">Shopping Cart</li>
        </ol>
      </nav>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl border border-slate-200/80 bg-white p-12 sm:p-16 flex flex-col items-center justify-center text-center shadow-xs space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mb-2 shadow-inner">
              <ShoppingCart className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Your shopping cart is empty
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Looks like you haven't added anything to your cart yet. Explore our curated collections to find your favorite products!
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-red-600/30 cursor-pointer"
              >
                <span>Start Shopping</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Has Items Layout */
          <>
            {/* Page Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200/80">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  Your Bag
                </div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                    Shopping <span className="text-red-600">Cart</span>
                  </h1>
                  <span className="px-3 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>

              {totalItems > 0 && (
                <button
                  type="button"
                  onClick={handleClearCart}
                  disabled={isClearing}
                  className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isClearing ? "Clearing..." : "Clear Cart"}</span>
                </button>
              )}
            </div>

            {/* Free Shipping Progress Track */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2 text-slate-700">
                  <Truck className="w-4 h-4 text-red-600" />
                  {shippingRemaining > 0 ? (
                    <span>
                      Add <strong className="text-red-600">${shippingRemaining.toFixed(2)}</strong> more to get Free Standard Shipping!
                    </span>
                  ) : (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Congratulations! You unlocked Free Shipping!
                    </span>
                  )}
                </div>
                <span className="text-slate-400">
                  Threshold: ${FREE_SHIPPING_THRESHOLD}
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            {/* Main Cart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Cart Table */}
              <div className="lg:col-span-8 space-y-4">
                <CartTable cartItems={cartItems} />

                {/* Continue Shopping Button */}
                <div className="pt-2">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-red-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Cart Summary Box */}
              <div className="lg:col-span-4 sticky top-24">
                <CartSummaryBox
                  subtotal={subtotal}
                  shipping={shippingRemaining === 0 ? "FREE" : "$10.00"}
                  total={shippingRemaining === 0 ? subtotal : subtotal + 10}
                  onCheckout={() => navigate("/checkout")}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Cart;
