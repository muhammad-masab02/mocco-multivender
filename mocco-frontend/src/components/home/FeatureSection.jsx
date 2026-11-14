import React from "react";
import { Truck, Headphones, ShieldCheck, ArrowUpRight } from "lucide-react";

const featureList = [
  {
    id: 1,
    title: "Free & Fast Delivery",
    desc: "Reliable, lightning-fast shipping directly to your doorstep with real-time tracking.",
    highlight: "Free on orders over $100",
    icon: Truck,
  },
  {
    id: 2,
    title: "24/7 Customer Support",
    desc: "Friendly and responsive customer care ready to assist you any time of day or night.",
    highlight: "Instant chat & email",
    icon: Headphones,
  },
  {
    id: 3,
    title: "Money Back Guarantee",
    desc: "Shop with total peace of mind with our 30-day hassle-free return and refund policy.",
    highlight: "100% buyer protection",
    icon: ShieldCheck,
  },
];

const FeatureSection = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {featureList.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.id}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-red-200 hover:shadow-[0_20px_40px_rgba(239,68,68,0.08)] flex flex-col items-center justify-between"
            >
              {/* Top ambient hover accent line */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Background ambient light */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-50/50 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

              <div className="relative w-full flex flex-col items-center">
                {/* Icon Hub */}
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-red-500/25">
                  <Icon className="w-8 h-8 transition-transform group-hover:scale-105" />
                </div>

                {/* Title */}
                <h4 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-red-600 transition-colors uppercase tracking-wide">
                  {f.title}
                </h4>

                {/* Description */}
                <p className="text-slate-500 mt-2.5 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
                  {f.desc}
                </p>
              </div>

              {/* Bottom Feature Tag */}
              <div className="relative mt-5 pt-4 border-t border-slate-100 w-full flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 group-hover:bg-red-50 group-hover:text-red-600 px-3 py-1 rounded-full transition-colors">
                  {f.highlight}
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureSection;
