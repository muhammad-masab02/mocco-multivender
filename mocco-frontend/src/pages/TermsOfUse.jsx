import React from "react";
import { Link } from "react-router-dom";
import { Scale, CheckCircle2, AlertTriangle, RefreshCw, ShoppingBag, ShieldAlert } from "lucide-react";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-slate-50/70 py-12 sm:py-16 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400">
          <Link to="/" className="hover:text-slate-700 transition">Home</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Terms of Use</span>
        </div>

        {/* Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm mb-8 text-center sm:text-left">
          <div className="inline-flex p-3 rounded-2xl bg-amber-50 text-amber-600 mb-4">
            <Scale size={28} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Terms of Use
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl">
            Please read these terms and conditions carefully before using the Mocco Mart multi-vendor marketplace platform.
          </p>
          <p className="mt-4 text-xs text-slate-400">
            Last Updated: November 2026 • Agreement Version: 2.1
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="text-emerald-500" size={20} />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                1. Acceptance of Terms
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              By accessing or using Mocco Mart ("Platform", "we", "us"), whether as a guest visitor, registered buyer, or verified vendor, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Use and our Privacy Policy.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="text-emerald-500" size={20} />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                2. Multi-Vendor Marketplace Operations
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mocco Mart operates as an open multi-vendor e-commerce platform. Independent sellers create their storefronts, list inventory, manage event discounts, and fulfill customer orders. While Mocco Mart provides the checkout infrastructure, messaging, and dispute facilitation, individual sellers are primarily responsible for the accurate description, quality, and timely dispatch of their goods.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-amber-500" size={20} />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                3. Buyer Obligations & Order Placements
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside leading-relaxed">
              <li>Buyers must provide genuine, accurate shipping and contact information.</li>
              <li>Order inventory is reserved upon placement; orders can be cancelled prior to dispatch.</li>
              <li>Product ratings and reviews must reflect truthful personal experiences with the delivered product. Fraudulent, defamatory, or abusive reviews will be removed.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="text-sky-500" size={20} />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                4. Returns, Cancellations & Refunds
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Buyers may initiate return or refund requests on eligible delivered items within the platform's return window. Sellers must evaluate disputes in good faith. In cases of unfulfilled or defective goods, Mocco Mart customer care mediates resolutions according to platform policy.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="text-rose-500" size={20} />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                5. Vendor Conduct & Prohibited Items
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Vendors agree not to list counterfeit, illegal, hazardous, or infringed products. Mocco Mart reserves the unilateral right to suspend vendor storefronts, delist violating items, and withhold balances associated with fraudulent activities.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
