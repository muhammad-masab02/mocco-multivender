import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Upload,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Store,
} from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    file: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const avatarPreview = useMemo(() => {
    if (!formData.file) return "";
    return URL.createObjectURL(formData.file);
  }, [formData.file]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "file" ? files?.[0] || null : value,
    });
  };

  const handleRemoveAvatar = () => {
    setFormData({ ...formData, file: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);

      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }

      const { data } = await axios.post(
        `${backendUrl}/user/register`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data?.success) {
        toast.success(
          data.message || "Registration email sent! Please check your inbox.",
          { duration: 5000 },
        );
        setFormData({
          name: "",
          email: "",
          password: "",
          file: null,
        });
        navigate("/login");
      } else {
        toast.error(data?.message || "Registration failed. Try again.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred during signup.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full min-h-[85vh] grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 my-4 sm:my-6">
      {/* Left Brand Showcase Banner */}
      <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-linear-to-br from-slate-900 via-red-900 to-rose-700 text-white overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-red-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />

        {/* Top Tagline */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-red-100 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Customer Onboarding</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight">
            Join the Mocco Mart Shopping Community.
          </h1>
          <p className="mt-3 text-red-100/90 text-sm leading-relaxed">
            Create an account to unlock member discounts, track real-time
            deliveries, and enjoy frictionless checkout.
          </p>
        </div>

        {/* Perks Checklist */}
        <div className="relative z-10 space-y-3 my-8">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instant order tracking & push notifications</span>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Save multiple delivery addresses & payment methods</span>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Exclusive flash vouchers and event access</span>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-red-100/80">
          <span>Safe & encrypted authentication</span>
          <span className="font-bold text-white">Mocco Mart v2.0</span>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="lg:col-span-7 p-6 sm:p-10 xl:p-14 flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Get Started with Mocco Mart
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Enter your details to create your customer profile.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  autoComplete="name"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium outline-none focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address <span className="text-red-500">*</span>
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

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Password <span className="text-red-500">*</span>
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

            {/* Avatar Upload Dropzone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Profile Avatar (Optional)
              </label>
              <div className="flex items-center gap-4 p-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70">
                <div className="w-13 h-13 rounded-full border border-slate-200 bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-slate-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="user-avatar-upload"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formData.file ? "Change Photo" : "Upload Photo"}</span>
                    </label>

                    {formData.file && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 transition cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">
                    {formData.file ? formData.file.name : "JPEG, PNG up to 5MB"}
                  </p>
                  <input
                    id="user-avatar-upload"
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
                className="w-full py-3.5 px-6 rounded-2xl bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Customer Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Secondary Navigation */}
            <div className="pt-4 text-center space-y-3">
              <p className="text-xs text-slate-500">
                Already registered?{" "}
                <Link
                  to="/login"
                  className="font-bold text-red-600 hover:text-red-700 underline underline-offset-2"
                >
                  Sign In
                </Link>
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                <span>Want to sell products?</span>
                <Link
                  to="/shop-create"
                  className="font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Register as a Seller
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
