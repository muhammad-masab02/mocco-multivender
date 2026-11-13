import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Check, ArrowRight, Sparkles, Zap, Flame, Star, ShieldCheck } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slidesData = [
  {
    id: 1,
    tagline: "ONE MARKETPLACE. MANY GREAT FINDS.",
    tagColor: "bg-amber-400",
    title: "Find your next favourite thing.",
    subtitle:
      "Explore thoughtfully selected products from independent sellers. Discover something useful, something beautiful, or something you didn't know you needed.",
    primaryBtn: {
      text: "Explore the collection",
      url: "/products",
      className:
        "bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/30",
    },
    secondaryBtn: {
      text: "Discover best sellers",
      url: "/best-selling",
      className:
        "border border-white/40 bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-md",
    },
    features: ["Independent sellers", "Secure checkout", "Order tracking"],
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
    overlayGradient:
      "linear-gradient(90deg, rgba(13,18,23,0.94) 0%, rgba(13,18,23,0.75) 50%, rgba(13,18,23,0.25) 100%)",
    floatingBadges: [
      {
        type: "card",
        title: "Nordic Living Essentials",
        rating: "4.9",
        reviews: "1,240+",
        highlight: "Editor's Choice",
        icon: <Star size={14} className="text-amber-400 fill-amber-400" />,
        position: "top-10 right-6 sm:right-12",
        animation: "animate-float-slow",
      },
      {
        type: "pill",
        text: "Verified Marketplace Sellers",
        icon: <ShieldCheck size={15} className="text-emerald-400" />,
        position: "bottom-16 right-8 sm:right-20",
        animation: "animate-float-reverse",
      },
    ],
  },
  {
    id: 2,
    tagline: "CURATED TECH · TOP VERIFIED SELLERS",
    tagColor: "bg-red-500",
    title: "Power your passion with top-tier gear.",
    subtitle:
      "From ultra-light performance laptops and flagship smartphones to immersive noise-cancelling headphones and smart wearables, curated directly from top electronics vendors.",
    primaryBtn: {
      text: "Shop Electronics",
      url: "/products?category=computers%20and%20laptops",
      className:
        "bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/30",
    },
    secondaryBtn: {
      text: "View Flash Events",
      url: "/events",
      className:
        "border border-white/40 bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-md",
    },
    features: ["Official warranties", "Express shipping", "Verified authentic"],
    imageUrl:
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2000&auto=format&fit=crop",
    overlayGradient:
      "linear-gradient(90deg, rgba(8,12,18,0.95) 0%, rgba(8,12,18,0.78) 50%, rgba(8,12,18,0.25) 100%)",
    floatingBadges: [
      {
        type: "card",
        title: "Studio Pro ANC Headphones",
        rating: "4.8",
        reviews: "3,890+",
        highlight: "⚡ Flash Deal · 35% OFF",
        icon: <Zap size={14} className="text-red-400 fill-red-400" />,
        position: "top-12 right-6 sm:right-16",
        animation: "animate-float-slow",
      },
      {
        type: "pill",
        text: "2-Year Official Brand Warranty",
        icon: <Sparkles size={15} className="text-cyan-400" />,
        position: "bottom-14 right-8 sm:right-24",
        animation: "animate-float-reverse",
      },
    ],
  },
  {
    id: 3,
    tagline: "TRENDING DROPS · EXCLUSIVE STYLES",
    tagColor: "bg-rose-400",
    title: "Elevate your style. Crafted to stand out.",
    subtitle:
      "Discover trendsetting apparel, handcrafted leather goods, and seasonal boutique drops designed by independent fashion creators worldwide.",
    primaryBtn: {
      text: "Explore Fashion Drops",
      url: "/products?category=cloths",
      className:
        "bg-white hover:bg-neutral-100 text-neutral-900 font-bold shadow-lg shadow-black/25",
    },
    secondaryBtn: {
      text: "Browse Accessories",
      url: "/products?category=accesories",
      className:
        "border border-white/40 bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-md",
    },
    features: ["Handcrafted quality", "Easy 30-day returns", "Buyer protection guarantee"],
    imageUrl:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop",
    overlayGradient:
      "linear-gradient(90deg, rgba(20,10,16,0.94) 0%, rgba(20,10,16,0.75) 50%, rgba(20,10,16,0.2) 100%)",
    floatingBadges: [
      {
        type: "card",
        title: "Artisan Velvet & Leather Line",
        rating: "5.0",
        reviews: "950+",
        highlight: "🔥 Selling Fast · Limited",
        icon: <Flame size={14} className="text-rose-400 fill-rose-400" />,
        position: "top-10 right-8 sm:right-14",
        animation: "animate-float-slow",
      },
      {
        type: "pill",
        text: "Handmade & Sustainable Fashion",
        icon: <Sparkles size={15} className="text-amber-300" />,
        position: "bottom-16 right-6 sm:right-20",
        animation: "animate-float-reverse",
      },
    ],
  },
];

