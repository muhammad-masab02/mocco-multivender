import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { loadUser } from "../services/store/actions/user";
import {
  getGuestWishlist,
  mergeWishlist,
} from "../services/store/actions/wishlist";
import { getGuestCart, mergeCart } from "../services/store/actions/cart";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  Store,
  ShieldAlert,
} from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/user/login`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (data?.success) {
        toast.success("Welcome back to Mocco Mart!");
        if (data.token) {
          localStorage.setItem("user_token", data.token);
          if (String(data.user?.role || "").toLowerCase() === "admin") {
            localStorage.setItem("admin_token", data.token);
          }
        }
        await dispatch(loadUser());

        // --- MERGE WISHLIST ---
        const guestIds = getGuestWishlist();
        if (guestIds && guestIds.length > 0) {
          try {
            await dispatch(mergeWishlist(guestIds));
          } catch (mergeErr) {
            console.error("Failed to merge guest wishlist", mergeErr);
          }
        }

        // --- MERGE CART ---
        const guestCart = getGuestCart();
        if (guestCart && guestCart.length > 0) {
          try {
            const mappedCart = guestCart.map((item) => ({
              productId: item.productId?._id || item.productId,
              quantity: item.quantity,
            }));
            await dispatch(mergeCart(mappedCart));
          } catch (mergeErr) {
            console.error("Failed to merge guest cart", mergeErr);
          }
        }

        setFormData({ email: "", password: "" });
        navigate("/");
      } else {
        toast.error(data?.message || "Login failed. Please check credentials.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred during login.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full min-h-[82vh] grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 my-4 sm:my-6">
      {/* Left Brand Showcase Banner */}
      <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-linear-to-br from-red-600 via-rose-600 to-red-800 text-white overflow-hidden">
        {/* Decorative Backdrop Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />

        {/* Top Tagline */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-red-50 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Shopper Access</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight">
            Discover Millions of Products from Trusted Sellers.
          </h1>
          <p className="mt-3 text-red-100/90 text-sm leading-relaxed">
            Sign in to track orders, manage addresses, access your saved
            wishlist, and checkout in seconds.
          </p>
        </div>

        {/* Floating Perks Card */}
        <div className="relative z-10 space-y-3 my-8">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
            <div className="p-2 rounded-xl bg-white/20 text-white shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold">Fast & Insured Delivery</p>
              <p className="text-red-100/80 text-[11px]">
                Nationwide express delivery to your doorstep.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
            <div className="p-2 rounded-xl bg-white/20 text-white shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold">100% Buyer Protection</p>
              <p className="text-red-100/80 text-[11px]">
                Safe payments & hassle-free 7-day returns.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-red-100/80">
          <span>Trusted by 50,000+ customers</span>
          <span className="font-bold text-white">Mocco Mart v2.0</span>
        </div>
      </div>

      {/* Right Form Card */}
      <div className="lg:col-span-7 p-6 sm:p-10 xl:p-14 flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Customer Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sign In to Your Account
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Welcome back! Please enter your details to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. alex@example.com"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium outline-none focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    toast("Password reset instructions will be sent via email.")
                  }
                  className="text-xs font-semibold text-red-600 hover:text-red-700 transition cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium outline-none focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-2xl bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Secondary Navigation */}
            <div className="pt-4 text-center space-y-3">
              <p className="text-xs text-slate-500">
                Don&apos;t have a customer account?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-red-600 hover:text-red-700 underline underline-offset-2"
                >
                  Sign Up Here
                </Link>
              </p>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-500">
                <Link
                  to="/shop-login"
                  className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:text-emerald-700"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Merchant / Seller Login</span>
                </Link>

                <span className="hidden sm:inline text-slate-300">•</span>

                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 font-bold text-slate-600 hover:text-red-600 transition"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                  <span>Super Admin Portal</span>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
