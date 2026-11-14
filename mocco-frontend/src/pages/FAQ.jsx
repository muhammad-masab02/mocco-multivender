import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Home as HomeIcon,
  Search,
  ChevronDown,
  Sparkles,
  HelpCircle,
  MessageCircle,
  Mail,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { faqsContent } from "../contents/FAQ'sContent";

const FAQ = () => {
  const [openItem, setOpenItem] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Questions" },
    { id: "shipping", label: "Shipping & Delivery" },
    { id: "returns", label: "Returns & Refunds" },
    { id: "payments", label: "Payments & Orders" },
    { id: "support", label: "Support & Accounts" },
  ];

  const handleToggle = (id) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  const filteredFaqs = useMemo(() => {
    let result = faqsContent || [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.question?.toLowerCase().includes(q) ||
          item.answer?.toLowerCase().includes(q),
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((item) => {
        const text = `${item.question} ${item.answer}`.toLowerCase();
        if (selectedCategory === "shipping")
          return text.includes("shipping") || text.includes("delivery");
        if (selectedCategory === "returns")
          return text.includes("return") || text.includes("refund");
        if (selectedCategory === "payments")
          return text.includes("payment") || text.includes("track");
        if (selectedCategory === "support")
          return text.includes("support") || text.includes("contact");
        return true;
      });
    }

    return result;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2"
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
          <li className="text-slate-900 font-semibold">FAQ</li>
        </ol>
      </nav>

      {/* Hero Header */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Knowledge Base & Help Center
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Frequently Asked <span className="text-red-600">Questions</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Find immediate answers regarding orders, vendor shipping, payment methods,
            and buyer protection on Mocco Mart.
          </p>

          {/* Real-Time Search Bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. shipping, returns, payment)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none text-sm text-slate-900 placeholder:text-slate-400 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs font-bold text-slate-400 hover:text-slate-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-red-200 hover:text-red-600"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Accordion List */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((item) => {
            const isOpen = openItem === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border bg-white p-5 sm:p-6 transition-all duration-300 shadow-xs ${
                  isOpen
                    ? "border-red-300 ring-2 ring-red-50 shadow-md"
                    : "border-slate-200/80 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                  onClick={() => handleToggle(item.id)}
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-snug">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "bg-red-50 text-red-600 rotate-180"
                        : "bg-slate-100 text-slate-500 group-hover:bg-red-50 group-hover:text-red-600"
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3.5 pt-3.5 border-t border-slate-100 animate-in fade-in duration-200">
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center text-slate-500 shadow-xs space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              No matching questions found
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              Try searching with different keywords or browse our categories above.
            </p>
          </div>
        )}

        {/* Still Have Questions Banner */}
        <div className="mt-12 rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-10 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900">
              Still have questions?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Can't find the answers you're looking for? Please chat with our friendly support team.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-red-600/30"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