const HeroSwiper = () => {
  return (
    <>
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(0.8deg); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(12px) rotate(-0.8deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.1); }
        }
        .animate-float-slow {
          animation: floatSlow 5s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: floatReverse 6s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulseGlow 4s ease-in-out infinite;
        }
        .hero-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s ease;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          width: 26px;
          border-radius: 9999px;
          background: #ef4444;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
        }
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: white;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.2s ease;
        }
        .hero-swiper .swiper-button-next:hover,
        .hero-swiper .swiper-button-prev:hover {
          background: #ef4444;
          border-color: #ef4444;
          transform: scale(1.08);
        }
        .hero-swiper .swiper-button-next::after,
        .hero-swiper .swiper-button-prev::after {
          font-size: 16px;
          font-weight: bold;
        }
        @media (max-width: 640px) {
          .hero-swiper .swiper-button-next,
          .hero-swiper .swiper-button-prev {
            display: none;
          }
        }
      `}</style>

      <div className="relative w-full overflow-hidden bg-neutral-950">
        <Swiper
          speed={700}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          loop={true}
          modules={[Pagination, Navigation, Autoplay]}
          className="hero-swiper w-full min-h-[520px] sm:min-h-[580px] lg:min-h-[640px]"
        >
          {slidesData.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden">
                {/* Background Image */}
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
                />

                {/* Dark Gradient Overlay for optimal readability */}
                <div
                  className="absolute inset-0 z-10"
                  style={{ background: slide.overlayGradient }}
                />

                {/* Ambient Animated Glow Orbs in background */}
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-red-600/20 blur-3xl animate-pulse-glow z-10 pointer-events-none" />
                <div className="absolute top-1/2 right-12 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl animate-pulse-glow z-10 pointer-events-none" />

                {/* Content Container */}
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16 flex flex-col justify-between h-full min-h-[520px] sm:min-h-[580px] lg:min-h-[640px]">
                  {/* Top / Middle Content Block */}
                  <div className="max-w-2xl lg:max-w-3xl my-auto">
                    {/* Eyebrow Tagline */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-5">
                      <span
                        className={`w-2 h-2 rounded-full ${slide.tagColor} animate-pulse`}
                      />
                      {slide.tagline}
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] sm:leading-[1.12]">
                      {slide.title}
                    </h1>

                    {/* Description */}
                    <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-white/80 leading-relaxed max-w-xl">
                      {slide.subtitle}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
                      <Link
                        to={slide.primaryBtn.url}
                        className={`px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm tracking-wide transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2.5 ${slide.primaryBtn.className}`}
                      >
                        <span>{slide.primaryBtn.text}</span>
                        <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                      </Link>

                      <Link
                        to={slide.secondaryBtn.url}
                        className={`px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm tracking-wide transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 ${slide.secondaryBtn.className}`}
                      >
                        {slide.secondaryBtn.text}
                      </Link>
                    </div>
                  </div>

                  {/* Floating Animated Badges (Visible on md/lg screens) */}
                  <div className="hidden lg:block absolute inset-0 pointer-events-none z-20">
                    {slide.floatingBadges?.map((badge, idx) => {
                      if (badge.type === "card") {
                        return (
                          <div
                            key={idx}
                            className={`absolute ${badge.position} ${badge.animation} pointer-events-auto bg-neutral-900/80 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl text-white max-w-xs transition-transform hover:scale-105`}
                          >
                            <div className="flex items-center justify-between gap-3 text-xs mb-1">
                              <span className="font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded-full border border-red-500/20">
                                {badge.highlight}
                              </span>
                              <div className="flex items-center gap-1 font-semibold text-amber-300">
                                {badge.icon}
                                <span>{badge.rating}</span>
                              </div>
                            </div>
                            <h4 className="text-sm font-bold text-white mt-1">
                              {badge.title}
                            </h4>
                            <p className="text-[11px] text-white/60 mt-0.5">
                              {badge.reviews} verified reviews
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={idx}
                          className={`absolute ${badge.position} ${badge.animation} pointer-events-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 shadow-2xl text-white text-xs font-semibold flex items-center gap-2`}
                        >
                          {badge.icon}
                          <span>{badge.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Trust Badges Features Row */}
                  <div className="pt-6 border-t border-white/10 mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 sm:gap-x-8 text-xs sm:text-sm text-white/80">
                    {slide.features?.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1.5 font-medium">
                        <Check size={16} className="text-emerald-400 stroke-[2.5]" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default HeroSwiper;
