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
import { Menu, ChevronDown, ChevronRight, Store } from "lucide-react";
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

  // Scroll listener to hide top search bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
      console.error("Logout error:", error);
    }
  };

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleMenuClose = () => setMenuOpen(false);

  return (
    <header className="w-full sticky top-0 z-50 shadow-md bg-white">
      {/* ── Top Bar: Logo, Global Search & Open Your Shop ─────────────────────── */}
      <div
        className={`relative z-30 transition-all duration-300 ease-in-out border-b border-gray-100 bg-white ${
          isScrolled
            ? "max-h-0 opacity-0 py-0 border-none pointer-events-none overflow-hidden"
            : "max-h-24 opacity-100 py-3 sm:py-3.5 overflow-visible"
        }`}
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
            <GlobalSearch />
          </div>

          {/* Right: Open Your Shop Action Button */}
          <button
            onClick={() =>
              navigate(
                isSellerAuthenticated && seller?._id
                  ? `/shop/${seller._id}`
                  : "/shop-create",
              )
            }
            className="hidden md:flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-red-600 text-white text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap shrink-0 group"
          >
            <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-white text-xs group-hover:translate-x-0.5 transition-transform">
              ›
            </span>
            <span>{isSellerAuthenticated ? "My Shop" : "Open Your Shop"}</span>
          </button>
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
                  className="p-1 rounded-full text-white hover:ring-2 hover:ring-red-500 transition-all cursor-pointer"
                  title="Account Menu"
                >
                  {user?.avatar?.url ? (
                    <img
                      src={getImageUrl(
                        user.avatar.url,
                        "https://dummyimage.com/100",
                      )}
                      alt="User"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 flex items-center justify-center text-white">
                      <PersonOutlineIcon fontSize="small" />
                    </div>
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 text-neutral-800">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-neutral-400">Signed in as</p>
                      <p className="text-sm font-semibold truncate text-neutral-900">
                        {user?.name || user?.email}
                      </p>
                    </div>
                    <Link
                      to="/my-profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-red-50 hover:text-red-600 transition"
                    >
                      <PersonOutlineIcon fontSize="small" />
                      My Profile
                    </Link>
                    <Link
                      to="/my-profile?tab=orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-red-50 hover:text-red-600 transition"
                    >
                      <ShoppingCartIcon fontSize="small" />
                      My Orders
                    </Link>
                    {isSellerAuthenticated && seller?._id && (
                      <Link
                        to={`/shop/${seller._id}`}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-red-50 hover:text-red-600 transition"
                      >
                        <Store size={16} />
                        My Shop
                      </Link>
                    )}
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
            <button
              onClick={() => {
                handleMenuClose();
                navigate(
                  isSellerAuthenticated && seller?._id
                    ? `/shop/${seller._id}`
                    : "/shop-create",
                );
              }}
              className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wide transition shadow-sm"
            >
              {isSellerAuthenticated ? "My Shop Dashboard" : "Become a Seller"}
            </button>

            {isUserAuthenticated && (
              <button
                onClick={() => {
                  handleMenuClose();
                  handleLogout();
                }}
                className="w-full py-2 rounded-xl bg-gray-100 hover:bg-red-50 text-neutral-700 hover:text-red-600 text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <LogoutRoundedIcon fontSize="small" />
                Logout
              </button>
            )}
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
