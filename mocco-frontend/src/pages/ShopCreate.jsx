import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Store,
  Phone,
  Mail,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Upload,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Trash2,
  ShoppingBag,
} from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const initialFormData = {
  name: "",
  phoneNumber: "",
  email: "",
  address: "",
  zipCode: "",
  password: "",
  file: null,
};

const ShopCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const logoPreview = useMemo(() => {
    if (!formData.file) return "";
    return URL.createObjectURL(formData.file);
  }, [formData.file]);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "file" ? files?.[0] || null : value,
    }));
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, file: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      toast.error("Please upload your storefront brand logo.");
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("zipCode", formData.zipCode);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("file", formData.file);

      const { data } = await axios.post(
        `${backendUrl}/shop/register`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data?.success) {
        toast.success(
          data.message ||
            "Store registered! Activation link sent to your email.",
          { duration: 5000 },
        );
        setFormData(initialFormData);
        navigate("/shop-login");
      } else {
        toast.error(data?.message || "Store registration failed. Try again.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred during seller signup.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full min-h-[85vh] grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 my-4 sm:my-6">
      {/* Left Merchant Showcase Banner */}
      <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-linear-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

        {/* Top Tagline */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-6">
            <Store className="w-3.5 h-3.5" />
            <span>Vendor Onboarding</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight">
            Launch Your Storefront to Thousands of Active Buyers.
          </h1>
          <p className="mt-3 text-emerald-100/80 text-sm leading-relaxed">
            Create your seller profile, customize your branding, and start
            receiving customer orders with automated payouts.
          </p>
        </div>

        {/* Merchant Benefits */}
        <div className="relative z-10 space-y-3 my-8">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs">
            <div className="p-2 rounded-xl bg-emerald-500/30 text-emerald-300 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">0% Platform Fee for 30 Days</p>
              <p className="text-emerald-100/70 text-[11px]">
                Keep 100% of your initial earnings during launch.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs">
            <div className="p-2 rounded-xl bg-emerald-500/30 text-emerald-300 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Direct Merchant Payouts</p>
              <p className="text-emerald-100/70 text-[11px]">
                Request earnings withdrawal to your bank anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Details */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-100/70">
          <span>Enterprise grade seller infrastructure</span>
          <span className="font-bold text-emerald-400">Merchant Hub v2.0</span>
        </div>
      </div>

      {/* Right Form Card */}
      <div className="lg:col-span-7 p-6 sm:p-10 xl:p-12 flex items-center justify-center bg-white">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Store className="w-3.5 h-3.5" />
              <span>Seller Registration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Create Your Storefront
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Fill in your business information to register as a seller.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Store Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Storefront Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Apex Tech Store"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Phone & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Business Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g. +1 (555) 019-2834"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Business Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@store.com"
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Address & Zip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Physical Store Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street, suite, city"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Zip / Postal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="e.g. 90210"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Store Account Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
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

            {/* Shop Logo Avatar */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Storefront Logo Avatar <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4 p-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70">
                <div className="w-13 h-13 rounded-full border border-slate-200 bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Shop Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store className="w-6 h-6 text-slate-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="shop-logo-upload"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formData.file ? "Change Logo" : "Upload Brand Logo"}</span>
                    </label>

                    {formData.file && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 transition cursor-pointer"
                        title="Remove logo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">
                    {formData.file ? formData.file.name : "JPEG, PNG up to 5MB (Square recommended)"}
                  </p>
                  <input
                    id="shop-logo-upload"
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </div>
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
                    <span>Creating Storefront...</span>
                  </>
                ) : (
                  <>
                    <span>Register Storefront</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Navigation links */}
            <div className="pt-4 text-center space-y-3">
              <p className="text-xs text-slate-500">
                Already have a seller account?{" "}
                <Link
                  to="/shop-login"
                  className="font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
                >
                  Sign In to Store
                </Link>
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShoppingBag className="w-3.5 h-3.5 text-red-500" />
                <span>Want to shop instead?</span>
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

export default ShopCreate;
