import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Home as HomeIcon,
  Sparkles,
  ShieldCheck,
  Truck,
  Headphones,
  Store,
  Users,
  Package,
  Award,
  ArrowRight,
  Globe,
  HeartHandshake,
} from "lucide-react";

const stats = [
  { label: "Active Verified Sellers", value: "10,500+", icon: Store },
  { label: "Curated Products", value: "1,000,000+", icon: Package },
  { label: "Delighted Shoppers", value: "3,000,000+", icon: Users },
  { label: "On-Time Dispatch Rate", value: "99.8%", icon: Award },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Uncompromising Quality",
    desc: "Every vendor and catalog item undergoes strict authentication and quality checks so you always get genuine products.",
  },
  {
    icon: HeartHandshake,
    title: "Empowering Merchants",
    desc: "We provide state-of-the-art seller tools, real-time analytics, and fair terms that allow small and large businesses to thrive.",
  },
  {
    icon: Globe,
    title: "Seamless Accessibility",
    desc: "A mobile-first, high-performance marketplace designed to deliver fast loading, instant checkout, and reliable fulfillment anywhere.",
  },
];

const About = () => {
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
          <li className="text-slate-900 font-semibold">About Us</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Our Story & Mission
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Connecting Shoppers with <span className="text-red-600">Extraordinary Vendors</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Mocco Mart is a next-generation multi-vendor ecommerce ecosystem created to
            unite passionate sellers, premium brands, and conscious buyers under one
            trusted, seamless marketplace.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-red-200 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300 text-center relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Story & Background Showcase */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
              Built on Trust & Community
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              From Humble Origins to a Flourishing Digital Marketplace
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Launched with a vision to overcome the friction of traditional online retail,
              Mocco Mart bridges the gap between verified independent creators, regional
              distributors, and shoppers seeking exceptional quality at fair prices.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              With integrated live inventory synchronization, transparent order tracking,
              and localized multi-currency checkouts, we ensure every transaction is fast,
              secure, and satisfying.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <Truck className="w-8 h-8 text-red-600 mb-2" />
              <h3 className="font-bold text-slate-900 text-base">Express Delivery</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Smart dispatch logistics ensure rapid, trackable shipping to your front door.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mb-2" />
              <h3 className="font-bold text-slate-900 text-base">Buyer Guarantee</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Full 30-day money-back guarantee with zero hassle return policies.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <Headphones className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-bold text-slate-900 text-base">24/7 Live Care</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dedicated support specialists available round-the-clock for guidance.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <Store className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-bold text-slate-900 text-base">Vendor Success</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Empowering merchants with zero startup hurdles and dedicated shop tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Our Core <span className="text-red-600">Values</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Principles that guide every decision, feature, and interaction we create.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-red-200 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300 space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{val.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-red-950 p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="space-y-2 max-w-xl z-10">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to Discover More or Sell on Mocco Mart?
            </h2>
            <p className="text-slate-300 text-sm">
              Join millions of happy shoppers and thousands of growing sellers today.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0 z-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-red-600/30"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/shop-create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm transition-all"
            >
              <span>Become a Seller</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
