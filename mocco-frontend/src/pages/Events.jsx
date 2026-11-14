import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "../components/home/EventCard";
import { EventCardSkeleton } from "../components/common/skeletons";
import { getAllEvents } from "../services/store/actions/event";
import { Sparkles, Zap, Search, Clock, Flame, X } from "lucide-react";

const Events = () => {
  const dispatch = useDispatch();
  const { events, isLoading } = useSelector((state) => state.event);

  const [activeTab, setActiveTab] = useState("all"); // 'all', 'live', 'ending-soon'
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  const eventProducts = useMemo(() => {
    return Array.isArray(events) ? events : [];
  }, [events]);

  // Filter Pipeline
  const filteredEvents = useMemo(() => {
    const now = Date.now();

    return eventProducts.filter((event) => {
      const endTime = new Date(event.endDate).getTime();
      const isExpired = Number.isFinite(endTime) && endTime < now;

      // Status tab
      if (activeTab === "live" && isExpired) return false;
      if (activeTab === "ending-soon") {
        if (isExpired) return false;
        // Less than 48 hours remaining
        const diffHours = (endTime - now) / (1000 * 3600);
        if (diffHours > 48) return false;
      }

      // Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchTitle = (event.name || "").toLowerCase().includes(q);
        const matchDesc = (event.description || "").toLowerCase().includes(q);
        const matchCat = (event.category || "").toLowerCase().includes(q);
        const matchShop = (event.shop?.name || "").toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCat && !matchShop) return false;
      }

      return true;
    });
  }, [eventProducts, activeTab, searchQuery]);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-200/50 py-10 sm:py-14 lg:py-16">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-72 w-72 rounded-full bg-red-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-rose-100/50 blur-3xl" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
        {/* ── Page Header ──────────────────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Zap size={13} className="fill-red-600" />
            <span>Limited-Time Promotions</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Flash Event Deals
          </h1>
          <div className="w-16 h-1 bg-red-500 mx-auto rounded-full" />

          <p className="sm:text-base text-slate-600 font-light max-w-2xl mx-auto leading-relaxed">
            Discover verified time-sensitive offers from independent Mocco
            sellers. Each event card highlights live pricing, remaining units,
            and real-time countdowns.
          </p>
        </div>

        {/* ── Filter & Search Control Bar ───────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-slate-100 p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "all"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Events ({eventProducts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("live")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "live"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Live Deals</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ending-soon")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "ending-soon"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Clock size={12} className="text-orange-500" />
              <span>Ending Soon</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative sm:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search event deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-7 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-red-400 focus:bg-white transition text-slate-800"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* ── Events List ──────────────────────────────────────────────────────── */}
        {isLoading && eventProducts.length === 0 ? (
          <div className="mx-auto flex max-w-6xl flex-col gap-6">
            <EventCardSkeleton variant="hero" count={3} />
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:gap-8">
            {filteredEvents.map((eventProduct) => {
              const productId = eventProduct?._id || eventProduct?.id;

              return (
                <EventCard
                  key={productId}
                  eventProduct={eventProduct}
                  variant="hero"
                  showMoreCta={false}
                />
              );
            })}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto rounded-3xl border border-slate-100 bg-white p-12 text-center space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <Flame size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              No matching events found
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              There are currently no active promotional events matching your
              selected filter. Please check back soon or clear search filters.
            </p>
            {(searchQuery || activeTab !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-red-600 transition"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
