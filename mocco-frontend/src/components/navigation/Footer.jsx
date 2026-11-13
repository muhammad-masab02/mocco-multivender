import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Mail, Twitter, Github, Instagram, Linkedin, Facebook } from "lucide-react";
import toast from "react-hot-toast";

const Footer = () => {
  const { isUserAuthenticated } = useSelector((state) => state.user);
  const { seller, isSellerAuthenticated } = useSelector((state) => state.seller);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you for subscribing to Mocco Mart!");
    setEmail("");
  };

  return (
    <footer className="relative bg-[#0d1217] text-white mt-24 sm:mt-28 lg:mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Floating Newsletter Card */}
        <div className="-translate-y-14 sm:-translate-y-16 lg:-translate-y-20 bg-[#f4f6f2] text-neutral-900 rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 lg:p-12 border border-neutral-200/80 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-pulse"></span>
                THE MOCCO EDIT
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900">
                A little inspiration, delivered.
              </h3>
              <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-xl">
                Be first to hear about fresh arrivals, special finds and upcoming marketplace events.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex-1 max-w-md">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 shadow-sm transition"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-medium text-sm transition shadow-md whitespace-nowrap cursor-pointer"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="pt-0 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & Social Column */}
          <div className="lg:col-span-5 pr-0 lg:pr-8">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center font-bold text-white text-lg shadow-sm group-hover:scale-105 transition-transform">
                M
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                mocco<span className="text-red-500">.</span>
              </span>
            </Link>

            <p className="mt-4 text-sm text-neutral-400 leading-relaxed max-w-sm">
              A multi-vendor marketplace bringing independent sellers and thoughtful product discovery together.
            </p>

            <div className="flex items-center gap-2.5 mt-6">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-200"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://github.com/MuhammadMasab002"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-200"
              >
                <Github size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-200"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-200"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-200"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Discover Column */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-white tracking-wider mb-4">
              Discover
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-use" className="hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Marketplace Column */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-white tracking-wider mb-4">
              Marketplace
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/best-selling" className="hover:text-white transition-colors">
                  Best Selling
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Events & Deals
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Computers%20and%20Laptops"
                  className="hover:text-white transition-colors"
                >
                  Computers & Laptop
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Cloths"
                  className="hover:text-white transition-colors"
                >
                  Clothes & Fashion
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support Column */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold text-white tracking-wider mb-4">
              Help & support
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <Link
                  to={isUserAuthenticated ? "/my-profile" : "/login"}
                  className="hover:text-white transition-colors"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  to={isUserAuthenticated ? "/my-profile" : "/login"}
                  className="hover:text-white transition-colors"
                >
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  to={
                    isSellerAuthenticated && seller?._id
                      ? `/shop/${seller._id}`
                      : "/shop-create"
                  }
                  className="hover:text-white transition-colors"
                >
                  {isSellerAuthenticated ? "My Shop Storefront" : "Become a Seller"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800/80 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © {new Date().getFullYear()} Mocco Mart. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <span>Designed with care · Built for discovery</span>
            <span className="hidden sm:inline text-neutral-700">•</span>
            <span className="hidden sm:inline">
              Made with <span className="text-red-500">♥</span> by{" "}
              <a
                href="https://github.com/MuhammadMasab002"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                Masab Ashraf
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
