import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { loadUser } from "../services/store/actions/user";
import {
  UserCog,
  Crown,
  Settings2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Terminal,
  Mail,
  ArrowRight,
  Store,
  ChevronLeft,
} from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isUserAuthenticated } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [auditAgreement, setAuditAgreement] = useState(true);

  // If already logged in as super admin, redirect straight to /admin
  useEffect(() => {
    if (
      isUserAuthenticated &&
      String(user?.role || "").toLowerCase() === "admin"
    ) {
      navigate("/admin", { replace: true });
    }
  }, [isUserAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please supply administrator email and security key.");
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
        // Load the authenticated user profile
        const userRes = await dispatch(loadUser());
        const currentUser = userRes?.user || data?.user;

        const role = String(currentUser?.role || "").toLowerCase();

        if (role === "admin") {
          toast.success(
            "Super Administrator Authenticated. Welcome to Command Center.",
            {
              icon: "🛡️",
              duration: 4000,
            },
          );
          setFormData({ email: "", password: "" });
          navigate("/admin", { replace: true });
        } else {
          // Account is not an admin, logout to clean cookie and reject
          await axios.get(`${backendUrl}/user/logout`, {
            withCredentials: true,
          });
          dispatch(loadUser());
          toast.error(
            "Access Denied: This account does not possess Super Administrator privileges.",
            {
              duration: 5000,
            },
          );
        }
      } else {
        toast.error(data?.message || "Invalid administrator credentials.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Security verification failed. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#070b12] text-slate-100 relative overflow-hidden font-sans">
      {/* Background Cyber Grid & Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Console Box */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg">
        {/* Top Floating Return Link */}
        <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 hover:text-white transition group cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition" />
            <span>Return to Marketplace</span>
          </Link>
        </div>

        {/* Executive Card */}
        <div className="rounded-3xl border border-red-500/20 bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl shadow-red-950/40 ring-1 ring-white/10 relative overflow-hidden">
          {/* Subtle Red Top Accent Stripe */}
          {/* <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-600 via-rose-500 to-amber-500" /> */}

          {/* Console Header */}
          <div className="text-center pb-6 border-b border-slate-800">
            {/* Admin Crest Icon */}

            <p className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/40 border border-red-900/50 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-red-400 mb-2">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Super Admin Portal</span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white pb-8 pt-2">
              Admin Login
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Admin Email */}
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <UserCog className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@mocco-mart.com"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-white text-xs sm:text-sm font-medium outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition placeholder:text-slate-500 font-mono"
                />
              </div>
            </div>

            {/* Admin Security Key */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                  Security Passkey
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  256-bit Hash
                </span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-white text-xs sm:text-sm font-medium outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition placeholder:text-slate-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Audit Agreement */}
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
              <input
                type="checkbox"
                id="audit-trail"
                checked={auditAgreement}
                onChange={(e) => setAuditAgreement(e.target.checked)}
                className="w-4 h-4 rounded-md border-slate-700 bg-slate-950 text-red-600 focus:ring-red-500/30 accent-red-600 cursor-pointer"
              />
              <label
                htmlFor="audit-trail"
                className="text-[11px] text-slate-400 cursor-pointer select-none"
              >
                Log this administrative session to audit trail
              </label>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-2xl bg-linear-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Verifying Clearance...</span>
                  </>
                ) : (
                  <>
                    <UserCog className="w-4 h-4" />
                    <span>Authenticate Administrator</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Bottom Footer Details */}
            <div className="pt-4 border-t border-slate-800 text-center space-y-2.5">
              <p className="text-[10px] text-slate-600 font-mono">
                Mocco Mart Enterprise Core v2.0 • Build #2026.11
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
