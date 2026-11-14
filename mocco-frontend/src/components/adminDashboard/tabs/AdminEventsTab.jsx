import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllAdminEvents } from "../../../services/store/actions/admin";
import { getImageUrl } from "../../../utils/imageUrl";
import {
  Calendar,
  Search,
  ExternalLink,
  Store,
  Sparkles,
  Clock,
  CheckCircle2,
  TrendingDown,
  Tag,
} from "lucide-react";

const AdminEventsTab = () => {
  const dispatch = useDispatch();
  const { events, isEventsLoading, eventsError } = useSelector((s) => s.admin);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    dispatch(fetchAllAdminEvents());
  }, [dispatch]);

  // Compute stats
  const eventStats = useMemo(() => {
    const list = Array.isArray(events) ? events : [];
    const now = new Date();
    const total = list.length;
    let active = 0;
    let upcoming = 0;
    let ended = 0;

    list.forEach((e) => {
      const start = new Date(e.startDate);
      const end = new Date(e.endDate);
      if (now >= start && now <= end) active++;
      else if (now < start) upcoming++;
      else ended++;
    });

    return { total, active, upcoming, ended };
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    const now = new Date();

    return events.filter((event) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        event.name?.toLowerCase().includes(q) ||
        event.shop?.name?.toLowerCase().includes(q) ||
        event.category?.toLowerCase().includes(q);

      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const isActive = now >= start && now <= end;
      const isUpcoming = now < start;
      const isEnded = now > end;

      let matchesStatus = true;
      if (statusFilter === "ACTIVE") matchesStatus = isActive;
      else if (statusFilter === "UPCOMING") matchesStatus = isUpcoming;
      else if (statusFilter === "ENDED") matchesStatus = isEnded;

      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, statusFilter]);

  if (isEventsLoading && events.length === 0) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 rounded-md animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Promotions & Campaigns</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Flash Deals & Events ({events.length})
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns or shops..."
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-medium outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 shadow-xs"
          />
        </div>
      </div>

      {eventsError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium">
          {eventsError}
        </div>
      )}

      {/* Mini Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Campaigns
          </p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {eventStats.total}
          </p>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Active Now
          </p>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 flex items-center gap-2">
            <span>{eventStats.active}</span>
            {eventStats.active > 0 && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </p>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
            Upcoming
          </p>
          <p className="text-xl sm:text-2xl font-black text-sky-700 mt-1">
            {eventStats.upcoming}
          </p>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Ended / Archived
          </p>
          <p className="text-xl sm:text-2xl font-black text-slate-600 mt-1">
            {eventStats.ended}
          </p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: "ALL", label: "All Campaigns" },
          { id: "ACTIVE", label: `Active (${eventStats.active})` },
          { id: "UPCOMING", label: `Upcoming (${eventStats.upcoming})` },
          { id: "ENDED", label: `Ended (${eventStats.ended})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === tab.id
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center text-slate-400 space-y-2">
            <Calendar className="w-10 h-10 text-slate-300" />
            <p className="text-sm font-semibold">No promotional events found</p>
            <p className="text-xs text-slate-400 max-w-xs">
              No campaigns match the current criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3.5">Event Details</th>
                  <th className="px-5 py-3.5">Hosting Shop</th>
                  <th className="px-5 py-3.5">Pricing</th>
                  <th className="px-5 py-3.5">Campaign Window</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredEvents.map((event) => {
                  const now = new Date();
                  const start = new Date(event.startDate);
                  const end = new Date(event.endDate);
                  const isActive = now >= start && now <= end;
                  const isUpcoming = now < start;

                  const original = event.originalPrice || 0;
                  const discounted = event.discountedPrice || 0;
                  const discountPercent =
                    original > 0 && discounted < original
                      ? Math.round(((original - discounted) / original) * 100)
                      : 0;

                  return (
                    <tr
                      key={event._id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Event Details */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(
                              event.images?.[0],
                              "https://dummyimage.com/100",
                            )}
                            alt={event.name}
                            className="h-10 w-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="max-w-xs">
                            <p className="font-bold text-slate-900 truncate">
                              {event.name}
                            </p>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ID: #{event._id?.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Shop */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-800">
                            {event.shop?.name || "Independent"}
                          </span>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            ${discounted || original}
                          </span>
                          {discountPercent > 0 && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-black border border-red-200">
                              <TrendingDown className="w-2.5 h-2.5" />
                              <span>{discountPercent}% OFF</span>
                            </span>
                          )}
                        </div>
                        {discountPercent > 0 && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ${original}
                          </span>
                        )}
                      </td>

                      {/* Campaign Window */}
                      <td className="px-5 py-3.5 text-xs text-slate-600">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1 text-slate-700 font-medium">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>
                              {start.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}{" "}
                              –{" "}
                              {end.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isUpcoming
                                ? "bg-sky-50 text-sky-700 border-sky-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive
                                ? "bg-emerald-500 animate-pulse"
                                : isUpcoming
                                  ? "bg-sky-500"
                                  : "bg-slate-400"
                            }`}
                          />
                          <span>
                            {isActive
                              ? "Active Now"
                              : isUpcoming
                                ? "Upcoming"
                                : "Ended"}
                          </span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          to="/events"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs"
                        >
                          <ExternalLink size={13} />
                          <span>Events Feed</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventsTab;
