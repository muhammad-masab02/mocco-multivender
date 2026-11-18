import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {
  Menu,
  ChevronDown,
  ChevronRight,
  Store,
  ShieldAlert,
  Shield,
  LayoutDashboard,
  Sparkles,
  User,
  BadgeCheck,
} from "lucide-react";
import { navItems, categoriesData } from "../../static/data.jsx";
import { loadUser } from "../../services/store/actions/user.js";
import { getAllEvents } from "../../services/store/actions/event.js";
import { clearWishlistState } from "../../services/store/slices/wishlistSlice.js";
import { clearCartState } from "../../services/store/slices/cartSlice.js";
import { initGuestWishlist } from "../../services/store/actions/wishlist.js";
import { initGuestCart } from "../../services/store/actions/cart.js";
import { getImageUrl } from "../../utils/imageUrl.js";
import GlobalSearch from "./GlobalSearch.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { user, isUserAuthenticated } = useSelector((state) => state.user);
  const { seller, isSellerAuthenticated } = useSelector(
    (state) => state.seller,
  );
  const { ids: wishlistIds } = useSelector((state) => state.wishlist);
  const { cartItems } = useSelector((state) => state.cart);

  const isAdmin = isUserAuthenticated && String(user?.role || "").toLowerCase() === "admin";
  const isSeller = isSellerAuthenticated && Boolean(seller?._id);

  const cartTotalQuantity =
    cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const categoryDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Fetch events for search
  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  // Hysteresis-based scroll listener — hides search bar above 110px, shows it below 25px.
  // This wide hysteresis gap completely eliminates boundary jitter/blinking during half scroll.
  useEffect(() => {
    const HIDE_THRESHOLD = 110;
    const SHOW_THRESHOLD = 25;

    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled((prev) => {
        if (!prev && y > HIDE_THRESHOLD) return true;
        if (prev && y < SHOW_THRESHOLD) return false;
        return prev;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click or route change
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setIsCategoryOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsCategoryOpen(false);
    setIsProfileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  // Handle logout
  const handleLogout = async () => {
    try {
      localStorage.removeItem("user_token");
      localStorage.removeItem("admin_token");
      const { data } = await axios.get(`${backendUrl}/user/logout`, {
        withCredentials: true,
      });
      if (data?.success) {
        dispatch(loadUser());
        dispatch(clearWishlistState());
        dispatch(clearCartState());
        dispatch(initGuestWishlist());
        dispatch(initGuestCart());
        navigate("/login", { replace: true });
      }
    } catch (error) {
      localStorage.removeItem("user_token");
      localStorage.removeItem("admin_token");
      dispatch(loadUser());
      dispatch(clearWishlistState());
      dispatch(clearCartState());
      dispatch(initGuestWishlist());
      dispatch(initGuestCart());
      navigate("/login", { replace: true });
    }
  };

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleMenuClose = () => setMenuOpen(false);

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-md">
      {/* ── Top Bar: Logo, Global Search & Open Your Shop ─────────────────────── */}
      <div
        className={`transition-all duration-300 ease-in-out border-b border-gray-100 bg-white ${
          isScrolled
            ? "max-h-0 opacity-0 -translate-y-2 pointer-events-none overflow-hidden py-0 border-none"
            : "max-h-28 opacity-100 translate-y-0 py-3 sm:py-3.5 relative z-30"
        }`}
        style={{
          overflow: isScrolled ? "hidden" : "visible",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo with Marketplace subtitle */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-600 flex items-center justify-center font-bold text-white text-base sm:text-lg shadow-sm group-hover:scale-105 transition-transform">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 leading-none">
                mocco<span className="text-red-500">.</span>
              </span>
              <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-0.5">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Center: Global Search Bar */}
          <div className="flex-1 max-w-2xl mx-1 sm:mx-6">
            <GlobalSearch isScrolled={isScrolled} />
          </div>

          {/* Right: Dynamic Role Action Button */}
          {isAdmin ? (
            <button
              onClick={() => navigate("/admin")}
              className="hidden md:flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md shadow-red-600/25 cursor-pointer whitespace-nowrap shrink-0 group hover:-translate-y-0.5"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span>Admin Portal</span>
            </button>
          ) : isSeller ? (
            <button
              onClick={() => navigate("/shop-dashboard")}
              className="hidden md:flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0 group border border-slate-700 hover:-translate-y-0.5"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Seller Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => navigate("/shop-create")}
              className="hidden md:flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-red-600 text-white text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap shrink-0 group hover:-translate-y-0.5"
            >
              <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-white text-xs group-hover:translate-x-0.5 transition-transform">
                ›
              </span>
              <span>Become a Seller</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Navigation Bar: Categories, Nav items, Wishlist, Cart & Profile ────── */}
      <div className="relative z-20 bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-13 sm:h-14 gap-4">
          {/* Left: All Categories Dropdown */}
          <div className="relative" ref={categoryDropdownRef}>
            <button
              onClick={() => setIsCategoryOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white font-medium text-xs sm:text-sm transition-all duration-200 cursor-pointer border border-white/10 whitespace-nowrap"
            >
              <Menu size={16} className="text-red-400" />
              <span className="font-semibold tracking-wide">All Categories</span>
              <ChevronDown
                size={15}
                className={`transition-transform duration-200 text-white/70 ${
                  isCategoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isCategoryOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 text-neutral-800">
                <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-gray-100 flex items-center justify-between">
                  <span>Browse Categories</span>
                  <span className="text-[10px] text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
                    {categoriesData?.length}
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto py-1">
                  {categoriesData?.map((category) => (
                    <button
                      key={category.id || category.title}
                      onClick={() => {
                        navigate(
                          `/products?category=${encodeURIComponent(
                            category.title.toLowerCase(),
                          )}`,
                        );
                        setIsCategoryOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-red-50 hover:text-red-600 flex items-center justify-between transition-colors group cursor-pointer"
                    >
                      <span className="font-medium truncate capitalize">
                        {category.title}
                      </span>
                      <ChevronRight
                        size={14}
                        className="text-neutral-400 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Center: Main Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems
              ?.filter((item) => item.title !== "SignUp")
              .map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  {item.title}
                </NavLink>
              ))}
          </nav>

          {/* Right: Wishlist, Cart & Profile Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors"
              title="Wishlist"
            >
              <FavoriteBorderIcon fontSize="small" />
              {wishlistIds?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center leading-none shadow-sm">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCartIcon fontSize="small" />
              {cartTotalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center leading-none shadow-sm">
                  {cartTotalQuantity}
                </span>
              )}
            </Link>

            {/* Profile Dropdown / Login */}
            {isUserAuthenticated ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="relative p-1 rounded-full text-white transition-all cursor-pointer group"
                  title="Account Menu"
                >
                  <div className={`rounded-full p-0.5 transition-all ${
                    isAdmin
                      ? "ring-2 ring-red-500 ring-offset-2 ring-offset-slate-900"
                      : isSeller
                      ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-900"
                      : "hover:ring-2 hover:ring-white/40"
                  }`}>
                    {user?.avatar?.url ? (
                      <img
                        src={getImageUrl(
                          user.avatar.url,
                          "https://dummyimage.com/100",
                        )}
                        alt="User"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 flex items-center justify-center text-white">
                        <PersonOutlineIcon fontSize="small" />
                      </div>
                    )}
                  </div>

                  {/* Corner Role Badge Indicator on Avatar */}
                  {isAdmin ? (
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs border border-slate-900">
                      <Shield className="w-2.5 h-2.5" />
                    </span>
                  ) : isSeller ? (
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs border border-slate-900">
                      <Store className="w-2.5 h-2.5" />
                    </span>
                  ) : null}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-200/80 py-2.5 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                    {/* User Profile Card Header with Role Badge */}
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                      <div className="relative shrink-0">
                        {user?.avatar?.url ? (
                          <img
                            src={getImageUrl(user.avatar.url, "https://dummyimage.com/100")}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                            {user?.name?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="text-sm font-bold truncate text-slate-900">
                            {user?.name || "Customer"}
                          </p>
                        </div>
                        <p className="text-xs text-slate-400 truncate mb-1">
                          {user?.email}
                        </p>
                        {/* Distinct Role Badges */}
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                            <ShieldAlert className="w-3 h-3 text-red-600" />
                            <span>Super Admin</span>
                          </span>
                        ) : isSeller ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <BadgeCheck className="w-3 h-3 text-emerald-600" />
                            <span>Verified Seller</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                            <User className="w-3 h-3 text-slate-500" />
                            <span>Shopper</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Role Specific Shortcuts */}
                    {isAdmin && (
                      <div className="px-2 py-1.5 border-b border-slate-100">
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold text-red-700 bg-red-50/70 hover:bg-red-100/70 transition group"
                        >
                          <span className="flex items-center gap-2">
                            <ShieldAlert size={15} className="text-red-600" />
                            <span>Admin Dashboard</span>
                          </span>
                          <span className="text-[10px] bg-red-600 text-white font-black px-1.5 py-0.2 rounded-md">
                            ADMIN
                          </span>
                        </Link>
                      </div>
                    )}

                    {isSeller && (
                      <div className="px-2 py-1.5 border-b border-slate-100 space-y-1">
                        <Link
                          to="/shop-dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/70 transition"
                        >
                          <span className="flex items-center gap-2">
                            <LayoutDashboard size={15} className="text-emerald-600" />
                            <span>Seller Dashboard</span>
                          </span>
                          <span className="text-[10px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded-md">
                            SHOP
                          </span>
                        </Link>
                        {seller?._id && (
                          <Link
                            to={`/shop/${seller._id}`}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 transition"
                          >
                            <Store size={14} className="text-slate-400" />
                            <span>View Storefront</span>
                          </Link>
                        )}
                      </div>
                    )}

                    {/* General User Links */}
                    <div className="px-2 py-1.5 space-y-0.5">
                      <Link
                        to="/my-profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                      >
                        <PersonOutlineIcon fontSize="small" />
                        My Profile
                      </Link>
                      <Link
                        to="/my-profile?tab=orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                      >
                        <ShoppingCartIcon fontSize="small" />
                        My Orders
                      </Link>
                    </div>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-100 mt-1 cursor-pointer"
                    >
                      <LogoutRoundedIcon fontSize="small" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="p-1.5 sm:p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition"
                title="Login / Register"
              >
                <PersonOutlineIcon fontSize="small" />
              </Link>
            )}

            {/* Mobile Drawer Hamburger Button */}
            <button
              onClick={handleMenuToggle}
              className="p-2 rounded-lg text-white hover:bg-white/10 lg:hidden cursor-pointer ml-1"
              aria-label="Open mobile menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer Navigation ────────────────────────────────────────── */}
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={handleMenuClose}
        sx={{
          display: { lg: "none" },
          "& .MuiDrawer-paper": {
            width: 290,
            boxSizing: "border-box",
          },
        }}
      >
        <div className="flex h-full flex-col bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
            <Link to="/" onClick={handleMenuClose} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white text-sm shadow-sm">
                M
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-900">
                mocco<span className="text-red-500">.</span>
              </span>
            </Link>
            <IconButton onClick={handleMenuClose} aria-label="Close mobile menu">
              <CloseIcon />
            </IconButton>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
            {/* Nav links */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Navigation
              </p>
              <nav className="space-y-1">
                {navItems?.map((item) => {
                  if (item.title === "SignUp" && isUserAuthenticated) return null;
                  return (
                    <NavLink
                      key={item.title}
                      to={item.url}
                      onClick={handleMenuClose}
                      className={({ isActive }) =>
                        `block rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-red-50 text-red-600 font-bold"
                            : "text-neutral-700 hover:bg-neutral-100"
                        }`
                      }
                    >
                      {item.title}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Quick Categories */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Top Categories
              </p>
              <div className="space-y-1">
                {categoriesData?.slice(0, 6).map((cat) => (
                  <button
                    key={cat.title}
                    onClick={() => {
                      navigate(
                        `/products?category=${encodeURIComponent(
                          cat.title.toLowerCase(),
                        )}`,
                      );
                      handleMenuClose();
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-neutral-600 hover:text-red-600 hover:bg-neutral-50 rounded-lg transition capitalize flex items-center justify-between"
                  >
                    <span>{cat.title}</span>
                    <ChevronRight size={12} className="text-neutral-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-gray-200 px-4 py-4 space-y-3">
            {/* Logged in User Pill */}
            {isUserAuthenticated && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0 overflow-hidden">
                  {user?.avatar?.url ? (
                    <img src={getImageUrl(user.avatar.url, "https://dummyimage.com/100")} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.[0]?.toUpperCase() || "U"
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.name || "User"}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                </div>
                {isAdmin ? (
                  <span className="text-[9px] font-black uppercase tracking-wider bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md">ADMIN</span>
                ) : isSeller ? (
                  <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md">SELLER</span>
                ) : null}
              </div>
            )}

            {/* Dynamic Role Action Button */}
            {isAdmin ? (
              <button
                onClick={() => {
                  handleMenuClose();
                  navigate("/admin");
                }}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white text-xs font-bold tracking-wide transition shadow-sm flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Portal</span>
              </button>
            ) : isSeller ? (
              <button
                onClick={() => {
                  handleMenuClose();
                  navigate("/shop-dashboard");
                }}
                className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold tracking-wide transition shadow-sm flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Seller Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  handleMenuClose();
                  navigate("/shop-create");
                }}
                className="w-full py-2.5 rounded-2xl bg-neutral-900 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wide transition shadow-sm"
              >
                Become a Seller
              </button>
            )}

            {isUserAuthenticated ? (
              <button
                onClick={() => {
                  handleMenuClose();
                  handleLogout();
                }}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogoutRoundedIcon fontSize="small" />
                Logout
              </button>
            ) : (
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    handleMenuClose();
                    navigate("/login");
                  }}
                  className="w-full py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PersonOutlineIcon fontSize="small" />
                  <span>Customer Sign In</span>
                </button>
                <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-slate-500">
                  <Link
                    to="/shop-login"
                    onClick={handleMenuClose}
                    className="hover:text-emerald-600 font-semibold transition"
                  >
                    Merchant Login
                  </Link>
                  <span>•</span>
                  <Link
                    to="/admin/login"
                    onClick={handleMenuClose}
                    className="hover:text-red-600 font-semibold transition"
                  >
                    Admin Gateway
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
