import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Eye, FileText, Bell, HelpCircle } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50/70 py-12 sm:py-16 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400">
          <Link to="/" className="hover:text-slate-700 transition">Home</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Privacy Policy</span>
        </div>

        {/* Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm mb-8 text-center sm:text-left">
          <div className="inline-flex p-3 rounded-2xl bg-rose-50 text-rose-600 mb-4">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl">
            At Mocco Mart, we value your trust and are dedicated to protecting your personal information.
            This policy outlines how we collect, store, and safeguard your data.
          </p>
          <p className="mt-4 text-xs text-slate-400">
            Last Updated: November 2026 • Effective Date: Immediately
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-rose-500" size={20} />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                1. Information We Collect
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              When you browse, register, make a purchase, or create a vendor storefront on Mocco Mart, we collect:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
              <li><strong>Personal Identifiers:</strong> Name, email address, phone number, and physical shipping address.</li>
              <li><strong>Account Credentials:</strong> Encrypted passwords and security tokens.</li>
              <li><strong>Transaction Data:</strong> Ordered items, shipping details, payment status, and order history. Note that financial payment details (card numbers) are processed securely through payment processors (such as Stripe) and are never stored on our servers.</li>
              <li><strong>Vendor Information:</strong> Shop name, shop description, business address, and inventory data.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-rose-500" size={20} />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                2. How We Use Your Information
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              We process your data strictly to fulfill your marketplace interactions:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
              <li>To fulfill, ship, and track your marketplace orders.</li>
              <li>To facilitate seamless communication between buyers and vendors via platform messaging.</li>
              <li>To notify you about order status updates, delivery alerts, and promotional events.</li>
              <li>To prevent fraudulent transactions, safeguard vendor accounts, and enforce platform security.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-rose-500" size={20} />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                3. Cookies and Session Storage
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mocco Mart uses secure, HTTP-only, encrypted authentication cookies (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-mono">user_token</code> and <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-mono">seller_token</code>) to maintain persistent session integrity and protect user accounts against cross-site scripting (XSS).
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="text-rose-500" size={20} />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                4. Data Sharing & Third Parties
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              We never sell or rent your personal data to advertisers. We share details solely with:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
              <li><strong>Independent Sellers:</strong> Only the shipping address and order details necessary to fulfill your purchases.</li>
              <li><strong>Payment & Cloud Infrastructure:</strong> Compliant vendors (Stripe, Cloudinary, MongoDB Cloud) operating under rigorous security standards.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="text-rose-500" size={20} />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                5. Contact Privacy Team
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Have questions or requests regarding your data? Contact our Data Protection Officer at{" "}
              <a href="mailto:privacy@moccomart.com" className="text-rose-600 font-medium hover:underline">
                privacy@moccomart.com
              </a>{" "}
              or through our{" "}
              <Link to="/contact" className="text-rose-600 font-medium hover:underline">
                Contact Page
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
