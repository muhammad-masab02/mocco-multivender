import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { loadUser } from "../services/store/actions/user";
import { loadSeller } from "../services/store/actions/seller";
import {
  Store,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Package,
  ShoppingBag,
} from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ShopLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter your seller email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/shop/login`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (data?.success) {
        toast.success("Merchant session authenticated successfully!");
        await dispatch(loadUser());
        await dispatch(loadSeller());
        setFormData({ email: "", password: "" });
        const sellerId = data.seller?._id;
        navigate(`/shop-dashboard`, { replace: true });
      } else {
        toast.error(data?.message || "Invalid merchant credentials.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to sign in to seller account.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full min-h-[82vh] grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 my-4 sm:my-6">
      {/* Left Merchant Showcase Banner */}
      <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-linear-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

        {/* Top Tagline */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-6">
            <Store className="w-3.5 h-3.5" />
            <span>Merchant Operations</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight">
            Grow Your Commerce Business on Mocco Mart.
          </h1>
          <p className="mt-3 text-emerald-100/80 text-sm leading-relaxed">
            Access your vendor dashboard to process incoming customer orders,
            track payout balances, and launch flash deal promotions.
          </p>
        </div>

        {/* Merchant Highlights */}
        <div className="relative z-10 space-y-3 my-8">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs">
            <div className="p-2 rounded-xl bg-emerald-500/30 text-emerald-300 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Daily Payout Settlements</p>
              <p className="text-emerald-100/70 text-[11px]">
                Low transaction commissions and direct bank withdrawals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs">
            <div className="p-2 rounded-xl bg-emerald-500/30 text-emerald-300 shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Multi-Warehouse Inventory</p>
              <p className="text-emerald-100/70 text-[11px]">
                Real-time stock notifications and tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Proof */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-100/70">
          <span>Trusted by 1,200+ registered shops</span>
          <span className="font-bold text-emerald-400">Seller Hub 2.0</span>
        </div>
      </div>

      {/* Right Form Card */}
      <div className="lg:col-span-7 p-6 sm:p-10 xl:p-14 flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Store className="w-3.5 h-3.5" />
              <span>Seller Authentication</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Merchant Login
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Sign in to manage your storefront, catalog, and finances.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Business Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Merchant Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seller@yourstore.com"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    toast("Please contact seller support for password reset.")
                  }
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition cursor-pointer"
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
                  placeholder="Enter store password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
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
                className="w-full py-3.5 px-6 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Signing into Store...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Seller Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Secondary Navigation */}
            <div className="pt-4 text-center space-y-3">
              <p className="text-xs text-slate-500">
                New to Mocco Mart?{" "}
                <Link
                  to="/shop-create"
                  className="font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
                >
                  Register a New Storefront
                </Link>
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShoppingBag className="w-3.5 h-3.5 text-red-500" />
                <span>Looking for shopper account?</span>
                <Link
                  to="/login"
                  className="font-bold text-red-600 hover:text-red-700"
                >
                  Customer Sign In
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ShopLogin;
